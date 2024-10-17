// backend/routes/chat.js
const express = require("express");
const { Configuration, OpenAIApi } = require("openai");

const router = express.Router();

// Set up OpenAI configuration
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // Use environment variables for security
});
const openai = new OpenAIApi(configuration);

// Define an endpoint for the chatbot
router.post("/chat", async (req, res) => {
  const { message } = req.body;
  
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: message,
      max_tokens: 100,
      temperature: 0.5,
    });

    res.json({ reply: response.data.choices[0].text.trim() });
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    res.status(500).json({ error: "Failed to process your request." });
  }
});

module.exports = router;
