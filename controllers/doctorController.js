import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import noteModel from "../models/noteModel.js";
import prescriptionModel from "../models/prescriptionModel.js";
import userModel from "../models/userModel.js";

// API for doctor Login 
const loginDoctor = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await doctorModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "Invalid credentials" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get doctor appointments for doctor panel
const appointmentsDoctor = async (req, res) => {
    try {
    const docId = req.docId
    const appointments = await appointmentModel.find({ docId })
        res.json({ success: true, appointments })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to cancel appointment for doctor panel
const appointmentCancel = async (req, res) => {
    try {
        const { appointmentId } = req.body
        const docId = req.docId
        const appointmentData = await appointmentModel.findById(appointmentId)
        if (appointmentData && appointmentData.docId === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
            return res.json({ success: true, message: 'Appointment Cancelled' })
        }
        res.json({ success: false, message: 'Appointment Cancelled' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to mark appointment completed for doctor panel
const appointmentComplete = async (req, res) => {
    try {
        const { appointmentId } = req.body
        const docId = req.docId
        const appointmentData = await appointmentModel.findById(appointmentId)
        if (appointmentData && appointmentData.docId === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true })
            return res.json({ success: true, message: 'Appointment Completed' })
        }
        res.json({ success: false, message: 'Appointment Cancelled' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get all doctors list for Frontend
const doctorList = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select(['-password', '-email'])
        res.json({ success: true, doctors })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to change doctor availablity for Admin and Doctor Panel
const changeAvailablity = async (req, res) => {
    try {
    const docId = req.docId
    const docData = await doctorModel.findById(docId)
    await doctorModel.findByIdAndUpdate(docId, { available: !docData.available })
        res.json({ success: true, message: 'Availablity Changed' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get doctor profile for  Doctor Panel
const doctorProfile = async (req, res) => {
    try {
    const docId = req.docId
    const profileData = await doctorModel.findById(docId).select('-password')
        res.json({ success: true, profileData })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to update doctor profile data from  Doctor Panel
const updateDoctorProfile = async (req, res) => {
    try {
        const { 
            name, email, phone, speciality, experience, fees, degree, 
            about, education, certifications, languages, address, available 
        } = req.body;
        const docId = req.docId;
        
        // Prepare update object with only provided fields
        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (email !== undefined) updateData.email = email;
        if (phone !== undefined) updateData.phone = phone;
        if (speciality !== undefined) updateData.speciality = speciality;
        if (experience !== undefined) updateData.experience = experience;
        if (fees !== undefined) updateData.fees = fees;
        if (degree !== undefined) updateData.degree = degree;
        if (about !== undefined) updateData.about = about;
        if (education !== undefined) updateData.education = education;
        if (certifications !== undefined) updateData.certifications = certifications;
        if (languages !== undefined) updateData.languages = languages;
        if (address !== undefined) updateData.address = address;
        if (available !== undefined) updateData.available = available;
        
        await doctorModel.findByIdAndUpdate(docId, updateData);
        res.json({ success: true, message: 'Profil mis à jour avec succès' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to get dashboard data for doctor panel
const doctorDashboard = async (req, res) => {
    try {
        const docId = req.docId;
        
        // Get doctor information
        const doctor = await doctorModel.findById(docId).select('-password');
        if (!doctor) {
            return res.json({ success: false, message: 'Médecin non trouvé' });
        }
        
        // Get appointments for this specific doctor
        const appointments = await appointmentModel.find({ docId }).sort({ date: -1 });

        // Calculate earnings
        let earnings = 0;
        appointments.forEach((item) => {
            if (item.isCompleted || item.payment) {
                earnings += item.amount;
            }
        });

        // Get unique patients
        const uniquePatients = new Set();
        appointments.forEach((item) => {
            uniquePatients.add(item.userId);
        });

        // Get today's appointments
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const todayAppointments = appointments.filter(apt => {
            const aptDate = new Date(apt.date);
            return aptDate >= today && aptDate < tomorrow;
        });

        // Get next appointment
        const nextAppointment = appointments.find(apt => 
            !apt.cancelled && !apt.isCompleted && new Date(apt.date) > new Date()
        );

        // Get doctor's slots
        const slots = doctor.availabilitySlots || [];

        const dashData = {
            doctorName: doctor.name,
            doctorEmail: doctor.email,
            doctorSpeciality: doctor.speciality,
            earnings,
            appointments: appointments.length,
            patients: uniquePatients.size,
            todayAppointments: todayAppointments.length,
            latestAppointments: appointments.slice(0, 10), // Last 10 appointments
            nextAppointment: nextAppointment ? {
                time: nextAppointment.slotTime,
                patient: nextAppointment.userData?.name || 'Patient inconnu',
                date: nextAppointment.slotDate
            } : null,
            slots: slots,
            doctorData: {
                name: doctor.name,
                email: doctor.email,
                speciality: doctor.speciality,
                fees: doctor.fees,
                available: doctor.available,
                totalAppointments: appointments.length,
                totalPatients: uniquePatients.size
            }
        };

        res.json({ success: true, dashData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


const removeAvailabilitySlot = async (req, res) => {
    try {
        const { slotId } = req.body;
        const docId = req.docId;
        await doctorModel.findByIdAndUpdate(docId, {
            $pull: { availabilitySlots: { _id: slotId } }
        });
        res.json({ success: true, message: "Créneau supprimé" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Pour les patients - slots disponibles
const getAvailableSlots = async (req, res) => {
    try {
        const { docId } = req.params; 
        const doctor = await doctorModel.findById(docId);
        
        if (!doctor) {
            return res.json({ success: false, message: "Médecin non trouvé" });
        }

        res.json({ 
            success: true, 
            slots: doctor.availabilitySlots.filter(slot => !slot.isBooked)
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Pour le médecin - tous ses slots
const getDoctorSlots = async (req, res) => {
    try {
        const docId = req.docId; // Use the authenticated doctor's ID
        const doctor = await doctorModel.findById(docId);
        if (!doctor) {
            return res.json({ success: false, message: 'Médecin non trouvé' });
        }
        res.json({ success: true, slots: doctor.availabilitySlots || [] });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const updateAvailabilitySlot = async (req, res) => {
    try {
        const docId = req.docId; // Use the authenticated doctor's ID
        const { slotId, newDate, newStartTime, newEndTime } = req.body;
        const doctor = await doctorModel.findById(docId);
        
        if (!doctor) {
            return res.json({ success: false, message: "Médecin non trouvé" });
        }
        
        const slotToUpdate = doctor.availabilitySlots.id(slotId);

        if (!slotToUpdate) {
            return res.json({ success: false, message: "Créneau introuvable" });
        }

        slotToUpdate.date = newDate || slotToUpdate.date;
        slotToUpdate.startTime = newStartTime || slotToUpdate.startTime;
        slotToUpdate.endTime = newEndTime || slotToUpdate.endTime;

        await doctor.save();
        res.json({ success: true, message: "Créneau mis à jour" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const generateTimeSlots = async (req, res) => {
    try {
        const docId = req.docId; // Use the authenticated doctor's ID
        const { date, startTime, endTime, duration = 30 } = req.body;
        
        // Validation des données
        if (!date || !startTime || !endTime) {
            return res.json({ success: false, message: "Tous les champs sont requis" });
        }

        const start = new Date(`${date}T${startTime}`);
        const end = new Date(`${date}T${endTime}`);
        
        if (start >= end) {
            return res.json({ success: false, message: "L'heure de fin doit être après l'heure de début" });
        }

        const slots = [];
        let currentTime = new Date(start);

        // Génération des créneaux
        while (currentTime < end) {
            const slotEnd = new Date(currentTime.getTime() + duration * 60000);
            
            if (slotEnd > end) break;

            slots.push({
                date: date,
                startTime: currentTime.toTimeString().substring(0, 5),
                endTime: slotEnd.toTimeString().substring(0, 5),
                isBooked: false
            });

            currentTime = slotEnd;
        }

        // Ajout des créneaux au médecin
        await doctorModel.findByIdAndUpdate(docId, {
            $push: { availabilitySlots: { $each: slots } }
        });

        res.json({ 
            success: true, 
            message: `${slots.length} créneaux générés`,
            slots
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// API to get doctor notes
const getNotes = async (req, res) => {
    try {
        const docId = req.docId;
        const notes = await noteModel.find({ doctorId: docId }).sort({ date: -1 });
        res.json({ success: true, notes });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to add a new note
const addNote = async (req, res) => {
    try {
        const docId = req.docId;
        const { patientId, patientName, title, content, type, diagnosis, symptoms, treatment, followUp, isPrivate } = req.body;
        
        const newNote = new noteModel({
            doctorId: docId,
            patientId,
            patientName,
            title,
            content,
            type,
            diagnosis,
            symptoms,
            treatment,
            followUp,
            isPrivate
        });
        
        await newNote.save();
        res.json({ success: true, message: 'Note ajoutée avec succès', note: newNote });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to get doctor patients
const getPatients = async (req, res) => {
    try {
        const docId = req.docId;
        const appointments = await appointmentModel.find({ docId }).populate('userId');
        
        // Get unique patients
        const patientMap = new Map();
        appointments.forEach(appointment => {
            if (appointment.userData && !patientMap.has(appointment.userData._id)) {
                patientMap.set(appointment.userData._id, {
                    _id: appointment.userData._id,
                    name: appointment.userData.name,
                    email: appointment.userData.email,
                    phone: appointment.userData.phone,
                    gender: appointment.userData.gender,
                    dob: appointment.userData.dob,
                    bloodType: appointment.userData.bloodType,
                    allergies: appointment.userData.allergies,
                    medicalConditions: appointment.userData.medicalConditions,
                    medications: appointment.userData.medications,
                    totalAppointments: 0,
                    totalSpent: 0,
                    lastVisit: null,
                    status: 'Actif'
                });
            }
        });
        
        // Calculate statistics for each patient
        const patients = Array.from(patientMap.values());
        patients.forEach(patient => {
            const patientAppointments = appointments.filter(apt => apt.userData._id === patient._id);
            patient.totalAppointments = patientAppointments.length;
            patient.totalSpent = patientAppointments.reduce((sum, apt) => sum + apt.amount, 0);
            patient.lastVisit = patientAppointments.length > 0 ? 
                new Date(Math.max(...patientAppointments.map(apt => apt.date))) : null;
        });
        
        res.json({ success: true, patients });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to get doctor prescriptions
const getPrescriptions = async (req, res) => {
    try {
        const docId = req.docId;
        const prescriptions = await prescriptionModel.find({ doctorId: docId }).sort({ date: -1 });
        res.json({ success: true, prescriptions });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to add a new prescription
const addPrescription = async (req, res) => {
    try {
        const docId = req.docId;
        const { patientId, patientName, medications, diagnosis, instructions, validUntil } = req.body;
        
        const newPrescription = new prescriptionModel({
            doctorId: docId,
            patientId,
            patientName,
            medications,
            diagnosis,
            instructions,
            validUntil: new Date(validUntil)
        });
        
        await newPrescription.save();
        res.json({ success: true, message: 'Prescription créée avec succès', prescription: newPrescription });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to get doctor statistics
const getStatistics = async (req, res) => {
    try {
        const docId = req.docId;
        
        // Get appointments data
        const appointments = await appointmentModel.find({ docId });
        const notes = await noteModel.find({ doctorId: docId });
        const prescriptions = await prescriptionModel.find({ doctorId: docId });
        
        // Calculate monthly statistics
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        
        const monthlyStats = [];
        for (let i = 11; i >= 0; i--) {
            const date = new Date(currentYear, currentMonth - i, 1);
            const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
            const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            
            const monthAppointments = appointments.filter(apt => {
                const aptDate = new Date(apt.date);
                return aptDate >= monthStart && aptDate <= monthEnd;
            });
            
            const monthRevenue = monthAppointments.reduce((sum, apt) => {
                return sum + (apt.isCompleted || apt.payment ? apt.amount : 0);
            }, 0);
            
            monthlyStats.push({
                month: date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }),
                appointments: monthAppointments.length,
                revenue: monthRevenue
            });
        }
        
        // Calculate overall statistics
        const totalEarnings = appointments.reduce((sum, apt) => {
            return sum + (apt.isCompleted || apt.payment ? apt.amount : 0);
        }, 0);
        
        const pendingEarnings = appointments.reduce((sum, apt) => {
            return sum + (!apt.isCompleted && !apt.payment ? apt.amount : 0);
        }, 0);
        
        const completedAppointments = appointments.filter(apt => apt.isCompleted).length;
        const cancelledAppointments = appointments.filter(apt => apt.cancelled).length;
        const pendingAppointments = appointments.filter(apt => !apt.isCompleted && !apt.cancelled).length;
        
        // Get unique patients count
        const uniquePatients = new Set(appointments.map(apt => apt.userId)).size;
        
        const statistics = {
            totalAppointments: appointments.length,
            completedAppointments,
            cancelledAppointments,
            pendingAppointments,
            totalPatients: uniquePatients,
            totalEarnings,
            pendingEarnings,
            totalNotes: notes.length,
            totalPrescriptions: prescriptions.length,
            monthlyStats
        };
        
        res.json({ success: true, statistics });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export {
    loginDoctor,
    appointmentsDoctor,
    appointmentCancel,
    doctorList,
    changeAvailablity,
    appointmentComplete,
    doctorDashboard,
    doctorProfile,
    updateDoctorProfile,
    removeAvailabilitySlot,
    updateAvailabilitySlot,
    getAvailableSlots,
    getDoctorSlots,
    generateTimeSlots,
    getNotes,
    addNote,
    getPatients,
    getPrescriptions,
    addPrescription,
    getStatistics
};