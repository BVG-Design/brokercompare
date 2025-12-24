import { createClient } from 'next-sanity';

// Trim env values to avoid accidental whitespace in .env files
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim();
const dataset = (process.env.NEXT_PUBLIC_SANITY_DATASET || 'production').trim();

export const sanityConfigured = Boolean(projectId);

type SanityClient = ReturnType<typeof createClient>;

export const client: Pick<SanityClient, 'fetch'> = sanityConfigured
  ? createClient({
      projectId: projectId as string,
      dataset,
      apiVersion: '2023-10-01', // must not be in the future
      useCdn: true, // faster, cache-enabled (safe for public data)
    })
  : {
      fetch: async (
        query: string,
        _params?: Record<string, any>,
        _options?: Record<string, any>
      ) => {
        console.warn(
          'Sanity client disabled: NEXT_PUBLIC_SANITY_PROJECT_ID is not set. Returning empty results for query.',
          query
        );
        return [];
      },
    } as unknown as Pick<SanityClient, 'fetch'>;
