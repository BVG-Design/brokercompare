// sanity/lib/queries.ts
import { groq } from 'next-sanity';

// ============================================================================
// DIRECTORY LISTING QUERIES
// All software and services are stored as directoryListing with listingType
// ============================================================================

// Legacy query - returns software listings (listingType == "software")
export const productsAsSoftwareQuery = groq`
*[_type == "directoryListing" && listingType == "software"]{
  "id": _id,
  "slug": slug.current,
  "name": title,
  websiteURL,
  "category": category->title,
  "logoUrl": logo.asset->url,
  "tagline": tagline,
  description,

  "pricing": select(
    defined(pricing.startingFrom) => "Starts at $" + string(pricing.startingFrom),
    pricing.type == "free" => "Free",
    defined(pricing.notes) => pricing.notes,
    "Pricing available on request"
  ),

  "pricingNotes": pricing.notes,
  "tags": [],
  "features": features[].feature->title,
  "compatibility": worksWith[]->title,

  "rating": {
    "average": 0,
    "reviewCount": 0
  },
  "reviews": []
}
`;

// Get all service listings (directoryListing with listingType == "service")
export const SERVICES_QUERY = groq`
  *[_type == "directoryListing" && listingType == "service"] | order(title asc) {
    "id": _id,
    "slug": slug.current,
    title,
    "name": title,
    "category": category->title,
    "logoUrl": logo.asset->url,
    tagline,
    description,
    websiteURL,
    listingType,
    "features": features[]{
      availability,
      limitationType,
      notes,
      "feature": feature->{
        title,
        "slug": slug.current,
        description
      }
    },
    pricing,
    "serviceAreas": serviceAreas[]->{ title, group },
    brokerType,
    "badges": badges[]->{
      title,
      "slug": slug.current,
      badgeType,
      color,
      "iconUrl": icon.asset->url,
      priority
    },
    isFeatured
  }
`;

// Get service slugs for static generation (directoryListing with listingType == "service")
export const SERVICES_SLUGS_QUERY = groq`
  *[_type == "directoryListing" && listingType == "service"] {
    "id": slug.current
  }
`;

// Get single service by slug (directoryListing with listingType == "service")
export const SERVICE_BY_ID_QUERY = groq`
  *[_type == "directoryListing" && listingType == "service" && slug.current == $slug][0] {
    "id": _id,
    "slug": slug.current,
    title,
    "name": title,
    "category": category->title,
    "logoUrl": logo.asset->url,
    "images": [logo.asset->url],
    tagline,
    description,
    websiteURL,
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
    brokerType,
    "badges": badges[]->{
      title,
      "slug": slug.current,
      badgeType,
      color,
      "iconUrl": icon.asset->url,
      priority,
      description
    },
    "worksWith": worksWith[]->{
      title,
      "slug": slug.current,
      listingType
    },
    "author": author->{
      name
    },
    editorNotes,
    metaDescription,
    synonyms,
    isFeatured
  }
`;

// Get all software listings (directoryListing with listingType == "software")
export const SOFTWARE_QUERY = groq`
  *[_type == "directoryListing" && listingType == "software"] | order(title asc) {
    "id": _id,
    "slug": slug.current,
    title,
    "name": title,
    "category": category->title,
    "logoUrl": logo.asset->url,
    tagline,
    description,
    websiteURL,
    listingType,
    "features": features[]{
      availability,
      limitationType,
      notes,
      "feature": feature->{
        title,
        "slug": slug.current,
        description
      }
    },
    pricing,
    brokerType,
    "badges": badges[]->{
      title,
      "slug": slug.current,
      badgeType,
      color,
      "iconUrl": icon.asset->url,
      priority
    },
    "worksWith": worksWith[]->{
      title,
      "slug": slug.current,
      listingType
    },
    isFeatured
  }
`;

// Get software slugs for static generation (directoryListing with listingType == "software")
export const SOFTWARE_SLUGS_QUERY = groq`
  *[_type == "directoryListing" && listingType == "software"] {
    "id": slug.current
  }
`;

// Get single software by slug (directoryListing with listingType == "software")
export const SOFTWARE_BY_ID_QUERY = groq`
  *[_type == "directoryListing" && listingType == "software" && slug.current == $slug][0] {
    "id": _id,
    "slug": slug.current,
    title,
    "name": title,
    "category": category->title,
    "logoUrl": logo.asset->url,
    "images": [logo.asset->url],
    tagline,
    description,
    websiteURL,
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
    brokerType,
    "badges": badges[]->{
      title,
      "slug": slug.current,
      badgeType,
      color,
      "iconUrl": icon.asset->url,
      priority,
      description
    },
    "worksWith": worksWith[]->{
      title,
      "slug": slug.current,
      listingType
    },
    "author": author->{
      name
    },
    editorNotes,
    metaDescription,
    synonyms,
    isFeatured
  }
`;

