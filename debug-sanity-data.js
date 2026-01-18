
const { fetchUnifiedSearchResults } = require('./src/services/sanity');
const client = require('@/../sanity/lib/client').client; // Attempt to mock or require client if needed, but since we are running in node, we might need to handle imports differently.
// Actually, since the project is TS and uses aliases, running a standalone script might be hard without ts-node and path registration.
// Let's try to verify via a simple sanity query script instead, avoiding the complex project dependencies for now.

const { createClient } = require('@sanity/client');

const sanityClient = createClient({
    projectId: '2982829s', // I need to find the projectId from environment or config
    dataset: 'production',
    apiVersion: '2024-01-01',
    useCdn: false,
});

async function run() {
    console.log('Fetching broker-industry-tools...');
    const query = `*[_type == "directoryListing" && category->slug.current == "broker-industry-tools"]{
        title,
        brokerType,
        "category": category->slug.current
    }`;

    try {
        const results = await sanityClient.fetch(query);
        console.log('Found results:', results.length);
        console.log(JSON.stringify(results, null, 2));
    } catch (err) {
        console.error('Error:', err);
    }
}

run();
