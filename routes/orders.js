const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/orders');
const { orderValidationRules, validate } = require('../middleware/validate');
const { isAuthenticated } = require('../middleware/auth');

// GET all orders (Public)
router.get('/', ordersController.getAll);

// GET a single order by ID (Public)
router.get('/:id', ordersController.getSingle);

// POST a new order (Protected: Requires authentication BEFORE running data validation)
router.post('/', isAuthenticated, orderValidationRules(), validate, ordersController.createOrder);

// PUT (update) an order by ID (Protected: Requires authentication BEFORE running data validation)
router.put('/:id', isAuthenticated, orderValidationRules(), validate, ordersController.updateOrder);

// DELETE an order by ID (Protected: Requires authentication)
router.delete('/:id', isAuthenticated, ordersController.deleteOrder);

module.exports = router;