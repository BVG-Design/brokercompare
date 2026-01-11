import { NextResponse } from 'next/server';
import { client } from '@/../sanity/lib/client';

export async function GET() {
  try {
    const query = `*[_type == "product"] {
      _id,
      "id": _id,
      "name": title,
      description,
      "logoUrl": select(
        defined(logo.asset->url) => logo.asset->url,
        defined(organisation->logo.asset->url) => organisation->logo.asset->url,
        defined(images[@.isLogo == true][0].asset->url) => images[@.isLogo == true][0].asset->url,
        defined(images[0].asset->url) => images[0].asset->url,
        defined(mainImage.asset->url) => mainImage.asset->url,
        defined(heroImage.asset->url) => heroImage.asset->url
      ),
      "category": category->title,
      "listingType": coalesce(listingType->value, listingType->title, listingType, "software"),
      "tagline": tagline
    }`;
    const software = await client.fetch(query);
    return NextResponse.json(software);
  } catch (error) {
    console.error('Error fetching software:', error);
    return NextResponse.json({ error: 'Failed to fetch software' }, { status: 500 });
  }
}
