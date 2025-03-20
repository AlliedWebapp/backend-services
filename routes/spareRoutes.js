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

// Test route
router.get("/test", (req, res) => {
    res.json({ message: "Routes are working" });
});

// Define routes WITHOUT /api prefix
router.get("/jogini", getAllJogini);
router.get("/solding", getAllSolding);
router.get("/shong", getAllShong);
router.get("/sdllpsalun", getAllSDLLPsalun);
router.get("/kuwarsi", getAllKuwarsi);
router.get("/inventory", getSpareInventory);

module.exports = router;
