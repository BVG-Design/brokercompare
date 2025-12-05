import { groq } from "next-sanity";

export const SERVICES_QUERY = groq`*[_type == "serviceProvider"] {
  "id": slug.current,
  name,
  category,
  "logoUrl": images[0].asset->url,
  "images": images[].asset->url,
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
  reviews[] {
    author,
    "avatarUrl": avatar.asset->url,
    rating,
    comment,
    date,
    verified
  }
}`;

export const SERVICE_BY_ID_QUERY = groq`*[_type == "serviceProvider" && slug.current == $slug][0] {
  "id": slug.current,
  name,
  category,
  "logoUrl": images[0].asset->url,
  "images": images[].asset->url,
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
  reviews[] {
    author,
    "avatarUrl": avatar.asset->url,
    rating,
    comment,
    date,
    verified
  }
}`;

export const SERVICES_SLUGS_QUERY = groq`*[_type == "serviceProvider"] {
  "id": slug.current
}`;
