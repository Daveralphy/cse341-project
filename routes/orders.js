const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/orders');
const { orderValidationRules, validate } = require('../middleware/validate');

// GET all orders
router.get('/', ordersController.getAll);

// GET a single order by ID
router.get('/:id', ordersController.getSingle);

// POST a new order (with validation middleware)
router.post('/', orderValidationRules(), validate, ordersController.createOrder);

// PUT (update) an order by ID (with validation middleware)
router.put('/:id', orderValidationRules(), validate, ordersController.updateOrder);

// DELETE an order by ID
router.delete('/:id', ordersController.deleteOrder);

module.exports = router;