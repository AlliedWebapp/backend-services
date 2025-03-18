const mongoose = require("mongoose");

const joginiSchema = new mongoose.Schema({
  sNo: { type: Number, required: true }, // "S.No"
  spareDescription: { type: String, required: true }, // "Spare Description"
  make: {
    vendor: { type: String, default: "" }, // "Make" -> "Vendor"
  },
  month: { type: String, required: true }, // "Month"
  openingStock: { type: String, required: true }, // "OPENING STOCK ( NOS )"
  receivedQty: { type: String, default: "" }, // "RECEIVED QTY ( NOS )"
  monthlyConsumption: { type: Number, default: 0 }, // "Monthly Consumption ( NOS )"
  closingStock: { type: Number, required: true }, // "CLOSING STOCK ( NOS )"
  msl: { type: String, default: "" }, // "MSL (Maximum Stock Level...)"
  sign: { type: String, default: "" }, // "SIGN."
  field11: { type: String, default: "" }, // "FIELD11"
}, { timestamps: true }); // Adds createdAt & updatedAt fields automatically

const Jogini = mongoose.model("Jogini", joginiSchema, "Jogini"); 
module.exports = Jogini;
