import type { Software } from '@/lib/types';
import { getSoftwareFromSanity } from '../../../sanity/lib/software';
import SoftwarePageClient from './SoftwarePageClient';

export default async function SoftwarePage() {
  const software: Software[] = await getSoftwareFromSanity();

  return <SoftwarePageClient software={software} />;
}
