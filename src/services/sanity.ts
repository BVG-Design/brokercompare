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
    "logoUrl": logo.asset->url,
    "listingType": coalesce(listingType->value, listingType),
    blogType
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
    featuredLabel: item.featuredLabel,
    listingType: item.listingType,
    blogType: item.blogType
  }));
};

export const fetchHomepageResourceCards = async (): Promise<ResourcePost[]> => {
  const query = `{
    "podcast": *[_type == "blog" && blogType == "podcast"] | order(_createdAt desc)[0]{
      _id, _type, title, summary, "slug": slug.current, "imageUrl": heroImage.asset->url, blogType
    },
    "guide": *[_type == "blog" && blogType == "guide"] | order(_createdAt desc)[0]{
      _id, _type, title, summary, "slug": slug.current, "imageUrl": heroImage.asset->url, blogType
    },
    "faq": *[_type == "blog" && blogType == "faq"] | order(_createdAt desc)[0]{
      _id, _type, title, summary, "slug": slug.current, "imageUrl": heroImage.asset->url, blogType
    }
  }`;

  const results = await client.fetch(query);

  const mapResult = (item: any, defaultCategory: string) => {
    if (!item) return null;
    return {
      id: item._id,
      title: item.title,
      description: item.summary,
      category: defaultCategory,
      ctaText: 'EXPLORE',
      imageUrl: item.imageUrl,
      link: `/blog/${item.slug}`,
      blogType: item.blogType
    };
  };

  const cards = [
    mapResult(results.podcast, 'PODCASTS'),
    mapResult(results.guide, 'GUIDES'),
    mapResult(results.faq, 'FAQS')
  ].filter(Boolean) as ResourcePost[];

  return cards;
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
  tags?: string[];
  brokerType?: string[];
  listingType?: string;
  badges?: string[];
  features?: string[];
  rating?: number;
  reviews?: number;
}

export const fetchUnifiedSearchResults = async (
  searchTerms: string[],
  contentTypes: string[],
  filters?: { category?: string; brokerType?: string; type?: string }
): Promise<UnifiedSearchResult[]> => {
  const normalizedTerms = searchTerms.map((term) => term.trim()).filter(Boolean);
  if (normalizedTerms.length === 0 || contentTypes.length === 0) {
    return [];
  }

  const searchPatterns = normalizedTerms.map((term) => `${term}*`);
  const results = await client.fetch<UnifiedSearchResult[]>(UNIFIED_SEARCH_QUERY, {
    searchTerms: searchPatterns,
    contentTypes,
    category: filters?.category && filters.category !== 'all' ? filters.category : null,
    brokerType: filters?.brokerType && filters.brokerType !== 'all' ? filters.brokerType : null,
    listingType: filters?.type && filters.type !== 'all' ? filters.type : null
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
  featuredLabel?: string;
  listingType?: string;
  blogType?: string;
  tier?: string;
  search?: string;
} = {}): Promise<DirectoryListing[]> => {
  const { category, brokerType, tier, search, listingType } = filters;

  const query = `*[_type == "directoryListing"
    ${category && category !== 'all' ? '&& category->slug.current == $category' : ''}
    ${tier && tier !== 'all' ? `&& isFeatured == ${tier === 'featured'}` : ''}
    ${listingType && listingType !== 'all' ? '&& (listingType == $listingType || listingType->value == $listingType || listingType->title == $listingType)' : ''}
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
    rating,
    trustMetrics,
    viewCount,
    websiteURL,
    pricing,
    "listingType": coalesce(listingType->value, listingType->title, listingType),
    isFeatured
  }`;

  const params: Record<string, any> = {};
  if (category && category !== 'all') params.category = category;
  if (search) params.search = search;
  if (listingType && listingType !== 'all') params.listingType = listingType;

  const results = await client.fetch(query, params);

  return results.map((item: any) => ({
    id: item._id,
    name: item.name,
    company_name: item.name, // For PartnerCard
    description: item.description,
    logoUrl: item.logoUrl,
    logo_url: item.logoUrl, // For PartnerCard
    categories: item.categories || [],
    brokerTypes: item.brokerType || [],
    listingTier: item.isFeatured ? 'featured' : 'free',
    listing_tier: item.isFeatured ? 'featured' : 'free', // For PartnerCard
    slug: item.slug,
    rating: item.rating,
    trustMetrics: item.trustMetrics,
    viewCount: item.viewCount,
    websiteUrl: item.websiteURL,
    pricingModel: item.pricing?.type,
    type: item.listingType
  }));
};

export const fetchCategories = async (): Promise<{ title: string, value: string }[]> => {
  const query = `*[_type == "category" && defined(slug.current)] { title, "value": slug.current } | order(title asc)`;
  return await client.fetch(query);
};

import { DirectoryProxy } from '@/sanity/lib/proxy';

import { SEARCH_INTENT_NAV_QUERY } from '@/sanity/lib/queries';

export const fetchSearchIntents = async (): Promise<{ title: string; slug: string }[]> => {
  return await client.fetch(SEARCH_INTENT_NAV_QUERY);
};

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
export const fetchRelatedArticles = async (limit: number = 3): Promise<any[]> => {
  const query = `*[_type == "blog"] | order(_createdAt desc)[0...${limit}] {
    _id,
    title,
    description,
    "category": category->title,
    mainImage {
      asset-> {
        url
      }
    },
    publishedAt,
    "author": author->name,
    "slug": slug.current
  }`;

  return client.fetch(query);
};
