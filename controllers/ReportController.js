const FSR = require("../models/FSRModel"); // Your mongoose model

// Function to generate a 4-digit unique fsr_id
function generateFSRId() {
  return Math.floor(1000 + Math.random() * 9000); // Generates a 4-digit number between 1000 and 9999
}

exports.submitFSR = async (req, res) => {
  try {
    const {
      customerName,
      installationAddress,
      siteId,
      commissioningDate,
      instanceId,
      state,
      rating,
      engineModel,
      engineSerial,
      gensetSerial,
      runningHours,
      taskStart,
      taskEnd,
      problemSummary,
      natureOfFailure,
      checklist,
      engineerRemarks,
      customerRemarks,
      engineerName,
      customerContact,
      customerEmail,
      ticketId
    } = req.body;

    // Retrieve image buffers for signatures and work photos
    const customerSignature = req.files["customerSignature"]?.[0]?.buffer;
    const engineerSignature = req.files["engineerSignature"]?.[0]?.buffer;
    const workPhotos = req.files["workPhotos"]?.map(file => file.buffer) || [];

    // Generate a 4-digit fsr_id for each report
    const fsrId = generateFSRId();

    // Create new FSR report with generated fsr_id
    const newReport = new FSR({
      fsrId,  // Add the unique 4-digit fsr_id
      ticketId,
      customerName,
      installationAddress,
      siteId,
      commissioningDate,
      instanceId,
      state,
      rating,
      engineModel,
      engineSerial,
      gensetSerial,
      runningHours,
      taskStart,
      taskEnd,
      problemSummary,
      natureOfFailure,
      checklist,
      engineerRemarks,
      customerRemarks,
      engineerName,
      customerContact,
      customerEmail,
      customerSignature,
      engineerSignature,
      workPhotos
    });

    // Save the new report to the database
    await newReport.save();
    res.status(201).json({ message: "FSR submitted successfully!" });
  } catch (err) {
    console.error("Error in submitFSR:", err);
    res.status(500).json({ message: "Something went wrong." });
  }
};

exports.getAllFSRs = async (req, res) => {
  try {
    // Fetch all reports from the database, sorted by creation date in descending order
    const reports = await FSR.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    console.error("Error fetching FSRs:", err);
    res.status(500).json({ message: "Failed to fetch FSRs" });
  }
};

// ✅ NEW FUNCTION TO FETCH BY MONGO _id
const Ticket = require("../models/ticketModel");

exports.getFSRByMongoId = async (req, res) => {
  try {
    const { id } = req.params;

    // Step 1: Find the FSR
    const report = await FSR.findById(id);
    if (!report) {
      return res.status(404).json({ message: "FSR not found" });
    }

    // Step 2: Find the Ticket using ticketId stored in FSR
    const ticket = await Ticket.findById(report.ticketId);
    if (!ticket) {
      return res.status(404).json({ message: "Associated ticket not found" });
    }

    // Step 3: Replace Mongo ObjectId with custom 4-digit ticket_id
    const updatedReport = {
      ...report.toObject(),
      ticketId: ticket.ticket_id  // replace with human-readable one
    };

    res.json(updatedReport);
  } catch (err) {
    console.error("Error fetching FSR by _id:", err);
    res.status(500).json({ message: "Failed to fetch FSR" });
  }
};

