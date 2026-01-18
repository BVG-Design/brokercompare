
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01';
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !dataset) {
    console.error('Missing Sanity configuration. Please check your .env.local file.');
    process.exit(1);
}

const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token,
});

import { UNIFIED_SEARCH_QUERY } from '../sanity/lib/queries/search';

async function runTest() {
    console.log('--- Testing Subcategory Search ---');

    // Fetch a valid subcategory first
    const validSubResult = await client.fetch('*[_type == "subCategory"][0]{"slug": slug.current, title}');
    if (!validSubResult) {
        console.log("No subcategories found in dataset.");
        return;
    }
    const subCategorySlug = validSubResult.slug;
    const subCategoryTitle = validSubResult.title;
    console.log(`Found subcategory: ${subCategoryTitle} (${subCategorySlug})`);

    // Test 1: Search by text matching a subcategory title
    const searchTerm = subCategoryTitle;
    console.log(`\nTest 1: Search by text "${searchTerm}"`);
    try {
        const params = {
            searchTerms: [searchTerm],
            contentTypes: ["directoryListing"],
            category: null,
            brokerType: null,
            listingType: null,
            author: null,
            subCategory: null
        };
        const results = await client.fetch(UNIFIED_SEARCH_QUERY, params);
        console.log(`Found ${results.length} results.`);
        if (results.length > 0) {
            console.log('Sample result:', results[0].title);
        }
    } catch (error: any) {
        console.error('Test 1 failed:', error.message);
    }

    // Test 2: Filter by subcategory slug
    console.log(`\nTest 2: Filter by subcategory slug "${subCategorySlug}"`);
    try {
        const params = {
            searchTerms: [],
            contentTypes: ["directoryListing"],
            category: null,
            brokerType: null,
            listingType: null,
            author: null,
            subCategory: subCategorySlug
        };
        // This might fail before we update the query because $subCategory is not defined in the query yet
        // So we expect this to potentially error or just ignore the param.
        const results = await client.fetch(UNIFIED_SEARCH_QUERY, params);
        console.log(`Found ${results.length} results.`);
        if (results.length > 0) {
            console.log('Sample result:', results[0].title);
        }
    } catch (error: any) {
        console.log('Test 2 failed (expected if query not updated):', error.message);
    }
}

runTest();
