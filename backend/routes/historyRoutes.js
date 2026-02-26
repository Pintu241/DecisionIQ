const express = require('express');
const router = express.Router();
const { saveHistory, getHistory, clearHistory, deleteHistoryItem } = require('../controllers/historyController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, saveHistory)
    .get(protect, getHistory)
    .delete(protect, clearHistory);

router.route('/:id').delete(protect, deleteHistoryItem);

module.exports = router;
