import { fetchUnifiedSearchResults, fetchCategories, fetchRelatedArticles, fetchSearchIntentBySlug } from '@/services/sanity';
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

  // Try to find if this slug corresponds to a known search intent (e.g. "crm-document-collection")
  const intent = await fetchSearchIntentBySlug(decodedTerm);

  // If intent found, use its synonyms/queries. Otherwise use the raw term.
  const searchTerms = intent
    ? [...(intent.synonyms || []), ...(intent.exampleQueries || [])]
    : [decodedTerm];

  // If this is a defined search intent (from navbar), exclude blogs to focus on software/services
  const contentTypes = intent
    ? ['product', 'serviceProvider', 'directoryListing']
    : ['blog', 'product', 'serviceProvider', 'directoryListing'];

  const [results, categories, relatedArticles] = await Promise.all([
    fetchUnifiedSearchResults(
      searchTerms.length > 0 ? searchTerms : [decodedTerm],
      contentTypes,
      { category, brokerType, type }
    ),
    fetchCategories(),
    fetchRelatedArticles(3)
  ]);

  return (
    <SearchPageClient
      initialResults={results}
      categories={categories}
      initialSearchTerm={decodedTerm}
      initialFilters={{ category, brokerType, type }}
      relatedArticles={relatedArticles}
    />
  );
}