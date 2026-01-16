
const { createClient } = require('next-sanity');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2024-01-01',
    useCdn: false,
});

async function checkCategories() {
    console.log('Fetching categories...');
    const query = `*[_type == "category"]{title, slug}`;
    const cats = await client.fetch(query);
    console.log('Categories found:', cats.length);
    if (cats.length > 0) {
        console.log('First 5:', cats.slice(0, 5));
    }
}

checkCategories();
