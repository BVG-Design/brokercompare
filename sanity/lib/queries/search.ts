import { groq } from 'next-sanity';

export const UNIFIED_SEARCH_QUERY = groq`
*[_type in $contentTypes 
  && ($category == null || category->slug.current == $category || $category in categories[]->slug.current)
  && ($brokerType == null || $brokerType == brokerType || $brokerType in brokerType || $brokerType in brokerTypes || brokerType[] match $brokerType + "*" || brokerType match $brokerType + "*")
  && ($listingType == null 
      || ($listingType == "software" && (_type == "product" || listingType == "software" || listingType->value == "software" || listingType->title == "software"))
      || ($listingType == "service" && (_type == "serviceProvider" || listingType == "service" || listingType->value == "service" || listingType->title == "service"))
      || ($listingType == "product" && (listingType == "product" || listingType->value == "product" || listingType->title == "product"))
      || ($listingType == "resourceGuide" && _type == "blog")
     )
  && (
    count($searchTerms) == 0 ||
    count($searchTerms[
    ^.title match @ ||
    ^.name match @ ||
    ^.description match @ ||
    ^.tagline match @ ||
    ^.slug.current match @ ||
    ^.category->title match @ ||
    ^.categories[]->title match @ ||
    ^.synonyms[] match @
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
  "badges": badges[]->{title, description},
  "logoUrl": select(
    defined(logo.asset->url) => logo.asset->url,
    defined(organisation->logo.asset->url) => organisation->logo.asset->url,
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
  "reviews": count(*[_type == "review" && references(^._id)]),
  "websiteUrl": coalesce(websiteURL, websiteUrl)
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
