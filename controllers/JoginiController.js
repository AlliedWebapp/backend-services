const asyncHandler = require('express-async-handler');
const Jogini = require("../models/JoginiModel");

// @desc    Get all Jogini spares
// @route   GET /api/jogini
// @access  Public
const getAllJogini = asyncHandler(async (req, res) => {
  try {
    console.log("🔄 Fetching Jogini inventory data...");

    const joginiItems = await Jogini.find().lean().limit(100);

    if (!joginiItems.length) {
      console.warn("⚠️ No Jogini items found in the database.");
    } else {
      console.log(`✅ Fetched ${joginiItems.length} Jogini items.`);
    }

    res.status(200).json({
      success: true,
      data: joginiItems,
    });

  } catch (error) {
    console.error("❌ Error fetching Jogini data:", error.stack);
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
