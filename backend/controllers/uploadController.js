const { GoogleGenerativeAI } = require('@google/generative-ai');
const xlsx = require('xlsx');

/**
 * @desc    Upload and analyze Excel dataset
 * @route   POST /api/upload/dataset
 * @access  Private
 */
const uploadDataset = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ message: 'Backend Gemini API Key missing' });
        }

        // Parse Excel file from buffer
        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);

        if (data.length === 0) {
            return res.status(400).json({ message: 'The uploaded Excel file is empty' });
        }

        // Initialize Gemini
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const systemPrompt = `You are Decision IQ, an expert data analyst. 
The user has uploaded a dataset from an Excel file. Analyze the following JSON data and provide deep insights, trends, and a "Prediction Decision" based on the data.

Your response MUST be a valid JSON object matching this exact structure:
{
  "isChartResponse": true,
  "introText": "Extensive analysis of the dataset, highlighting key patterns and insights found.",
  "finalRecommendation": "Your prediction decision or strategic recommendation based on the data analysis.",
  "performanceData": [ { "name": "Category/Metric", "Value1": 90, "Value2": 80 } ],
  "priceData": [ { "name": "Item/Category", "value": 1500 } ]
}
Return ONLY valid raw JSON.`;

        const userPrompt = `Dataset JSON: ${JSON.stringify(data.slice(0, 500))}`; // Limit to first 500 rows for token limits

        const result = await model.generateContent(systemPrompt + "\n\n" + userPrompt);
        const response = await result.response;
        const responseText = response.text();

        // Clean and parse JSON
        const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsedData = JSON.parse(cleanedText);

        res.json(parsedData);
    } catch (error) {
        console.error('Upload Error:', error);
        // Provide more detail in the response for debugging
        const errorMessage = error.response?.data?.error?.message || error.message || 'Unknown error during analysis';
        res.status(500).json({
            message: `Analysis failed: ${errorMessage}`,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

module.exports = {
    uploadDataset
};
