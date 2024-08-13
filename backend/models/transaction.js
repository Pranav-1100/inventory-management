const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Transaction = sequelize.define('Transaction', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    type: {
      type: DataTypes.ENUM('income', 'expense'),
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    description: DataTypes.TEXT,
    category: DataTypes.STRING
  }, {
    tableName: 'transactions',
    timestamps: true
  });

  Transaction.associate = (models) => {
    Transaction.belongsTo(models.Order);
  };

  return Transaction;
};