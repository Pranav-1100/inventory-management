const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
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
    tableName: 'products',
    timestamps: true
  });

  Product.associate = (models) => {
    Product.hasOne(models.Inventory);
    Product.belongsToMany(models.Order, { through: 'OrderProduct' });
  };

  return Product;
};