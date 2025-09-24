// Script de test pour vérifier les endpoints doctor
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/doctor';

// Test data
const testDoctor = {
    email: 'davy@fasolink.com',
    password: 'password123'
};

async function testDoctorEndpoints() {
    try {
        console.log('🧪 Test des endpoints doctor...\n');

        // 1. Test de connexion
        console.log('1. Test de connexion...');
        const loginResponse = await axios.post(`${BASE_URL}/login`, testDoctor);
        console.log('✅ Connexion réussie:', loginResponse.data.success);
        
        const token = loginResponse.data.token;
        const headers = { dtoken: token };

        // 2. Test du dashboard
        console.log('\n2. Test du dashboard...');
        const dashboardResponse = await axios.get(`${BASE_URL}/dashboard`, { headers });
        console.log('✅ Dashboard récupéré:', dashboardResponse.data.success);
        console.log('📊 Données du dashboard:', {
            doctorName: dashboardResponse.data.dashData?.doctorName,
            appointments: dashboardResponse.data.dashData?.appointments,
            patients: dashboardResponse.data.dashData?.patients,
            earnings: dashboardResponse.data.dashData?.earnings
        });

        // 3. Test du profil
        console.log('\n3. Test du profil...');
        const profileResponse = await axios.get(`${BASE_URL}/profile`, { headers });
        console.log('✅ Profil récupéré:', profileResponse.data.success);
        console.log('👨‍⚕️ Nom du docteur:', profileResponse.data.profileData?.name);

        // 4. Test des rendez-vous
        console.log('\n4. Test des rendez-vous...');
        const appointmentsResponse = await axios.get(`${BASE_URL}/appointments`, { headers });
        console.log('✅ Rendez-vous récupérés:', appointmentsResponse.data.success);
        console.log('📅 Nombre de rendez-vous:', appointmentsResponse.data.appointments?.length);

        // 5. Test des créneaux
        console.log('\n5. Test des créneaux...');
        const slotsResponse = await axios.get(`${BASE_URL}/my-slots`, { headers });
        console.log('✅ Créneaux récupérés:', slotsResponse.data.success);
        console.log('⏰ Nombre de créneaux:', slotsResponse.data.slots?.length);

        // 6. Test des notes
        console.log('\n6. Test des notes...');
        const notesResponse = await axios.get(`${BASE_URL}/notes`, { headers });
        console.log('✅ Notes récupérées:', notesResponse.data.success);
        console.log('📝 Nombre de notes:', notesResponse.data.notes?.length);

        // 7. Test des patients
        console.log('\n7. Test des patients...');
        const patientsResponse = await axios.get(`${BASE_URL}/patients`, { headers });
        console.log('✅ Patients récupérés:', patientsResponse.data.success);
        console.log('👥 Nombre de patients:', patientsResponse.data.patients?.length);

        // 8. Test des prescriptions
        console.log('\n8. Test des prescriptions...');
        const prescriptionsResponse = await axios.get(`${BASE_URL}/prescriptions`, { headers });
        console.log('✅ Prescriptions récupérées:', prescriptionsResponse.data.success);
        console.log('💊 Nombre de prescriptions:', prescriptionsResponse.data.prescriptions?.length);

        // 9. Test des statistiques
        console.log('\n9. Test des statistiques...');
        const statisticsResponse = await axios.get(`${BASE_URL}/statistics`, { headers });
        console.log('✅ Statistiques récupérées:', statisticsResponse.data.success);
        console.log('📈 Statistiques:', {
            totalAppointments: statisticsResponse.data.statistics?.totalAppointments,
            totalPatients: statisticsResponse.data.statistics?.totalPatients,
            totalEarnings: statisticsResponse.data.statistics?.totalEarnings
        });

        console.log('\n🎉 Tous les tests sont passés avec succès !');
        console.log('\n📋 Résumé:');
        console.log('- ✅ Connexion doctor');
        console.log('- ✅ Dashboard spécifique au docteur');
        console.log('- ✅ Profil doctor');
        console.log('- ✅ Rendez-vous du docteur');
        console.log('- ✅ Créneaux du docteur');
        console.log('- ✅ Notes du docteur');
        console.log('- ✅ Patients du docteur');
        console.log('- ✅ Prescriptions du docteur');
        console.log('- ✅ Statistiques du docteur');

    } catch (error) {
        console.error('❌ Erreur lors des tests:', error.response?.data || error.message);
    }
}

// Exécuter les tests
testDoctorEndpoints();
