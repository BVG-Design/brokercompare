import { SoftwareListing } from '@/components/product-page/types';
import { DirectoryProxy } from '@/sanity/lib/proxy';
import { fetchDirectoryListingBySlug, fetchDirectoryListings } from '@/services/sanity';
import {
  ComparisonFeatureGroup,
  ComparisonFeatureRow,
  ComparisonProduct,
  FeatureAvailability,
  ProviderCard,
  RubricCategoryScore
} from '@/types/comparison';

interface DirectoryPageData {
  listing: SoftwareListing;
  comparisonProducts: ComparisonProduct[];
  summaryProducts: ComparisonProduct[];
  featureGroups: ComparisonFeatureGroup[];
  summaryFeatures: ComparisonFeatureRow[];
  providers: ProviderCard[];
  allDirectoryProducts: ComparisonProduct[];
  suggestedProducts: ComparisonProduct[];
}

const formatPricing = (pricing?: { type?: string; startingFrom?: number; notes?: string }): string => {
  if (!pricing) return 'Contact sales';

  if (pricing.type === 'free') return 'Free';
  if (typeof pricing.startingFrom === 'number') {
    const base = `$${pricing.startingFrom}`;
    return pricing.type === 'subscription' ? `${base}/mo` : `From ${base}`;
  }
  if (pricing.type === 'subscription') return 'Subscription';
  if (pricing.type === 'one_time') return 'One-time';
  if (pricing.type === 'quote') return 'Contact for quote';

  return 'Contact sales';
};

const mapToSoftwareListing = (listing: any): SoftwareListing => ({
  name: listing.title,
  slug: listing.slug,
  tagline: listing.tagline,
  description: listing.description,
  category: listing.category?.title,
  websiteUrl: listing.websiteURL,
  logoUrl: listing.logoUrl || listing.logo_url,
  badges: (listing.badges || []).map((b: any) => ({ title: b.title, color: b.color })),
  serviceArea: (listing.serviceAreas || [])
    .filter((sa: any) => sa)
    .map((sa: any) => sa.title || sa),
  brokerType: listing.brokerType || [],
  features: (listing.features || [])
    .filter((f: any) => f)
    .map((f: any) => f.title || (typeof f === 'string' ? f : f.feature?.title)),
  pricing: {
    model: listing.pricing?.type,
    min: listing.pricing?.startingFrom ?? listing.pricing?.min,
    max: listing.pricing?.max,
    notes: listing.pricing?.notes
  },
  worksWith: (listing.worksWith || []).map((ww: any) => ({
    name: ww.title,
    slug: ww.slug
  })),
  editor: {
    author: listing.author?.name || 'Broker Tools Editor',
    notes: listing.editorNotes
  },
  rating: {
    average: 0,
    count: 0
  },
  trustMetrics: {
    responseTimeHours:
      listing.trustMetrics?.responseTimeHours ??
      listing.trust_metrics?.response_time_hours ??
      listing.response_time_hours ??
      listing.responseTimeHours,
    verifiedRatio:
      listing.trustMetrics?.verifiedRatio ??
      listing.trust_metrics?.verified_ratio ??
      listing.verified_ratio ??
      listing.verifiedRatio,
    reviewRecencyDays:
      listing.trustMetrics?.reviewRecencyDays ??
      listing.trust_metrics?.review_recency_days ??
      listing.review_recency_days ??
      listing.reviewRecencyDays
  }
});

const buildFeatureGroups = (
  comparisonData: any[],
  allSlugs: string[]
): ComparisonFeatureGroup[] => {
  const groupsMap = new Map<
    string,
    { title: string; order: number; features: Map<string, ComparisonFeatureRow> }
  >();

  comparisonData.forEach((item) => {
    const groupedRaw = DirectoryProxy.groupFeaturesByCategory(item.features);
    const grouped = Array.isArray(groupedRaw) ? groupedRaw : [];

    grouped.forEach((group: any) => {
      const existingGroup =
        groupsMap.get(group.title) ||
        { title: group.title, order: group.order ?? 999, features: new Map() };

      group.features.forEach((feature: any) => {
        const row =
          existingGroup.features.get(feature.title) || {
            title: feature.title,
            score: feature.score,
            availability: {}
          };

        if (feature.score !== undefined) {
          row.score = feature.score;
        }
        row.availability[item.slug] = feature.availability as FeatureAvailability;
        existingGroup.features.set(feature.title, row);
      });

      groupsMap.set(group.title, existingGroup);
    });
  });

  return Array.from(groupsMap.values())
    .map((group) => {
      const rows = Array.from(group.features.values()).map((row) => {
        const availability = { ...row.availability };
        allSlugs.forEach((slug) => {
          if (!availability[slug]) {
            availability[slug] = 'no';
          }
        });
        return { ...row, availability };
      });

      return {
        title: group.title,
        order: group.order,
        features: rows
      };
    })
    .sort((a, b) => a.order - b.order);
};

const buildSummaryFeatures = (groups: ComparisonFeatureGroup[]): ComparisonFeatureRow[] => {
  const flattened = groups.flatMap((group) =>
    group.features.map((feature) => ({
      ...feature,
      order: group.order
    }))
  );

  const sorted = flattened.sort(
    (a: any, b: any) => a.order - b.order || a.title.localeCompare(b.title)
  );

  return sorted.slice(0, 8).map(({ order, ...rest }) => rest);
};

const mapProviderCard = (listing: any): ProviderCard => {
  const { average, count } = normalizeRating(listing.rating);

  return {
    id: listing._id || listing.id,
    name: listing.title || listing.name,
    slug: listing.slug,
    description: listing.description,
    logoUrl: listing.logoUrl,
    rating: average,
    reviewCount: listing.viewCount ?? count ?? null,
    tags: listing.brokerType?.length ? listing.brokerType : listing.categories,
    location: listing.categories?.[0],
    websiteUrl: listing.websiteUrl,
    badges: listing.badges
  };
};

