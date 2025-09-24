import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema({
    doctorId: { type: String, required: true },
    patientId: { type: String, required: true },
    patientName: { type: String, required: true },
    medications: [{
        name: { type: String, required: true },
        dosage: { type: String, required: true },
        frequency: { type: String, required: true },
        duration: { type: String, required: true },
        instructions: { type: String, default: '' }
    }],
    diagnosis: { type: String, required: true },
    instructions: { type: String, default: '' },
    status: { 
        type: String, 
        enum: ['active', 'completed', 'cancelled'],
        default: 'active'
    },
    date: { type: Date, default: Date.now },
    validUntil: { type: Date, required: true }
});

const prescriptionModel = mongoose.models.prescription || mongoose.model("prescription", prescriptionSchema);
export default prescriptionModel;
