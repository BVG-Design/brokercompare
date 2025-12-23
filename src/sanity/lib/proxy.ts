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
    "serviceAreas": serviceAreas[]->title,
    "worksWith": worksWith[]->title,
    isFeatured
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
        return data.map(this.normalizeListing);
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
            features: listing.features || []
        };
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
