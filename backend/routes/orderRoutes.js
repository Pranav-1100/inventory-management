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
        const product = await Product.findByPk(item.productId, { transaction: t });
        if (!product) throw new Error(`Product not found: ${item.productId}`);

        const inventory = await Inventory.findOne({ 
          where: { productId: item.productId },
          transaction: t
        });
        if (inventory.quantity < item.quantity) {
          throw new Error(`Insufficient inventory for product: ${product.name}`);
        }

        await OrderItem.create({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: product.price
        }, { transaction: t });

        await inventory.decrement('quantity', { 
          by: item.quantity, 
          transaction: t 
        });

        total += product.price * item.quantity;
      }

      await order.update({ total, status: 'completed' }, { transaction: t });

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
}

module.exports = OrderService;