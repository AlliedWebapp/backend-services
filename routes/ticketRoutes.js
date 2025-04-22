const express = require("express");
const router = express.Router();
const {
  getTickets,
  getTicket,
  createTicket,
  updateTicket,
  deleteTicket
} = require("../controllers/ticketController");

const { protect } = require("../middleware/authMiddleware");
const upload = require('../middleware/uploadMiddleware');

// Re-route into note router for ticket-related notes
const noteRouter = require("./noteRoutes");
router.use("/:ticketId/notes", noteRouter);

// Main ticket routes
router.route("/")
  .get(protect, getTickets)
  .post(protect, upload.array('images', 4), createTicket); // ✅ only one post route here

router.route("/:id")
  .get(protect, getTicket)
  .put(protect, updateTicket)
  .delete(protect, deleteTicket);

  
// Serve individual images for a ticket
router.get("/:ticketId/images/:index", protect, async (req, res) => {
  try {
    const ticket = await require("../models/ticketModel").findById(req.params.ticketId);
    const index = parseInt(req.params.index);

    if (!ticket || !ticket.images || index >= ticket.images.length) {
      return res.status(404).send("Image not found");
    }

    const image = ticket.images[index];

    // If image is stored as plain Buffer (which multer does), no .data needed
    res.set("Content-Type", image.contentType || "image/jpeg");
    res.send(Buffer.from(image.data)); // Force sending raw binary    
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});
// Add a new route to fetch spare descriptions
router.get("/:ticketId/spare-description", protect, async (req, res) => {
  try {
    const ticket = await require("../models/ticketModel").findById(req.params.ticketId);
    if (!ticket) {
      return res.status(404).json({ msg: "Ticket not found" });
    }

    const project = ticket.projectname.toLowerCase();  // Get the project name (e.g., 'jogini')

    // Fetch spare descriptions from the appropriate collection
    const collectionMapping = {
      jogini: 'spareDescription',
      solding: 'descriptionOfMaterial',
      shong: 'descriptionOfMaterial',
      sdllpsalun: 'nameOfMaterials',
      kuwarsi: 'nameOfMaterials'
    }

    const collectionName = collectionMapping[project]
    const ProjectModel = mongoose.model(project)  // Dynamically fetch the model

    const spareDescriptions = await ProjectModel.find({})  // Fetch spare descriptions
    const spareDescriptionsList = spareDescriptions.map(item => item[collectionName])

    res.status(200).json(spareDescriptionsList);  // Send the spare descriptions back to frontend
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});


module.exports = router;

