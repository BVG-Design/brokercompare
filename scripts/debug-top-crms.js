const { createClient } = require('@sanity/client');

const client = createClient({
    projectId: 'vrf26tjl',
    dataset: 'production',
    apiVersion: '2023-10-01',
    useCdn: false,
    perspective: 'published',
});

// The query from src/sanity/lib/queries/listings.ts
const query = `
  *[_type == "directoryListing" && count((subCategory[]->title)[@ in ["Broker CRM", "CRM & pipeline", "Fact Find & document collection"]]) > 0] | order(manualRank asc) [0...49] {
    _id,
    title,
    "slug": slug.current,
    "subCategoryTitles": subCategory[]->title,
    manualRank
  }
`;

async function run() {
    console.log('Running TOP_CRMS_QUERY...');
    try {
        const result = await client.fetch(query);
        console.log('Count:', result.length);
        console.log('Results:', JSON.stringify(result, null, 2));
    } catch (err) {
        console.error('Error:', err.message);
    }
}

run();
