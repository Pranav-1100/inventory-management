const express = require('express');
const TransactionService = require('../services/transactionService');
const auth = require('../middlewares/auth');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const transaction = await TransactionService.createTransaction(req.body);
    res.status(201).json(transaction);
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const transactions = await TransactionService.getAllTransactions();
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/summary', auth, async (req, res) => {
  try {
    const summary = await TransactionService.getTransactionSummary();
    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;