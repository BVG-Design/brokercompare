const fs = require('fs');
const { execSync } = require('child_process');

const filePath = 'seed-service-areas.ndjson';
const content = fs.readFileSync(filePath, 'utf8');
const docs = content.split('\n').filter(Boolean).map(line => JSON.parse(line));

console.log(`Starting batch import of ${docs.length} documents...`);

let success = 0;
let fail = 0;

docs.forEach((doc, i) => {
    try {
        const docJson = JSON.stringify(doc).replace(/"/g, '\\"');
        // Using --replace to overwrite existing docs
        execSync(`npx -y sanity documents create --replace --projectId vrf26tjl --dataset production "${docJson}"`, { stdio: 'pipe' });
        success++;
        if (success % 10 === 0) console.log(`Imported ${success} documents...`);
    } catch (err) {
        console.error(`Failed at doc ${i}: ${doc._id}`);
        fail++;
    }
});

console.log(`Import completed. Success: ${success}, Fail: ${fail}`);
