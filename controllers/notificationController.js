import notificationModel from "../models/notificationModel.js";

// API to create a notification
const createNotification = async (req, res) => {
    try {
    const userId = req.userId;
    const { type, title, message, relatedId, relatedType } = req.body;
        
        const newNotification = new notificationModel({
            userId,
            type,
            title,
            message,
            timestamp: Date.now(),
            read: false,
            relatedId,
            relatedType
        });
        
        await newNotification.save();
        res.json({ success: true, message: "Notification created successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to get notifications for a user
const getNotifications = async (req, res) => {
    try {
    const userId = req.userId;
        
        // Get notifications for the user, sorted by timestamp
    const notifications = await notificationModel.find({ userId })
            .sort({ timestamp: -1 })
            .limit(20); // Limit to last 20 notifications
        
        res.json({ success: true, notifications });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to mark notifications as read
const markAsRead = async (req, res) => {
    try {
    const userId = req.userId;
    const { notificationId } = req.body;
        
        // Mark specific notification as read
        if (notificationId) {
            await notificationModel.findByIdAndUpdate(notificationId, { read: true });
        } 
        // Mark all notifications as read
        else {
            await notificationModel.updateMany({ userId, read: false }, { read: true });
        }
        
        res.json({ success: true, message: "Notifications marked as read" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to get unread notification count
const getUnreadCount = async (req, res) => {
    try {
    const userId = req.userId;
        
        // Get count of unread notifications
    const count = await notificationModel.countDocuments({ userId, read: false });
        
        res.json({ success: true, count });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export {
    createNotification,
    getNotifications,
    markAsRead,
    getUnreadCount
};