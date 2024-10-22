const express = require('express');
const db = require('./models'); // Sequelize models
const cors = require('cors');
const carRoutes = require('./routes/carRoutes'); // Custom routes for car-related API
const authRoutes = require('./routes/authRoutes'); // Custom routes for authentication
const bcrypt = require('bcryptjs'); // For password hashing (if used in auth)
const axios = require('axios'); // For making API requests (e.g., to OpenAI)
const csv = require('csv-parser'); // For parsing CSV files
const fs = require('fs'); // File system to read the CSV file
require('dotenv').config(); // Load environment variables from .env
const app = express(); // Express app definition

// CORS Configuration
const corsOptions = {
  origin: 'http://localhost:5173', // Update this to match your frontend's URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json()); // For parsing application/json bodies

// Initialize an array to store car data
let cars = [];

// Load and parse the CSV file with car data
fs.createReadStream('./nextGenCars.csv') // Update this to the actual location of your CSV file
  .pipe(csv())
  .on('data', (data) => cars.push(data))
  .on('end', () => {
    console.log('CSV file successfully processed:', cars);
  });

// OpenAI Chat Route
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  // Format car data to include in the OpenAI prompt
  const carData = cars.map(car => {
    return `${car.make} ${car.model}: Type: ${car.type}, Price: $${car.price}, Features: ${car.features}, Image: ${car.imageUrl}`;
  }).join("\n");

  const prompt = `
    You are a car recommendation assistant. Here is a list of cars with their details. 
    Use only the provided list to recommend a car based on user preferences.

    Available cars:
    ${carData}

    User preference: ${message}
    Your recommendation should include only the car make, model, type, price range, key features, and image URL from the available list.
  `;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 250,
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const recommendedCarNames = response.data.choices[0].message.content.trim().split('\n');

    // Adjust this logic to handle multiple recommendations
    const recommendedCars = cars.filter(car => 
      recommendedCarNames.some(name => 
        name.toLowerCase().includes(car.make.toLowerCase()) && name.toLowerCase().includes(car.model.toLowerCase())
      )
    );

    if (recommendedCars.length > 0) {
      const botMessages = recommendedCars.map(car => ({
        make: car.make,
        model: car.model,
        type: car.type,
        price: car.price,
        features: car.features,
        imageUrl: car.imageUrl,
      }));

      res.json({ reply: botMessages });
    } else {
      res.json({ reply: [] });
    }
  } catch (error) {
    console.error("Error processing chat response:", error);
    res.status(500).json({ error: "Failed to generate recommendations" });
  }
});


// Routes for cars and authentication
app.use('/api', carRoutes); // Car-related routes
app.use('/auth', authRoutes); // Authentication-related routes

// Database Sync
db.sequelize.sync({ force: false }) // Set force: false to avoid dropping tables in production
  .then(() => {
    console.log('Database synced');
  })
  .catch(err => {
    console.error('Unable to sync database:', err);
  });

// Start the server with basic error handling
const PORT = 3000;
app.listen(PORT, (err) => {
  if (err) {
    console.error(`Failed to start server on port ${PORT}:`, err);
  } else {
    console.log(`Server is running on port ${PORT}`);
  }
});
