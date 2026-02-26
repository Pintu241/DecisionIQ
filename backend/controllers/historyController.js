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

const deleteHistoryItem = async (req, res) => {
    try {
        const history = await History.findById(req.params.id);

        if (!history) {
            return res.status(404).json({ message: 'History item not found' });
        }

        // Check if item belongs to user
        if (history.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to delete this item' });
        }

        await History.findByIdAndDelete(req.params.id);
        res.json({ message: 'History item removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    saveHistory,
    getHistory,
    clearHistory,
    deleteHistoryItem
};
