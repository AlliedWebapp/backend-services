const express = require('express'); // CommonJS module syntax
const colors = require('colors');
const dotenv = require('dotenv').config();
const cors = require('cors'); // ✅ Import CORS
const { errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');
const path = require('path');
const mongoose = require('mongoose');
const spareRoutes = require('./routes/spareRoutes');

const PORT = process.env.PORT || 5000;
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

// ✅ Import Mongoose Models
const solding = require("./models/soldingModel");
const Shong = require("./models/ShongModel");
const Jogini = require("./models/JoginiModel");
const SDLLPsalun = require("./models/SDLLPsalunModel");
const Kuwarsi = require("./models/KuwarsiModel");

console.log("MongoDB URI:", process.env.MONGODB_URI);

// ✅ Connect to database
connectDB();
console.log("Connected to DB:", mongoose.connection.name);

// Add error handling for MongoDB connection
mongoose.connection.on('error', (err) => {
  console.error('MongoDB Connection Error:', err);
  // Add more detailed logging
  console.error('MongoDB URI:', process.env.MONGODB_URI ? 'URI is set' : 'URI is missing');
});

mongoose.connection.once('open', () => {
  console.log('MongoDB Connected Successfully');
});

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS Configuration
const corsOptions = {
    origin: ['https://alliedwebapp.vercel.app', 'https://backend-services-theta.vercel.app'],
    credentials: true,
    optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Test route to verify server is working
app.get("/test", (req, res) => {
    res.json({ message: "Server is working" });
});

// Route registrations - only use one prefix
app.use('/api', spareRoutes);  // This will handle all routes

// Health check route
app.get("/api/health", (req, res) => {
    res.status(200).json({ 
        message: "✅ Backend is running fine!",
        dbConnection: mongoose.connection.readyState === 1 ? "Connected" : "Not Connected"
    });
});

// Catch-all route for undefined routes
app.use('*', (req, res) => {
    res.status(404).json({ 
        message: 'API endpoint not found',
        availableEndpoints: {
            test: '/test',
            health: '/api/health',
            solding: '/api/solding',
            shong: '/api/shong',
            jogini: '/api/jogini',
            sdllpsalun: '/api/sdllpsalun',
            kuwarsi: '/api/kuwarsi'
        }
    });
});

// Error handler should be last
app.use(errorHandler);

/**
 * ✅ Start Server
 */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
