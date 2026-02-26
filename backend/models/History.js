const mongoose = require('mongoose');

const historySchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    query: {
        type: String,
        required: true,
    },
    response: {
        type: Object, // Stores the structured JSON response from AI
        required: true,
    },
    category: {
        type: String,
        default: 'All',
    }
}, {
    timestamps: true,
});

const History = mongoose.model('History', historySchema);

module.exports = History;
