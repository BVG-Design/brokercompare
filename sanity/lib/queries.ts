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

  // Expose raw pricing notes + tags
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

export const UNIFIED_SEARCH_QUERY = groq`
*[
  _type in $contentTypes &&
  count(
    array::concat($searchTerms, $intentTerms)[
      ^.title match @ ||
      ^.name match @ ||
      ^.description match @ ||
      ^.tagline match @ ||
      ^.slug.current match @ ||
      ^.category->title match @ ||
      ^.categories[]->title match @ ||
      ^.serviceAreas[]->title match @ ||
      ^.brokerType[] match @ ||
      ^.listingType match @ ||
      ^.badges[]->title match @ ||
      ^.features[]->title match @ ||
      ^.features[].title match @ ||
      ^.featureCategory->title match @ ||
      ^.worksWith[]->name match @ ||
      ^.worksWith[]->title match @ ||
      ^.integrations[]->name match @ ||
      ^.synonyms[] match @
    ]
  ) > 0
]{
  _id,
  _type,
  title,
  name,
  description,
  tagline,
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

  "relevanceScore": (
    select(title match $searchQuery => 1, 0) +
    select(name match $searchQuery => 1, 0) +
    select(description match $searchQuery => 3, 0) +
    select(tagline match $searchQuery => 3, 0) +
    select(category->title match $searchQuery => 4, 0) +
    select(categories[]->title match $searchQuery => 4, 0) +
    select(serviceAreas[]->title match $searchQuery => 2, 0) +
    select(brokerType[] match $searchQuery => 3, 0) +
    select(listingType match $searchQuery => 3, 0) +
    select(badges[]->title match $searchQuery => 2, 0) +
    select(features[]->title match $searchQuery => 2, 0) +
    select(features[].title match $searchQuery => 2, 0) +
    select(worksWith[]->name match $searchQuery => 1, 0) +
    select(worksWith[]->title match $searchQuery => 1, 0) +
    select(synonyms[] match $searchQuery => 2, 0) +

    select(title match $intentTerms => 6, 0) +
    select(description match $intentTerms => 8, 0) +
    select(category->title match $intentTerms => 6, 0) +
    select(categories[]->title match $intentTerms => 6, 0) +
    select(serviceAreas[]->title match $intentTerms => 5, 0) +
    select(brokerType[] match $intentTerms => 4, 0) +
    select(listingType match $intentTerms => 4, 0) +
    select(badges[]->title match $intentTerms => 3, 0) +
    select(features[]->title match $intentTerms => 5, 0) +
    select(worksWith[]->name match $intentTerms => 3, 0) +
    select(worksWith[]->title match $intentTerms => 3, 0) +
    select(synonyms[] match $intentTerms => 4, 0)
  ),

  "rankingScore": (
    coalesce(badges[].priority | order(@ asc)[0], 999) * 10 +
    (
      select(title match $searchQuery => 1, 0) +
      select(name match $searchQuery => 1, 0) +
      select(description match $searchQuery => 3, 0) +
      select(tagline match $searchQuery => 3, 0) +
      select(category->title match $searchQuery => 4, 0) +
      select(categories[]->title match $searchQuery => 4, 0) +
      select(serviceAreas[]->title match $searchQuery => 2, 0) +
      select(brokerType[] match $searchQuery => 3, 0) +
      select(listingType match $searchQuery => 3, 0) +
      select(badges[]->title match $searchQuery => 2, 0) +
      select(features[]->title match $searchQuery => 2, 0) +
      select(features[].title match $searchQuery => 2, 0) +
      select(worksWith[]->name match $searchQuery => 1, 0) +
      select(worksWith[]->title match $searchQuery => 1, 0) +
      select(synonyms[] match $searchQuery => 2, 0) +

      select(title match $intentTerms => 6, 0) +
      select(description match $intentTerms => 8, 0) +
      select(category->title match $intentTerms => 6, 0) +
      select(categories[]->title match $intentTerms => 6, 0) +
      select(serviceAreas[]->title match $intentTerms => 5, 0) +
      select(brokerType[] match $intentTerms => 4, 0) +
      select(listingType match $intentTerms => 4, 0) +
      select(badges[]->title match $intentTerms => 3, 0) +
      select(features[]->title match $intentTerms => 5, 0) +
      select(worksWith[]->name match $intentTerms => 3, 0) +
      select(worksWith[]->title match $intentTerms => 3, 0) +
      select(synonyms[] match $intentTerms => 4, 0)
    )
  ),

  "whyMatched": [
    select(title match $searchQuery => "Title (Exact)"),
    select(description match $searchQuery => "Description (Exact)"),
    select(category->title match $searchQuery => "Category (Exact)"),
    select(categories[]->title match $searchQuery => "Category (Exact)"),
    select(serviceAreas[]->title match $searchQuery => "Service Area (Exact)"),
    select(brokerType[] match $searchQuery => "Broker Type (Exact)"),
    select(listingType match $searchQuery => "Listing Type (Exact)"),
    select(badges[]->title match $searchQuery => "Badge (Exact)"),
    select(features[]->title match $searchQuery => "Feature (Exact)"),
    select(worksWith[]->name match $searchQuery => "Works With (Exact)"),
    select(worksWith[]->title match $searchQuery => "Works With (Exact)"),
    select(synonyms[] match $searchQuery => "Synonym (Exact)"),

    select(title match $intentTerms => "Title (Intent)"),
    select(description match $intentTerms => "Description (Intent)"),
    select(category->title match $intentTerms => "Category (Intent)"),
    select(categories[]->title match $intentTerms => "Category (Intent)"),
    select(serviceAreas[]->title match $intentTerms => "Service Area (Intent)"),
    select(brokerType[] match $intentTerms => "Broker Type (Intent)"),
    select(listingType match $intentTerms => "Listing Type (Intent)"),
    select(badges[]->title match $intentTerms => "Badge (Intent)"),
    select(features[]->title match $intentTerms => "Feature (Intent)"),
    select(worksWith[]->name match $intentTerms => "Works With (Intent)"),
    select(worksWith[]->title match $intentTerms => "Works With (Intent)"),
    select(synonyms[] match $intentTerms => "Synonym (Intent)")
  ],

  "resultGroup": select(
    _type == "product" => "Software",
    _type == "serviceProvider" => "Services",
    _type == "directoryListing" => "Tools",
    _type == "blog" => "Resource Guides",
    "Other"
  ),

  "logoUrl": select(
    defined(logo.asset->url) => logo.asset->url,
    defined(images[@.isLogo == true][0].asset->url) => images[@.isLogo == true][0].asset->url,
    defined(images[0].asset->url) => images[0].asset->url
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

export const FEATURED_BLOGS_QUERY = groq`
*[_type == "blog" && isFeatured == true] | order(publishedAt desc) {
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
*[_type == "blog"] | order(publishedAt desc) [$skip...$limit] {
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
*[_type == "blog"] | order(publishedAt desc) {
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

