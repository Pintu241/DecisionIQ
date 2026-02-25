const mongoose = require('mongoose');

const connectDB = async () => {
    if (!process.env.MONGO_URI) {
        console.error("CRITICAL: MONGO_URI is not defined in environment variables!");
        return;
    }
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
    }
};

module.exports = connectDB;
