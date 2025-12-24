import { client } from './client';
import { groq } from 'next-sanity';

interface SanityFetchOptions {
  query: string;
  params?: Record<string, any>;
  tags?: string[];
}

/**
 * Wrapper around Sanity client fetch for live preview support
 * This function can be extended to support draft/preview modes in the future
 */
export async function sanityFetch<T = any>({
  query,
  params = {},
  tags = [],
}: SanityFetchOptions): Promise<{ data: T }> {
  try {
    const data = await client.fetch<T>(groq`${query}`, params, {
      next: {
        revalidate: 60, // Revalidate every 60 seconds
        tags,
      },
    });

    return { data };
  } catch (error) {
    console.error('Sanity fetch error:', error);
    return { data: [] as T };
  }
}
