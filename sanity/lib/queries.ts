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
*[_type in $contentTypes 
  && ($category == null || category->slug.current == $category || $category in categories[]->slug.current)
  && ($brokerType == null || $brokerType == brokerType || $brokerType in brokerType || $brokerType in brokerTypes || brokerType[] match $brokerType + "*" || brokerType match $brokerType + "*")
  && ($listingType == null 
      || ($listingType == "software" && (_type == "product" || listingType == "software" || listingType->value == "software" || listingType->title == "software"))
      || ($listingType == "service" && (_type == "serviceProvider" || listingType == "service" || listingType->value == "service" || listingType->title == "service"))
      || ($listingType == "resourceGuide" && _type == "blog")
     )
  && (
  count($searchTerms[
    ^.title match @ ||
    ^.name match @ ||
    ^.description match @ ||
    ^.tagline match @ ||
    ^.slug.current match @ ||
    ^.category->title match @ ||
    ^.categories[]->title match @
  ]) > 0
)] | order(defined(tags) desc, defined(brokerType) desc, _updatedAt desc) {
  _id,
  _type,
  title,
  name,
  description,
  tags,
  brokerType,
  "slug": slug.current,
  "category": coalesce(category->title, categories[0]->title, "Uncategorized"),
  "listingType": select(
    _type == "product" => "software",
    _type == "serviceProvider" => "service",
    _type == "blog" => "resourceGuide",
    coalesce(listingType->value, listingType->title, listingType)
  ),
  "badges": badges[]->title,
  "logoUrl": select(
    defined(logo.asset->url) => logo.asset->url,
    defined(images[@.isLogo == true][0].asset->url) => images[@.isLogo == true][0].asset->url,
    defined(images[0].asset->url) => images[0].asset->url,
    defined(mainImage.asset->url) => mainImage.asset->url,
    defined(heroImage.asset->url) => heroImage.asset->url
  ),
  "heroImageUrl": heroImage.asset->url,
  "features": select(
    _type == "directoryListing" => features[availability == "yes"].feature->title,
    features
  ),
  "rating": coalesce(rating, 0),
  "reviews": count(*[_type == "review" && references(^._id)])
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

export const SERVICE_BY_ID_QUERY = groq`
  *[_type == "serviceProvider" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    description,
    tagline,
    "logoUrl": logo.asset->url,
    "images": images[].asset->url,
    website,
    "category": category->title,
    location,
    features,
    reviews
  }
`;

export const SERVICES_SLUGS_QUERY = groq`
    "id": slug.current
  }
`;

export const SEARCH_INTENT_BY_SLUG_QUERY = groq`
  *[_type == "searchIntent" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    synonyms,
    exampleQueries,
    description
  }
`;