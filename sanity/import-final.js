const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function importFile(filePath) {
    console.log(`Starting final import of ${filePath}...`);
    const content = fs.readFileSync(path.join(__dirname, filePath), 'utf8');
    const docs = content.split('\n').filter(Boolean).map(line => JSON.parse(line));

    let success = 0;
    let fail = 0;

    for (let i = 0; i < docs.length; i++) {
        const doc = docs[i];
        const tempFile = path.join(__dirname, `temp_import_${i}.json`);
        try {
            fs.writeFileSync(tempFile, JSON.stringify(doc));
            // Use --replace to overwrite existing docs with the new object structure
            execSync(`npx -y sanity documents create --replace --projectId vrf26tjl --dataset production "${tempFile}"`, { stdio: 'pipe' });
            success++;
            if (success % 10 === 0) console.log(`Imported ${success}/${docs.length} from ${filePath}...`);
        } catch (err) {
            console.error(`Failed at doc ${i} (${doc._id}):`, err.message);
            fail++;
        } finally {
            if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
        }
    }

    console.log(`Completed ${filePath}. Success: ${success}, Fail: ${fail}`);
}

async function run() {
    try {
        // 1. Seed all service areas first so listings can reference them
        await importFile('seed-service-areas.ndjson');
        // 2. Import the actual listing data
        await importFile('migrate-pilot.ndjson');
        console.log('All Sanity Data Fixed!');
    } catch (err) {
        console.error('Final import crashed:', err.message);
    }
}

run();
