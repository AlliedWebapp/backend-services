const JoginiModel = require("../models/JoginiModel");
const ShongModel = require("../models/ShongModel");
const soldingModel = require("../models/soldingModel");
const SDLLPsalunModel = require("../models/SDLLPsalunModel");
const KuwarsiModel = require("../models/KuwarsiModel");

exports.getInventory = async (req, res) => {
    try {
        const joginiData = await JoginiModel.find({});
        const shongData = await ShongModel.find({});
        const soldingData = await soldingModel.find({});
        const sdllpData = await SDLLPsalunModel.find({});
        const kuwarsiData = await KuwarsiModel.find({});

        res.json({
            jogini: joginiData,
            shong: shongData,
            solding: soldingData,
            sdllp: sdllpData,
            kuwarsi: kuwarsiData,
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching inventory", error });
    }
};
