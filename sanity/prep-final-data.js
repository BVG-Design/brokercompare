const fs = require('fs');
const path = require('path');

try {
    const s1 = fs.readFileSync('seed-service-areas.ndjson', 'utf8').split('\n').filter(Boolean);
    const s2 = fs.readFileSync('migrate-pilot.ndjson', 'utf8').split('\n').filter(Boolean);

    const combined = [...s1, ...s2].map(line => {
        const doc = JSON.parse(line);
        // Ensure all serviceArea groups are clean and emojis don't break import
        if (doc.group) {
            doc.group = doc.group.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2700}-\u{27BF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{26FF}]|[\u{1F1E0}-\u{1F1FF}]/gu, '').trim();
        }
        return JSON.stringify(doc);
    }).join('\n');

    fs.writeFileSync('final-combined.ndjson', combined);
    console.log('Successfully prepared final-combined.ndjson');
} catch (err) {
    console.error('Data preparation failed:', err.message);
    process.exit(1);
}
