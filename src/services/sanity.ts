import { client } from "@/sanity/lib/client";
import { UNIFIED_SEARCH_QUERY } from "@/sanity/lib/queries";
import { DirectoryListing, ResourcePost } from "@/types";
import { DirectoryProxy } from "@/sanity/lib/proxy";

export const fetchResourcePosts = async (): Promise<ResourcePost[]> => {
  const query = `*[_type == "blog" && lower(featuredLabel) == "resource guide"]{
    _id,
    _type,
    title,
    name,
    description,
    summary,
    featuredLabel,
    "categories": categories[]->title,
    "slug": slug.current,
    "imageUrl": heroImage.asset->url,
    "logoUrl": logo.asset->url
  }`;

  try {
    const results = await client.fetch(query);
    
    if (!Array.isArray(results)) {
      return [];
    }

    return results.map((item: any) => ({
      id: item._id,
      title: item.title || item.name,
      description: item.summary || item.description,
      category: item.featuredLabel || "RESOURCE",
      categories: item.categories || [],
      ctaText: item._type === "blog" ? "Read" : "Explore",
      imageUrl: item.imageUrl || item.logoUrl,
      link: item._type === "blog" ? `/blog/${item.slug}` : `/directory/${item.slug}`,
      featuredLabel: item.featuredLabel
    }));
  } catch (error: any) {
    // Silently handle errors - data might not exist yet in Sanity
    if (process.env.NODE_ENV === 'development') {
      console.warn("Failed to fetch resource posts from Sanity:", error?.message || error);
    }
    return [];
  }
};

export interface UnifiedSearchResult {
  _id: string;
  _type: string;
  title?: string;
  name?: string;
  description?: string;
  tagline?: string;
  slug?: string;
  category?: string;
  categories?: string[];
  listingType?: string;
  featuredLabel?: string;
  logoUrl?: string;
  heroImageUrl?: string;
  badgePriority?: number;
  resultType?: "software" | "service" | "resourceGuide" | "other";
  whyMatched?: string[];
}

export const fetchUnifiedSearchResults = async (
  searchTerms: string[],
  contentTypes: string[]
): Promise<UnifiedSearchResult[]> => {
  const normalizedTerms = searchTerms.map((t) => t.trim()).filter(Boolean);

  if (normalizedTerms.length === 0 || contentTypes.length === 0) {
    return [];
  }

  // Broad matching (used in filter stage)
  const searchPatterns = normalizedTerms.map((term) => `${term}*`);

  // Exact phrase (used in relevance scoring)
  const searchQuery = normalizedTerms.join(" ");

  // 🔒 ALWAYS provide intentTerms (even if empty)
  const intentTerms: string[] = [];

  let results: UnifiedSearchResult[] = [];

  try {
    results = await client.fetch<UnifiedSearchResult[]>(
      UNIFIED_SEARCH_QUERY,
      {
        contentTypes,
        searchTerms: searchPatterns,
        searchQuery: `${searchQuery}*`,
        intentTerms
      },
      { useCdn: false }
    );
  } catch (error: any) {
    // Silently handle errors - data might not exist yet in Sanity
    if (process.env.NODE_ENV === 'development') {
      console.warn("Unified search failed to fetch from Sanity:", error?.message || error);
    }
    return [];
  }

  const deduped = new Map<string, UnifiedSearchResult>();

  results.forEach((item) => {
    if (deduped.has(item._id)) return;

    const categories =
      item.categories?.filter(Boolean) ||
      (item.category ? [item.category] : []);

    const badgePriority = item.badgePriority ?? 999;
    const featuredLabel = item.featuredLabel || "";
    const isResourceGuide = featuredLabel.toLowerCase() === "resource guide";
    const listingType = item.listingType || "";

    const resultType: UnifiedSearchResult["resultType"] =
      isResourceGuide
        ? "resourceGuide"
        : listingType === "software"
          ? "software"
          : listingType === "service"
            ? "service"
            : "other";

    deduped.set(item._id, {
      ...item,
      categories,
      badgePriority,
      resultType
    });
  });

  return Array.from(deduped.values());
};

export const fetchDirectoryListings = async (filters: {
  categories?: string[] | string;
  brokerType?: string;
  tier?: string;
  search?: string;
  type?: string;
} = {}): Promise<DirectoryListing[]> => {
  const rawCategories = Array.isArray(filters.categories)
    ? filters.categories
    : filters.categories
      ? [filters.categories]
      : [];

  const { tier, search, type } = filters;
  const categoryFilterActive =
    rawCategories.length > 0 && !rawCategories.includes("all");

  const query = `*[_type == "directoryListing"
    ${categoryFilterActive ? "&& category->slug.current in $categories" : ""}
    ${type && type !== "all" ? "&& listingType == $type" : ""}
    ${tier && tier !== "all" ? `&& isFeatured == ${tier === "featured"}` : ""}
    ${search ? "&& (title match $search + \"*\" || description match $search + \"*\" || serviceAreas[]->title match $search + \"*\")" : ""}
  ]{
    _id,
    _type,
    "name": title,
    description,
    "logoUrl": logo.asset->url,
    "categories": [category->title],
    brokerType,
    "slug": slug.current,
    websiteURL,
    pricing,
    listingType,
    isFeatured,
    features,
    "serviceAreas": serviceAreas[]->title,
    badges[]{
      title,
      priority
    }
  }`;

  const params: Record<string, any> = {};
  if (categoryFilterActive) params.categories = rawCategories;
  if (type && type !== "all") params.type = type;
  if (search) params.search = search;

  try {
    const results = await client.fetch(query, params);
    
    if (!Array.isArray(results)) {
      return [];
    }

    return results.map((item: any) => ({
      id: item._id,
      name: item.name,
      description: item.description,
      logoUrl: item.logoUrl,
      categories: item.categories || [],
      brokerTypes: item.brokerType || [],
      listingTier: item.isFeatured ? "featured" : "free",
      slug: item.slug,
      websiteUrl: item.websiteURL,
      pricingModel: item.pricing?.type,
      type: item.listingType,
      serviceAreas: item.serviceAreas || [],
      features: item.features || [],
      badges: item.badges || [],
      badgePriority: Math.min(
        ...(item.badges?.map((b: any) => b?.priority).filter((p: number) => typeof p === "number") ?? [999])
      )
    }));
  } catch (error: any) {
    // Silently handle errors - data might not exist yet in Sanity
    if (process.env.NODE_ENV === 'development') {
      console.warn("Failed to fetch directory listings from Sanity:", error?.message || error);
    }
    return [];
  }
};

export const fetchCategories = async (): Promise<{ title: string; value: string }[]> => {
  const query = `*[_type == "category"]{title, "value": slug.current}`;

  try {
    const results = await client.fetch(query);
    
    if (!Array.isArray(results)) {
      return [];
    }
    
    return results.map((cat: any) => ({
      title: cat.title,
      value: cat.value
    }));
  } catch (error: any) {
    // Silently handle errors - data might not exist yet in Sanity
    if (process.env.NODE_ENV === 'development') {
      console.warn("Failed to fetch categories from Sanity:", error?.message || error);
    }
    return [];
  }
};

export const fetchDirectoryListingBySlug = async (slug: string): Promise<any | null> => {
  try {
    return await DirectoryProxy.getListingBySlug(slug);
  } catch (error) {
    console.error(`Failed to fetch directory listing with slug "${slug}"`, error);
    return null;
  }
};
