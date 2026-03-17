const express = require('express');
const { chatWithGemini } = require('../controllers/aiController');

const router = express.Router();

// Public route (no backend JWT required) for Gemini chat. Authentication can be handled in frontend as needed.
router.post('/chat', chatWithGemini);

module.exports = router;
