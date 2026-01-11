
import { client } from './sanity/lib/client';

async function debugListing() {
    const slug = 'bula-outsourcing';
    const query = `*[slug.current == $slug][0]{
    ...,
    "logoUrl": logo.asset->url,
    "orgLogo": organisation->logo.asset->url,
    "imgLogo": images[@.isLogo == true][0].asset->url,
    "firstImg": images[0].asset->url,
    "mainImg": mainImage.asset->url,
    "heroImg": heroImage.asset->url
  }`;

    const result = await client.fetch(query, { slug });
    console.log('DEBUG RESULT:', JSON.stringify(result, null, 2));
}

debugListing();
