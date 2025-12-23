// sanity/lib/software.ts
import { client } from './client';
import { productsAsSoftwareQuery } from './queries';
import type { Software } from '../../lib/types';

export async function getSoftwareFromSanity(): Promise<Software[]> {
  const data = await client.fetch<Software[] | null>(productsAsSoftwareQuery);
  return Array.isArray(data) ? data : [];
}
