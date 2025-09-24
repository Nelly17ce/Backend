import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // User ID who receives the notification
    type: { 
        type: String, 
        enum: ['appointment_confirmation', 'appointment_reminder', 'appointment_cancellation', 'message'], 
        required: true 
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Number, required: true },
    read: { type: Boolean, default: false },
    relatedId: { type: String }, // ID of related appointment or message
    relatedType: { type: String, enum: ['appointment', 'message'] } // Type of related item
});

const notificationModel = mongoose.models.notification || mongoose.model("notification", notificationSchema);
export default notificationModel;