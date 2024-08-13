const express = require('express');
const UserService = require('../services/userService');
const authMiddleware = require('../middlewares/auth');
const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { user, token } = await UserService.createUser(req.body);
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { user, token } = await UserService.loginUser(req.body);
    res.json({ user, token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

router.get('/profile', authMiddleware(), async (req, res) => {
  try {
    const user = await UserService.getUserById(req.user.id);
    res.json(user);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

module.exports = router;