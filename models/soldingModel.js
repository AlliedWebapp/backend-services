const mongoose = require("mongoose");

const soldingSchema = new mongoose.Schema({
  sNo: { type: Number, required: true }, // "S.No."
  descriptionOfMaterial: { type: String, required: true }, // "Description of Material"
  make: { type: String, required: true }, // "Make"
  vendor: { type: String, required: true }, // "Vendor"
  code: {
    specification: { type: String, default: "" } // "Code" -> "Specification"
  },
  place: { type: String, required: true }, // "Place"
  rate: { type: Number, default: null }, // "Rate"
  qty: { type: String, default: "No." }, // "Qty."
  inStock: { type: Number, required: true }, // "In Stock"
  remarks: { type: String, default: "" }, // "Remarks"
  types: { type: String, default: "" }, // "TYPES"
}, { timestamps: true }); // Adds createdAt & updatedAt fields automatically

const Solding = mongoose.model("Solding", soldingSchema, "Solding");
module.exports = Solding;
