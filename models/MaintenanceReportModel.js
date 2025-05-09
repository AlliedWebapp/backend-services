const mongoose = require('mongoose');

const MaintenanceReportSchema = new mongoose.Schema({
    mrId: {type: Number, required: true, unique: true},
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    unit: { type: String, required: true },
    outageDate: { type: Date, required: true },
    outageTime: { type: String, required: true },
    defectReported: { type: String, required: true },
    investigationOutcome: { type: String, required: true },
    correctiveAction: { type: String, required: true },
    followUp: { type: String, required: true },
    repairCost: { type: String, required: true },
    remarks: { type: String, required: true },
    generationLoss: { type: String, required: true },

    // Image buffers
    hodSignature: {
        data: Buffer,
        contentType: String
    },
    plantInchargeSignature: {
        data: Buffer,
        contentType: String
    },

    // Timestamp for creation
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const MaintenanceReport = mongoose.model('MaintenanceReport', MaintenanceReportSchema);

module.exports = MaintenanceReport;
