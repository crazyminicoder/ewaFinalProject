const { Tool } = require("@langchain/core/tools");

class FraudDetectionTool extends Tool {
    name = "fraud_detection";
    description = "Analyzes transaction details and OCR text to detect fraudulent activities";

    async _call(input) {
        try {
            const { transactionDetails, extractedText, message } = JSON.parse(input);
            
            // Analyze the content for fraud patterns
            const analysis = await this.analyzeFraudulentActivity(transactionDetails, extractedText, message);
            return JSON.stringify(analysis);
        } catch (error) {
            console.error('Fraud Detection Tool Error:', error);
            return JSON.stringify({
                fraudRisk: "MEDIUM",
                confidence: 50,
                indicators: ["Error processing analysis"],
                action: "REVIEW",
                explanation: "Unable to complete fraud analysis due to technical error",
                userAdvice: "Please try again or contact support for assistance"
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

        // Determine action based on risk level
        const action = riskLevel === "HIGH" ? "BLOCK" : 
                      riskLevel === "MEDIUM" ? "REVIEW" : "APPROVE";

        // Generate user advice based on findings
        const userAdvice = this.generateUserAdvice(riskLevel, fraudIndicators);

        return {
            fraudRisk: riskLevel,
            confidence: Math.min(confidence, 100),
            indicators: fraudIndicators,
            action,
            explanation: this.generateExplanation(fraudIndicators, riskLevel),
            userAdvice
        };
    }

    generateExplanation(indicators, riskLevel) {
        if (indicators.length === 0) {
            return "No significant fraud indicators detected in the analysis.";
        }

        return `Analysis detected ${indicators.length} fraud indicators with ${riskLevel} risk level: ${indicators.join(', ')}.`;
    }

    generateUserAdvice(riskLevel, indicators) {
        if (riskLevel === "HIGH") {
            return "DO NOT respond to this message. Contact your bank directly using the official number on your card or bank website. This shows multiple signs of being fraudulent.";
        } else if (riskLevel === "MEDIUM") {
            return "Exercise caution. Verify this communication by contacting your bank through official channels. Do not click links or reply to the message.";
        }
        return "While this appears low risk, always verify unexpected communications with your bank through official channels.";
    }
}

module.exports = FraudDetectionTool;