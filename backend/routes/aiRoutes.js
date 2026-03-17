const express = require('express');
const { chatWithGemini } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/chat', protect, chatWithGemini);

module.exports = router;
