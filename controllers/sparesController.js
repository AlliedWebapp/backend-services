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

// Get all Solding data
const getAllSolding = async (req, res) => {
    try {
        const data = await solding.find();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching Solding data', error: error.message });
    }
};

// Get all Shong data
const getAllShong = async (req, res) => {
    try {
        const data = await Shong.find();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching Shong data', error: error.message });
    }
};

// Get all Jogini data
const getAllJogini = async (req, res) => {
    try {
        const data = await Jogini.find();
        console.log('Jogini data:', data);
        res.status(200).json(data);
    } catch (error) {
        console.error('Error in getAllJogini:', error);
        res.status(500).json({ 
            message: 'Error fetching Jogini data', 
            error: error.message,
            stack: process.env.NODE_ENV === 'production' ? null : error.stack
        });
    }
};

// Get all SDLLPsalun data
const getAllSDLLPsalun = async (req, res) => {
    try {
        const data = await SDLLPsalun.find();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching SDLLPsalun data', error: error.message });
    }
};

// Get all Kuwarsi data
const getAllKuwarsi = async (req, res) => {
    try {
        const data = await Kuwarsi.find();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching Kuwarsi data', error: error.message });
    }
};

module.exports = {
    getSpareInventory,
    getAllSolding,
    getAllShong,
    getAllJogini,
    getAllSDLLPsalun,
    getAllKuwarsi
};
