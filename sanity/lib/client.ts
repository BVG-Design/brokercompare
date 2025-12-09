import { createClient } from 'next-sanity';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

export const sanityConfigured = Boolean(projectId);

type SanityClient = ReturnType<typeof createClient>;

export const client: Pick<SanityClient, 'fetch'> = sanityConfigured
  ? createClient({
    projectId: projectId as string,
    dataset,
    apiVersion: '2025-10-01',
    useCdn: true,
  })
  : {
    fetch: async (query: string, params?: Record<string, any>) => {
      console.warn(
        'Sanity client disabled: NEXT_PUBLIC_SANITY_PROJECT_ID is not set. Returning empty results.'
      );
      return [];
    },
  } as unknown as Pick<SanityClient, 'fetch'>;
