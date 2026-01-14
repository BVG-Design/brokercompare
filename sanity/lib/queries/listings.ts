import { groq } from 'next-sanity';

export const productsAsSoftwareQuery = groq`
*[_type == "product"]{
  "id": _id,
  "slug": slug.current, 
  name,
  websiteUrl,
  "category": coalesce(categories[0]->title, "Uncategorized"),
  "logoUrl": select(
    defined(logo.asset->url) => logo.asset->url,
    defined(organisation->logo.asset->url) => organisation->logo.asset->url,
    defined(images[@.isLogo == true][0].asset->url) => images[@.isLogo == true][0].asset->url,
    defined(images[0].asset->url) => images[0].asset->url,
    defined(mainImage.asset->url) => mainImage.asset->url,
    defined(heroImage.asset->url) => heroImage.asset->url
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

export const DIRECTORY_LISTINGS_MATRIX_QUERY = groq`
  *[_type == "directoryListing" && defined(journeyStage)] {
    _id,
    _type,
    title,
    "slug": slug.current,
    "journeyStageId": journeyStage._ref,
    journeyAssociations,
    "logo": select(
      defined(logo.asset->url) => logo.asset->url,
      defined(organisation->logo.asset->url) => organisation->logo.asset->url,
      defined(images[@.isLogo == true][0].asset->url) => images[@.isLogo == true][0].asset->url,
      defined(images[0].asset->url) => images[0].asset->url,
      defined(mainImage.asset->url) => mainImage.asset->url,
      defined(heroImage.asset->url) => heroImage.asset->url
    ),
    tagline,
    rating,
    pricing,
    features,
    badges[]->{ _id, title }
  }
`;

export const SERVICE_BY_ID_QUERY = groq`
  *[_type == "serviceProvider" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    description,
    tagline,
    "logoUrl": select(
      defined(logo.asset->url) => logo.asset->url,
      defined(organisation->logo.asset->url) => organisation->logo.asset->url,
      defined(images[@.isLogo == true][0].asset->url) => images[@.isLogo == true][0].asset->url,
      defined(images[0].asset->url) => images[0].asset->url,
      defined(mainImage.asset->url) => mainImage.asset->url,
      defined(heroImage.asset->url) => heroImage.asset->url
    ),
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
