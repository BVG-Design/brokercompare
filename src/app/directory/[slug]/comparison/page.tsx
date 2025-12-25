import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';
import ComparisonMatrix from '@/components/product-page/ComparisonMatrix';
import { buildDirectoryPageData } from '../comparisonData';

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

  return (
    <div className="min-h-screen bg-gray-50/50 py-10">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase text-gray-500 tracking-wide">
              Detailed Comparison
            </p>
            <h1 className="text-2xl font-bold text-gray-900 mt-1">
              Compare {pageData.listing.name} vs alternatives
            </h1>
            <p className="text-sm text-gray-500">
              Feature-level breakdown sourced from Sanity directory listings.
            </p>
          </div>
          <Link
            href={`/directory/${slug}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            <ArrowLeft size={16} />
            Back to profile
          </Link>
        </div>

        <ComparisonMatrix
          products={pageData.comparisonProducts}
          featureGroups={pageData.featureGroups}
        />
      </div>
    </div>
  );
}