const roundScore = (value: number): number => Math.round(value * 10) / 10;

const buildRubricCategoryScores = (features: any[]): RubricCategoryScore[] => {
  if (!Array.isArray(features)) return [];

  const categoryMap = new Map<
    string,
    { title: string; order: number; total: number; count: number }
  >();

  features.forEach((feature: any) => {
    const score = feature?.score;
    if (typeof score !== 'number') return;

    const categoryTitle = feature?.feature?.category?.title || 'Other';
    const order = feature?.feature?.category?.order ?? 999;
    const current = categoryMap.get(categoryTitle) || {
      title: categoryTitle,
      order,
      total: 0,
      count: 0
    };

    current.total += score;
    current.count += 1;
    current.order = Math.min(current.order, order ?? 999);

    categoryMap.set(categoryTitle, current);
  });

  return Array.from(categoryMap.values())
    .map((entry) => ({
      title: entry.title,
      order: entry.order,
      score: roundScore(entry.total / entry.count)
    }))
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
};

const buildOverallRubricScore = (categoryScores: RubricCategoryScore[]): number | null => {
  if (!categoryScores.length) return null;
  const total = categoryScores.reduce((sum, category) => sum + category.score, 0);
  return roundScore(total / categoryScores.length);
};

const normalizeRating = (rating: any): { average: number | null; count: number } => {
  if (!rating) return { average: null, count: 0 };

  // Sanity rating structure could be a number or an object with average/count.
  const average =
    typeof rating === 'number'
      ? rating
      : typeof rating?.average === 'number'
        ? rating.average
        : null;

  const count =
    typeof rating?.count === 'number'
      ? rating.count
      : typeof rating?.reviewCount === 'number'
        ? rating.reviewCount
        : 0;

  return {
    average: count > 0 ? average : null,
    count
  };
};

export const buildDirectoryPageData = async (slug: string): Promise<DirectoryPageData | null> => {
  const listing = await fetchDirectoryListingBySlug(slug);
  if (!listing) return null;

  const mappedListing = mapToSoftwareListing(listing);
  const similarRaw = Array.isArray(listing.similarTo) ? listing.similarTo : [];
  const sortedSimilar = similarRaw
    .map((item: any) => ({
      priority: item?.priority ?? 999,
      slug: item?.listing?.slug,
      title: item?.listing?.title,
      logoUrl: item?.listing?.logoUrl
    }))
    .filter((item: any) => item.slug)
    .sort((a: any, b: any) => a.priority - b.priority);

  const alternativeSlugs = sortedSimilar.map((item: any) => item.slug).slice(0, 6);
  const comparisonSlugs = Array.from(new Set([slug, ...alternativeSlugs]));

  const comparisonData = comparisonSlugs.length
    ? await DirectoryProxy.getComparisonMatrix(comparisonSlugs)
    : [];

  const comparisonProducts: ComparisonProduct[] = comparisonData.map((item: any) => {
    const { average: ratingValue } = normalizeRating(item.rating);
    const rubricCategoryScores = buildRubricCategoryScores(item.features);
    const overallRubricScore = buildOverallRubricScore(rubricCategoryScores);

    return {
      slug: item.slug,
      name: item.title,
      logoUrl: item.logoUrl,
      tagline: item.tagline,
      priceText: formatPricing(item.pricing),
      rating: ratingValue,
      isCurrent: item.slug === slug,
      websiteUrl: item.websiteURL,
      worksWith: item.worksWith || [],
      serviceAreas: (item.serviceAreas || []).map((sa: any) => sa?.title).filter(Boolean),
      alternativesCount: item.alternativesCount,
      overallRubricScore,
      rubricCategoryScores
    };
  });

  if (!comparisonProducts.some((p) => p.slug === slug)) {
    comparisonProducts.unshift({
      slug,
      name: mappedListing.name,
      logoUrl: mappedListing.logoUrl,
      priceText: formatPricing(listing.pricing),
      rating: null,
      overallRubricScore: null,
      rubricCategoryScores: [],
      isCurrent: true
    });
  }

  const orderLookup = new Map(comparisonSlugs.map((s, idx) => [s, idx]));
  comparisonProducts.sort(
    (a, b) => (orderLookup.get(a.slug) ?? 999) - (orderLookup.get(b.slug) ?? 999)
  );

  const summarySlugs = new Set([slug, ...alternativeSlugs.slice(0, 2)]);
  const summaryProducts = comparisonProducts.filter((p) => summarySlugs.has(p.slug));

  const featureGroups = buildFeatureGroups(
    comparisonData,
    comparisonProducts.map((p) => p.slug)
  );
  const summaryFeatures = buildSummaryFeatures(featureGroups);

  const allDirectoryRaw = await fetchDirectoryListings();
  const allDirectoryProducts: ComparisonProduct[] = allDirectoryRaw.map((item: any) => ({
    slug: item.slug,
    name: item.name,
    logoUrl: item.logoUrl,
    priceText: item.pricingModel,
    rating: normalizeRating(item.rating).average,
    isCurrent: item.slug === slug
  }));

  const suggestedProducts = comparisonProducts.slice(0, 6);

  const providers =
    listing.listingType === 'software'
      ? (listing.serviceProviders || []).map(mapProviderCard).slice(0, 4)
      : [];

  return {
    listing: mappedListing,
    comparisonProducts,
    summaryProducts,
    featureGroups,
    summaryFeatures,
    providers,
    allDirectoryProducts,
    suggestedProducts
  };
};
