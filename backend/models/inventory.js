const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Inventory = sequelize.define('Inventory', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
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
    tableName: 'inventories',
    timestamps: true
  });

  Inventory.associate = (models) => {
    Inventory.belongsTo(models.Product);
  };

  return Inventory;
};