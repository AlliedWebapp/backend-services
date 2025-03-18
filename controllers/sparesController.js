const asyncHandler = require('express-async-handler')
const solding = require("../models/soldingModel")
const Shong = require("../models/ShongModel")
const Jogini = require("../models/JoginiModel")
const SDLLPsalun = require("../models/SDLLPsalunModel")
const Kuwarsi = require("../models/KuwarsiModel")

// @desc    Get all spares from all collections
// @route   GET /api/spares
// @access  Public
const getAllSpares = asyncHandler(async (req, res) => {
  try {
    const soldingItems = await solding.find()
    const shongItems = await Shong.find()
    const joginiItems = await Jogini.find()
    const sdllpItems = await SDLLPsalun.find()
    const kuwarsiItems = await Kuwarsi.find()

    res.status(200).json({
      solding: soldingItems,
      shong: shongItems,
      jogini: joginiItems,
      sdllp: sdllpItems,
      kuwarsi: kuwarsiItems
    })
  } catch (error) {
    res.status(500)
    throw new Error('Error fetching spares data')
  }
})

module.exports = {
  getAllSpares
}
