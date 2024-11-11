const express = require('express');
const router = express.Router();
const { ChatOpenAI } = require("@langchain/openai");
const { AgentExecutor, createOpenAIFunctionsAgent } = require("langchain/agents");
const { ChatPromptTemplate, MessagesPlaceholder } = require("@langchain/core/prompts");
const FraudDetectionTool = require('../tools/FraudDetectionTool');
const { Order } = require('../models');
const tesseract = require('node-tesseract-ocr');
require('dotenv').config();

const llm = new ChatOpenAI({
    modelName: "gpt-4",
    temperature: 0,
    openAIApiKey: process.env.OPENAI_API_KEY,
});

const createFraudAgent = async () => {
    const prompt = ChatPromptTemplate.fromMessages([
        ["system", `You are a fraud detection AI agent specialized in analyzing financial messages and documents.
Your role is to:
1. Analyze OCR text from images and transaction details
2. Identify potential fraud indicators
3. Provide specific, actionable responses based on the analysis

Input will be provided as a JSON string containing:
- transactionDetails: Transaction information
- extractedText: Text extracted from images
- message: User-provided message
- timestamp: Analysis timestamp

Analyze for:
- Suspicious messaging patterns
- Urgency or pressure tactics
- Unusual contact methods or numbers
- Mismatched bank details
- Suspicious amount patterns`],
        ["human", "{input}"],
        new MessagesPlaceholder("agent_scratchpad")
    ]);

    const agent = await createOpenAIFunctionsAgent({
        llm,
        tools: [new FraudDetectionTool()],
        prompt,
    });

    return new AgentExecutor({
        agent,
        tools: [new FraudDetectionTool()],
        verbose: true,
    });
};

let fraudAgent;
(async () => {
    try {
        fraudAgent = await createFraudAgent();
        console.log('Fraud detection agent initialized successfully');
    } catch (error) {
        console.error('Error initializing fraud detection agent:', error);
    }
})();

router.post('/report', express.json({ limit: '50mb' }), async (req, res) => {
    try {
        if (!fraudAgent) {
            throw new Error('Fraud detection agent not initialized');
        }

        const { message, imageData, transactionDetails = {} } = req.body;
        
        // Process image and extract text first
        let extractedText = '';
        if (imageData) {
            try {
                extractedText = await tesseract.recognize(
                    Buffer.from(imageData, 'base64'),
                    {
                        lang: 'eng',
                        oem: 1,
                        psm: 3,
                    }
                );
                console.log('OCR Extracted Text:', extractedText);
            } catch (error) {
                console.error('OCR Processing Error:', error);
            }
        }

        const analysisInput = {
            transactionDetails,
            extractedText,
            message,
            timestamp: new Date().toISOString()
        };

        // Invoke the agent with the prepared input
        const result = await fraudAgent.invoke({
            input: JSON.stringify(analysisInput),
            fraudRisk: "LOW",  // Default values to satisfy template requirements
            confidence: 0,
            indicators: [],
            action: "REVIEW",
            explanation: "",
            userAdvice: ""
        });

        // Parse the tool's response
        let analysis;
        try {
            analysis = typeof result.output === 'string' ? JSON.parse(result.output) : result.output;
        } catch (error) {
            console.error('Error parsing analysis result:', error);
            analysis = {
                fraudRisk: "MEDIUM",
                confidence: 50,
                indicators: ["Unable to parse analysis result"],
                action: "REVIEW",
                explanation: "System encountered an error processing the analysis",
                userAdvice: "Please try again or contact support"
            };
        }

        // Update order if orderId exists
        if (transactionDetails.orderId) {
            await Order.update(
                {
                    status: analysis.action,
                    fraudAnalysis: analysis
                },
                {
                    where: { id: transactionDetails.orderId }
                }
            );
        }

        res.json({
            status: 'success',
            analysis
        });
    } catch (error) {
        console.error('Error processing fraud report:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to process fraud report',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

module.exports = router;