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
} = {}): Promise<DirectoryListing[]> => {
  const { category, brokerType, tier, search } = filters;

  const query = `*[_type == "directoryListing"
    ${category && category !== 'all' ? '&& category->slug.current == $category' : ''}
    ${tier && tier !== 'all' ? `&& isFeatured == ${tier === 'featured'}` : ''}
    ${search ? '&& (title match $search + "*" || description match $search + "*")' : ''}
  ]{
    _id,
    _type,
    "name": title,
    description,
    "logoUrl": logo.asset->url,
    "categories": [category->title],
    brokerType,
    "slug": slug.current,
    "rating": 5, // Placeholder for now
    websiteURL,
    pricing,
    listingType,
    isFeatured
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
    categories: item.categories || [],
    brokerTypes: item.brokerType || [],
    listingTier: item.isFeatured ? 'featured' : 'free',
    slug: item.slug,
    rating: item.rating,
    websiteUrl: item.websiteURL,
    pricingModel: item.pricing?.type,
    type: item.listingType
  }));
};

export const fetchCategories = async (): Promise<{ title: string, value: string }[]> => {
  const query = `*[_type == "category"] { title, "value": slug.current } | order(title asc)`;
  return await client.fetch(query);
};

import { DirectoryProxy } from '@/sanity/lib/proxy';

export const fetchDirectoryListingBySlug = async (slug: string): Promise<any | null> => {
  return await DirectoryProxy.getListingBySlug(slug);
};