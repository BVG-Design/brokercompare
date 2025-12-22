import { client } from '@/../sanity/lib/client';
import { UNIFIED_SEARCH_QUERY } from '@/sanity/lib/queries';
import { DirectoryListing, ResourcePost } from '@/types';

export const fetchResourcePosts = async (): Promise<ResourcePost[]> => {
  const query = `*[_type in ["blog", "product", "serviceProvider"] && isFeatured == true]{
    _id,
    _type,
    title,
    name,
    description,
    summary,
    featuredLabel,
    "slug": slug.current,
    "imageUrl": heroImage.asset->url, 
    "logoUrl": logo.asset->url
  }`;

  const results = await client.fetch(query);

  return results.map((item: any) => ({
    id: item._id,
    title: item.title || item.name,
    description: item.summary || item.description,
    category: item.featuredLabel || 'RESOURCE',
    ctaText: item._type === 'blog' ? 'Read' : 'Explore',
    imageUrl: item.imageUrl || item.logoUrl, // Fallback logic
    link: item._type === 'blog' ? `/blog/${item.slug}` : `/directory/${item.slug}`,
    featuredLabel: item.featuredLabel
  }));
};

export interface UnifiedSearchResult {
  _id: string;
  _type: string;
  title?: string;
  name?: string;
  description?: string;
  slug?: string;
  category?: string;
  logoUrl?: string;
  heroImageUrl?: string;
}

export const fetchUnifiedSearchResults = async (
  searchTerms: string[],
  contentTypes: string[]
): Promise<UnifiedSearchResult[]> => {
  const normalizedTerms = searchTerms.map((term) => term.trim()).filter(Boolean);
  if (normalizedTerms.length === 0 || contentTypes.length === 0) {
    return [];
  }

  const searchPatterns = normalizedTerms.map((term) => `${term}*`);
  const results = await client.fetch<UnifiedSearchResult[]>(UNIFIED_SEARCH_QUERY, {
    searchTerms: searchPatterns,
    contentTypes
  });

  const deduped = new Map<string, UnifiedSearchResult>();
  results.forEach((item) => {
    if (!deduped.has(item._id)) {
      deduped.set(item._id, item);
    }
  });

  return Array.from(deduped.values());
};

export const fetchDirectoryListings = async (filters: {
  category?: string;
  brokerType?: string;
  tier?: string;
  search?: string;
} = {}): Promise<DirectoryListing[]> => {
  const { category, brokerType, tier, search } = filters;

  // Query for both Products (Software) and ServiceProviders
  // We can join them in a single query or mapping
  const query = `*[(_type == "product" || _type == "software" || _type == "serviceProvider")
    ${category && category !== 'all' ? '&& ($category in categories[] || category == $category)' : ''}
    ${tier && tier !== 'all' ? `&& isFeatured == ${tier === 'featured'}` : ''}
    ${search ? '&& (name match $search + "*" || description match $search + "*")' : ''}
  ]{
    _id,
    _type,
    name,
    description,
    "logoUrl": select(
      _type == "product" => images[0].asset->url,
      _type == "serviceProvider" => logo.asset->url
      _type == "software" => images[0].asset->url
    ),
    "categories": select(
      defined(categories) => categories,
      defined(category) => [category]
    ),
    "brokerTypes": brokerTypes,
    "slug": slug.current,
    "rating": reviews[0].rating, // simplistic, maybe avg in query later
    websiteUrl, // Note: serviceProvider has 'website', create alias if needed or map below
    pricingModel
  }`;

  const params: Record<string, any> = {};
  if (category && category !== 'all') params.category = category;
  if (search) params.search = search;

  const results = await client.fetch(query, params);

  return results.map((item: any) => ({
    id: item._id,
    name: item.name,
    description: item.description,
    logoUrl: item.logoUrl,
    categories: Array.isArray(item.categories) ? item.categories : (item.categories ? [item.categories] : []),
    brokerTypes: item.brokerTypes || [],
    listingTier: item.isFeatured ? 'featured' : 'free', // Inference
    slug: item.slug,
    rating: item.rating,
    websiteUrl: item.websiteUrl || item.website, // map serviceProvider 'website' field if returned as such
    pricingModel: item.pricingModel,
    type: item._type === 'product' ? 'software' : 'service'
  }));
};

export const fetchCategories = async (): Promise<{ title: string, value: string }[]> => {
  // Fetch unique categories from both products and serviceProviders
  // serviceProvider has 'category' (string), product has 'categories' (array of strings)
  const query = `array::unique(*[_type == "product"].categories[] + *[_type == "serviceProvider"].category)`;
  const categories = await client.fetch<string[]>(query);
  return categories.map((c) => ({ title: c, value: c }));
};

export const fetchDirectoryListingBySlug = async (slug: string): Promise<DirectoryListing | null> => {
  const query = `*[(_type == "product" || _type == "serviceProvider") && slug.current == $slug][0]{
    _id,
    _type,
    name,
    description,
    "logoUrl": select(
      _type == "product" => images[0].asset->url,
      _type == "serviceProvider" => logo.asset->url
    ),
    "categories": select(
      defined(categories) => categories,
      defined(category) => [category]
    ),
    "brokerTypes": brokerTypes,
    "slug": slug.current,
    "rating": reviews[0].rating, 
    websiteUrl,
    pricingModel,
    tagline, // Add these to query/type as they are used in profile
    features,
    "integrations": badges // assuming using badges or similar for integrations, or add field
  }`;

  const result = await client.fetch(query, { slug });
  if (!result) return null;

  return {
    id: result._id,
    name: result.name,
    description: result.description,
    logoUrl: result.logoUrl,
    categories: Array.isArray(result.categories) ? result.categories : (result.categories ? [result.categories] : []),
    brokerTypes: result.brokerTypes || [],
    listingTier: result.isFeatured ? 'featured' : 'free',
    slug: result.slug,
    rating: result.rating,
    websiteUrl: result.websiteUrl || result.website,
    pricingModel: result.pricingModel,
    type: result._type === 'product' ? 'software' : 'service',
    tags: result.tagline ? [result.tagline] : [], // mapping tagline to tags or explicit tagline field
    // We might need to extend DirectoryListing type if we want to pass these explicitly
  } as DirectoryListing & { tagline?: string, features?: string[], integrations?: string[] };
};
