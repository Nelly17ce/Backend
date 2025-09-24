import messageModel from "../models/messageModel.js";
import userModel from "../models/userModel.js";
import doctorModel from "../models/doctorModel.js";

// API to send a message
const sendMessage = async (req, res) => {
    try {
        const { senderId, receiverId, content, senderType, receiverType } = req.body;
        
        // Validate that sender and receiver exist
        let sender, receiver;
        
        if (senderType === 'user') {
            sender = await userModel.findById(senderId);
        } else if (senderType === 'doctor') {
            sender = await doctorModel.findById(senderId);
        }
        
        if (receiverType === 'user') {
            receiver = await userModel.findById(receiverId);
        } else if (receiverType === 'doctor') {
            receiver = await doctorModel.findById(receiverId);
        }
        
        if (!sender || !receiver) {
            return res.json({ success: false, message: "Sender or receiver not found" });
        }
        
        const newMessage = new messageModel({
            senderId,
            receiverId,
            senderType,
            receiverType,
            content,
            timestamp: Date.now(),
            read: false
        });
        
        await newMessage.save();
        res.json({ success: true, message: "Message sent successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to get messages between two users
const getMessages = async (req, res) => {
    try {
        const { userId, contactId, userType, contactType } = req.body;
        
        // Get messages between the two users
        const messages = await messageModel.find({
            $or: [
                { senderId: userId, receiverId: contactId, senderType: userType, receiverType: contactType },
                { senderId: contactId, receiverId: userId, senderType: contactType, receiverType: userType }
            ]
        }).sort({ timestamp: 1 });
        
        res.json({ success: true, messages });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to mark messages as read
const markAsRead = async (req, res) => {
    try {
        const { userId, contactId, userType, contactType } = req.body;
        
        // Mark messages as read
        await messageModel.updateMany({
            senderId: contactId,
            receiverId: userId,
            senderType: contactType,
            receiverType: userType,
            read: false
        }, {
            read: true
        });
        
        res.json({ success: true, message: "Messages marked as read" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to get unread message count
const getUnreadCount = async (req, res) => {
    try {
        const { userId, userType } = req.body;
        
        // Get count of unread messages
        const count = await messageModel.countDocuments({
            receiverId: userId,
            receiverType: userType,
            read: false
        });
        
        res.json({ success: true, count });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export {
    sendMessage,
    getMessages,
    markAsRead,
    getUnreadCount
};