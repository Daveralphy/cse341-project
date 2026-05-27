const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products');
const { productValidationRules, validate } = require('../middleware/validate');
const { isAuthenticated } = require('../middleware/auth');

// GET all products (Public)
router.get('/', productsController.getAll);

// GET a single product by ID (Public)
router.get('/:id', productsController.getSingle);

// POST a new product (Protected: Requires authentication BEFORE running data validation)
router.post('/', isAuthenticated, productValidationRules(), validate, productsController.createProduct);

// PUT (update) a product by ID (Protected: Requires authentication BEFORE running data validation)
router.put('/:id', isAuthenticated, productValidationRules(), validate, productsController.updateProduct);

// DELETE a product by ID (Protected: Requires authentication)
router.delete('/:id', isAuthenticated, productsController.deleteProduct);

module.exports = router;