const express = require('express');
const router = express.Router();
const { saveHistory, getHistory, clearHistory } = require('../controllers/historyController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, saveHistory)
    .get(protect, getHistory)
    .delete(protect, clearHistory);

module.exports = router;
