const express = require('express');
const db = require('./models');
const cors = require('cors');
const carRoutes = require('./routes/carRoutes');
const authRoutes = require('./routes/authRoutes');
const axios = require('axios');
const csv = require('csv-parser');
const fs = require('fs');
require('dotenv').config();
const app = express();
const session = require('express-session');

// CORS Configuration
const corsOptions = {
  origin: 'http://localhost:5173',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(session({
  secret: 'ewaenterprisewebapplicationsprojectphaseone',
  resave: false,
  saveUninitialized: true,
}));

// Initialize cars array for OpenAI implementation
let cars = [];


fs.createReadStream('./nextGenCars.csv')
  .pipe(csv())
  .on('data', (data) => cars.push(data))
  .on('end', () => {
  });

// LangChain Setup
const { ChatOpenAI } = require("@langchain/openai");
const { AgentExecutor, createOpenAIFunctionsAgent } = require("langchain/agents");
const { MessagesPlaceholder } = require("@langchain/core/prompts");
const { HumanMessage, AIMessage } = require("@langchain/core/messages");
const { ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate } = require("@langchain/core/prompts");
const CarDatabaseTool = require('./routes/CarDatabaseTool');

// Initialize OpenAI LLM
const llm = new ChatOpenAI({
  modelName: "gpt-3.5-turbo",
  temperature: 0,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

// Create tools array
const tools = [new CarDatabaseTool()];

// Create the agent
const createAgent = async () => {
  const systemTemplate = `You are a car recommendation assistant that helps users find the perfect vehicle based on their preferences.
  IMPORTANT: You must ONLY recommend cars that you have explicitly verified exist in the database using the provided search tools.
  Never recommend cars based on your general knowledge.
  
  When recommending cars, consider factors like:
  - Budget (price range)
  - Vehicle type
  - Preferred makes/models
  - Engine type
  - Features and specifications
  
  Always be professional and friendly in your responses.`;

  const systemMessagePrompt = SystemMessagePromptTemplate.fromTemplate(systemTemplate);
  const humanTemplate = "{input}\n\n{agent_scratchpad}";
  const humanMessagePrompt = HumanMessagePromptTemplate.fromTemplate(humanTemplate);

  const chatPrompt = ChatPromptTemplate.fromMessages([
    systemMessagePrompt,
    new MessagesPlaceholder("chat_history"),
    humanMessagePrompt,
  ]);

  const agent = await createOpenAIFunctionsAgent({
    llm,
    tools,
    prompt: chatPrompt,
  });

  return new AgentExecutor({
    agent,
    tools,
    verbose: true,
  });
};

// Initialize agent executor
let agentExecutor;
(async () => {
  try {
    agentExecutor = await createAgent();
    console.log('Agent executor initialized successfully');
  } catch (error) {
    console.error('Error initializing agent executor:', error);
  }
})();

app.post('/api/chat-openai', async (req, res) => {
  const { message } = req.body;

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
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
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
    const recommendedCars = cars.filter(car => 
      recommendedCarNames.some(name => 
        name.toLowerCase().includes(car.make.toLowerCase()) && 
        name.toLowerCase().includes(car.model.toLowerCase())
      )
    );

    const botMessages = recommendedCars.map(car => ({
      id: car.id,
      make: car.make,
      model: car.model,
      type: car.type,
      price: car.price,
      features: car.features,
      imageUrl: car.imageUrl,
    }));

    console.log(botMessages);

    res.json({ reply: botMessages });
  } catch (error) {
    console.error("Error processing OpenAI chat response:", error);
    res.status(500).json({ error: "Failed to generate recommendations" });
  }
});

app.post('/api/chat-langchain', async (req, res) => {
  const { message } = req.body;

  if (!req.session.chatHistory) {
    req.session.chatHistory = [];
  }

  try {
    if (!agentExecutor) {
      throw new Error('Agent executor not initialized');
    }

    const formattedHistory = req.session.chatHistory.map(msg => 
      msg.role === 'user' 
        ? new HumanMessage(msg.content)
        : new AIMessage(msg.content)
    );

    const result = await agentExecutor.invoke({
      input: message,
      chat_history: formattedHistory,
    });

    req.session.chatHistory.push(
      { role: 'user', content: message },
      { role: 'assistant', content: result.output }
    );

    console.log(result.output);
    res.json({ status: 'processed' });
  } catch (error) {
    console.error("Error processing LangChain chat response:", error);
    res.status(500).json({ 
      error: "Failed to process LangChain request",
      details: error.message 
    });
  }
});

// Routes for cars and authentication
app.use('/api', carRoutes);
app.use('/auth', authRoutes);

// Database Sync and Server Start
db.sequelize.sync({ force: false })
  .then(() => {
    console.log('Database synced');
  })
  .catch(err => {
    console.error('Unable to sync database:', err);
  });

const PORT = 3000;
app.listen(PORT, (err) => {
  if (err) {
    console.error(`Failed to start server on port ${PORT}:`, err);
  } else {
    console.log(`Server is running on port ${PORT}`);
  }
});