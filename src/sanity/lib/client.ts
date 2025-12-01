// /sanity/lib/client.ts
import { createClient } from 'next-sanity';

const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  // Fallback to the studio config so Netlify deploys don't silently disable Sanity when env vars are missing
  'vrf26tjl';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

export const sanityConfigured = Boolean(projectId && dataset);

// Debug helper (leave commented for production builds)
// console.log('Sanity client init', {
//   sanityConfigured,
//   projectId,
//   dataset,
// });

type SanityClient = ReturnType<typeof createClient>;

export const client: Pick<SanityClient, 'fetch'> = sanityConfigured
  ? createClient({
      projectId: projectId as string,
      dataset,
      apiVersion: '2025-10-01', // or a recent date
      useCdn: true, // faster, cache-enabled (safe for public data)
    })
  : {
      fetch: async () => {
        console.warn(
          'Sanity client disabled: NEXT_PUBLIC_SANITY_PROJECT_ID is not set. Returning empty results.'
        );
        return null;
      },
    };
