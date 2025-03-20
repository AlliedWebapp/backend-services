const express = require("express");
const { getSpareInventory } = require("../controllers/sparesController");

const router = express.Router();

router.get("/spares/inventory", getSpareInventory);  // API Endpoint: /api/spares/inventory

module.exports = router;
