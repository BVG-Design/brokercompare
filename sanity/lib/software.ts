// sanity/lib/software.ts
import { client } from './client';
import { productsAsSoftwareQuery } from './queries';
import type { Software } from '../../src/lib/types';

export async function getSoftwareFromSanity(): Promise<Software[]> {
  const data = await client.fetch<Software[]>(productsAsSoftwareQuery);
  return data;
}
