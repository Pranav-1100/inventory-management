const { Inventory, Product, sequelize } = require('../models');
const { Op } = require('sequelize');

class InventoryService {
  static async adjustInventory(productId, quantityChange) {
    const t = await sequelize.transaction();

    try {
      const inventory = await Inventory.findOne({ 
        where: { productId },
        transaction: t
      });

      if (!inventory) throw new Error('Inventory not found for this product');

      const newQuantity = inventory.quantity + quantityChange;
      if (newQuantity < 0) throw new Error('Insufficient inventory');

      await inventory.update({ quantity: newQuantity }, { transaction: t });

      await t.commit();
      return inventory;
    } catch (error) {
      await t.rollback();
      throw error;
    }
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

  static async getInventoryValuation() {
    return await Product.findAll({
      attributes: [
        'id',
        'name',
        'cost',
        [sequelize.literal('Inventory.quantity * Product.cost'), 'totalValue']
      ],
      include: [{
        model: Inventory,
        attributes: ['quantity']
      }]
    });
  }
}

module.exports = InventoryService;