// Get all directory listings regardless of type
export const ALL_LISTINGS_QUERY = groq`
  *[_type == "directoryListing"] | order(title asc) {
    "id": _id,
    "slug": slug.current,
    title,
    "name": title,
    "category": category->title,
    "logoUrl": logo.asset->url,
    tagline,
    description,
    websiteURL,
    listingType,
    "features": features[]{
      availability,
      limitationType,
      notes,
      "feature": feature->{
        title,
        "slug": slug.current,
        description
      }
    },
    pricing,
    "serviceAreas": serviceAreas[]->{ title, group },
    brokerType,
    "badges": badges[]->{
      title,
      "slug": slug.current,
      badgeType,
      color,
      "iconUrl": icon.asset->url,
      priority
    },
    "worksWith": worksWith[]->{
      title,
      "slug": slug.current,
      listingType
    },
    isFeatured
  }
`;

// Get featured directory listings
export const FEATURED_LISTINGS_QUERY = groq`
  *[_type == "directoryListing" && isFeatured == true] | order(title asc) {
    "id": _id,
    "slug": slug.current,
    title,
    "name": title,
    "category": category->title,
    "logoUrl": logo.asset->url,
    tagline,
    description,
    listingType,
    "badges": badges[]->{
      title,
      badgeType,
      color
    }
  }
`;

// ============================================================================
// SEARCH QUERIES
// ============================================================================

// Simple search query
export const searchResultsQuery = groq`
*[
  _type in ["blog", "directoryListing"] &&
  (
    title match $term ||
    summary match $term ||
    description match $term
  )
]{
  _id,
  _type,
  title,
  "summary": coalesce(summary, description),
  "slug": slug.current,
  "imageUrl": coalesce(
    heroImage.asset->url,
    logo.asset->url
  )
}
`;

