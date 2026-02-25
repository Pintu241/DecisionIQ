const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        return;
    }

    if (!process.env.MONGO_URI) {
        console.error("CRITICAL: MONGO_URI is not defined!");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
        });

        isConnected = !!db.connections[0].readyState;
        console.log(`MongoDB Connected: ${db.connection.host}`);

        // Disable buffering so we get real errors instead of timeouts
        mongoose.set('bufferCommands', false);

    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
    }
};

module.exports = connectDB;
