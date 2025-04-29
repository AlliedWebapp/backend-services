// controllers/sparesController.js

const JoginiModel       = require("../models/JoginiModel");
const ShongModel        = require("../models/ShongModel");
const soldingModel      = require("../models/soldingModel");
const SDLLPsalunModel   = require("../models/SDLLPsalunModel");
const KuwarsiModel      = require("../models/KuwarsiModel");
const UserSpareCount    = require("../models/UserSpareCount");
const userModel         = require("../models/userModel");

// map the exact collectionName strings → your Mongoose models
const MODEL_MAP = {
  jogini:     JoginiModel,
  solding:    soldingModel,
  shong:      ShongModel,
  sdllpsalun: SDLLPsalunModel,
  kuwarsi:    KuwarsiModel,
};

const getSpareInventory = async (req, res) => {
  try {
    res.status(200).json({ message: 'Spare inventory endpoint' });
  } catch (error) {
    console.error("Error in getSpareInventory:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching spare inventory",
      error: error.message,
    });
  }
};

const getAllSolding = async (req, res) => {
  try {
    const userId = req.user._id;
    const data   = await soldingModel.find();
    const userSpareCounts = await UserSpareCount.find({ userId, collectionName: 'solding' });

    const spareCountMap = userSpareCounts.reduce((map, item) => {
      map[item.itemId.toString()] = item.spareCount;
      return map;
    }, {});

    const updatedData = data.map(item => ({
      ...item.toObject(),
      spareCount: spareCountMap[item._id.toString()] || 0
    }));

    res.status(200).json({
      success: true,
      data: updatedData,
      count: updatedData.length,
      message: "Data fetched successfully"
    });
  } catch (error) {
    console.error("Error in getAllSolding:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching Solding data",
      error: error.message,
    });
  }
};

const getAllShong = async (req, res) => {
  try {
    const userId = req.user._id;
    const data   = await ShongModel.find();
    const userSpareCounts = await UserSpareCount.find({ userId, collectionName: 'shong' });

    const spareCountMap = userSpareCounts.reduce((map, item) => {
      map[item.itemId.toString()] = item.spareCount;
      return map;
    }, {});

    const updatedData = data.map(item => ({
      ...item.toObject(),
      spareCount: spareCountMap[item._id.toString()] || 0
    }));

    res.status(200).json({
      success: true,
      data: updatedData,
      count: updatedData.length
    });
  } catch (error) {
    console.error("Error in getAllShong:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching Shong data",
      error: error.message,
    });
  }
};

const getAllJogini = async (req, res) => {
  try {
    const userId = req.user._id;
    const data   = await JoginiModel.find();
    const userSpareCounts = await UserSpareCount.find({ userId, collectionName: 'jogini' });

    const spareCountMap = userSpareCounts.reduce((map, item) => {
      map[item.itemId.toString()] = item.spareCount;
      return map;
    }, {});

    const updatedData = data.map(item => ({
      ...item.toObject(),
      spareCount: spareCountMap[item._id.toString()] || 0
    }));

    res.status(200).json({
      success: true,
      data: updatedData,
      count: updatedData.length
    });
  } catch (error) {
    console.error("Error in getAllJogini:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching Jogini data",
      error: error.message,
    });
  }
};

const getAllSDLLPsalun = async (req, res) => {
  try {
    const userId = req.user._id;
    const data   = await SDLLPsalunModel.find();
    const userSpareCounts = await UserSpareCount.find({ userId, collectionName: 'sdllpsalun' });

    const spareCountMap = userSpareCounts.reduce((map, item) => {
      map[item.itemId.toString()] = item.spareCount;
      return map;
    }, {});

    const updatedData = data.map(item => ({
      ...item.toObject(),
      spareCount: spareCountMap[item._id.toString()] || 0
    }));

    res.status(200).json({
      success: true,
      data: updatedData,
      count: updatedData.length
    });
  } catch (error) {
    console.error("Error in getAllSDLLPsalun:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching SDLLPsalun data",
      error: error.message,
    });
  }
};

const getAllKuwarsi = async (req, res) => {
  try {
    const userId = req.user._id;
    const data   = await KuwarsiModel.find();
    const userSpareCounts = await UserSpareCount.find({ userId, collectionName: 'kuwarsi' });

    const spareCountMap = userSpareCounts.reduce((map, item) => {
      map[item.itemId.toString()] = item.spareCount;
      return map;
    }, {});

    const updatedData = data.map(item => ({
      ...item.toObject(),
      spareCount: spareCountMap[item._id.toString()] || 0
    }));

    res.status(200).json({
      success: true,
      data: updatedData,
      count: updatedData.length
    });
  } catch (error) {
    console.error("Error in getAllKuwarsi:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching Kuwarsi data",
      error: error.message,
    });
  }
};

const updatespareCount = async (req, res) => {
  const { collectionName, id, increment } = req.body;
  const userId = req.user._id;

  // load full user record for name/email
  const userRecord = await userModel.findById(userId).select("name email");
  if (!userRecord) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  const userName  = userRecord.name;
  const userEmail = userRecord.email;

  if (
    typeof collectionName !== "string" ||
    typeof id             !== "string" ||
    typeof increment      !== "number"
  ) {
    return res.status(400).json({ success: false, message: "Invalid payload" });
  }

  const Model = MODEL_MAP[collectionName.toLowerCase()];
  if (!Model) {
    return res.status(400).json({ success: false, message: "Unknown collection" });
  }

  try {
    const spareItem = await Model.findById(id);
    if (!spareItem) {
      return res.status(404).json({ success: false, message: "Spare item not found" });
    }

    let userSpareCount = await UserSpareCount.findOne({
      userId,
      collectionName: collectionName.toLowerCase(),
      itemId: id
    });

    if (!userSpareCount) {
      userSpareCount = new UserSpareCount({
        userId,
        userName,
        userEmail,
        collectionName: collectionName.toLowerCase(),
        itemId: id,
        spareCount: 0
      });
    }

    userSpareCount.spareCount = Math.max(0, userSpareCount.spareCount + increment);
    await userSpareCount.save();

    res.json({
      success:    true,
      spareCount: userSpareCount.spareCount,
      userDetails:{
        name:  userSpareCount.userName,
        email: userSpareCount.userEmail
      }
    });
  } catch (error) {
    console.error("Error updating SpareCount:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

const getUserSpareCounts = async (req, res) => {
  try {
    const { collectionName } = req.params;
    const userId = req.user._id;

    const counts = await UserSpareCount.find({
      userId,
      collectionName: collectionName.toLowerCase()
    });

    const spareCounts = counts.reduce((map, item) => {
      map[item.itemId.toString()] = item.spareCount;
      return map;
    }, {});

    res.json({ success: true, spareCounts });
  } catch (error) {
    console.error("Error in getUserSpareCounts:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

module.exports = {
  getSpareInventory,
  getAllSolding,
  getAllShong,
  getAllJogini,
  getAllSDLLPsalun,
  getAllKuwarsi,
  updatespareCount,
  getUserSpareCounts
};
