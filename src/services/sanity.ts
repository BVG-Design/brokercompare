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
  }, { useCdn: false });

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
  type?: string;
} = {}): Promise<DirectoryListing[]> => {
  const { category, brokerType, tier, search, type } = filters;

  const query = `*[_type == "directoryListing"
    ${category && category !== 'all' ? '&& category->slug.current == $category' : ''}
    ${type && type !== 'all' ? '&& listingType == $type' : ''}
    ${tier && tier !== 'all' ? `&& isFeatured == ${tier === 'featured'}` : ''}
    ${search ? '&& (title match $search + "*" || description match $search + "*" || serviceArea[] match $search + "*" || features[] match $search + "*")' : ''}
  ]{
    _id,
    _type,
    "name": title,
    description,
    "logoUrl": logo.asset->url,
    "categories": [category->title],
    brokerType,
    "slug": slug.current,
    "rating": 5,
    websiteURL,
    pricing,
    listingType,
    isFeatured,
    serviceArea,
    features
  }`;

  const params: Record<string, any> = {};
  if (category && category !== 'all') params.category = category;
  if (type && type !== 'all') params.type = type;
  if (search) params.search = search;

  const results = await client.fetch(query, params);

  return results.map((item: any) => ({
    id: item._id,
    name: item.name,
    description: item.description,
    logoUrl: item.logoUrl,
    categories: item.categories || [],
    brokerTypes: item.brokerType || [],
    listingTier: item.isFeatured ? 'featured' : 'free',
    slug: item.slug,
    rating: item.rating,
    websiteUrl: item.websiteURL,
    pricingModel: item.pricing?.type,
    type: item.listingType,
    serviceAreas: item.serviceArea || [],
    features: item.features || []
  }));
};



import { DirectoryProxy } from '@/sanity/lib/proxy';

export const fetchCategories = async (): Promise<{ title: string; value: string }[]> => {
  const query = `*[_type == "category"]{title, "value": slug.current}`;
  const results = await client.fetch(query);
  return results.map((cat: any) => ({ title: cat.title, value: cat.value }));
};

export const fetchDirectoryListingBySlug = async (slug: string): Promise<any | null> => {
  return await DirectoryProxy.getListingBySlug(slug);
};
