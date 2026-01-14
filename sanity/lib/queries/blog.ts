import { groq } from 'next-sanity';

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
