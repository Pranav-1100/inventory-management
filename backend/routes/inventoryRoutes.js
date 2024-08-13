const express = require('express');
const InventoryService = require('../services/inventoryService');
const auth = require('../middlewares/auth');
const router = express.Router();

router.post('/adjust/:productId', auth, async (req, res) => {
  try {
    const { quantity } = req.body;
    const inventory = await InventoryService.adjustInventory(req.params.productId, quantity);
    res.json(inventory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/:productId', async (req, res) => {
  try {
    const inventory = await InventoryService.getInventoryForProduct(req.params.productId);
    res.json(inventory);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.get('/low-stock', auth, async (req, res) => {
  try {
    const lowStockItems = await InventoryService.getLowStockItems();
    res.json(lowStockItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;