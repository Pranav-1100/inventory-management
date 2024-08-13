const express = require('express');
const { initDatabase } = require('./config/database');
const { PORT } = require('./config/config');

// Import routes
// const authRoutes = require('./routes/auth.routes');
// const userRoutes = require('./routes/user.routes');
// const productRoutes = require('./routes/product.routes');
// const inventoryRoutes = require('./routes/inventory.routes');
// const orderRoutes = require('./routes/order.routes');
// const serviceRoutes = require('./routes/service.routes');
// const transactionRoutes = require('./routes/transaction.routes');

const app = express();

// Middleware
app.use(express.json());

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/products', productRoutes);
// app.use('/api/inventory', inventoryRoutes);
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