const Jogini = require("../models/JoginiModel");
const Shong = require("../models/ShongModel");
const solding = require("../models/soldingModel");
const SDLLPsalun = require("../models/SDLLPsalunModel");
const Kuwarsi = require("../models/KuwarsiModel");

const getSpareInventory = async (req, res) => {
    try {
        const joginiData = await Jogini.find();  
        const shongData = await Shong.find();    
        const soldingData = await solding.find(); 
        const sdllpData = await SDLLPsalun.find(); 
        const kuwarsiData = await Kuwarsi.find(); 

        res.status(200).json({
            Jogini: joginiData,
            Shong: shongData,
            solding: soldingData,
            SDLLPsalun: sdllpData,
            Kuwarsi: kuwarsiData
        });
    } catch (error) {
        console.error("Error fetching spare inventory:", error);
        res.status(500).json({ message: "Failed to fetch spare inventory data" });
    }
};

module.exports = { getSpareInventory };
