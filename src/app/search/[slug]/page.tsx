import { fetchUnifiedSearchResults } from '@/services/sanity';
import SearchResultsClient from './SearchResultsClient';

interface SearchPageProps {
  params: {
    slug: string;
  };
  searchParams?: Record<string, string | string[] | undefined>;
}

const CONTENT_TYPES = ['blog', 'product', 'serviceProvider', 'directoryListing'];

export default async function SearchPage({ params, searchParams }: SearchPageProps) {
  const rawTerm = decodeURIComponent(params.slug);
  const searchTerms = rawTerm.split(/[\s-]+/).filter(Boolean);
  const results = await fetchUnifiedSearchResults(searchTerms, CONTENT_TYPES);

  const initialType = typeof searchParams?.type === 'string' ? searchParams.type : 'all';
  const categoriesParam = typeof searchParams?.categories === 'string' ? searchParams.categories : '';
  const initialCategories = categoriesParam ? categoriesParam.split(',').filter(Boolean) : [];

  return (
    <SearchResultsClient
      rawTerm={rawTerm}
      initialResults={results}
      initialType={initialType}
      initialCategories={initialCategories}
    />
  );
}
