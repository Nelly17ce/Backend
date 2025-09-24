import cron from 'node-cron';
import appointmentModel from '../models/appointmentModel.js';
import userModel from '../models/userModel.js';
import doctorModel from '../models/doctorModel.js';
import { sendAppointmentReminder } from './notificationService.js';

// Schedule a cron job to run every day at 9:00 AM
// This will send reminders for appointments scheduled for the next day
cron.schedule('0 9 * * *', async () => {
    console.log('Running daily appointment reminder check');
    
    try {
        // Get tomorrow's date
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        // Format date to match slotDate format (dd_mm_yyyy)
        const day = tomorrow.getDate();
        const month = tomorrow.getMonth() + 1; // Months are zero-indexed
        const year = tomorrow.getFullYear();
        const targetDate = `${day}_${month}_${year}`;
        
        // Find all appointments for tomorrow that haven't been reminded yet
        const appointments = await appointmentModel.find({
            slotDate: targetDate,
            cancelled: false,
            reminderSent: { $ne: true } // Only appointments where reminder hasn't been sent
        }).populate('userId').populate('docId');
        
        console.log(`Found ${appointments.length} appointments for tomorrow`);
        
        // Send reminders for each appointment
        for (const appointment of appointments) {
            try {
                // Get user and doctor details
                const user = await userModel.findById(appointment.userId);
                const doctor = await doctorModel.findById(appointment.docId);
                
                if (user && doctor) {
                    // Send reminder notification
                    await sendAppointmentReminder(user, doctor, appointment.slotDate, appointment.slotTime);
                    
                    // Mark reminder as sent
                    await appointmentModel.findByIdAndUpdate(appointment._id, { reminderSent: true });
                    
                    console.log(`Reminder sent for appointment ${appointment._id}`);
                }
            } catch (error) {
                console.error(`Error sending reminder for appointment ${appointment._id}:`, error);
            }
        }
    } catch (error) {
        console.error('Error in appointment reminder service:', error);
    }
});

console.log('Appointment reminder service initialized');