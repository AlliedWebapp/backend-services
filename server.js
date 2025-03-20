const express = require('express'); // CommonJS module syntax
const colors = require('colors');
const dotenv = require('dotenv').config();
const cors = require('cors'); // ✅ Import CORS
const { errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');
const path = require('path');
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

const app = express();
const router = express.Router();


 
app.use(express.json()); // Enable JSON Parsing
app.use(express.urlencoded({ extended: false }));

// ✅ CORS Configuration
const corsOptions = {
  origin: 'https://alliedwebapp.vercel.app',
  credentials: true, // Access-Control-Allow-Credentials
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions)); // Enable CORS

/**
 * ✅ API Routes
 */
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/tickets', require('./routes/ticketRoutes'));
app.use("/api/spares", spareRoutes);
app.use("/api", spareRoutes); // Register API route

// ✅ Health Check Route
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "✅ Backend is running fine!" });
});

// ✅ Spare Route
router.get("/spare", async (req, res) => {
  try {
    res.status(200).json({ message: 'Welcome to the Support Desk API' });
  } catch (error) {
    res.status(500).json({ message: "Error fetching spares", error });
  }
});


 
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the Backend API' });
});


/**
 * ✅ Error Handling Middleware
 */
app.use(errorHandler);

/**
 * ✅ Start Server
 */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
