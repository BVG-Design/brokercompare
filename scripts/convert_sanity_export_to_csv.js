const fs = require('fs');
const path = require('path');
const readline = require('readline');

const inputFile = process.argv[2];
const outputDir = process.argv[3];

if (!inputFile || !outputDir) {
    console.error('Usage: node convert_sanity_export_to_csv.js <input_file> <output_dir>');
    process.exit(1);
}

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const documentsByType = {};
const keysByType = {};

const processLine = (line) => {
    if (!line.trim()) return;
    try {
        const doc = JSON.parse(line);
        const type = doc._type;

        if (!documentsByType[type]) {
            documentsByType[type] = [];
            keysByType[type] = new Set();
        }

        documentsByType[type].push(doc);
        Object.keys(doc).forEach(key => keysByType[type].add(key));
    } catch (e) {
        console.warn('Failed to parse line:', line, e);
    }
};

const escapeCsv = (val) => {
    if (val === null || val === undefined) return '';
    let stringVal;
    if (typeof val === 'object') {
        stringVal = JSON.stringify(val);
    } else {
        stringVal = String(val);
    }
    if (stringVal.includes(',') || stringVal.includes('"') || stringVal.includes('\n')) {
        return `"${stringVal.replace(/"/g, '""')}"`;
    }
    return stringVal;
};

const processFile = async () => {
    const fileStream = fs.createReadStream(inputFile);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    for await (const line of rl) {
        processLine(line);
    }

    for (const type of Object.keys(documentsByType)) {
        const keys = Array.from(keysByType[type]).sort();
        const headers = keys.join(',');
        const rows = documentsByType[type].map(doc => {
            return keys.map(key => escapeCsv(doc[key])).join(',');
        });

        const csvContent = [headers, ...rows].join('\n');
        const outputPath = path.join(outputDir, `${type}.csv`);
        fs.writeFileSync(outputPath, csvContent);
        console.log(`Created ${outputPath} with ${rows.length} rows`);
    }
};

processFile().catch(console.error);
