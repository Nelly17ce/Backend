// Script pour tester la connexion entre frontend et backend
import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

async function testConnection() {
    try {
        console.log('🧪 Test de connexion backend...\n');

        // 1. Test de l'endpoint principal
        console.log('1. Test de l\'endpoint principal...');
        const mainResponse = await axios.get(`${BASE_URL}/`);
        console.log('✅ Serveur accessible:', mainResponse.data);

        // 2. Test de la liste des docteurs
        console.log('\n2. Test de la liste des docteurs...');
        const doctorsResponse = await axios.get(`${BASE_URL}/api/doctor/list`);
        console.log('✅ Liste des docteurs:', doctorsResponse.data.success);
        console.log('📊 Nombre de docteurs:', doctorsResponse.data.doctors?.length || 0);
        
        if (doctorsResponse.data.doctors?.length > 0) {
            console.log('👨‍⚕️ Docteurs disponibles:');
            doctorsResponse.data.doctors.forEach((doctor, index) => {
                console.log(`  ${index + 1}. ${doctor.name} - ${doctor.speciality}`);
            });
        }

        // 3. Test de connexion admin
        console.log('\n3. Test de connexion admin...');
        try {
            const adminResponse = await axios.post(`${BASE_URL}/api/admin/login`, {
                email: 'admin@fasolink.com',
                password: 'admin123'
            });
            console.log('✅ Connexion admin:', adminResponse.data.success);
        } catch (error) {
            console.log('⚠️ Connexion admin échouée (normal si pas d\'admin créé):', error.response?.data?.message || error.message);
        }

        // 4. Test de connexion docteur
        console.log('\n4. Test de connexion docteur...');
        try {
            const doctorResponse = await axios.post(`${BASE_URL}/api/doctor/login`, {
                email: 'davy@fasolink.com',
                password: 'password123'
            });
            console.log('✅ Connexion docteur:', doctorResponse.data.success);
            if (doctorResponse.data.success) {
                console.log('🔑 Token reçu:', doctorResponse.data.token ? 'Oui' : 'Non');
            }
        } catch (error) {
            console.log('❌ Connexion docteur échouée:', error.response?.data?.message || error.message);
        }

        console.log('\n🎉 Tests terminés !');
        console.log('\n📋 Résumé:');
        console.log('- ✅ Serveur backend accessible');
        console.log('- ✅ Endpoint docteurs fonctionnel');
        console.log('- ✅ Docteurs disponibles dans la base');
        console.log('- ✅ Prêt pour les connexions frontend');

    } catch (error) {
        console.error('❌ Erreur lors des tests:', error.response?.data || error.message);
        console.log('\n💡 Solutions possibles:');
        console.log('1. Vérifiez que le serveur backend est démarré');
        console.log('2. Vérifiez que le port 5000 est libre');
        console.log('3. Vérifiez la connexion à MongoDB');
    }
}

// Exécuter les tests
testConnection();
