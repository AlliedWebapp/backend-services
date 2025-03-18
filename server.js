const express = require('express') // commonjs module syntax
const colors = require('colors')
const dotenv = require('dotenv').config()
const cors = require('cors')  // ✅ Import CORS
const { errorHandler } = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')
const path = require('path')
const PORT = process.env.PORT || 5000
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
console.log("MongoDB URI:", process.env.MONGODB_URI);


// ✅ Connect to database
connectDB()

const app = express()

app.use(cors({
  origin: 'https://alliedwebapp.vercel.app'
}));

const corsOptions = {
  origin: 'https://alliedwebapp.vercel.app',
  credentials: true,            //access-control-allow-credentials:true
  optionSuccessStatus: 200,
}
/**
 * Enable CORS Middleware
 */
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:3000",  // ✅ Allow local & deployed frontend
];

app.use(cors(corsOptions));  // ✅ Enable CORS({

/**
 * Express Middleware to parse JSON & URL-encoded payloads
 */
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

/**
 * API Routes
 */
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/tickets', require('./routes/ticketRoutes'))

// ✅ Backend Health Check Route
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "✅ Backend is running fine!" });
});

/**
 * Serve Frontend (Only in Production)
 */
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')))

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'))
  })
} else {
  app.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to the Support Desk API' })
  })
}

/**
 * Error Handling Middleware
 */
app.use(errorHandler)

/**
 * Start Server
 */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})
app.use("/api/spares", require("./routes/spareRoutes"));
