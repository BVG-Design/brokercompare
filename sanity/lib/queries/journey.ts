import { groq } from 'next-sanity';

export const JOURNEY_STAGES_QUERY = groq`
  *[_type == "journeyStage"] | order(position asc) {
    "id": _id,
    title,
    "slug": slug.current,
    position,
    description
  }
`;
