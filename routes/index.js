const express = require('express');
const router = express.Router();

// Fallback home route message
router.get('/', (req, res) => {
  res.send('Welcome to the Online Store API! Access documentation via /api-docs');
});

// Route everything starting with /products to our products routing file
router.use('/products', require('./products'));

module.exports = router;