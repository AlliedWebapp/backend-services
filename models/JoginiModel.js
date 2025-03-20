const mongoose = require("mongoose");

const joginiSchema = new mongoose.Schema(
  {
    sNo: { type: Number, required: true }, // Removed alias since MongoDB stores keys without alias
    spareDescription: { type: String, required: true, trim: true },
    make: {
      vendor: { type: String, required: true, trim: true },
    },
    month: { type: String, required: true, trim: true },
    openingStock: { type: Number, default: 0 }, // Changed to Number
    receivedQty: { type: Number, default: 0 }, // Changed to Number
    monthlyConsumption: { type: Number, default: 0 },
    closingStock: { type: Number, default: 0 },
    msl: { type: Number, default: 0 }, // Changed to Number
    sign: { type: String, trim: true },
  },
  { timestamps: true, collection: "Jogini" } // Added collection name explicitly
);

const Jogini = mongoose.model("Jogini", joginiSchema, "Jogini");
module.exports = Jogini;
