import React from 'react';
import { notFound } from 'next/navigation';
import { buildDirectoryPageData } from '../comparisonData';
import DetailedComparisonClient from '@/components/product-page/DetailedComparisonClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function DirectoryComparisonPage(props: PageProps) {
  const params = await props.params;
  const { slug } = params;

  const pageData = await buildDirectoryPageData(slug);

  if (!pageData) {
    notFound();
  }

  const { comparisonProducts, featureGroups, listing, summaryProducts, allDirectoryProducts, suggestedProducts } = pageData;
  const selectionFromSummary = (summaryProducts || []).map((p) => p.slug).slice(0, 3);
  const fallbackSelection = comparisonProducts.slice(0, 3).map((p) => p.slug);
  const initialSelection = selectionFromSummary.length ? selectionFromSummary : fallbackSelection;

  return (
    <div className="min-h-screen bg-gray-50/50 py-10">
      <div className="max-w-6xl mx-auto px-4 space-y-10">
        <DetailedComparisonClient
          listingSlug={slug}
          listingName={listing.name}
          listingCategory={listing.category}
          listingWebsite={listing.websiteUrl}
          allProducts={[...comparisonProducts, ...allDirectoryProducts]}
          suggestedProducts={suggestedProducts}
          featureGroups={featureGroups}
          initialSelection={initialSelection}
        />
      </div>
    </div>
  );
}
