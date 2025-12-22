import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { client } from '@/../sanity/lib/client';
import { searchResultsQuery } from '@/../sanity/lib/queries';
import { Card, CardContent } from '@/components/ui/card';

type SearchIntent = {
  _id: string;
  title: string;
  searchTerms?: string[];
};

type SearchResult = {
  _id: string;
  _type: string;
  title?: string;
  summary?: string;
  slug?: string;
  imageUrl?: string;
};

const searchIntentQuery = `*[_type == "searchIntent" && slug.current == $slug][0]{
  _id,
  title,
  searchTerms
}`;

const getResultHref = (result: SearchResult) => {
  if (!result.slug) return '#';
  if (result._type === 'blog') return `/blog/${result.slug}`;
  return `/directory/${result.slug}`;
};

const fetchIntent = async (slug: string) =>
  client.fetch<SearchIntent | null>(searchIntentQuery, { slug });

const fetchResultsForTerm = async (term: string) =>
  client.fetch<SearchResult[]>(searchResultsQuery, {
    term: `${term}*`,
  });

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const intent = await fetchIntent(params.slug);

  if (!intent) {
    return { title: 'Search' };
  }

  return {
    title: `Search: ${intent.title}`,
  };
}

export default async function SearchIntentPage({
  params,
}: {
  params: { slug: string };
}) {
  const intent = await fetchIntent(params.slug);

  if (!intent) {
    notFound();
  }

  const searchTerms = intent.searchTerms?.filter(Boolean) ?? [];
  const resultsByTerm = await Promise.all(
    searchTerms.map((term) => fetchResultsForTerm(term)),
  );
  const dedupedResults = new Map<string, SearchResult>();

  resultsByTerm.flat().forEach((result) => {
    if (!dedupedResults.has(result._id)) {
      dedupedResults.set(result._id, result);
    }
  });

  const results = Array.from(dedupedResults.values());

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase text-muted-foreground">
          Search Intent
        </p>
        <h1 className="text-3xl font-bold text-primary">{intent.title}</h1>
        {searchTerms.length > 0 && (
          <p className="mt-2 text-muted-foreground">
            Searching for: {searchTerms.join(', ')}
          </p>
        )}
      </div>

      {results.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No results found for this intent.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {results.map((result) => (
            <Card key={result._id}>
              <CardContent className="flex flex-col gap-2 p-6">
                <div className="text-xs font-semibold uppercase text-muted-foreground">
                  {result._type}
                </div>
                <h2 className="text-lg font-semibold text-primary">
                  {result.title ?? 'Untitled'}
                </h2>
                {result.summary && (
                  <p className="text-sm text-muted-foreground">
                    {result.summary}
                  </p>
                )}
                {result.slug && (
                  <Link
                    className="text-sm font-semibold text-primary hover:underline"
                    href={getResultHref(result)}
                  >
                    View details
                  </Link>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
