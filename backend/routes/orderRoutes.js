const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/orders', orderController.saveOrder); // Route to handle placing an order

module.exports = router;
