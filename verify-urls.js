// Script pour vérifier que toutes les URLs utilisent le bon port
import fs from 'fs';
import path from 'path';

const searchDirectory = (dir, results = []) => {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory() && !file.includes('node_modules') && !file.includes('.git')) {
            searchDirectory(filePath, results);
        } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
            const content = fs.readFileSync(filePath, 'utf8');
            if (content.includes('localhost:4000')) {
                results.push({
                    file: filePath,
                    lines: content.split('\n').map((line, index) => ({
                        lineNumber: index + 1,
                        content: line
                    })).filter(line => line.content.includes('localhost:4000'))
                });
            }
        }
    }
    
    return results;
};

console.log('🔍 Vérification des URLs dans le projet...\n');

const results = searchDirectory('FasoLink');

if (results.length === 0) {
    console.log('✅ Toutes les URLs utilisent le port 5000 !');
} else {
    console.log('❌ Fichiers contenant encore localhost:4000 :\n');
    
    results.forEach(result => {
        console.log(`📁 ${result.file}:`);
        result.lines.forEach(line => {
            console.log(`   Ligne ${line.lineNumber}: ${line.content.trim()}`);
        });
        console.log('');
    });
}

console.log('\n🎯 Résumé:');
console.log(`- Fichiers avec URLs incorrectes: ${results.length}`);
console.log('- Tous les fichiers devraient utiliser localhost:5000');
