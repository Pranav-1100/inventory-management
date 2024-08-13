const express = require('express');
const OrderService = require('../services/orderService');
const authMiddleware = require('../middlewares/auth');
const router = express.Router();

router.post('/', authMiddleware('create:order'), async (req, res) => {
  try {
    const order = await OrderService.createOrder(req.user.id, req.body);
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', authMiddleware('read:orders'), async (req, res) => {
  try {
    const orders = await OrderService.getAllOrders(req.user.id);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', authMiddleware('read:orders'), async (req, res) => {
  try {
    const order = await OrderService.getOrderById(req.params.id, req.user.id);
    res.json(order);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.put('/:id/status', authMiddleware('update:order'), async (req, res) => {
  try {
    const { status } = req.body;
    const order = await OrderService.updateOrderStatus(req.params.id, status);
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;