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
        First, always ask for the order ID if not provided. Then proceed with the analysis.

        Your role is to:
        1. Verify order exists
        2. Analyze OCR text from images and transaction details
        3. Identify potential fraud indicators
        4. Process the fraud detection tool's response
        5. Combine the tool's analysis with your observations
        6. Provide a detailed, integrated response including all findings

        When providing your final response, always:
        - Include the fraud risk level from the analysis
        - List all detected fraud indicators
        - Provide the recommended action
        - Include the confidence score
        - Add your additional observations and recommendations
        - Note any concerning patterns or anomalies

        Input will be provided as a JSON string containing:
        - orderId: Order identification number
        - transactionDetails: Transaction information
        - extractedText: Text extracted from images
        - message: User-provided message
        - timestamp: Analysis timestamp

        Always include both the technical analysis results and your interpretative insights in the response.`],
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
        returnIntermediateSteps: true,
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

router.post('/report', express.json({ limit: '50mb' }), async (req, res) => {
    try {
        if (!fraudAgent) {
            throw new Error('Fraud detection agent not initialized');
        }

        const { orderId, message, imageData, transactionDetails = {} } = req.body;

        // Verify order exists
        const order = await Order.findByPk(orderId);
        if (!order) {
            return res.status(404).json({
                status: 'error',
                message: 'Order not found. Please verify the order ID.',
                requireOrderId: true
            });
        }

        // Process image and extract text
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
            orderId,
            transactionDetails: {
                ...transactionDetails,
                orderId,
                totalPrice: order.totalPrice
            },
            extractedText,
            message,
            timestamp: new Date().toISOString()
        };

        // Invoke the agent with the prepared input
        const result = await fraudAgent.invoke({
            input: JSON.stringify(analysisInput)
        });

        // Parse both the tool's response and the agent's analysis
        let toolAnalysis;
        try {
            // Get the last observation from intermediate steps
            const lastStep = result.intermediateSteps[result.intermediateSteps.length - 1];
            toolAnalysis = typeof lastStep.observation === 'string' 
                ? JSON.parse(lastStep.observation)
                : lastStep.observation;
        } catch (error) {
            console.error('Error parsing tool analysis:', error);
            toolAnalysis = {
                fraudRisk: "MEDIUM",
                confidence: 70,
                indicators: ["Error processing tool analysis"],
                action: "ESCALATE",
                explanation: "Tool analysis parsing failed",
                userAdvice: "Please review the analysis carefully."
            };
        }

        // Combine tool analysis with agent's output and additional metadata
        const combinedAnalysis = {
            ...toolAnalysis,
            agentAnalysis: result.output,
            rawAnalysisSteps: result.intermediateSteps,
            metadata: {
                analysisTimestamp: new Date().toISOString(),
                orderAmount: order.totalPrice,
                analysisVersion: '1.0'
            }
        };

        // Update order with combined analysis
        await order.update({
            status: combinedAnalysis.action,
            fraudAnalysis: combinedAnalysis
        });

        res.json({
            status: 'success',
            analysis: combinedAnalysis,
            orderDetails: {
                id: order.id,
                status: order.status,
                totalPrice: order.totalPrice
            }
        });
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