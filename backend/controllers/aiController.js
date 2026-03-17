const { GoogleGenerativeAI } = require('@google/generative-ai');

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

        const systemPrompt = `You are Decision IQ, an intelligent assistant. ${domainConstraint}`;

        const response = await model.generateContent(`${systemPrompt}\n\nUser Query: ${prompt}`);
        const responseText = response.response ? (await response.response).text() : '';

        // parse Genie response to JSON-safe, if it is already JSON-like
        let parsedData = {
            isChartResponse: false,
            introText: responseText
        };

        try {
            const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
            parsedData = JSON.parse(cleanedText);
        } catch (e) {
            parsedData = {
                isChartResponse: false,
                introText: responseText
            };
        }

        return res.json(parsedData);
    } catch (error) {
        console.error('AI chat error:', error);
        const errorMessage = error.response?.data?.error?.message || error.message || 'Unknown error during chat generation';
        return res.status(500).json({ message: `AI call failed: ${errorMessage}` });
    }
};

module.exports = {
    chatWithGemini
};
