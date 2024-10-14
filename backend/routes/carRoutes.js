const express = require('express');
const router = express.Router();
const carController = require('../controllers/carContoller');

// Define your endpoints
router.get('/cars', carController.getAllCars);
router.get('/car-makes', carController.getCarMakes);

module.exports = router;

