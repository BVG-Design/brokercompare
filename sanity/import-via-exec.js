const fs = require('fs');
const path = require('path');

// This script expects to be run via `sanity exec import-via-exec.js --with-user-token`
// In sanity exec, we can use the environment to get a client.
// However, the easiest is to just use the global 'sanity' object if available or create a client from config.

const { createClient } = require('@sanity/client');

// We'll try to get the project info from the current directory's config
const projectId = 'vrf26tjl';
const dataset = 'production';

async function importBatch(client, filePath) {
    console.log(`Starting import of ${filePath}...`);
    const content = fs.readFileSync(filePath, 'utf8');
    const docs = content.split('\n').filter(Boolean).map(line => JSON.parse(line));

    // Use transaction for speed
    let transaction = client.transaction();
    let count = 0;

    for (const doc of docs) {
        transaction.createOrReplace(doc);
        count++;
        if (count % 20 === 0) {
            await transaction.commit();
            console.log(`Committed ${count} docs from ${filePath}...`);
            transaction = client.transaction();
        }
    }

    if (count % 20 !== 0) {
        await transaction.commit();
    }
    console.log(`Finished ${filePath}. Total: ${count}`);
}

async function run() {
    // We expect the token to be passed or available via sanity exec
    // If not, this might fail with "Insufficient permissions"
    console.log('Running import via sanity exec...');

    // We can try to use the client without a token if we are already authenticated in the CLI
    const client = createClient({
        projectId,
        dataset,
        apiVersion: '2025-10-01',
        useCdn: false,
        // The token should ideally be picked up from the environment or sanity exec
        token: process.env.SANITY_AUTH_TOKEN || process.env.SANITY_API_TOKEN
    });

    try {
        await importBatch(client, 'seed-service-areas.ndjson');
        await importBatch(client, 'migrate-pilot.ndjson');
        console.log('Done!');
    } catch (err) {
        console.error('Import failed:', err.message);
    }
}

run();
