import express from 'express';
import { loginUser, registerUser, getProfile, updateProfile, bookAppointment, listAppointments, cancelAppointment } from '../controllers/userController.js';
import upload from '../middleware/multer.js';
import authUser from '../middleware/authUser.js';
const userRouter = express.Router();

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)

userRouter.get("/profile", authUser, getProfile)
userRouter.put("/profile", upload.single('image'), authUser, updateProfile)
userRouter.post("/book-appointment", authUser, bookAppointment)
userRouter.get("/appointments", authUser, listAppointments)
userRouter.post("/cancel-appointment", authUser, cancelAppointment)

export default userRouter;