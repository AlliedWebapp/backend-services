const express = require("express");
const router = express.Router();
const multer = require("multer");

const storage = multer.memoryStorage();  // Store file as buffer in memory
const upload = multer({ storage: storage });

const { submitFSR } = require("../controllers/ReportController");

const { submitFSR, getAllFSRs } = require("../controllers/ReportController");
router.get("/fsrs", getAllFSRs); // 👈 GET route to fetch all reports

// Match field names: single & multiple
router.post(
  "/submit-fsr",
  upload.fields([
    { name: "customerSignature", maxCount: 1 },
    { name: "engineerSignature", maxCount: 1 },
    { name: "workPhotos", maxCount: 4 }, // multiple files
  ]),
  submitFSR
);

module.exports = router;
