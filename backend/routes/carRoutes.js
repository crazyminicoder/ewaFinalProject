const express = require('express');
const router = express.Router();
const carController = require('../controllers/carContoller');

// Define your endpoints
router.get('/cars', carController.getAllCars);

module.exports = router;
