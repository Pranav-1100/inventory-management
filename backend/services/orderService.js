const { Order, OrderItem, Product, Inventory, sequelize } = require('../models');

class OrderService {
  static async createOrder(userId, orderData) {
    const t = await sequelize.transaction();

    try {
      const order = await Order.create({
        userId,
        status: 'pending',
        total: 0
      }, { transaction: t });

      let total = 0;
      for (let item of orderData.items) {
        const product = await Product.findByPk(item.productId);
        if (!product) throw new Error(`Product not found: ${item.productId}`);

        const inventory = await Inventory.findOne({ where: { productId: item.productId } });
        if (inventory.quantity < item.quantity) throw new Error(`Insufficient inventory for product: ${product.name}`);

        await OrderItem.create({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: product.price
        }, { transaction: t });

        await inventory.decrement('quantity', { by: item.quantity, transaction: t });

        total += product.price * item.quantity;
      }

      await order.update({ total }, { transaction: t });

      await t.commit();
      return order;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  static async getAllOrders(userId) {
    return await Order.findAll({
      where: { userId },
      include: [{ model: OrderItem, include: Product }]
    });
  }

  static async getOrderById(id, userId) {
    const order = await Order.findOne({
      where: { id, userId },
      include: [{ model: OrderItem, include: Product }]
    });
    if (!order) throw new Error('Order not found');
    return order;
  }

  static async updateOrderStatus(id, status) {
    const order = await Order.findByPk(id);
    if (!order) throw new Error('Order not found');
    return await order.update({ status });
  }
  static async processOrder(orderId) {
    const t = await sequelize.transaction();

    try {
      const order = await Order.findByPk(orderId, {
        include: [{ model: OrderItem, include: Product }],
        transaction: t
      });

      if (!order) throw new Error('Order not found');
      if (order.status !== 'pending') throw new Error('Order already processed');

      for (let item of order.OrderItems) {
        await this.allocateInventory(item.Product.id, item.quantity, t);
      }

      await order.update({ status: 'processed' }, { transaction: t });

      await t.commit();
      return order;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  static async allocateInventory(productId, quantity, transaction) {
    let remainingQuantity = quantity;
    const batches = await InventoryBatch.findAll({
      where: { productId, quantity: { [Op.gt]: 0 } },
      order: [['expiryDate', 'ASC']],
      transaction
    });

    for (let batch of batches) {
      if (remainingQuantity <= 0) break;

      const allocatedQuantity = Math.min(batch.quantity, remainingQuantity);
      await batch.decrement('quantity', { by: allocatedQuantity, transaction });
      remainingQuantity -= allocatedQuantity;
    }

    if (remainingQuantity > 0) {
      throw new Error(`Insufficient inventory for product ${productId}`);
    }

    await Inventory.decrement('quantity', {
      by: quantity,
      where: { productId },
      transaction
    });
  }
}


module.exports = OrderService;