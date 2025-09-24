import express from 'express';
import { sendMessage, getMessages, markAsRead, getUnreadCount } from '../controllers/messageController.js';
import authUser from '../middleware/authUser.js';
import authDoctor from '../middleware/authDoctor.js';

const messageRouter = express.Router();

// User routes (protected by user authentication)
messageRouter.post("/send", authUser, sendMessage);
messageRouter.post("/get", authUser, getMessages);
messageRouter.post("/read", authUser, markAsRead);
messageRouter.post("/unread-count", authUser, getUnreadCount);

// Doctor routes (protected by doctor authentication)
messageRouter.post("/doctor/send", authDoctor, sendMessage);
messageRouter.post("/doctor/get", authDoctor, getMessages);
messageRouter.post("/doctor/read", authDoctor, markAsRead);
messageRouter.post("/doctor/unread-count", authDoctor, getUnreadCount);

export default messageRouter;