// Main unified search query - optimized for directoryListing and blog only
export const UNIFIED_SEARCH_QUERY = groq`
*[
  _type in $contentTypes &&
  (
    /* --- Guard: allow results when no terms supplied --- */
    (
      !defined($searchQuery) || $searchQuery == ""
    )
    ||
    /* --- Direct string matching with case-insensitive wildcards --- */
    (
      defined($searchQuery) && $searchQuery != "" && (
        lower(title) match "*" + lower($searchQuery) + "*" ||
        lower(description) match "*" + lower($searchQuery) + "*" ||
        lower(tagline) match "*" + lower($searchQuery) + "*" ||
        lower(slug.current) match "*" + lower($searchQuery) + "*" ||
        lower(category->title) match "*" + lower($searchQuery) + "*" ||
        lower(categories[]->title) match "*" + lower($searchQuery) + "*" ||
        lower(serviceAreas[]->title) match "*" + lower($searchQuery) + "*" ||
        lower(brokerType[]) match "*" + lower($searchQuery) + "*" ||
        lower(badges[]->title) match "*" + lower($searchQuery) + "*" ||
        lower(features[].feature->title) match "*" + lower($searchQuery) + "*" ||
        lower(worksWith[]->title) match "*" + lower($searchQuery) + "*" ||
        lower(synonyms[]) match "*" + lower($searchQuery) + "*" ||
        lower(summary) match "*" + lower($searchQuery) + "*"
      )
    )
    ||
    /* --- Intent term matching --- */
    (
      count(coalesce($intentTerms, [])) > 0 &&
      count(
        coalesce($intentTerms, [])[
          lower(^.title) match "*" + lower(@) + "*" ||
          lower(^.description) match "*" + lower(@) + "*" ||
          lower(^.tagline) match "*" + lower(@) + "*" ||
          lower(^.category->title) match "*" + lower(@) + "*" ||
          lower(^.categories[]->title) match "*" + lower(@) + "*" ||
          lower(^.serviceAreas[]->title) match "*" + lower(@) + "*" ||
          lower(^.brokerType[]) match "*" + lower(@) + "*" ||
          lower(^.badges[]->title) match "*" + lower(@) + "*" ||
          lower(^.features[].feature->title) match "*" + lower(@) + "*" ||
          lower(^.worksWith[]->title) match "*" + lower(@) + "*" ||
          lower(^.synonyms[]) match "*" + lower(@) + "*" ||
          lower(^.summary) match "*" + lower(@) + "*"
        ]
      ) > 0
    )
  )
]{
  _id,
  _type,
  title,
  description,
  tagline,
  summary,
  "slug": coalesce(slug.current, _id),

  "category": coalesce(
    category->title,
    categories[0]->title,
    "Uncategorized"
  ),

  "categories": coalesce(
    categories[]->title,
    select(defined(category->title) => [category->title], [])
  ),

  brokerType,
  listingType,

  "badgePriority": coalesce(
    badges[].priority | order(@ asc)[0],
    999
  ),

  /* ---------------- RELEVANCE SCORE ---------------- */
  "relevanceScore": (
    /* Exact matches get highest scores */
    select(defined($searchQuery) && lower(title) == lower($searchQuery) => 100, 0) +
    select(defined($searchQuery) && lower(slug.current) == lower($searchQuery) => 150, 0) +
    
    /* Starts-with matches get medium-high scores */
    select(defined($searchQuery) && lower(title) match lower($searchQuery) + "*" => 50, 0) +
    
    /* Contains matches get lower scores */
    select(defined($searchQuery) && lower(title) match "*" + lower($searchQuery) + "*" => 20, 0) +
    select(defined($searchQuery) && lower(description) match "*" + lower($searchQuery) + "*" => 10, 0) +
    select(defined($searchQuery) && lower(tagline) match "*" + lower($searchQuery) + "*" => 15, 0) +
    select(defined($searchQuery) && lower(category->title) match "*" + lower($searchQuery) + "*" => 12, 0) +
    select(defined($searchQuery) && lower(synonyms[]) match "*" + lower($searchQuery) + "*" => 18, 0) +
    select(defined($searchQuery) && lower(summary) match "*" + lower($searchQuery) + "*" => 10, 0) +
    
    /* Intent boost */
    select(
      count(coalesce($intentTerms, [])) > 0 && 
      count(coalesce($intentTerms, [])[lower(^.title) match "*" + lower(@) + "*"]) > 0 
      => 16, 0
    ) +
    select(
      count(coalesce($intentTerms, [])) > 0 && 
      count(coalesce($intentTerms, [])[lower(^.description) match "*" + lower(@) + "*"]) > 0 
      => 24, 0
    ) +
    select(
      count(coalesce($intentTerms, [])) > 0 && 
      count(coalesce($intentTerms, [])[lower(^.category->title) match "*" + lower(@) + "*"]) > 0 
      => 20, 0
    ) +
    select(
      count(coalesce($intentTerms, [])) > 0 && 
      count(coalesce($intentTerms, [])[lower(^.synonyms[]) match "*" + lower(@) + "*"]) > 0 
      => 22, 0
    ) +
    select(
      count(coalesce($intentTerms, [])) > 0 && 
      count(coalesce($intentTerms, [])[lower(^.features[].feature->title) match "*" + lower(@) + "*"]) > 0 
      => 18, 0
    )
  ),

  /* ---------------- RANKING SCORE ---------------- */
  "rankingScore": (
    /* Lower is better */
    (coalesce(badges[].priority | order(@ asc)[0], 999) * 0.1) +
    (-1 * relevanceScore)
  ),

  /* ---------------- WHY MATCHED ---------------- */
  "whyMatched": array::compact([
    select(defined($searchQuery) && lower(title) == lower($searchQuery) => "Title (Exact)"),
    select(defined($searchQuery) && lower(slug.current) == lower($searchQuery) => "Slug (Exact)"),
    select(defined($searchQuery) && lower(title) match "*" + lower($searchQuery) + "*" => "Title"),
    select(defined($searchQuery) && lower(description) match "*" + lower($searchQuery) + "*" => "Description"),
    select(defined($searchQuery) && lower(category->title) match "*" + lower($searchQuery) + "*" => "Category"),
    select(defined($searchQuery) && lower(synonyms[]) match "*" + lower($searchQuery) + "*" => "Synonym"),
    select(defined($searchQuery) && lower(summary) match "*" + lower($searchQuery) + "*" => "Summary"),
    select(
      count(coalesce($intentTerms, [])) > 0 && 
      count(coalesce($intentTerms, [])[lower(^.title) match "*" + lower(@) + "*"]) > 0 
      => "Intent: Title"
    ),
    select(
      count(coalesce($intentTerms, [])) > 0 && 
      count(coalesce($intentTerms, [])[lower(^.description) match "*" + lower(@) + "*"]) > 0 
      => "Intent: Description"
    ),
    select(
      count(coalesce($intentTerms, [])) > 0 && 
      count(coalesce($intentTerms, [])[lower(^.category->title) match "*" + lower(@) + "*"]) > 0 
      => "Intent: Category"
    )
  ]),

  /* ---------------- GROUPING ---------------- */
  "resultGroup": select(
    _type == "directoryListing" && listingType == "software" => "Software",
    _type == "directoryListing" && listingType == "service" => "Services",
    _type == "blog" => "Resource Guides",
    "Other"
  ),

  "logoUrl": select(
    defined(logo.asset->url) => logo.asset->url,
    defined(heroImage.asset->url) => heroImage.asset->url
  ),

  "heroImageUrl": heroImage.asset->url
}
| order(rankingScore asc)
`;

export const SEARCH_INTENT_NAV_QUERY = groq`
*[_type == "searchIntent" && showInNav == true]
| order(order asc) {
  _id,
  title,
  "slug": slug.current,
  order
}
`;

// ============================================================================
// BLOG QUERIES
// ============================================================================

export const FEATURED_BLOGS_QUERY = groq`
*[_type == "blog" && isFeatured == true]
| order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  summary,
  publishedAt,
  heroImage,
  categories[]->{ _id, title },
  tags,
  featuredLabel
}
`;

export const morePostsQuery = groq`
*[_type == "blog"]
| order(publishedAt desc) [$skip...$limit] {
  _id,
  title,
  "slug": slug.current,
  excerpt: summary,
  date: publishedAt,
  author->{
    firstName: name,
    lastName: "",
    image
  }
}
`;

export const allPostsQuery = groq`
*[_type == "blog"]
| order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  excerpt: summary,
  date: publishedAt,
  author->{
    firstName: name,
    lastName: "",
    image
  }
}
`;