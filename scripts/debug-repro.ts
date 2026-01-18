
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';
import { UNIFIED_SEARCH_QUERY } from '../sanity/lib/queries/search';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// Verify env vars
if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID');
    process.exit(1);
}

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    token: process.env.SANITY_API_TOKEN, // Optional for public datasets but good to have
    apiVersion: '2023-10-01',
    useCdn: false,
});

async function runTest() {
    console.log('Testing UNIFIED_SEARCH_QUERY...');

    // Mimic the params from route.ts
    const searchTerms = ['test'];
    const contentTypes = ['directoryListing'];
    const params = {
        searchTerms,
        contentTypes,
        category: null,
        brokerType: null,
        listingType: null,
        author: null
    };

    console.log('Params:', JSON.stringify(params, null, 2));

    try {
        const results = await client.fetch(UNIFIED_SEARCH_QUERY, params);
        console.log('Success! Results count:', results.length);
    } catch (error: any) {
        console.error('Query Failed:', error.message);
        console.error('Error Details:', JSON.stringify(error, null, 2));
    }
}

runTest();
