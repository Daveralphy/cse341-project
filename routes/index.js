const express = require('express');
const router = express.Router();

// Dynamic home route message showing session login status
router.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.send(`Welcome to the Online Store API! Status: Logged In as ${req.user.username}. Access documentation via /api-docs`);
  } else {
    res.send('Welcome to the Online Store API! Status: Logged Out. Access documentation via /api-docs or log in via /login');
  }
});

// Primary collection routing maps
router.use('/products', require('./products'));
router.use('/orders', require('./orders'));

module.exports = router;