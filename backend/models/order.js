const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 

class Order extends Model {}

Order.init({
  userId: DataTypes.INTEGER,
  carId: DataTypes.INTEGER,
  items: DataTypes.JSON, // Added to store order items as JSON
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending',
  },
  totalPrice: DataTypes.FLOAT,
  customerDetails: DataTypes.JSON, // Added to store customer details as JSON
  paymentDetails: DataTypes.JSON, // Added to store payment details as JSON
}, {
  sequelize,
  modelName: 'Order',
});

module.exports = Order;
