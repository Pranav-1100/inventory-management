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
}

module.exports = InventoryService;