require('dotenv').config();
const express = require('express');
const { sequelize, initDatabase } = require('./config/db');
const { PORT } = require('./config/config');

// Import routes
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');// const inventoryRoutes = require('./routes/inventory.routes');
// const orderRoutes = require('./routes/order.routes');
// const serviceRoutes = require('./routes/service.routes');
// const transactionRoutes = require('./routes/transaction.routes');

const app = express();
if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not set in environment variables');
    process.exit(1);
  }

// Middleware
app.use(express.json());

// // Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/inventory', inventoryRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/services', serviceRoutes);
// app.use('/api/transactions', transactionRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Initialize database and start server
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});