const History = require('../models/History');

const saveHistory = async (req, res) => {
    const { query, response, category } = req.body;

    try {
        const history = new History({
            user: req.user._id,
            query,
            response,
            category
        });

        const createdHistory = await history.save();
        res.status(201).json(createdHistory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getHistory = async (req, res) => {
    try {
        const history = await History.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const clearHistory = async (req, res) => {
    try {
        await History.deleteMany({ user: req.user._id });
        res.json({ message: 'History cleared' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    saveHistory,
    getHistory,
    clearHistory
};
