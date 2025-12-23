const fs = require('fs');
const path = require('path');
const { createClient } = require('@sanity/client');

// NOTE: You need to set SANITY_AUTH_TOKEN in your environment for this to work
const client = createClient({
    projectId: 'vrf26tjl',
    dataset: 'production',
    apiVersion: '2025-10-01',
    token: process.env.SANITY_AUTH_TOKEN,
    useCdn: false,
});

async function importNdjson(filePath) {
    console.log(`Importing ${filePath}...`);
    const content = fs.readFileSync(filePath, 'utf8');
    const docs = content.split('\n').filter(Boolean).map(line => JSON.parse(line));

    let count = 0;
    for (const doc of docs) {
        try {
            await client.createOrReplace(doc);
            count++;
            if (count % 10 === 0) console.log(`Imported ${count} documents...`);
        } catch (err) {
            console.error(`Failed to import document ${doc._id}:`, err.message);
        }
    }
    console.log(`Successfully imported ${count} documents from ${filePath}.`);
}

async function run() {
    try {
        // 1. Import Service Areas first so references can be strengthened
        await importNdjson(path.join(__dirname, 'seed-service-areas.ndjson'));
        // 2. Import Directory Listings
        await importNdjson(path.join(__dirname, 'migrate-pilot.ndjson'));
        console.log('All imports completed.');
    } catch (err) {
        console.error('Import failed:', err.message);
    }
}

run();
