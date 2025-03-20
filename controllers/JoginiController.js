const asyncHandler = require('express-async-handler');
const Jogini = require("../models/JoginiModel");

// @desc    Get all Jogini spares
// @route   GET /api/jogini
// @access  Public
const getAllJogini = asyncHandler(async (req, res) => {
  try {
    console.log("Fetching Jogini inventory data...");

    const joginiItems = await Jogini.find().lean().limit(100);

    console.log("Fetched Jogini items:", joginiItems);

    res.status(200).json({
      success: true,
      data: joginiItems || [],
    });

  } catch (error) {
    console.error("Error fetching Jogini data:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

module.exports = {
  getAllJogini,
};
