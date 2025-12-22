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


export const FEATURED_BLOGS_QUERY = groq`
  *[_type == "blog"] | order(publishedAt desc)[0...3] {
    _id,
    title,
    slug,
    publishedAt,
    summary,
    "imageUrl": heroImage.asset->url,
    "author": author->name,
    "categories": categories[]->title
  }
`;

export const SEARCH_INTENT_NAV_QUERY = groq`
  *[_type == "searchIntent" && showInNav == true] | order(order asc) {
    _id,
    "title": coalesce(title, name),
    "slug": slug.current,
    order
  }
`;

