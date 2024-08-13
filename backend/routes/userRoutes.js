const express = require('express');
const UserService = require('../services/userService');
const auth = require('../middlewares/auth');
const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const user = await UserService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { token, user } = await UserService.loginUser(req.body);
    res.json({ token, user });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

router.get('/profile', auth, async (req, res) => {
  try {
    const user = await UserService.getUserById(req.user.id);
    res.json(user);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

module.exports = router;