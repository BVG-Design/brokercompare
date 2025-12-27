import { fetchCategories, fetchUnifiedSearchResults } from '@/services/sanity';
import SearchResultsClient from './SearchResultsClient';

interface SearchPageProps {
  params: {
    slug: string;
  };
  searchParams?: {
    type?: string;
    category?: string;
  };
}

const CONTENT_TYPES = ['blog', 'product', 'serviceProvider', 'directoryListing'];

export default async function SearchPage({ params, searchParams }: SearchPageProps) {
  const rawTerm = decodeURIComponent(params.slug);
  const searchTerms = rawTerm.split(/[\s-]+/).filter(Boolean);
  const [results, categories] = await Promise.all([
    fetchUnifiedSearchResults(searchTerms, CONTENT_TYPES),
    fetchCategories()
  ]);
  const initialType = searchParams?.type || 'all';
  const initialCategory = searchParams?.category || 'all';

  return (
    <SearchResultsClient
      rawTerm={rawTerm}
      initialResults={results}
      initialType={initialType}
      initialCategory={initialCategory}
      availableCategories={categories.map((cat) => ({ label: cat.title, value: cat.value }))}
    />
  );
}
