const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 

class Order extends Model {}

Order.init({
  userId: DataTypes.INTEGER,
  carId: DataTypes.INTEGER,
  status: DataTypes.STRING,
  totalPrice: DataTypes.FLOAT,
}, {
  sequelize,
  modelName: 'Order',
});

module.exports = Order;
