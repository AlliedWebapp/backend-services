const express = require("express");
const { 
    getSpareInventory,
    getAllSolding,
    getAllShong,
    getAllJogini,
    getAllSDLLPsalun,
    getAllKuwarsi
} = require("../controllers/sparesController");

const router = express.Router();

router.get("/spares/inventory", getSpareInventory);  // API Endpoint: /api/spares/inventory

// Data routes
router.get("/solding", getAllSolding);
router.get("/shong", getAllShong);
router.get("/jogini", getAllJogini);
router.get("/sdllpsalun", getAllSDLLPsalun);
router.get("/kuwarsi", getAllKuwarsi);

module.exports = router;