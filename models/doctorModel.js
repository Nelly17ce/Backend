import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, required: true },
    phone: { type: String },
    speciality: { type: String, required: true },
    degree: { type: String, required: true },
    experience: { type: String, required: true },
    about: { type: String, required: true },
    education: { type: String },
    certifications: { type: String },
    languages: { type: String },
    available: { type: Boolean, default: true },
    fees: { type: Number, required: true },
    slots_booked: { type: Object, default: {} },
    address: { type: Object, required: true },
    date: { type: Number, required: true },
    availabilitySlots: [{
        date: { type: String, required: true },  
        startTime: { type: String, required: true },  
        endTime: { type: String, required: true },
        isBooked: { type: Boolean, default: false }
    }],
    slots_booked: { type: Object, default: {} }  
}, { minimize: false })

const doctorModel = mongoose.models.doctor || mongoose.model("doctor", doctorSchema);
export default doctorModel;