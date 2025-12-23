const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function importInChunks(filePath, chunkSize = 20) {
    console.log(`Starting chunked import of ${filePath}...`);
    const content = fs.readFileSync(path.join(__dirname, filePath), 'utf8');
    const docs = content.split('\n').filter(Boolean);

    for (let i = 0; i < docs.length; i += chunkSize) {
        const chunk = docs.slice(i, i + chunkSize);
        const chunkFile = path.join(__dirname, `chunk_${Math.floor(i / chunkSize)}.ndjson`);
        fs.writeFileSync(chunkFile, chunk.join('\n'));

        try {
            console.log(`Importing chunk ${Math.floor(i / chunkSize) + 1} (${chunk.length} docs)...`);
            execSync(`npx -y sanity dataset import "${chunkFile}" production --replace --projectId vrf26tjl --dataset production --allow-assets-error`, { stdio: 'pipe' });
        } catch (err) {
            console.error(`Failed at chunk starting at index ${i}:`, err.message);
        } finally {
            if (fs.existsSync(chunkFile)) fs.unlinkSync(chunkFile);
        }
    }
    console.log(`Completed ${filePath}.`);
}

async function run() {
    try {
        await importInChunks('seed-service-areas.ndjson');
        await importInChunks('migrate-pilot.ndjson');
        console.log('Chunked Import Finished!');
    } catch (err) {
        console.error('Import process failed:', err.message);
    }
}

run();
