const express = require("express");
const router = express.Router();
const { 
    getSpareInventory,
    getAllSolding,
    getAllShong,
    getAllJogini,
    getAllSDLLPsalun,
    getAllKuwarsi
} = require("../controllers/sparesController");

// Test route to check if router is working
router.get("/test", (req, res) => {
    res.json({ message: "Spare routes working" });
});

// Data routes - remove /api prefix since it's added in server.js
router.get("/solding", getAllSolding);
router.get("/shong", getAllShong);
router.get("/jogini", getAllJogini);
router.get("/sdllpsalun", getAllSDLLPsalun);
router.get("/kuwarsi", getAllKuwarsi);

// Existing spare route
router.get("/inventory", getSpareInventory);

module.exports = router;
