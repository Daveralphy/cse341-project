const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products');
const { productValidationRules, validate } = require('../middleware/validate');

// GET all products
router.get('/', productsController.getAll);

// GET a single product by ID
router.get('/:id', productsController.getSingle);

// POST a new product (with validation middleware injected)
router.post('/', productValidationRules(), validate, productsController.createProduct);

// PUT (update) a product by ID (with validation middleware injected)
router.put('/:id', productValidationRules(), validate, productsController.updateProduct);

// DELETE a product by ID
router.delete('/:id', productsController.deleteProduct);

module.exports = router;