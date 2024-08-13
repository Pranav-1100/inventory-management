require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5010,
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '1d'
};