
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    token: process.env.SANITY_API_TOKEN,
    apiVersion: '2025-10-01',
    useCdn: false,
});

async function check() {
    console.log('Checking for "Sherlok" in directoryListing...');
    console.log('Using Project ID:', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);

    // 1. Simple Match Result (Control)
    try {
        const t1 = await client.fetch(`*[_type == "directoryListing" && title match "Sherlok*"]{_id, title}`);
        console.log('1. Control Result:', t1.length);
    } catch (e) { console.log('1. Failed', e.message); }

    // 2. Count Logic test (WITH FIX: ^.title)
    try {
        const q = `*[_type == "directoryListing" && count(["Sherlok*"][^.title match @]) > 0]{_id}`;
        const t2 = await client.fetch(q);
        console.log('2. Count Logic Result (Fixed):', t2.length);
    } catch (e) { console.log('2. Failed', e.message); }

    // 3. Full Query with FIX
    try {
        const searchTerms = ["Sherlok*"];
        const contentTypes = ["directoryListing"];
        const query = `*[_type in $contentTypes && (
        count($searchTerms[
            ^.title match @ ||
            ^.name match @ ||
            ^.description match @ ||
            ^.tagline match @ ||
            ^.slug.current match @ ||
            ^.category->title match @ ||
            ^.categories[]->title match @
        ]) > 0
        )]{ _id, title }`;

        const t5 = await client.fetch(query, { searchTerms, contentTypes });
        console.log('3. Full Unified Result (Fixed):', t5.length);
    } catch (e) { console.log('3. Failed', e.message); }
}

check().catch(console.error);
