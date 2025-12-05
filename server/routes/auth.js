const express = require('express');
const router = express.Router();
const authService = require('../services/AuthService');

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await authService.register(username, email, password);
    res.json({ success: true, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await authService.login(username, password);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

module.exports = router;
