// Script pour créer des docteurs de test et corriger les problèmes de données
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import doctorModel from './models/doctorModel.js';

// Connexion à MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/FasoLink');
        console.log('✅ Connexion à MongoDB réussie');
    } catch (error) {
        console.error('❌ Erreur de connexion à MongoDB:', error);
        process.exit(1);
    }
};

// Docteurs de test
const sampleDoctors = [
    {
        name: "Dr. Jean Baptiste",
        email: "jean@fasolink.com",
        password: "password123",
        image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face",
        speciality: "Médecin Généraliste",
        degree: "MD - Médecine Générale",
        experience: "8 ans",
        about: "Dr. Jean Baptiste est un médecin généraliste expérimenté avec une passion pour les soins préventifs et l'accompagnement de ses patients.",
        available: true,
        fees: 5000,
        address: {
            line1: "Ouagadougou, Secteur 15",
            line2: "Burkina Faso"
        },
        date: Date.now(),
        availabilitySlots: [
            {
                date: "2024-01-15",
                startTime: "09:00",
                endTime: "10:00",
                isBooked: false
            },
            {
                date: "2024-01-15",
                startTime: "10:00",
                endTime: "11:00",
                isBooked: false
            },
            {
                date: "2024-01-15",
                startTime: "14:00",
                endTime: "15:00",
                isBooked: false
            }
        ]
    },
    {
        name: "Dr. Marie Traoré",
        email: "marie@fasolink.com",
        password: "password123",
        image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
        speciality: "Cardiologue",
        degree: "MD - Cardiologie",
        experience: "12 ans",
        about: "Dr. Marie Traoré est une cardiologue renommée spécialisée dans le traitement des maladies cardiovasculaires et la prévention.",
        available: true,
        fees: 8000,
        address: {
            line1: "Ouagadougou, Secteur 10",
            line2: "Burkina Faso"
        },
        date: Date.now(),
        availabilitySlots: [
            {
                date: "2024-01-15",
                startTime: "08:00",
                endTime: "09:00",
                isBooked: false
            },
            {
                date: "2024-01-15",
                startTime: "11:00",
                endTime: "12:00",
                isBooked: false
            }
        ]
    },
    {
        name: "Dr. Ibrahim Ouédraogo",
        email: "ibrahim@fasolink.com",
        password: "password123",
        image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face",
        speciality: "Pédiatre",
        degree: "MD - Pédiatrie",
        experience: "6 ans",
        about: "Dr. Ibrahim Ouédraogo est un pédiatre dévoué qui se spécialise dans les soins aux enfants et adolescents.",
        available: true,
        fees: 6000,
        address: {
            line1: "Ouagadougou, Secteur 5",
            line2: "Burkina Faso"
        },
        date: Date.now(),
        availabilitySlots: [
            {
                date: "2024-01-15",
                startTime: "09:00",
                endTime: "10:00",
                isBooked: false
            },
            {
                date: "2024-01-15",
                startTime: "15:00",
                endTime: "16:00",
                isBooked: false
            }
        ]
    },
    {
        name: "Dr. Fatouma Sawadogo",
        email: "fatouma@fasolink.com",
        password: "password123",
        image: "https://images.unsplash.com/photo-1594824388852-8a0b5b3b3b3b?w=400&h=400&fit=crop&crop=face",
        speciality: "Gynécologue",
        degree: "MD - Gynécologie",
        experience: "10 ans",
        about: "Dr. Fatouma Sawadogo est une gynécologue expérimentée spécialisée dans la santé des femmes et la médecine reproductive.",
        available: true,
        fees: 7000,
        address: {
            line1: "Ouagadougou, Secteur 12",
            line2: "Burkina Faso"
        },
        date: Date.now(),
        availabilitySlots: [
            {
                date: "2024-01-15",
                startTime: "10:00",
                endTime: "11:00",
                isBooked: false
            },
            {
                date: "2024-01-15",
                startTime: "16:00",
                endTime: "17:00",
                isBooked: false
            }
        ]
    },
    {
        name: "Dr. Davy Kaboré",
        email: "davy@fasolink.com",
        password: "password123",
        image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face",
        speciality: "Médecin Généraliste",
        degree: "MD - Médecine Générale",
        experience: "5 ans",
        about: "Dr. Davy Kaboré est un médecin généraliste passionné par les soins de qualité et l'accompagnement de ses patients.",
        available: true,
        fees: 5000,
        address: {
            line1: "Ouagadougou, Secteur 8",
            line2: "Burkina Faso"
        },
        date: Date.now(),
        availabilitySlots: [
            {
                date: "2024-01-15",
                startTime: "08:00",
                endTime: "09:00",
                isBooked: false
            },
            {
                date: "2024-01-15",
                startTime: "13:00",
                endTime: "14:00",
                isBooked: false
            }
        ]
    }
];

// Fonction pour créer les docteurs
const seedDoctors = async () => {
    try {
        await connectDB();
        
        console.log('\n🌱 Création des docteurs de test...\n');
        
        // Supprimer les docteurs existants
        await doctorModel.deleteMany({});
        console.log('🗑️ Anciens docteurs supprimés');
        
        // Créer les nouveaux docteurs
        for (const doctorData of sampleDoctors) {
            // Hasher le mot de passe
            const hashedPassword = await bcrypt.hash(doctorData.password, 10);
            
            const doctor = new doctorModel({
                ...doctorData,
                password: hashedPassword
            });
            
            await doctor.save();
            console.log(`✅ Docteur créé: ${doctor.name} (${doctor.speciality})`);
        }
        
        // Vérifier la création
        const totalDoctors = await doctorModel.countDocuments();
        console.log(`\n📊 Total de docteurs créés: ${totalDoctors}`);
        
        // Test de l'endpoint
        console.log('\n🌐 Test de l\'endpoint /api/doctor/list...');
        try {
            const response = await fetch('http://localhost:5000/api/doctor/list');
            const data = await response.json();
            
            if (data.success) {
                console.log(`✅ Endpoint fonctionne - ${data.doctors.length} docteurs retournés`);
                console.log('👨‍⚕️ Docteurs disponibles:');
                data.doctors.forEach((doctor, index) => {
                    console.log(`  ${index + 1}. ${doctor.name} - ${doctor.speciality}`);
                });
            } else {
                console.log('❌ Endpoint retourne une erreur:', data.message);
            }
        } catch (error) {
            console.log('❌ Erreur lors du test de l\'endpoint:', error.message);
            console.log('💡 Assurez-vous que le serveur backend est démarré sur le port 5000');
        }
        
        console.log('\n🎉 Script terminé avec succès !');
        console.log('\n📋 Prochaines étapes:');
        console.log('1. Vérifiez que le serveur backend fonctionne');
        console.log('2. Testez le frontend pour voir les docteurs');
        console.log('3. Connectez-vous avec un des docteurs créés');
        
    } catch (error) {
        console.error('❌ Erreur lors de la création des docteurs:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Déconnexion de MongoDB');
    }
};

// Exécuter le script
seedDoctors();
