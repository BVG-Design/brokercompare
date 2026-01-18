const { createClient } = require('@sanity/client');

const client = createClient({
    projectId: 'vrf26tjl',
    dataset: 'production',
    apiVersion: '2023-10-01',
    useCdn: false,
    perspective: 'published',
});

const query = `{
    "podcast": *[_type == "blog" && blogType == "podcast"] | order(_createdAt desc)[0]{
      _id, _type, title, summary, "slug": slug.current, "imageUrl": heroImage.asset->url, blogType
    },
    "guide": *[_type == "blog" && blogType == "guide"] | order(_createdAt desc)[0]{
      _id, _type, title, summary, "slug": slug.current, "imageUrl": heroImage.asset->url, blogType
    },
    "faq": *[_type == "blog" && blogType == "faq"] | order(_createdAt desc)[0]{
      _id, _type, title, summary, "slug": slug.current, "imageUrl": heroImage.asset->url, blogType
    }
}`;

async function run() {
    console.log('Running query...');
    try {
        const result = await client.fetch(query);
        console.log('Success:', JSON.stringify(result, null, 2));
    } catch (err) {
        console.error('Error:', err.message);
        if (err.response) {
            console.error('Response body:', err.response.body);
        }
    }
}

run();
