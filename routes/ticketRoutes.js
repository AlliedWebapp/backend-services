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
// **New Route** to fetch spare descriptions (based on collection)
router.get("/:ticketId/spare-description", protect, async (req, res) => {
  const { ticketId } = req.params;

  try {
    // Validate ticketId format
    if (!ticketId || !/^[0-9a-fA-F]{24}$/.test(ticketId)) {
      return res.status(400).json({ 
        msg: "Invalid ticket ID format",
        error: "Ticket ID must be a valid MongoDB ObjectId"
      });
    }

    const ticket = await require("../models/ticketModel").findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ 
        msg: "Ticket not found",
        error: `No ticket found with ID: ${ticketId}`
      });
    }

    if (!ticket.projectname) {
      return res.status(400).json({ 
        msg: "Invalid ticket data",
        error: "Ticket does not have a project name"
      });
    }

    // Map project names to their correct collection names and API endpoints
    const projectMapping = {
      'jogini': { collection: 'Jogini', endpoint: 'jogini' },
      'jogini-ii': { collection: 'Jogini', endpoint: 'jogini' },
      'kuwarsi': { collection: 'Kuwarsi', endpoint: 'kuwarsi' },
      'kuwarsi-ii': { collection: 'Kuwarsi', endpoint: 'kuwarsi' },
      'jhp kuwarsi-ii': { collection: 'Kuwarsi', endpoint: 'kuwarsi' },
      'sdllp salun': { collection: 'SDLLPsalun', endpoint: 'sdllpsalun' },
      'sdllpsalun': { collection: 'SDLLPsalun', endpoint: 'sdllpsalun' },
      'shong': { collection: 'Shong', endpoint: 'shong' },
      'solding': { collection: 'solding', endpoint: 'solding' }
    };

    const project = ticket.projectname.toLowerCase();
    const projectInfo = projectMapping[project];

    if (!projectInfo) {
      return res.status(400).json({ 
        msg: "Invalid project",
        error: `Project '${project}' is not supported. Valid projects are: ${Object.keys(projectMapping).join(', ')}`
      });
    }

    // Get the authorization token from the request headers
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ 
        msg: "Unauthorized",
        error: "Authorization token is missing"
      });
    }

    // Fetch spare descriptions from the correct endpoint with authorization
    const response = await fetch(`https://backend-services-theta.vercel.app/api/${projectInfo.endpoint}`, {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error from spares API: ${errorText}`);
      return res.status(response.status).json({ 
        msg: `Error fetching spare descriptions for ${projectInfo.collection}`,
        error: errorText
      });
    }

    const responseData = await response.json();
    
    // Ensure we have an array of spares
    let spareDescriptions = [];
    if (Array.isArray(responseData)) {
      spareDescriptions = responseData;
    } else if (responseData && typeof responseData === 'object') {
      // If the response is an object, try to extract the array of spares
      if (Array.isArray(responseData.spares)) {
        spareDescriptions = responseData.spares;
      } else if (Array.isArray(responseData.data)) {
        spareDescriptions = responseData.data;
      } else {
        // If we can't find an array, try to use the object's values
        spareDescriptions = Object.values(responseData);
      }
    }

    if (!Array.isArray(spareDescriptions)) {
      console.error('Invalid response format:', responseData);
      return res.status(500).json({
        msg: "Invalid response format",
        error: "Could not parse spare descriptions from the response"
      });
    }
    
    // Map the response to a consistent format based on the collection
    const mappedDescriptions = spareDescriptions.map(spare => {
      if (!spare || typeof spare !== 'object') {
        return {
          id: 'unknown',
          description: 'Invalid spare data',
          quantity: 0
        };
      }

      const fieldMapping = {
        'Jogini': spare.spareDescription,
        'Kuwarsi': spare.nameOfMaterials,
        'SDLLPsalun': spare.nameOfMaterials,
        'Shong': spare.descriptionOfMaterial,
        'solding': spare.descriptionOfMaterial
      };
      
      return {
        id: spare._id || spare.id || 'unknown',
        description: fieldMapping[projectInfo.collection] || spare.description || spare.name || 'Unknown',
        quantity: spare.quantity || 0
      };
    });

    return res.status(200).json(mappedDescriptions);
  } catch (err) {
    console.error("Error in spare-description route:", err);
    return res.status(500).json({ 
      msg: "Server Error", 
      error: err.message 
    });
  }
});

module.exports = router;

