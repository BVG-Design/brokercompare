import { NextResponse } from 'next/server';
import { client, sanityConfigured } from '@/sanity/lib/client';

type SearchIntent = {
  title: string;
  slug: string;
};

export async function GET(request: Request) {
  if (!sanityConfigured) {
    return NextResponse.json({ items: [] });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query')?.trim() ?? '';

  if (!query) {
    return NextResponse.json({ items: [] });
  }

  const searchPattern = `${query}*`;
  const data = await client.fetch<SearchIntent[]>(
    `
      *[_type == "searchIntent" && title match $search]
      | order(title asc)[0...6] {
        title,
        "slug": slug.current
      }
    `,
    { search: searchPattern }
  );

  const items = Array.isArray(data)
    ? data.filter((item) => item.title && item.slug)
    : [];

  return NextResponse.json({ items });
}
