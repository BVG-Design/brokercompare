import { groq } from 'next-sanity';

// Query to get all service providers
export const SERVICES_QUERY = groq`
  *[_type == "serviceProvider"] | order(name asc) {
    "id": _id,
    "slug": slug.current,
    name,
    category,
    "logoUrl": logo.asset->url,
    tagline,
    description,
    location,
    website,
    features,
    pricingModel,
    pricingRange,
    serviceAreas,
    brokerTypes,
    badges,
    availability,
    "reviews": reviews[] {
      author,
      "avatarUrl": avatar.asset->url,
      rating,
      comment,
      date,
      verified
    }
  }
`;

// Query to get service slugs for static generation
export const SERVICES_SLUGS_QUERY = groq`
  *[_type == "serviceProvider"] {
    "id": slug.current
  }
`;

// Query to get a single service provider by slug
export const SERVICE_BY_ID_QUERY = groq`
  *[_type == "serviceProvider" && slug.current == $slug][0] {
    "id": _id,
    "slug": slug.current,
    name,
    category,
    "logoUrl": logo.asset->url,
    "images": [logo.asset->url],
    tagline,
    description,
    location,
    website,
    features,
    pricingModel,
    pricingRange,
    serviceAreas,
    brokerTypes,
    badges,
    availability,
    "reviews": reviews[] {
      author,
      "avatarUrl": avatar.asset->url,
      rating,
      comment,
      date,
      verified
    }
  }
`;

