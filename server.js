/**
 * 🚀 Express Server for Allied Web App
 * ✅ Organized for clarity, maintainability, and deployment
 */

// ======================== [ 1️⃣ IMPORTS ] ========================
const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv').config();
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const { errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');
const spareRoutes = require('./routes/spareRoutes');

// ======================== [ 2️⃣ CONFIGURATION ] ========================
const PORT = process.env.PORT || 5000;
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

console.log("🌍 MongoDB URI:", process.env.MONGODB_URI);

// ======================== [ 3️⃣ IMPORT MONGOOSE MODELS ] ========================
const solding = require("./models/soldingModel");
const Shong = require("./models/ShongModel");
const Jogini = require("./models/JoginiModel");
const SDLLPsalun = require("./models/SDLLPsalunModel");
const Kuwarsi = require("./models/KuwarsiModel");

// ======================== [ 4️⃣ DATABASE CONNECTION ] ========================
connectDB().then(() => {
    console.log("✅ Database Connection Initialized");
    console.log("🗂️ Using Database:", mongoose.connection.name);

    // List available collections
    mongoose.connection.db.listCollections().toArray()
        .then(collections => console.log("📂 Available Collections:", collections.map(col => col.name)))
        .catch(err => console.error("❌ Error Fetching Collections:", err));
});

mongoose.connection.once("open", () => console.log("✅ MongoDB connection established!"));
mongoose.connection.on("error", (err) => console.error("❌ MongoDB connection error:", err));

// Connection Event Logging
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

// ======================== [ 5️⃣ EXPRESS APP & MIDDLEWARE ] ========================
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ✅ CORS Configuration
const corsOptions = {
    origin: ['https://alliedwebapp.vercel.app', "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// ✅ Request Logger (for debugging)
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log('📦 Body:', req.body);
    console.log('🔍 Query:', req.query);
    console.log('🎯 Headers:', req.headers);
    next();
});

// ======================== [ 6️⃣ ROUTES ] ========================
// ✅ Mount API Routes
app.use('/api', spareRoutes);

// ✅ Test Route
app.get('/test', (req, res) => res.json({ message: 'Server is working' }));

// ✅ Root Route
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

// ======================== [ 7️⃣ ERROR HANDLING ] ========================
// 404 handler
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

// ✅ Global Error Handler
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

// ======================== [ 8️⃣ START SERVER ] ========================
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`.green);
});
