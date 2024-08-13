const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

class Inventory extends Model {
  static associate(models) {
    this.belongsTo(models.Product);
  }
}

Inventory.init({
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  lowStockThreshold: {
    type: DataTypes.INTEGER,
    defaultValue: 10
  }
}, {
  sequelize,
  modelName: 'Inventory'
});

module.exports = Inventory;