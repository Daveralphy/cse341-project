const mongodb = require('../config/db');
const { ObjectId } = require('mongodb');

// GET all orders
const getAll = async (req, res, next) => {
  try {
    const result = await mongodb.getDb().db().collection('orders').find();
    result.toArray().then((lists) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists);
    });
  } catch (err) {
    next(err);
  }
};

// GET single order by ID
const getSingle = async (req, res, next) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      const err = new Error('Invalid order ID format.');
      err.statusCode = 400;
      throw err;
    }
    const orderId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().db().collection('orders').find({ _id: orderId });
    result.toArray().then((lists) => {
      if (lists.length === 0) {
        const err = new Error('Order not found.');
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

// POST a new order
const createOrder = async (req, res, next) => {
  try {
    const order = {
      userEmail: req.body.userEmail,
      orderDate: req.body.orderDate,
      totalAmount: parseFloat(req.body.totalAmount),
      shippingAddress: req.body.shippingAddress,
      status: req.body.status
    };
    
    const response = await mongodb.getDb().db().collection('orders').insertOne(order);
    if (response.acknowledged) {
      res.status(201).json({ success: true, id: response.insertedId });
    } else {
      throw new Error('Some error occurred while creating the order.');
    }
  } catch (err) {
    next(err);
  }
};

// PUT (update) an existing order
const updateOrder = async (req, res, next) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      const err = new Error('Invalid order ID format.');
      err.statusCode = 400;
      throw err;
    }
    const orderId = new ObjectId(req.params.id);
    const order = {
      userEmail: req.body.userEmail,
      orderDate: req.body.orderDate,
      totalAmount: parseFloat(req.body.totalAmount),
      shippingAddress: req.body.shippingAddress,
      status: req.body.status
    };
    
    const response = await mongodb.getDb().db().collection('orders').replaceOne({ _id: orderId }, order);
    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      throw new Error('Order not found or data was unchanged.');
    }
  } catch (err) {
    next(err);
  }
};

// DELETE an order
const deleteOrder = async (req, res, next) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      const err = new Error('Invalid order ID format.');
      err.statusCode = 400;
      throw err;
    }
    const orderId = new ObjectId(req.params.id);
    const response = await mongodb.getDb().db().collection('orders').deleteOne({ _id: orderId });
    if (response.deletedCount > 0) {
      res.status(200).json({ success: true, message: 'Order deleted successfully.' });
    } else {
      throw new Error('Order not found for deletion.');
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAll,
  getSingle,
  createOrder,
  updateOrder,
  deleteOrder
};