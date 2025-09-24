// Script pour vérifier les docteurs dans la base de données
import mongoose from 'mongoose';
import doctorModel from './models/doctorModel.js';

// Connexion à MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fasolink');
        console.log('✅ Connexion à MongoDB réussie');
    } catch (error) {
        console.error('❌ Erreur de connexion à MongoDB:', error);
        process.exit(1);
    }
};

// Vérifier les docteurs
const checkDoctors = async () => {
    try {
        await connectDB();
        
        console.log('\n🔍 Vérification des docteurs dans la base de données...\n');
        
        const doctors = await doctorModel.find({});
        console.log(`📊 Nombre total de docteurs: ${doctors.length}`);
        
        if (doctors.length === 0) {
            console.log('❌ Aucun docteur trouvé dans la base de données !');
            console.log('\n💡 Solutions possibles:');
            console.log('1. Créer des docteurs via l\'interface admin');
            console.log('2. Ajouter des docteurs directement en base');
            console.log('3. Vérifier la connexion à la base de données');
        } else {
            console.log('\n👨‍⚕️ Liste des docteurs:');
            doctors.forEach((doctor, index) => {
                console.log(`${index + 1}. ${doctor.name} - ${doctor.speciality} - ${doctor.email}`);
            });
        }
        
        // Test de l'endpoint
        console.log('\n🌐 Test de l\'endpoint /api/doctor/list...');
        try {
            const response = await fetch('http://localhost:5000/api/doctor/list');
            const data = await response.json();
            
            if (data.success) {
                console.log(`✅ Endpoint fonctionne - ${data.doctors.length} docteurs retournés`);
            } else {
                console.log('❌ Endpoint retourne une erreur:', data.message);
            }
        } catch (error) {
            console.log('❌ Erreur lors du test de l\'endpoint:', error.message);
        }
        
    } catch (error) {
        console.error('❌ Erreur:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Déconnexion de MongoDB');
    }
};

checkDoctors();
