const { Tool } = require("langchain/tools");
const Car = require('../models/cars');
const { Op } = require('sequelize');

class CarDatabaseTool extends Tool {
  name = "CarDatabaseTool";
  description = "Use this tool to query the car database for recommendations based on user preferences. Input should be a JSON string containing query parameters.";

  async _call(input) {
    try {
      const params = JSON.parse(input);
      const whereClause = {};
      
      // Basic filters
      if (params.make) {
        whereClause.make = { [Op.like]: `%${params.make}%` };
      }
      
      if (params.model) {
        whereClause.model = { [Op.like]: `%${params.model}%` };
      }
      
      if (params.type) {
        whereClause.type = { [Op.like]: `%${params.type}%` };
      }
      
      // Price range
      if (params.minPrice || params.maxPrice) {
        whereClause.price = {};
        if (params.minPrice) {
          whereClause.price[Op.gte] = params.minPrice;
        }
        if (params.maxPrice) {
          whereClause.price[Op.lte] = params.maxPrice;
        }
      }
      
      // Engine specifications
      if (params.engineType) {
        whereClause.engineType = { [Op.like]: `%${params.engineType}%` };
      }
      
      // Horsepower range
      if (params.minHorsepower || params.maxHorsepower) {
        whereClause.horsepower = {};
        if (params.minHorsepower) {
          whereClause.horsepower[Op.gte] = params.minHorsepower;
        }
        if (params.maxHorsepower) {
          whereClause.horsepower[Op.lte] = params.maxHorsepower;
        }
      }
      
      // Transmission
      if (params.transmission) {
        whereClause.transmission = { [Op.like]: `%${params.transmission}%` };
      }
      
      // Year range
      if (params.minYear || params.maxYear) {
        whereClause.year = {};
        if (params.minYear) {
          whereClause.year[Op.gte] = params.minYear;
        }
        if (params.maxYear) {
          whereClause.year[Op.lte] = params.maxYear;
        }
      }
      
      // Fuel efficiency
      if (params.minFuelEfficiency || params.maxFuelEfficiency) {
        whereClause.fuelEfficiency = {};
        if (params.minFuelEfficiency) {
          whereClause.fuelEfficiency[Op.gte] = params.minFuelEfficiency;
        }
        if (params.maxFuelEfficiency) {
          whereClause.fuelEfficiency[Op.lte] = params.maxFuelEfficiency;
        }
      }
      
      // Seating capacity
      if (params.seatingCapacity) {
        whereClause.seatingCapacity = { [Op.gte]: params.seatingCapacity };
      }

      // Query the database with pagination
      const limit = params.limit || 3; // Default to 3 results
      const offset = params.offset || 0;

      const cars = await Car.findAll({
        where: whereClause,
        limit,
        offset,
        order: [
          ['price', 'ASC'] // Default ordering by price ascending
        ]
      });

      if (cars.length === 0) {
        return JSON.stringify({
          status: "no_results",
          message: "No cars found matching your criteria.",
          query: whereClause
        });
      }

      // Format the results
      const formattedCars = cars.map(car => ({
        id: car.id,
        make: car.make,
        model: car.model,
        year: car.year,
        type: car.type,
        price: car.price,
        engineType: car.engineType,
        horsepower: car.horsepower,
        transmission: car.transmission,
        fuelEfficiency: car.fuelEfficiency,
        seatingCapacity: car.seatingCapacity,
        features: car.features,
        colors: car.colors,
        imageUrl: car.imageUrl,
        trim: car.trim
      }));

      return JSON.stringify({
        status: "success",
        results: formattedCars,
        count: formattedCars.length,
        query: whereClause
      });

    } catch (error) {
      console.error('Error in CarDatabaseTool:', error);
      return JSON.stringify({
        status: "error",
        message: "An error occurred while querying the database.",
        error: error.message,
        query: input
      });
    }
  }
}

module.exports = CarDatabaseTool;