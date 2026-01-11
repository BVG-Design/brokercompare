import { NextResponse } from 'next/server';
import { client } from '@/../sanity/lib/client';

export async function GET() {
  try {
    const query = `*[_type == "serviceProvider"] {
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
      "listingType": coalesce(listingType->value, listingType->title, listingType, "service"),
      "tagline": tagline
    }`;
    const services = await client.fetch(query);
    return NextResponse.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}
