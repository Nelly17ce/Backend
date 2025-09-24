import express from 'express';
import { createNotification, getNotifications, markAsRead, getUnreadCount } from '../controllers/notificationController.js';
import authUser from '../middleware/authUser.js';

const notificationRouter = express.Router();

// User routes (protected by user authentication)
notificationRouter.post("/create", authUser, createNotification);
notificationRouter.post("/get", authUser, getNotifications);
notificationRouter.post("/read", authUser, markAsRead);
notificationRouter.post("/unread-count", authUser, getUnreadCount);

export default notificationRouter;