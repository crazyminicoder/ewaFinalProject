const express = require('express');
const router = express.Router();
const { ChatOpenAI } = require("@langchain/openai");
const { AgentExecutor, createOpenAIFunctionsAgent } = require("langchain/agents");
const { ChatPromptTemplate, MessagesPlaceholder } = require("@langchain/core/prompts");
const DefectAnalysisTool = require('../tools/DefectAnalysisTool');
const { Order } = require('../models');
const tesseract = require('node-tesseract-ocr');
require('dotenv').config();

const llm = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    temperature: 0,
    openAIApiKey: process.env.OPENAI_API_KEY,
});

const createOrderAgent = async () => {
    const prompt = ChatPromptTemplate.fromMessages([
        ["system", `You are an AI defect analysis agent specializing in car damage evaluation. Your role is to:

        Analyze images and descriptions provided by customers detailing damage to their cars.
        Assess the severity of the damage and recommend appropriate actions (Repair, Insurance Claim, or Escalate to Human Agent).
        Provide detailed responses, categorizing the damage as severe, moderate, or minor.
                    
            Input will be provided as a JSON string containing:
- transactionDetails: Transaction information
- extractedText: Text extracted from images
- message: User-provided message
- timestamp: Analysis timestamp
            
            When evaluating, look for:
            - Visual signs of product damage or defects.
            - Descriptions indicating functionality issues (e.g., engine, transmission, etc.).
            - Severity and type of defect to decide on the appropriate action.`],
        ["human", "{input}"],
        new MessagesPlaceholder("agent_scratchpad")
    ]);

    const agent = await createOpenAIFunctionsAgent({
        llm,
        tools: [new DefectAnalysisTool()],
        prompt,
    });

    return new AgentExecutor({
        agent,
        tools: [new DefectAnalysisTool()],
        verbose: true,
    });
};

let fraudAgent;
(async () => {
    try {
        fraudAgent = await createOrderAgent();
        console.log('Defect analysis agent initialized successfully');
    } catch (error) {
        console.error('Error initializing defect analysis agent:', error);
    }
})();

// Route to verify order exists
router.get('/verify-order/:orderId', async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.orderId);
        res.json({
            exists: !!order,
            order: order ? {
                id: order.id,
                status: order.status,
                totalPrice: order.totalPrice
            } : null
        });
    } catch (error) {
        res.status(500).json({ error: 'Error verifying order' });
    }
});

router.post('/status', express.json({ limit: '50mb' }), async (req, res) => {
    try {
        const order = await Order.findByPk(req.body.orderId);
       console.log("backend response = ",req.body)
       //if(req.body.status){
        await order.update({
            status: req.body.status,
        });

        res.json({
            status: 'success',
            orderDetails: {
                id: order.id,
                status: order.status,
                totalPrice: order.totalPrice
            }
        });
      // }

    } catch (error) {
        console.error('Error processing fraud report:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to process fraud report',
            error: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

module.exports = router;