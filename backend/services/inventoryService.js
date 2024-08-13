const { Inventory, Product } = require('../models');

class InventoryService {
  static async adjustInventory(productId, quantityChange) {
    const inventory = await Inventory.findOne({ where: { productId } });
    if (!inventory) throw new Error('Inventory not found for this product');

    inventory.quantity += quantityChange;
    if (inventory.quantity < 0) throw new Error('Insufficient inventory');

    await inventory.save();
    return inventory;
  }

  static async getInventoryForProduct(productId) {
    const inventory = await Inventory.findOne({ 
      where: { productId },
      include: Product
    });
    if (!inventory) throw new Error('Inventory not found for this product');
    return inventory;
  }

  static async getLowStockItems() {
    return await Inventory.findAll({
      where: {
        quantity: {
          [Op.lt]: sequelize.col('lowStockThreshold')
        }
      },
      include: Product
    });
  }
  static async receiveInventory(productId, quantity, batchData) {
    const t = await sequelize.transaction();

    try {
      const product = await Product.findByPk(productId, { transaction: t });
      if (!product) throw new Error('Product not found');

      const inventory = await Inventory.findOne({ where: { productId }, transaction: t });
      await inventory.increment('quantity', { by: quantity, transaction: t });

      const batch = await InventoryBatch.create({
        productId,
        ...batchData,
        quantity
      }, { transaction: t });

      await t.commit();
      return { inventory, batch };
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  static async getExpiringInventory(daysThreshold = 30) {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);

    return await InventoryBatch.findAll({
      where: {
        expiryDate: {
          [Op.lte]: thresholdDate
        },
        quantity: {
          [Op.gt]: 0
        }
      },
      include: Product
    });
  }

  static async getInventoryValuation() {
    return await Product.findAll({
      attributes: [
        'id',
        'name',
        [sequelize.literal('(SELECT SUM(quantity * costPrice) FROM InventoryBatches WHERE InventoryBatches.productId = Product.id)'), 'totalValue']
      ],
      include: [
        {
          model: InventoryBatch,
          attributes: []
        }
      ],
      group: ['Product.id']
    });
  }
}

module.exports = InventoryService;