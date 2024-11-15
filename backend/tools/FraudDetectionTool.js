const { Tool } = require("@langchain/core/tools");

class FraudDetectionTool extends Tool {
    name = "fraud_detection";
    description = "Analyzes transaction details and OCR text to detect fraudulent activities";

    async _call(input) {
        try {
            const { transactionDetails, extractedText, message } = JSON.parse(input);
            
            // Analyze the content for fraud patterns
            const analysis = await this.analyzeFraudulentActivity(transactionDetails, extractedText, message);
            return JSON.stringify({
                fraudRisk: analysis.fraudRisk,
                confidence: analysis.confidence,
                indicators: analysis.indicators,
                action: analysis.action,
                explanation: analysis.explanation,
                userAdvice: analysis.userAdvice,
            });
        } catch (error) {
            console.error('Fraud Detection Tool Error:', error);
            return JSON.stringify({
                fraudRisk: "MEDIUM",
                confidence: 50,
                indicators: ["Error processing analysis"],
                action: "ESCALATE",
                explanation: "Unable to complete fraud analysis due to technical error",
                userAdvice: "Your case has been escalated to our fraud team for review. A representative will contact you shortly."
            });
        }
    }

    async analyzeFraudulentActivity(transactionDetails, extractedText, message) {
        const fraudIndicators = [];
        let riskLevel = "LOW";
        let confidence = 0;

        // Analyze extracted text for common fraud patterns
        const textToAnalyze = (extractedText || '') + ' ' + (message || '');
        const lowerText = textToAnalyze.toLowerCase();

        // Check for urgent language
        if (lowerText.includes('urgent') || lowerText.includes('immediately') || 
            lowerText.includes('right away') || lowerText.includes('as soon as possible')) {
            fraudIndicators.push("Urgent or pressuring language detected");
            confidence += 20;
        }

        // Check for suspicious contact methods
        if (lowerText.includes('click') || lowerText.includes('link') || 
            lowerText.includes('reply') || lowerText.includes('sms')) {
            fraudIndicators.push("Suspicious contact method or instructions");
            confidence += 25;
        }

        // Check for account security threats
        if (lowerText.includes('blocked') || lowerText.includes('disabled') || 
            lowerText.includes('suspended') || lowerText.includes('verify')) {
            fraudIndicators.push("Account security threat messaging");
            confidence += 30;
        }

        // Check for unusual amount patterns
        if (transactionDetails.amount) {
            if (transactionDetails.amount > 5000) {
                fraudIndicators.push("Unusually large transaction amount");
                confidence += 15;
            }
        }

        // Calculate risk level based on confidence
        if (confidence >= 60) {
            riskLevel = "HIGH";
        } else if (confidence >= 30) {
            riskLevel = "MEDIUM";
        }

        // Determine action based on risk level and indicators
        const action = this.determineAction(riskLevel, confidence, fraudIndicators);

        // Generate explanation based on findings
        const explanation = this.generateExplanation(fraudIndicators, riskLevel);

        // Generate user advice based on action
        const userAdvice = this.generateUserAdvice(action, fraudIndicators);

        return {
            fraudRisk: riskLevel,
            confidence: Math.min(confidence, 100),
            indicators: fraudIndicators,
            action,
            explanation,
            userAdvice
        };
    }

    determineAction(riskLevel, confidence, indicators) {
        if (riskLevel === "HIGH" && confidence >= 75) {
            return "REFUND";
        } else if (riskLevel === "HIGH" || (riskLevel === "MEDIUM" && indicators.length >= 2)) {
            return "ESCALATE";
        } else {
            return "DECLINE";
        }
    }

    generateExplanation(indicators, riskLevel) {
        if (indicators.length === 0) {
            return "No significant fraud indicators detected in the analysis.";
        }

        const indicatorsList = indicators.map((indicator, index) => 
            `${index + 1}. ${indicator}`
        ).join('\n');

        return `Based on the analysis, there is a ${riskLevel.toLowerCase()} risk of fraud associated with this transaction.\n\nDetected indicators:\n${indicatorsList}`;
    }

    generateUserAdvice(action, indicators) {
        switch (action) {
            case "DECLINE":
                return "This transaction has been declined due to strong indicators of fraud. " +
                       "For your security, please:\n" +
                       "1. Contact your bank immediately using the official number on your card\n" +
                       "2. Report any unauthorized charges\n" +
                       "3. Request a new card if necessary";

            case "ESCALATE":
                return "Your case requires additional review by our fraud team.\n" +
                       "What to expect:\n" +
                       "1. A fraud specialist will contact you within 24 hours\n" +
                       "2. The transaction is temporarily on hold\n" +
                       "3. Please have your transaction details ready for verification";

            case "REFUND":
                return "Based on our analysis, this transaction appears eligible for a refund.\n" +
                       "Next steps:\n" +
                       "1. Your refund will be processed within 3-5 business days\n" +
                       "2. Keep all transaction documentation\n" +
                       "3. Contact us if you don't receive the refund within 5 business days";

            default:
                return "Please contact our customer support team for assistance with this transaction.";
        }
    }
}

module.exports = FraudDetectionTool;