import { Suspense } from 'react';
import { fetchUnifiedSearchResults, fetchCategories, fetchSearchIntents } from '@/services/sanity';
import SearchPageClient from './SearchPageClient';

interface SearchPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const CONTENT_TYPES = ['product', 'serviceProvider', 'directoryListing'];

export default async function SearchPage({ params, searchParams }: SearchPageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const rawTerm = decodeURIComponent(slug);
  const searchTerms = rawTerm.split(/[\s-]+/).filter(Boolean);

  const category = filterValue(resolvedSearchParams.category);
  const brokerType = filterValue(resolvedSearchParams.brokerType);
  const type = filterValue(resolvedSearchParams.type);

  // Parallel fetch for results, categories, and search intents
  const [results, categories, searchIntents] = await Promise.all([
    fetchUnifiedSearchResults(searchTerms, CONTENT_TYPES, { category, brokerType, type }),
    fetchCategories(),
    fetchSearchIntents(),
  ]);

  const isSearchIntent = searchIntents.some(intent => intent.slug === slug);

  return (
    <Suspense fallback={<div className="container mx-auto p-12 text-center text-muted-foreground">Loading search results...</div>}>
      <SearchPageClient
        initialResults={results}
        categories={categories}
        initialSearchTerm={rawTerm}
        initialFilters={{ category, brokerType, type }}
        isSearchIntent={isSearchIntent}
      />
    </Suspense>
  );
}

function filterValue(val: string | string[] | undefined): string {
  if (Array.isArray(val)) return val[0];
  return val || 'all';
}