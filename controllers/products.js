const mongodb = require('../config/db');
const { ObjectId } = require('mongodb');

// GET all products
const getAll = async (req, res, next) => {
  try {
    const result = await mongodb.getDb().db().collection('products').find();
    result.toArray().then((lists) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists);
    });
  } catch (err) {
    next(err);
  }
};

// GET single product by ID
const getSingle = async (req, res, next) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      const err = new Error('Invalid product ID format.');
      err.statusCode = 400;
      throw err;
    }
    const productId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().db().collection('products').find({ _id: productId });
    result.toArray().then((lists) => {
      if (lists.length === 0) {
        const err = new Error('Product not found.');
        err.statusCode = 404;
        throw err;
      }
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists[0]);
    });
  } catch (err) {
    next(err);
  }
};

// POST a new product
const createProduct = async (req, res, next) => {
  try {
    const product = {
      name: req.body.name,
      description: req.body.description,
      price: parseFloat(req.body.price),
      stockQuantity: parseInt(req.body.stockQuantity),
      category: req.body.category,
      manufacturer: req.body.manufacturer,
      releaseYear: parseInt(req.body.releaseYear)
    };
    
    const response = await mongodb.getDb().db().collection('products').insertOne(product);
    if (response.acknowledged) {
      res.status(201).json({ success: true, id: response.insertedId });
    } else {
      throw new Error('Some error occurred while creating the product.');
    }
  } catch (err) {
    next(err);
  }
};

// PUT (update) an existing product
const updateProduct = async (req, res, next) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      const err = new Error('Invalid product ID format.');
      err.statusCode = 400;
      throw err;
    }
    const productId = new ObjectId(req.params.id);
    const product = {
      name: req.body.name,
      description: req.body.description,
      price: parseFloat(req.body.price),
      stockQuantity: parseInt(req.body.stockQuantity),
      category: req.body.category,
      manufacturer: req.body.manufacturer,
      releaseYear: parseInt(req.body.releaseYear)
    };
    
    const response = await mongodb.getDb().db().collection('products').replaceOne({ _id: productId }, product);
    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      throw new Error('Product not found or data was unchanged.');
    }
  } catch (err) {
    next(err);
  }
};

// DELETE a product
const deleteProduct = async (req, res, next) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      const err = new Error('Invalid product ID format.');
      err.statusCode = 400;
      throw err;
    }
    const productId = new ObjectId(req.params.id);
    const response = await mongodb.getDb().db().collection('products').deleteOne({ _id: productId });
    if (response.deletedCount > 0) {
      res.status(200).json({ success: true, message: 'Product deleted successfully.' });
    } else {
      throw new Error('Product not found for deletion.');
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAll,
  getSingle,
  createProduct,
  updateProduct,
  deleteProduct
};