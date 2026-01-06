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

  // Deduplicate by slug (preferring directoryListing, then product/serviceProvider, then blog)
  const slugFirst = new Map<string, UnifiedSearchResult>();
  const typePriority = (t?: string) => {
    if (t === 'directoryListing') return 1;
    if (t === 'product' || t === 'serviceProvider') return 2;
    if (t === 'blog') return 3;
    return 99;
  };

  results.forEach((item) => {
    const key = (item.slug || item._id || '').toLowerCase();
    if (!key) return;
    const existing = slugFirst.get(key);
    if (!existing || typePriority(item._type) < typePriority(existing._type)) {
      slugFirst.set(key, item);
    }
  });

  // fallback: if no slug, keep unique by _id
  const byId = new Map<string, UnifiedSearchResult>();
  results.forEach((item) => {
    if (!item.slug) {
      if (!byId.has(item._id)) byId.set(item._id, item);
    }
  });

  return [...slugFirst.values(), ...byId.values()];
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

export const fetchJourneyStages = async (): Promise<any[]> => {
  const { JOURNEY_STAGES_QUERY } = await import('@/sanity/lib/queries');
  return await client.fetch(JOURNEY_STAGES_QUERY, {}, { useCdn: false });
};

export const fetchDirectoryListingsMatrix = async (): Promise<any[]> => {
  const { DIRECTORY_LISTINGS_MATRIX_QUERY } = await import('@/sanity/lib/queries');
  return await client.fetch(DIRECTORY_LISTINGS_MATRIX_QUERY, {}, { useCdn: false });
};

export const fetchBlogPostsMatrix = async (): Promise<any[]> => {
  const { BLOG_POSTS_MATRIX_QUERY } = await import('@/sanity/lib/queries');
  return await client.fetch(BLOG_POSTS_MATRIX_QUERY, {}, { useCdn: false });
};

export const fetchGuidesMatrix = async (): Promise<any[]> => {
  const { GUIDES_MATRIX_QUERY } = await import('@/sanity/lib/queries');
  return await client.fetch(GUIDES_MATRIX_QUERY, {}, { useCdn: false });
};
