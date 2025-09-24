import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId: { type: String, required: true }, // User ID of sender
    receiverId: { type: String, required: true }, // User ID of receiver (doctor or patient)
    senderType: { type: String, enum: ['user', 'doctor'], required: true }, // Type of sender
    receiverType: { type: String, enum: ['user', 'doctor'], required: true }, // Type of receiver
    content: { type: String, required: true },
    timestamp: { type: Number, required: true },
    read: { type: Boolean, default: false }
});

const messageModel = mongoose.models.message || mongoose.model("message", messageSchema);
export default messageModel;