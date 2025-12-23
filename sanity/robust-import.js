const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function importBatch(filePath) {
    console.log(`Starting robust import of ${filePath}...`);
    const content = fs.readFileSync(filePath, 'utf8');
    const docs = content.split('\n').filter(Boolean).map(line => JSON.parse(line));

    let success = 0;
    let fail = 0;

    docs.forEach((doc, i) => {
        const tempFile = path.join(__dirname, `temp_${i}.json`);
        try {
            fs.writeFileSync(tempFile, JSON.stringify(doc));
            execSync(`npx -y sanity documents create --replace --projectId vrf26tjl --dataset production "${tempFile}"`, { stdio: 'pipe' });
            success++;
            if (success % 10 === 0) console.log(`Imported ${success}/${docs.length} from ${filePath}...`);
        } catch (err) {
            console.error(`Failed at doc ${i} (${doc._id}): ${err.message}`);
            fail++;
        } finally {
            if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
        }
    });

    console.log(`Completed ${filePath}. Success: ${success}, Fail: ${fail}`);
}

async function run() {
    try {
        await importBatch('seed-service-areas.ndjson');
        await importBatch('migrate-pilot.ndjson');
        console.log('All imports finished.');
    } catch (err) {
        console.error('Batch import crashed:', err.message);
    }
}

run();
