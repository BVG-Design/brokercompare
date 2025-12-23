const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

async function importFile(filePath) {
    console.log(`Starting final import of ${filePath}...`);
    const content = fs.readFileSync(filePath, 'utf8');
    const docs = content.split('\n').filter(Boolean).map(line => JSON.parse(line));

    let success = 0;
    let fail = 0;

    for (let i = 0; i < docs.length; i++) {
        const doc = docs[i];
        const tempFile = path.join(__dirname, `temp_final_${i}.json`);
        fs.writeFileSync(tempFile, JSON.stringify(doc));

        // Use spawnSync to avoid shell escaping issues
        const result = spawnSync('npx.cmd', [
            'sanity', 'documents', 'create', '--replace',
            '--projectId', 'vrf26tjl',
            '--dataset', 'production',
            tempFile
        ], { encoding: 'utf8' });

        if (result.status === 0) {
            success++;
            if (success % 10 === 0) console.log(`Imported ${success}/${docs.length} from ${filePath}...`);
        } else {
            console.error(`Failed at doc ${i} (${doc._id}): ${result.stderr}`);
            fail++;
        }

        if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
    }

    console.log(`Completed ${filePath}. Success: ${success}, Fail: ${fail}`);
}

async function run() {
    try {
        await importFile('seed-service-areas.ndjson');
        await importFile('migrate-pilot.ndjson');
        console.log('Final Import Loop Completed.');
    } catch (err) {
        console.error('Import crashed:', err.message);
    }
}

run();
