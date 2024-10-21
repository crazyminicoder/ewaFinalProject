const Car = require('../models/cars'); 
const Order = require('../models/order');

exports.getAllCars = async (req, res) => {
    try {
        const { make } = req.query; // Get the make from the query string (e.g., ?make=Toyota)
        let cars;

        if (make) {
            // If a specific make is provided, filter cars by that make
            cars = await Car.findAll({
                where: { make }, // Filter by the make
            });
        } else {
            // Otherwise, fetch all cars
            cars = await Car.findAll();
        }

        // Format the cars
        const formattedCars = cars.map(car => ({
            title: `${car.make} ${car.model}`, 
            img: car.imageUrl, 
            price: `$${car.price}`,
            trim: car.trim || "No trim available",
            description: car.features || "No description available",
            year: car.year,
            engineType: car.engineType || "N/A",
            horsepower: car.horsepower || "N/A",
            transmission: car.transmission || "N/A",
            fuelEfficiency: car.fuelEfficiency || "N/A",
            seatingCapacity: car.seatingCapacity || "N/A",
            colors: car.colors || "N/A"
        }));

        res.setHeader('Content-Type', 'application/json');
        res.json(formattedCars);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.getCarMakes = async (req, res) => {
    try {
        const cars = await Car.findAll({
            attributes: ['make'],
            group: ['make'],
        });

        // Clean up makes by trimming whitespace and normalizing the case
        const formattedMakes = cars.map(car => ({
            title: car.make.trim(),  // Trim any whitespace
            description: `Explore models from ${car.make.trim()}`,
        }));

        res.json(formattedMakes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.placeOrder = async (req, res) => {
    const { userId, carId, totalPrice, status = 'pending' } = req.body; // Extract required fields from the request

    try {
        // Create a new order with the provided data
        const order = await Order.create({
            userId,
            carId,
            status,
            totalPrice,
        });

        res.status(201).json({ message: 'Order placed successfully', order });
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ message: 'Failed to place order' });
    }
};

