import { fetchUnifiedSearchResults, fetchCategories } from '@/services/sanity';
import SearchPageClient from './SearchPageClient';

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SearchPage(props: PageProps) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const { slug } = params;
  const decodedTerm = decodeURIComponent(slug);

  const category = typeof searchParams.category === 'string' ? searchParams.category : 'all';
  const brokerType = typeof searchParams.brokerType === 'string' ? searchParams.brokerType : 'all';
  const type = typeof searchParams.type === 'string' ? searchParams.type : 'all';

  const [results, categories] = await Promise.all([
    fetchUnifiedSearchResults(
      [decodedTerm],
      ['blog', 'product', 'serviceProvider', 'directoryListing'],
      { category, brokerType, type }
    ),
    fetchCategories()
  ]);

  return (
    <SearchPageClient
      initialResults={results}
      categories={categories}
      initialSearchTerm={decodedTerm}
      initialFilters={{ category, brokerType, type }}
    />
  );
}