const { body, validationResult } = require('express-validator');

const productValidationRules = () => {
  return [
    body('name').trim().notEmpty().withMessage('Name is required.'),
    body('description').trim().notEmpty().withMessage('Description is required.'),
    body('price').isFloat({ min: 0.01 }).withMessage('Price must be a positive decimal number.'),
    body('stockQuantity').isInt({ min: 0 }).withMessage('Stock quantity must be a non-negative integer.'),
    body('category').trim().notEmpty().withMessage('Category is required.'),
    body('manufacturer').trim().notEmpty().withMessage('Manufacturer is required.'),
    body('releaseYear').isInt({ min: 1900, max: 2100 }).withMessage('Release year must be a valid 4-digit year.')
  ];
};

const orderValidationRules = () => {
  return [
    body('userEmail').isEmail().withMessage('A valid user email address is required.'),
    body('orderDate').isDate().withMessage('Order date must be a valid YYYY-MM-DD date.'),
    body('totalAmount').isFloat({ min: 0.01 }).withMessage('Total amount must be a positive number.'),
    body('shippingAddress').trim().notEmpty().withMessage('Shipping address is required.'),
    body('status').trim().notEmpty().withMessage('Order status is required.')
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  
  return res.status(400).json({
    success: false,
    errors: errors.array().map(err => ({ field: err.path, message: err.msg }))
  });
};

module.exports = {
  productValidationRules,
  orderValidationRules,
  validate
};