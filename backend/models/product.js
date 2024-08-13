const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

class Product extends Model {
  static associate(models) {
    this.hasOne(models.Inventory);
    this.belongsToMany(models.Order, { through: 'OrderProduct' });
  }
}

Product.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: DataTypes.TEXT,
  category: DataTypes.STRING,
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  cost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  barcode: {
    type: DataTypes.STRING,
    unique: true
  },
  imageUrl: DataTypes.STRING
}, {
  sequelize,
  modelName: 'Product'
});

module.exports = Product;