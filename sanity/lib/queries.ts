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

export const JOURNEY_STAGES_QUERY = groq`
  *[_type == "journeyStage"] | order(position asc) {
    "id": _id,
    title,
    "slug": slug.current,
    position,
    description
  }
`;

export const DIRECTORY_LISTINGS_MATRIX_QUERY = groq`
  *[_type == "directoryListing" && defined(journeyStage)] {
    _id,
    _type,
    title,
    "slug": slug.current,
    "journeyStageId": journeyStage._ref,
    journeyAssociations,
    "logo": logo.asset->url,
    tagline,
    rating,
    pricing,
    features,
    badges[]->{ _id, title }
  }
`;

export const BLOG_POSTS_MATRIX_QUERY = groq`
  *[_type == "blog" && defined(journeyStages)] {
    _id,
    _type,
    title,
    "slug": slug.current,
    "journeyStageIds": journeyStages[]._ref,
    journeyAssociations,
    "logo": heroImage.asset->url,
    "summary": summary,
    publishedAt,
    readTime
  }
`;

export const GUIDES_MATRIX_QUERY = groq`
  *[_type == "guide" && defined(journeyStage)] {
    _id,
    _type,
    title,
    "slug": slug.current,
    "journeyStageId": journeyStage._ref,
    journeyAssociations,
    "summary": summary,
    relatedLinks
  }
`;

export const UNIFIED_SEARCH_QUERY = groq`
*[_type in $contentTypes && (
  count($searchTerms[
    ^.title match @ ||
    ^.name match @ ||
    ^.description match @ ||
    ^.tagline match @ ||
    ^.slug.current match @ ||
    ^.category->title match @ ||
    ^.categories[]->title match @
  ]) > 0
)]{
  _id,
  _type,
  title,
  name,
  description,
  "slug": slug.current,
  "category": coalesce(category->title, categories[0]->title, "Uncategorized"),
  "logoUrl": select(
    defined(logo.asset->url) => logo.asset->url,
    defined(images[@.isLogo == true][0].asset->url) => images[@.isLogo == true][0].asset->url,
    defined(images[0].asset->url) => images[0].asset->url
  ),
  "heroImageUrl": heroImage.asset->url
}
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