const express = require('express');
const db = require('./models');
const cors = require('cors');
const carRoutes = require('./routes/carRoutes');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();
const app = express();
const session = require('express-session');


// CORS and basic middleware setup remains the same
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

// Updated LangChain Imports
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

// Create the agent with a proper prompt template
const createAgent = async () => {
  // Create the system message template
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
  
  // Create the human message template including the required agent_scratchpad
  const humanTemplate = "{input}\n\n{agent_scratchpad}";
  const humanMessagePrompt = HumanMessagePromptTemplate.fromTemplate(humanTemplate);

  // Create the chat prompt template
  const chatPrompt = ChatPromptTemplate.fromMessages([
    systemMessagePrompt,
    new MessagesPlaceholder("chat_history"),
    humanMessagePrompt,
  ]);

  // Create the agent
  const agent = await createOpenAIFunctionsAgent({
    llm,
    tools,
    prompt: chatPrompt,
  });

  return new AgentExecutor({
    agent,
    tools,
    verbose: true, // Set to true for debugging
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

// OpenAI Chat Route
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  if (!req.session.chatHistory) {
    req.session.chatHistory = [];
  }

  try {
    if (!agentExecutor) {
      throw new Error('Agent executor not initialized');
    }

    // Convert chat history to LangChain message format
    const formattedHistory = req.session.chatHistory.map(msg => 
      msg.role === 'user' 
        ? new HumanMessage(msg.content)
        : new AIMessage(msg.content)
    );

    const result = await agentExecutor.invoke({
      input: message,
      chat_history: formattedHistory,
    });

    // Update chat history
    req.session.chatHistory.push({ role: 'user', content: message });
    req.session.chatHistory.push({ role: 'assistant', content: result.output });

    res.json({ reply: result.output });
  } catch (error) {
    console.error("Error processing chat response:", error);
    res.status(500).json({ 
      error: "Failed to generate recommendations",
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