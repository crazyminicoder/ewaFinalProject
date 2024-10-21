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
  const carData = cars.map(car => 
    `${car.Make} ${car.Model}: Type: ${car.Type}, Price: ${car.Price}, Features: ${car.Features}`
  ).join("\n");



  const prompt = `
    You are a car recommendation assistant. Here is a list of cars with their details. 
    Based on the user’s preferences, please recommend the most suitable option.

    Available cars:
    ${carData}

    User preference: ${message}
    Your recommendation should include the car make, model, type, price range, and key features.
  `;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 150,
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, // Use the env variable here
        },
      }
    );

    const reply = response.data.choices[0].message.content.trim();

    res.json({ reply });
  } catch (error) {
    if (error.response) {
      console.error("Error Response:", error.response.data);
      console.error("Status:", error.response.status);
      console.error("Headers:", error.response.headers);
      res.status(500).json({ error: "Error from OpenAI API", details: error.response.data });
    } else if (error.request) {
      console.error("No response received:", error.request);
      res.status(500).json({ error: "No response received from OpenAI API" });
    } else {
      console.error("Request error:", error.message);
      res.status(500).json({ error: "Error setting up request to OpenAI API" });
    }
  }
});

// Routes for cars and authentication
app.use('/api', carRoutes); // Car-related routes
app.use('/auth', authRoutes); // Authentication-related routes
//app.use('/api', orderRoutes); // Use the order routes

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
