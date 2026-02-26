require('dotenv').config();


const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const historyRoutes = require('./routes/historyRoutes');

const app = express();

// Middleware
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/history', historyRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Connect to MongoDB and Start Server
const startServer = async () => {
    try {
        await connectDB();

        const PORT = process.env.PORT || 4000;

        if (process.env.NODE_ENV !== 'production') {
            app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
        }
    } catch (error) {
        console.error("Failed to start server due to DB connection error.");
        process.exit(1);
    }
};

startServer();

module.exports = app;
