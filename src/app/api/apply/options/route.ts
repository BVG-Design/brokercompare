import { NextResponse } from 'next/server';
import { client, sanityConfigured } from '@/sanity/lib/client';

type ApplyOption = {
  label: string;
  value: string;
};

const FEATURE_OPTIONS_QUERY = `
  *[_type == "feature" && defined(slug.current)]
  | order(title asc) {
    "label": title,
    "value": slug.current
  }
`;

const DIRECTORY_OPTIONS_QUERY = `
  *[_type == "directoryListing" && defined(slug.current)]
  | order(title asc) {
    "label": title,
    "value": slug.current
  }
`;

export async function GET() {
  if (!sanityConfigured) {
    return NextResponse.json({ features: [], directoryListings: [] });
  }

  try {
    const [features, directoryListings] = await Promise.all([
      client.fetch<ApplyOption[]>(FEATURE_OPTIONS_QUERY),
      client.fetch<ApplyOption[]>(DIRECTORY_OPTIONS_QUERY),
    ]);

    const sanitize = (items: ApplyOption[]) =>
      Array.isArray(items) ? items.filter((item) => item?.label && item?.value) : [];

    return NextResponse.json({
      features: sanitize(features),
      directoryListings: sanitize(directoryListings),
    });
  } catch (error) {
    console.error('Failed to load apply form options', error);
    return NextResponse.json({ features: [], directoryListings: [] }, { status: 500 });
  }
}
