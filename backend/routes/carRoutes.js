const express = require('express');
const router = express.Router();
const carController = require('../controllers/carContoller');

// Define your endpoints
router.get('/cars', carController.getAllCars);
router.get('/car-makes', carController.getCarMakes);
router.post('/orders', carController.placeOrder); // Route to handle placing an order

module.exports = router;

