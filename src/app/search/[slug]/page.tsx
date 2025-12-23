import Link from 'next/link';

import { fetchUnifiedSearchResults } from '@/services/sanity';

interface SearchPageProps {
  params: {
    slug: string;
  };
}

const CONTENT_TYPES = ['blog', 'product', 'serviceProvider', 'directoryListing'];

export default async function SearchPage({ params }: SearchPageProps) {
  const rawTerm = decodeURIComponent(params.slug);
  const searchTerms = rawTerm.split(/[\s-]+/).filter(Boolean);
  const results = await fetchUnifiedSearchResults(searchTerms, CONTENT_TYPES);

  return (
    <main className="container mx-auto px-4 md:px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">Search results</h1>
        <p className="text-muted-foreground mt-2">
          {results.length} {results.length === 1 ? 'result' : 'results'} for "{rawTerm}"
        </p>
      </div>

      {results.length === 0 ? (
        <div className="rounded-lg border border-dashed border-muted-foreground/40 p-8 text-center">
          <p className="text-lg font-medium">No results found.</p>
          <p className="text-muted-foreground mt-2">Try another search term.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {results.map((item) => {
            const title = item.title || item.name || 'Untitled';
            const imageUrl = item.logoUrl || item.heroImageUrl;
            const href = item._type === 'blog' ? `/blog/${item.slug}` : `/directory/${item.slug}`;

            return (
              <Link
                key={item._id}
                href={href}
                className="group rounded-xl border border-border bg-card p-5 transition hover:shadow-md"
              >
                <div className="flex gap-4">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={title}
                      className="h-16 w-16 shrink-0 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="h-16 w-16 shrink-0 rounded-lg bg-muted" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-primary">{item.category}</p>
                    <h2 className="text-xl font-semibold text-foreground group-hover:text-primary">
                      {title}
                    </h2>
                    {item.description ? (
                      <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    ) : null}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
