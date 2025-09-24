// Script de test pour vérifier la mise à jour du profil docteur
import axios from 'axios';

const testProfileUpdate = async () => {
    try {
        console.log('🧪 Test de mise à jour du profil docteur...\n');

        // 1. Connexion du docteur
        console.log('1. Connexion du docteur...');
        const loginResponse = await axios.post('http://localhost:5000/api/doctor/login', {
            email: 'davy@fasolink.com',
            password: 'password123'
        });

        if (!loginResponse.data.success) {
            console.error('❌ Échec de la connexion:', loginResponse.data.message);
            return;
        }

        const token = loginResponse.data.token;
        console.log('✅ Connexion réussie');

        // 2. Récupération du profil actuel
        console.log('\n2. Récupération du profil actuel...');
        const profileResponse = await axios.get('http://localhost:5000/api/doctor/profile', {
            headers: { dToken: token }
        });

        if (!profileResponse.data.success) {
            console.error('❌ Échec de la récupération du profil:', profileResponse.data.message);
            return;
        }

        console.log('✅ Profil récupéré:', profileResponse.data.profileData);

        // 3. Mise à jour du profil
        console.log('\n3. Mise à jour du profil...');
        const updateData = {
            name: 'Dr. Davy Modifié',
            phone: '+226 70 12 34 56',
            speciality: 'Médecin Généraliste Modifié',
            experience: '6 ans',
            degree: 'Doctorat en médecine modifié',
            about: 'Dr. Davy est un médecin très expérimenté avec une passion pour les soins de qualité.',
            education: 'Université de Ouagadougou - Faculté de médecine (modifié)',
            certifications: 'Certification en médecine générale, Formation continue en cardiologie (modifié)',
            languages: 'Français, Anglais, Mooré, Dioula'
        };

        const updateResponse = await axios.post('http://localhost:5000/api/doctor/update-profile', updateData, {
            headers: { dToken: token }
        });

        if (!updateResponse.data.success) {
            console.error('❌ Échec de la mise à jour:', updateResponse.data.message);
            return;
        }

        console.log('✅ Profil mis à jour:', updateResponse.data.message);

        // 4. Vérification de la mise à jour
        console.log('\n4. Vérification de la mise à jour...');
        const verifyResponse = await axios.get('http://localhost:5000/api/doctor/profile', {
            headers: { dToken: token }
        });

        if (!verifyResponse.data.success) {
            console.error('❌ Échec de la vérification:', verifyResponse.data.message);
            return;
        }

        console.log('✅ Profil vérifié après mise à jour:');
        console.log('   - Nom:', verifyResponse.data.profileData.name);
        console.log('   - Téléphone:', verifyResponse.data.profileData.phone);
        console.log('   - Spécialité:', verifyResponse.data.profileData.speciality);
        console.log('   - Expérience:', verifyResponse.data.profileData.experience);
        console.log('   - Diplôme:', verifyResponse.data.profileData.degree);
        console.log('   - À propos:', verifyResponse.data.profileData.about);
        console.log('   - Formation:', verifyResponse.data.profileData.education);
        console.log('   - Certifications:', verifyResponse.data.profileData.certifications);
        console.log('   - Langues:', verifyResponse.data.profileData.languages);

        console.log('\n🎉 Test de mise à jour du profil réussi !');

    } catch (error) {
        console.error('❌ Erreur lors du test:', error.response?.data || error.message);
    }
};

testProfileUpdate();
