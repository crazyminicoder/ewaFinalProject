const Car = require('../models/cars'); 

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
            description: car.features || "No description available" 
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
