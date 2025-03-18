const mongoose = require("mongoose");

const sparesSchema = new mongoose.Schema({}, { strict: false });

module.exports = mongoose.model("Spares", sparesSchema, "Jogini II");
