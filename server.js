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
connectDB().then(() => {
    console.log("✅ Database Connection Initialized");
    console.log("🗂️ Using Database:", mongoose.connection.name);

    // List collections after successful connection
    mongoose.connection.db.listCollections().toArray()
        .then(collections => {
            console.log("🗂️ Available Collections:", collections.map(col => col.name));
        })
        .catch(err => console.error("❌ Error Fetching Collections:", err));
});

mongoose.connection.once("open", () => {
    console.log("✅ MongoDB connection established!");
});

mongoose.connection.on("error", (err) => {
    console.error("❌ MongoDB connection error:", err);
});

// MongoDB Connection Event Logging
mongoose.connection.on('connected', () => {
    console.log('✅ MongoDB Connected successfully');
    console.log({
        database: mongoose.connection.name,
        host: mongoose.connection.host,
        port: mongoose.connection.port
    });
});

mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB Connection Error:', {
        error: err,
        message: err.message,
        code: err.code,
        connectionString: 'MongoDB URI is ' + (process.env.MONGODB_URI ? 'set' : 'not set')
    });
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

// Detailed request logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}]`);
    console.log(`📍 Route accessed: ${req.method} ${req.url}`);
    console.log('📦 Request Body:', req.body);
    console.log('🔍 Query Params:', req.query);
    console.log('🎯 Headers:', req.headers);
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
        environment: process.env.NODE_ENV,
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

// Error handling with full details
app.use((err, req, res, next) => {
    console.error('🔴 Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message,
        stack: err.stack,
        error: err,
        route: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString()
    });
});

/**
 * ✅ Start Server
 */
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});
