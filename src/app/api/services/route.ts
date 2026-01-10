import { NextResponse } from 'next/server';
import { client } from '@/../sanity/lib/client';

export async function GET() {
    try {
        const query = `*[_type == "serviceProvider"] {
      _id,
      "id": _id,
      "name": title,
      description,
      "logoUrl": logo.asset->url,
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
