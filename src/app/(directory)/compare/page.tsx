import React from 'react';
import { fetchDirectoryListings, fetchDirectoryListingsMatrix } from '@/services/sanity';
import ComparisonTool from '@/components/compare/ComparisonTool';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Compare Brokers | Broker Compare',
  description: 'Compare top brokers and tools side-by-side to find the best fit for your business.',
};

export default async function ComparePage() {
  const [listings, featureGroups] = await Promise.all([
    fetchDirectoryListings({}),
    fetchDirectoryListingsMatrix() // This fetches the feature matrix data
  ]);

  // Transform featureGroups if necessary to match ComparisonFeatureGroup type
  // Assuming fetchDirectoryListingsMatrix returns data compliant with the type expectation or close to it.

  return (
    <ComparisonTool
      listings={listings}
      featureGroups={featureGroups as any} // Cast if types aren't perfectly aligned yet
    />
  );
}
