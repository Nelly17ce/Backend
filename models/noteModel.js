import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
    doctorId: { type: String, required: true },
    patientId: { type: String, required: true },
    patientName: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    type: { 
        type: String, 
        enum: ['consultation', 'diagnostic', 'treatment', 'follow-up', 'general'],
        default: 'general'
    },
    diagnosis: { type: String, default: '' },
    symptoms: { type: String, default: '' },
    treatment: { type: String, default: '' },
    followUp: { type: String, default: '' },
    date: { type: Date, default: Date.now },
    isPrivate: { type: Boolean, default: false }
});

const noteModel = mongoose.models.note || mongoose.model("note", noteSchema);
export default noteModel;
