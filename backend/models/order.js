const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Order = sequelize.define('Order', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'cancelled'),
      defaultValue: 'pending'
    },
    paymentMethod: DataTypes.STRING
  }, {
    tableName: 'orders',
    timestamps: true
  });

  Order.associate = (models) => {
    Order.belongsTo(models.User);
    Order.belongsToMany(models.Product, { through: 'OrderProduct' });
  };

  return Order;
};