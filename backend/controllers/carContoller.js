const Car = require('../models/cars'); // Import your model

exports.getAllCars = async (req, res) => {
    try {
        const cars = await Car.findAll();
        const formattedCars = cars.map(car => ({
            title: `${car.make} ${car.model}`, // Combine make and model for the title
            img: car.imageUrl, // Use imageUrl from the database
            price: `$${car.price}`, // Format price as currency
            description: car.features || "No description available" // Use features as description
        }));

        // Set the content type to application/json
        res.setHeader('Content-Type', 'application/json');

        // Send the formatted cars as a JSON response
        res.json(formattedCars);
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ error: error.message });
    }
};