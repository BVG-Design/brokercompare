import { groq } from 'next-sanity';
import { client } from './client';

/**
 * DIRECTORY_LISTING_QUERY
 * Fetches directory listings with fully dereferenced categories and features.
 * Features are grouped by their category order.
 */
export const DIRECTORY_LISTING_QUERY = groq`
  *[_type == "directoryListing"] {
    _id,
    title,
    listingType,
    "slug": slug.current,
    tagline,
    description,
    "category": category->{
      title,
      "slug": slug.current
    },
    "logoUrl": logo.asset->url,
    websiteURL,
    brokerType,
    "features": features[]{
      availability,
      limitationType,
      notes,
      "details": feature->{
        title,
        "slug": slug.current,
        description,
        "category": category->{
          title,
          "order": order
        }
      }
    },
    pricing,
    "serviceAreas": serviceAreas[]->{ title, group },
    "worksWith": worksWith[]->{
      title,
      "slug": slug.current,
      listingType
    },
    isFeatured,
    "badges": badges[]->{
      title,
      "slug": slug.current,
      badgeType,
      color,
      "iconUrl": icon.asset->url,
      priority
    }
  }
`;

/**
 * GET_LISTING_BY_SLUG_QUERY
 * Fetches a single directory listing by slug.
 */
export const GET_LISTING_BY_SLUG_QUERY = groq`
  *[_type == "directoryListing" && slug.current == $slug][0] {
    _id,
    title,
    listingType,
    "slug": slug.current,
    tagline,
    description,
    "category": category->{
      title,
      "slug": slug.current
    },
    "logoUrl": logo.asset->url,
    websiteURL,
    brokerType,
    "features": features[]{
      availability,
      limitationType,
      notes,
      "feature": feature->{
        title,
        "slug": slug.current,
        description,
        "category": category->{
          title,
          "order": order
        }
      }
    },
    pricing,
    "serviceAreas": serviceAreas[]->{ title, group },
    "worksWith": worksWith[]->{
      title,
      "slug": slug.current,
      listingType
    },
    isFeatured,
    "badges": badges[]->{
      title,
      "slug": slug.current,
      badgeType,
      color,
      "iconUrl": icon.asset->url,
      priority,
      description
    },
    "author": author->{
      name
    },
    editorNotes,
    metaDescription,
    synonyms
  }
`;

/**
 * COMPARISON_QUERY
 * Specific query for G2-style side-by-side matrices.
 */
export const COMPARISON_QUERY = groq`
  *[_type == "directoryListing" && slug.current in $slugs] {
    title,
    "slug": slug.current,
    "logoUrl": logo.asset->url,
    "features": features[]{
      availability,
      limitationType,
      notes,
      "feature": feature->{
        title,
        "category": category->{
          title,
          "order": order
        }
      }
    }
  }
`;

/**
 * Proxy Data Access Layer
 * Normalizes Sanity data for the frontend.
 */
export const DirectoryProxy = {
  /**
   * Fetches all listings and normalizes them.
   */
  async getAllListings() {
    const data = await client.fetch(DIRECTORY_LISTING_QUERY);
    return data.map((l: any) => this.normalizeListing(l));
  },

  /**
   * Fetches a single listing by slug and normalizes features.
   */
  async getListingBySlug(slug: string) {
    const data = await client.fetch(GET_LISTING_BY_SLUG_QUERY, { slug }, { useCdn: false });
    if (!data) return null;

    const normalized = this.normalizeListing(data);
    return {
      ...normalized,
      featuresByCategory: this.groupFeaturesByCategory(normalized.features),
      serviceAreasByGroup: this.groupServiceAreas(normalized.serviceAreas)
    };
  },

  /**
   * Fetches specific listings for comparison and groups features by category.
   */
  async getComparisonMatrix(slugsList: string[]) {
    const data = await client.fetch(COMPARISON_QUERY, { slugs: slugsList });

    // Additional normalization can happen here (e.g., sorting features by category order)
    return data.map((listing: any) => ({
      ...listing,
      featuresByCategory: this.groupFeaturesByCategory(listing.features)
    }));
  },

  /**
   * Normalization helper
   */
  normalizeListing(listing: any) {
    return {
      ...listing,
      // Ensure arrays aren't null
      serviceAreas: listing.serviceAreas || [],
      worksWith: listing.worksWith || [],
      features: listing.features || [],
      badges: listing.badges || []
    };
  },

  /**
   * Group service areas by their group/category.
   */
  groupServiceAreas(areas: any[]) {
    if (!areas) return {};
    return areas.filter(Boolean).reduce((acc: any, area: any) => {
      const group = area.group || 'Other';
      if (!acc[group]) acc[group] = [];
      acc[group].push(area.title);
      return acc;
    }, {});
  },

  /**
   * Groups the capability matrix by feature category
   */
  groupFeaturesByCategory(features: any[]) {
    if (!features) return {};

    const groups: Record<string, any> = {};

    features.forEach(f => {
      const catName = f.feature?.category?.title || 'Other';
      const order = f.feature?.category?.order || 999;

      if (!groups[catName]) {
        groups[catName] = {
          title: catName,
          order: order,
          features: []
        };
      }

      groups[catName].features.push({
        title: f.feature?.title,
        availability: f.availability,
        limitationType: f.limitationType,
        notes: f.notes
      });
    });

    // Return sorted by category order
    return Object.values(groups).sort((a, b) => a.order - b.order);
  }
};

