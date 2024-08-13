const { sequelize } = require('../config/db');
const User = require('./user')(sequelize);
const Product = require('./product')(sequelize);
const Inventory = require('./inventory')(sequelize);
const Order = require('./order')(sequelize);
const Service = require('./service')(sequelize);
const Transaction = require('./transaction')(sequelize);

const models = {
  User,
  Product,
  Inventory,
  Order,
  Service,
  Transaction
};

Object.values(models).forEach(model => {
  if (model.associate) {
    model.associate(models);
  }
});

module.exports = models;