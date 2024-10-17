const express = require('express');
const db = require('./models'); 
const cors = require('cors');
const carRoutes = require('./routes/carRoutes');
const authRoutes = require('./routes/authRoutes');
const bcrypt = require('bcryptjs');
const axios = require('axios');
const csv = require('csv-parser');
const fs = require('fs');

const app = express(); // Make sure app is defined here

// CORS Configuration
const corsOptions = {
  origin: 'http://localhost:5173', // Update this to your frontend's URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json()); // For parsing application/json

// Initialize an array to store car data
let cars = [];

// Load and parse the CSV file
fs.createReadStream('./nextGenCars.csv') // Ensure this path matches your CSV file location
  .pipe(csv())
  .on('data', (data) => cars.push(data))
  .on('end', () => {
    console.log('CSV file successfully processed:', cars);
  });

// OpenAI Chat Route
app.post('/api/chat', async (req, res) => {
  console.log('Received message:', req.body.message);
  const { message } = req.body;

  // Format car data to include in the OpenAI prompt
  const carData = cars.map(car => 
    `${car.Make} ${car.Model}: Type: ${car.Type}, Price: ${car.Price}, Features: ${car.Features}`
  ).join("\n");

  console.log("Formatted car data for prompt:", carData); // Log the car data for debugging

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
          'Authorization': `Bearer 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`, // Replace with your actual API key
        },
      }
    );

    const reply = response.data.choices[0].message.content.trim();
    console.log("OpenAI Response:", reply); // Log OpenAI's response for debugging
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

// Routes
app.use('/api', carRoutes); // Car-related routes
app.use('/auth', authRoutes); // Authentication-related routes

// Database Sync
db.sequelize.sync({ force: false }) // Set force to false in production to avoid data loss
  .then(() => {
    console.log('Database synced');
  })
  .catch(err => {
    console.error('Unable to sync database:', err);
  });

// Start Server with Error Handling
const PORT = 3000;
app.listen(PORT, (err) => {
  if (err) {
    console.error(`Failed to start server on port ${PORT}:`, err);
  } else {
    console.log(`Server is running on port ${PORT}`);
  }
});
