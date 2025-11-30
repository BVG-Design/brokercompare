// /sanity/lib/client.ts
import { createClient } from 'next-sanity';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;

if (!projectId) {
  throw new Error(
    'Missing Sanity configuration: NEXT_PUBLIC_SANITY_PROJECT_ID is not set.'
  );
}

const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

export const client = createClient({
  projectId,
  dataset,
  apiVersion: '2025-10-01', // or a recent date
  useCdn: true, // faster, cache-enabled (safe for public data)
});
