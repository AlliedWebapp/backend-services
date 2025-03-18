const mongoose = require("mongoose");

const MONGODB_URI = "mongodb+srv://alliedcunsultant:nZ2WwFg7PWX66DFO@alliedwebapp.mxspx.mongodb.net/?retryWrites=true&w=majority&appName=AlliedWebapp";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`.red);
    process.exit(1);
  }
};

module.exports = connectDB;
