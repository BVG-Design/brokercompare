// sanity/lib/queries.ts
import { groq } from 'next-sanity';

export const productsAsSoftwareQuery = groq`
*[_type == "product"]{
  "id": _id,
  "slug": slug.current, 
  name,
  websiteUrl,
  "category": coalesce(categories[0]->title, "Uncategorized"),
  "logoUrl": coalesce(
    images[@.isLogo == true][0].asset->url,
    images[0].asset->url
  ),
  "tagline": description,
  description,

  // Existing human-readable pricing string
  "pricing": select(
    defined(pricing.startingFrom) => "Starts at $" + string(pricing.startingFrom),
    pricing.type == "free" => "Free",
    defined(pricing.notes) => pricing.notes,
    "Pricing available on request"
  ),

  // 🔹 New: expose raw pricing notes + tags
  "pricingNotes": pricing.notes,
  tags,

  features,
  "compatibility": integrations[]->name,

  "rating": {
    "average": rating.average,
    "reviewCount": rating.reviewCount
  },
  "reviews": []
}
`;

export const searchResultsQuery = groq`
*[_type in ["blog", "product", "serviceProvider", "software"] && (
  title match $term ||
  name match $term ||
  summary match $term ||
  description match $term
)]{
  _id,
  _type,
  "title": coalesce(title, name),
  "summary": coalesce(summary, description),
  "slug": slug.current,
  "imageUrl": coalesce(
    heroImage.asset->url,
    logo.asset->url,
    images[0].asset->url
  )
}
`;
