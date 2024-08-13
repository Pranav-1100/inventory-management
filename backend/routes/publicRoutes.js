const express = require('express');
const authMiddleware = require('../middlewares/auth');
const router = express.Router();

// Route that doesn't require any specific permission, just a valid token
router.get('/public-info', authMiddleware(), (req, res) => {
  res.json({ message: "This is public information for authenticated users." });
});

module.exports = router;