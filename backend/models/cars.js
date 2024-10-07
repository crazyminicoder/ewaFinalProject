const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 

class Car extends Model {}

Car.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  make: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  model: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  trim: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  condition: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  engineType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  engineCapacity: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  horsepower: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  transmission: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  fuelEfficiency: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  driveType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  seatingCapacity: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  colors: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  features: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'Car',
  tableName: 'cars',  // Optional: specify a custom table name if necessary
});

module.exports = Car;
