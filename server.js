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
mongoose.connection.on('connected', () => {
    console.log('✅ MongoDB Connected successfully');
});

mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB Connection Error:', err);
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

// Debug middleware to log all requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Mount routes - IMPORTANT: Order matters!
app.use('/api', spareRoutes);  // This will handle all /api routes

// Test route
app.get('/test', (req, res) => {
    res.json({ message: 'Server is working' });
});

// Root route
app.get('/', (req, res) => {
    res.json({ 
        message: 'Welcome to the Support Desk API',
        endpoints: {
            jogini: '/api/jogini',
            solding: '/api/solding',
            shong: '/api/shong',
            sdllpsalun: '/api/sdllpsalun',
            kuwarsi: '/api/kuwarsi'
        }
    });
});

// 404 handler - must be after all valid routes
app.use('*', (req, res) => {
    res.status(404).json({ 
        message: 'Route not found',
        availableEndpoints: {
            root: '/',
            jogini: '/api/jogini',
            solding: '/api/solding',
            shong: '/api/shong',
            sdllpsalun: '/api/sdllpsalun',
            kuwarsi: '/api/kuwarsi'
        }
    });
});

// Error handler must be last
app.use(errorHandler);

/**
 * ✅ Start Server
 */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
