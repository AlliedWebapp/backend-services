const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv").config();
const cors = require("cors");
const path = require("path");
const { errorHandler } = require("./middleware/errorMiddleware");
const connectDB = require("./config/db");

// ✅ Initialize Express App
const app = express();

// ✅ Load environment variables
const PORT = process.env.PORT || 5000;
console.log("MongoDB URI:", process.env.MONGODB_URI);

// ✅ Connect to MongoDB (Only Once)
connectDB();

// ✅ Middleware to parse JSON & URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ✅ Configure CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

// ✅ Import Models (Only if needed)
const solding = require("./models/soldingModel");
const Shong = require("./models/ShongModel");
const Jogini = require("./models/JoginiModel");
const SDLLPsalun = require("./models/SDLLPsalunModel");
const Kuwarsi = require("./models/KuwarsiModel");

// ✅ Define API Routes
app.use("/api/inventory", require("./routes/inventoryRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/tickets", require("./routes/ticketRoutes"));
app.use("/api/spares", require("./routes/spareRoutes"));

// ✅ Health Check API (Debugging)
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "✅ Backend is running fine!" });
});

// ✅ Remove Frontend Serving (If Backend Only Handles API)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.status(200).json({ message: "Welcome to the API" });
  });
}

// ✅ Error Handling Middleware
app.use(errorHandler);

// ✅ Start Express Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
