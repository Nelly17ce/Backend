import express from 'express';
import { loginDoctor, appointmentsDoctor, appointmentCancel, doctorList, changeAvailablity, appointmentComplete, doctorDashboard, doctorProfile, updateDoctorProfile, removeAvailabilitySlot, updateAvailabilitySlot, getAvailableSlots,getDoctorSlots,generateTimeSlots, getNotes, addNote, getPatients, getPrescriptions, addPrescription, getStatistics
     } from '../controllers/doctorController.js';
import authDoctor from '../middleware/authDoctor.js';
const doctorRouter = express.Router();

doctorRouter.post("/login", loginDoctor)
doctorRouter.post("/cancel-appointment", authDoctor, appointmentCancel)
doctorRouter.get("/appointments", authDoctor, appointmentsDoctor)
doctorRouter.get("/list", doctorList)
doctorRouter.post("/change-availability", authDoctor, changeAvailablity)
doctorRouter.post("/complete-appointment", authDoctor, appointmentComplete)
doctorRouter.get("/dashboard", authDoctor, doctorDashboard)
doctorRouter.get("/profile", authDoctor, doctorProfile)
doctorRouter.post("/update-profile", authDoctor, updateDoctorProfile)

// Availability management routes
doctorRouter.post("/remove-slot", authDoctor, removeAvailabilitySlot);
doctorRouter.put("/update-slot", authDoctor, updateAvailabilitySlot);
doctorRouter.get("/available-slots/:docId", getAvailableSlots);
doctorRouter.get("/my-slots", authDoctor, getDoctorSlots);
doctorRouter.post('/generate-slots', authDoctor, generateTimeSlots);

// New endpoints for notes, patients, prescriptions, and statistics
doctorRouter.get("/notes", authDoctor, getNotes);
doctorRouter.post("/notes", authDoctor, addNote);
doctorRouter.get("/patients", authDoctor, getPatients);
doctorRouter.get("/prescriptions", authDoctor, getPrescriptions);
doctorRouter.post("/prescriptions", authDoctor, addPrescription);
doctorRouter.get("/statistics", authDoctor, getStatistics);

export default doctorRouter;