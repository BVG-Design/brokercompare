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

export const UNIFIED_SEARCH_QUERY = groq`
*[_type in $contentTypes 
  && ($category == null || category->slug.current == $category || $category in categories[]->slug.current)
  && ($brokerType == null || $brokerType == brokerType || $brokerType in brokerType || $brokerType in brokerTypes)
  && ($listingType == null 
      || ($listingType == "software" && (_type == "product" || listingType == "software"))
      || ($listingType == "service" && (_type == "serviceProvider" || listingType == "service"))
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
  *[_type == "serviceProvider" && defined(slug.current)]{
    "id": slug.current
  }
`;