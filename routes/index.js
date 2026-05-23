const express = require('express');
const router = express.Router();

// Fallback home route message
router.get('/', (req, res) => {
  res.send('Welcome to the Online Store API! Access documentation via /api-docs');
});

// Primary collection routing maps
router.use('/products', require('./products'));
router.use('/orders', require('./orders')); // Added second required collection

module.exports = router;