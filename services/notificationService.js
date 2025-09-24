import nodemailer from 'nodemailer';
import twilio from 'twilio';

// Initialize Twilio client if credentials are available
let twilioClient;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

// Create reusable transporter object using the default SMTP transport
let transporter;
if (process.env.EMAIL_HOST && process.env.EMAIL_PORT && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
}

/**
 * Send email notification
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} text - Email body text
 * @param {string} html - Email body HTML
 */
export const sendEmail = async (to, subject, text, html) => {
    try {
        // If transporter is not configured, skip email sending
        if (!transporter) {
            console.log('Email transporter not configured, skipping email notification');
            return { success: true, message: 'Email transporter not configured' };
        }

        // Send email
        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
            to,
            subject,
            text,
            html
        });

        console.log('Email sent: ' + info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Send SMS notification
 * @param {string} to - Recipient phone number
 * @param {string} body - SMS body
 */
export const sendSMS = async (to, body) => {
    try {
        // If Twilio is not configured, skip SMS sending
        if (!twilioClient) {
            console.log('Twilio client not configured, skipping SMS notification');
            return { success: true, message: 'Twilio client not configured' };
        }

        // Send SMS
        const message = await twilioClient.messages.create({
            body,
            from: process.env.TWILIO_PHONE_NUMBER,
            to
        });

        console.log('SMS sent: ' + message.sid);
        return { success: true, sid: message.sid };
    } catch (error) {
        console.error('Error sending SMS:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Send appointment confirmation notification
 * @param {Object} user - User object
 * @param {Object} doctor - Doctor object
 * @param {string} date - Appointment date
 * @param {string} time - Appointment time
 */
export const sendAppointmentConfirmation = async (user, doctor, date, time) => {
    const subject = 'Appointment Confirmation';
    const text = `Hello ${user.name},\n\nYour appointment with Dr. ${doctor.name} on ${date} at ${time} has been confirmed.\n\nBest regards,\nFasoLink Team`;
    const html = `
        <h2>Hello ${user.name},</h2>
        <p>Your appointment with Dr. <strong>${doctor.name}</strong> on <strong>${date}</strong> at <strong>${time}</strong> has been confirmed.</p>
        <p>Best regards,<br/>FasoLink Team</p>
    `;

    // Send email
    if (user.email) {
        await sendEmail(user.email, subject, text, html);
    }

    // Send SMS
    if (user.phone) {
        await sendSMS(user.phone, `Hello ${user.name}, your appointment with Dr. ${doctor.name} on ${date} at ${time} has been confirmed. - FasoLink Team`);
    }
};

/**
 * Send appointment cancellation notification
 * @param {Object} user - User object
 * @param {Object} doctor - Doctor object
 * @param {string} date - Appointment date
 * @param {string} time - Appointment time
 */
export const sendAppointmentCancellation = async (user, doctor, date, time) => {
    const subject = 'Appointment Cancellation';
    const text = `Hello ${user.name},\n\nYour appointment with Dr. ${doctor.name} on ${date} at ${time} has been cancelled.\n\nBest regards,\nFasoLink Team`;
    const html = `
        <h2>Hello ${user.name},</h2>
        <p>Your appointment with Dr. <strong>${doctor.name}</strong> on <strong>${date}</strong> at <strong>${time}</strong> has been cancelled.</p>
        <p>Best regards,<br/>FasoLink Team</p>
    `;

    // Send email
    if (user.email) {
        await sendEmail(user.email, subject, text, html);
    }

    // Send SMS
    if (user.phone) {
        await sendSMS(user.phone, `Hello ${user.name}, your appointment with Dr. ${doctor.name} on ${date} at ${time} has been cancelled. - FasoLink Team`);
    }
};

/**
 * Send appointment reminder notification
 * @param {Object} user - User object
 * @param {Object} doctor - Doctor object
 * @param {string} date - Appointment date
 * @param {string} time - Appointment time
 */
export const sendAppointmentReminder = async (user, doctor, date, time) => {
    const subject = 'Appointment Reminder';
    const text = `Hello ${user.name},\n\nThis is a reminder for your appointment with Dr. ${doctor.name} on ${date} at ${time}.\n\nBest regards,\nFasoLink Team`;
    const html = `
        <h2>Hello ${user.name},</h2>
        <p>This is a reminder for your appointment with Dr. <strong>${doctor.name}</strong> on <strong>${date}</strong> at <strong>${time}</strong>.</p>
        <p>Best regards,<br/>FasoLink Team</p>
    `;

    // Send email
    if (user.email) {
        await sendEmail(user.email, subject, text, html);
    }

    // Send SMS
    if (user.phone) {
        await sendSMS(user.phone, `Hello ${user.name}, this is a reminder for your appointment with Dr. ${doctor.name} on ${date} at ${time}. - FasoLink Team`);
    }
};