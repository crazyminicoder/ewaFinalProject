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
            id: car.id,
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
    const { userId, items, customerDetails, paymentDetails, status = 'pending' } = req.body;

    try {
        // Validate required data
        if (!userId || !items || items.length === 0) {
            return res.status(400).json({ message: 'Invalid order data.' });
        }

        const createdOrders = [];

        // Iterate over items and create a separate order for each carId
        for (const item of items) {
            const { carId, totalPrice } = item;

            // Ensure carId and totalPrice are present
            if (!carId || !totalPrice) {
                return res.status(400).json({ message: 'Invalid item data.' });
            }

            // Create a new order entry for each item
            const order = await Order.create({
                userId,
                carId, // Correctly save carId for each order
                items: JSON.stringify([item]), // Save individual item in JSON format
                totalPrice,
                status,
                customerDetails: JSON.stringify(customerDetails),
                paymentDetails: JSON.stringify(paymentDetails),
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            createdOrders.push(order);
        }

        // Respond with all created orders
        res.status(201).json({
            message: 'Order(s) placed successfully',
            orders: createdOrders,
        });
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ message: 'Failed to place order' });
    }
};

exports.getOrdersByUserId = async (req, res) => {
    const { userId } = req.params;  // Extract userId from request params

    try {
        // Find all orders where the userId matches
        const orders = await Order.findAll({
            where: { userId },
        });

        if (orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for this user.' });
        }

        // Optionally format the orders here if needed
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Failed to fetch orders' });
    }
};

exports.getCarById = async (req, res) => {
    const { carId } = req.params;  // Extract carId from the request params

    try {
        // Find the car by its primary key (assumed to be `id`)
        const car = await Car.findByPk(carId);

        if (!car) {
            return res.status(404).json({ message: 'Car not found.' });
        }

        // Format the car information
        const formattedCar = {
            id: car.id,
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
        };

        res.json(formattedCar);
    } catch (error) {
        console.error('Error fetching car:', error);
        res.status(500).json({ message: 'Failed to fetch car.' });
    }
};


