const express = require("express");
const router = express.Router();
const Spare = require("../models/spareModel");

// @desc   Fetch all spares
// @route  GET /api/spares
// @access Public
router.get("/", async (req, res) => {
  try {
    const spares = await Spare.find();
    res.json(spares);
  } catch (error) {
    res.status(500).json({ message: "Error fetching spares", error });
  }
});

module.exports = router;
