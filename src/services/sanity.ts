import { client } from '@/../sanity/lib/client';
import { UNIFIED_SEARCH_QUERY } from '@/sanity/lib/queries';
import { DirectoryListing, ResourcePost } from '@/types';
import { SITE_URLS } from '@/lib/config';

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
    "logoUrl": select(
      defined(logo.asset->url) => logo.asset->url,
      defined(organisation->logo.asset->url) => organisation->logo.asset->url,
      defined(images[@.isLogo == true][0].asset->url) => images[@.isLogo == true][0].asset->url,
      defined(images[0].asset->url) => images[0].asset->url,
      defined(mainImage.asset->url) => mainImage.asset->url,
      defined(heroImage.asset->url) => heroImage.asset->url
    ),
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
    link: item._type === 'blog' ? `${SITE_URLS.resources}/blog/${item.slug}` : `${SITE_URLS.directory}/listings/${item.slug}`,
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
      link: `${SITE_URLS.resources}/blog/${item.slug}`,
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
  websiteUrl?: string;
}

export const fetchUnifiedSearchResults = async (
  searchTerms: string[],
  contentTypes: string[],
  filters?: { category?: string; brokerType?: string; type?: string; author?: string; subCategory?: string }
): Promise<UnifiedSearchResult[]> => {
  const normalizedTerms = searchTerms.map((term) => term.trim()).filter(Boolean);
  if (contentTypes.length === 0) {
    return [];
  }

  console.log('[fetchUnifiedSearchResults] params:', { searchTerms, contentTypes, filters, normalizedTerms });

  const searchPatterns = normalizedTerms;
  const params = {
    searchTerms: searchPatterns,
    contentTypes,
    category: filters?.category && filters.category !== 'all' ? filters.category : null,
    brokerType: filters?.brokerType && filters.brokerType !== 'all' ? filters.brokerType : null,
    listingType: filters?.type && filters.type !== 'all' ? filters.type : null,
    author: filters?.author && filters.author !== 'all' ? filters.author : null,
    subCategory: filters?.subCategory && filters.subCategory !== 'all' ? filters.subCategory : null
  };
  console.log('[fetchUnifiedSearchResults] executing query with params:', params);

  const results = await client.fetch<UnifiedSearchResult[]>(UNIFIED_SEARCH_QUERY, params, { useCdn: false });
  console.log('[fetchUnifiedSearchResults] raw results count:', results.length);

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
  subCategory?: string;
} = {}): Promise<DirectoryListing[]> => {
  const { category, brokerType, tier, search, listingType, subCategory } = filters;

  const query = `*[_type == "directoryListing"
    ${category && category !== 'all' ? '&& (category->slug.current == $category || $category in categories[]->slug.current)' : ''}
    ${subCategory && subCategory !== 'all' ? '&& $subCategory in subCategory[]->slug.current' : ''}
    ${brokerType && brokerType !== 'all' ? '&& $brokerType in brokerType' : ''}
    ${tier && tier !== 'all' ? `&& isFeatured == ${tier === 'featured'}` : ''}
    ${listingType && listingType !== 'all' ? '&& (listingType == $listingType || listingType->value == $listingType || listingType->title == $listingType)' : ''}
    ${search ? '&& (title match $search || description match $search || synonyms[] match $search || subCategory[]->title match $search)' : ''}
  ]{
    _id,
    _type,
    "name": title,
    description,
    "logoUrl": select(
      defined(logo.asset->url) => logo.asset->url,
      defined(organisation->logo.asset->url) => organisation->logo.asset->url,
      defined(images[@.isLogo == true][0].asset->url) => images[@.isLogo == true][0].asset->url,
      defined(images[0].asset->url) => images[0].asset->url,
      defined(mainImage.asset->url) => mainImage.asset->url,
      defined(heroImage.asset->url) => heroImage.asset->url
    ),
    "categories": [category->title],
    brokerType,
    "slug": slug.current,
    rating,
    trustMetrics,
    viewCount,
    websiteURL,
    pricing,
    "listingType": coalesce(listingType->value, listingType->title, listingType),
    "badgePriority": (badges[]->priority | order(@ asc))[0],
    "badges": badges[]->title,
    synonyms,
    "tagline": tagline,
    isFeatured
  }`;

  const params: Record<string, any> = {};
  if (category && category !== 'all') params.category = category;
  if (subCategory && subCategory !== 'all') params.subCategory = subCategory;
  if (brokerType && brokerType !== 'all') params.brokerType = brokerType;
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
    type: item.listingType,
    badgePriority: item.badgePriority,
    badges: item.badges || [],
    synonyms: item.synonyms || [],
    tagline: item.tagline
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