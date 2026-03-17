const { GoogleGenerativeAI } = require('@google/generative-ai');

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const generateContentWithRetry = async (model, content, maxRetries = 3) => {
    let attempt = 0;

    while (true) {
        attempt += 1;
        try {
            const result = await model.generateContent(content);
            const response = result?.response;
            if (!response || typeof response.text !== 'function') {
                throw new Error('Invalid AI response from Gemini');
            }
            return response.text();
        } catch (err) {
            const message = (err.response?.data?.error?.message || err.message || '').toString();
            const isTransient = /503|Unavailable|high demand|rate limit/i.test(message);
            if (attempt >= maxRetries || !isTransient) {
                throw err;
            }
            console.warn(`Gemini transient error (attempt ${attempt}): ${message}. Retrying...`);
            await delay(1000 * attempt);
        }
    }
};

const chatWithGemini = async (req, res) => {
    try {
        const { prompt, filter } = req.body;
        if (!prompt) {
            return res.status(400).json({ message: 'Prompt is required' });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ message: 'Backend Gemini API Key missing' });
        }

        const model = new GoogleGenerativeAI(apiKey).getGenerativeModel({ model: 'gemini-2.5-flash' });

        let domainConstraint = '';
        if (filter && filter !== 'All') {
            domainConstraint = `CRITICAL RULE: The user has selected the "${filter}" category filter. If the user's query is NOT related to ${filter}, refuse to answer and provide JSON stating out-of-domain.`;
        }

        const systemPrompt = `You are Decision IQ, an intelligent assistant. ${domainConstraint}\n\n` +
            `When user asks for a chart, graph, comparison, or numeric result, return a JSON object with the following keys (do not wrap in markdown):\n` +
            `- isChartResponse: true/false\n` +
            `- introText: string summary of result\n` +
            `- performanceData: array of { name: string, ...numeric fields }\n` +
            `- priceData: array of { name: string, value: number }\n` +
            `- keyInsights: array of strings (optional)\n` +
            `- comparisonTable: { headers: string[], rows: any[][] } (optional)\n` +
            `- prosCons: [{name, pros, cons}] (optional)\n` +
            `- finalRecommendation: string (optional)\n` +
            `If the user intent is not about charts, returning plain text as { isChartResponse: false, introText: "..." } is okay. Always prefer valid JSON object whenever possible.`;

        const responseText = await generateContentWithRetry(model, `${systemPrompt}\n\nUser Query: ${prompt}`);

        // parse Genie response to JSON-safe, if it is already JSON-like
        let parsedData = {
            isChartResponse: false,
            introText: responseText
        };

        const attemptParse = (text) => {
            const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(cleanedText);
        };

        try {
            parsedData = attemptParse(responseText);
        } catch (e1) {
            // try to extract JSON substring if any
            const first = responseText.indexOf('{');
            const last = responseText.lastIndexOf('}');
            if (first !== -1 && last !== -1 && last > first) {
                try {
                    parsedData = attemptParse(responseText.substring(first, last + 1));
                } catch (e2) {
                    parsedData = { isChartResponse: false, introText: responseText };
                }
            }
        }

        if (!parsedData.isChartResponse && (parsedData.performanceData || parsedData.priceData || parsedData.comparisonTable || parsedData.prosCons)) {
            parsedData.isChartResponse = true;
        }

        return res.json(parsedData);
    } catch (error) {
        console.error('AI chat error:', error);
        const errorMessage = error.response?.data?.error?.message || error.message || 'Unknown error during chat generation';

        if (/503|Unavailable|high demand|rate limit/i.test(errorMessage)) {
            return res.status(503).json({ message: `AI service temporarily unavailable: ${errorMessage}. Please retry in a few seconds.` });
        }

        return res.status(500).json({ message: `AI call failed: ${errorMessage}` });
    }
};

module.exports = {
    chatWithGemini
};
