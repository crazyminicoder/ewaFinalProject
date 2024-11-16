const { Tool } = require("@langchain/core/tools");

class DefectAnalysisTool extends Tool {
    name = "defect_analysis";
    description = "Analyzes transaction details and OCR text to detect defect products received";

    async _call(input) {
        try {
            console.log("test 11 input = ",input);
            const { transactionDetails, extractedText, message } = JSON.parse(input);
            
            // Analyze the content for fraud patterns
            const analysis = await this.defectsAnalyzingActivity(transactionDetails, extractedText, message);
            return JSON.stringify(analysis);
        } catch (error) {
            console.error('Defect Analysis Tool Error:', error);
            return JSON.stringify({
                fraudRisk: "MEDIUM",
                confidence: 50,
                indicators: ["Error processing analysis"],
                action: "REVIEW",
                explanation: "Unable to complete defect analysis due to technical error",
                userAdvice: "Please try again or contact support for assistance"
            });
        }
    }

    async defectsAnalyzingActivity(transactionDetails, extractedText, message) {
        console.log("test transactionDetails = ",transactionDetails, " extractedText = ",extractedText, " message = ",message)
        const defectIndicators  = [];
        let severityLevel = "MINOR";
        let confidence = 0;

        // Analyze extracted text for common fraud patterns
        const textToAnalyze = (extractedText || '') + ' ' + (message || '');
        const lowerText = textToAnalyze.toLowerCase();

        // Check for descriptions of major functional issues
    if (lowerText.includes('engine') || lowerText.includes('transmission') || 
    lowerText.includes('brakes') || lowerText.includes('won\'t start')) {
    defectIndicators.push("Major functional issue described");
    confidence += 40;
}

        // Check for descriptions of visible damage
    if (lowerText.includes('scratched') || lowerText.includes('dented') || 
    lowerText.includes('cracked') || lowerText.includes('broken')) {
    defectIndicators.push("Visible damage described");
    confidence += 30;
}

        // Check for minor cosmetic issues
    if (lowerText.includes('scuff') || lowerText.includes('paint') || 
    lowerText.includes('minor') || lowerText.includes('blemish')) {
    defectIndicators.push("Minor cosmetic issue described");
    confidence += 10;
}

        // Check product specifications for defect triggers
    if (productDetails.condition && productDetails.condition.toLowerCase() === 'used') {
        defectIndicators.push("Product condition marked as 'Used'");
        confidence += 10;
    }

         // Assess severity level based on confidence
    if (confidence >= 70) {
        severityLevel = "HIGH";
    } else if (confidence >= 40) {
        severityLevel = "MEDIUM";
    }

         // Determine action based on risk level and indicators
         const action = this.determineAction(riskLevel, confidence, fraudIndicators);

         // Generate explanation based on findings
         const explanation = this.generateExplanation(fraudIndicators, riskLevel);
 
         // Generate user advice based on action
         const userAdvice = this.generateUserAdvice(action, fraudIndicators);


        return {
            fraudRisk: severityLevel,
            confidence: Math.min(confidence, 100),
            indicators: defectIndicators,
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
            return "No significant defects detected in the analysis.";
        }

        const indicatorsList = indicators.map((indicator, index) => 
            `${index + 1}. ${indicator}`
        ).join('\n');
    
        return `Based on the analysis, your transaction has been updated to ${riskLevel.toLowerCase()} severity.\n\nDetected indicators:\n${indicatorsList}`;
    }
    
    generateUserAdvice(action, indicators) {
        switch (action) {
            case "DECLINE":
                return "The product has been identified with defects that cannot be resolved. " +
           "For further assistance, please:\n" +
           "1. Contact customer support to discuss your options\n" +
           "2. Provide any additional evidence of the defect, such as images or detailed descriptions\n" +
           "3. Request a replacement, refund, or further escalation as appropriate.";

            case "ESCALATE":
                return "Your case requires additional review by our fraud team.\n" +
                       "What to expect:\n" +
                       "1. Our specialist will contact you within 24 hours\n" +
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

module.exports = DefectAnalysisTool;