const multer = require('multer');
const path = require('path');

// Store in memory as Buffer
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Optional: 5MB limit
});

module.exports = upload;
