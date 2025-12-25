import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, ExternalLink, Filter, RefreshCcw, Star } from 'lucide-react';
import { notFound } from 'next/navigation';
import ComparisonMatrix from '@/components/product-page/ComparisonMatrix';
import { buildDirectoryPageData } from '../comparisonData';
import { Button } from '@/components/ui/button';
import StillNotSure from '@/components/product-page/StillNotSure';

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

  const { comparisonProducts, featureGroups, listing } = pageData;

  const getTopFeatures = (slug: string) => {
    const rows: string[] = [];
    featureGroups.forEach(group => {
      group.features.forEach(feature => {
        const availability = feature.availability[slug];
        if ((availability === 'yes' || availability === 'partial') && rows.length < 3) {
          rows.push(feature.title);
        }
      });
    });
    return rows;
  };

  const renderStars = (value?: number | null) => {
    const rating = value || 0;
    return (
      <div className="flex items-center gap-2 justify-center">
        <div className="flex text-orange-400 gap-0.5">
          {[1, 2, 3, 4, 5].map(i => (
            <Star
              key={i}
              size={14}
              className={i <= Math.round(rating) ? 'fill-orange-400 text-orange-400' : 'text-gray-300'}
            />
          ))}
        </div>
        <span className="text-sm font-bold text-gray-900">{rating.toFixed(1)} <span className="text-xs font-normal text-gray-500">/ 5</span></span>
      </div>
    );
  };

  const withUtm = (url?: string | null) => {
    if (!url) return null;
    try {
      const target = new URL(url.startsWith('http') ? url : `https://${url}`);
      target.searchParams.set('utm_source', 'BrokerTools');
      target.searchParams.set('utm_medium', 'comparison');
      return target.toString();
    } catch {
      return url;
    }
  };

  const visitCta = (url?: string | null) => {
    const href = withUtm(url);
    return (
      <Button
        asChild
        className="bg-[#F45E24] hover:bg-[#e45621] text-white text-sm px-5 py-2.5 rounded-lg shadow-sm font-semibold flex items-center gap-2"
        disabled={!href}
      >
        <a href={href || '#'} target="_blank" rel="noreferrer">
          Visit Website <ExternalLink size={14} />
        </a>
      </Button>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-10">
      <div className="max-w-6xl mx-auto px-4 space-y-10">
        {/* Config Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <Link
            href={`/directory/${slug}`}
            className="text-gray-600 hover:text-gray-900 flex items-center gap-2 text-sm font-medium"
          >
            <ArrowLeft size={16} /> Back to {listing.name} Review
          </Link>
          <div className="flex items-center gap-3 flex-wrap justify-center">
            {comparisonProducts.map((p) => (
              <div
                key={p.slug}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium ${p.isCurrent ? 'border-gray-900 text-gray-900' : 'border-gray-200 text-gray-700'} bg-white`}
              >
                <div className={`w-8 h-8 rounded-md flex items-center justify-center font-bold text-xs ${p.logoUrl ? 'bg-white' : 'bg-gray-900 text-white'}`}>
                  {p.logoUrl ? (
                    <img src={p.logoUrl} alt={p.name} className="w-8 h-8 object-contain rounded" />
                  ) : (
                    p.name.charAt(0)
                  )}
                </div>
                <span>{p.name}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-2 text-gray-400">
            <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors"><Filter size={18} /></button>
            <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors"><RefreshCcw size={18} /></button>
          </div>
        </div>

        {/* Overview */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-purple-100 text-purple-600 flex items-center justify-center">🎁</span>
            <h2 className="text-lg font-bold text-gray-900">Overview</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="p-4 w-1/4"></th>
                  {comparisonProducts.map((p) => (
                    <th key={p.slug} className="p-4 align-top w-1/4">
                      <div className="flex flex-col items-center gap-2">
                        {p.logoUrl ? (
                          <img src={p.logoUrl} alt={p.name} className="w-10 h-10 rounded shadow-sm object-contain" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-900 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                            {p.name.charAt(0)}
                          </div>
                        )}
                        <span className="font-bold text-gray-900 text-base">{p.name}</span>
                        {p.isCurrent && <span className="text-[10px] bg-gray-900 text-white px-2 py-0.5 rounded-full">Your Selection</span>}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="p-4 text-sm font-medium text-gray-600 bg-gray-50/30">Ratings</td>
                  {comparisonProducts.map((p) => (
                    <td key={p.slug} className="p-4 text-center">
                      {renderStars(p.rating)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 text-sm font-medium text-gray-600 bg-gray-50/30">Top Features</td>
                  {comparisonProducts.map((p) => {
                    const features = getTopFeatures(p.slug);
                    return (
                      <td key={p.slug} className="p-4">
                        <div className="flex flex-col gap-2 items-center">
                          {features.length === 0 && (
                            <span className="text-xs text-gray-400">No feature data yet</span>
                          )}
                          {features.map((f) => (
                            <div key={f} className="flex items-center gap-1.5 text-xs text-gray-700 bg-gray-50 px-2 py-1 rounded border border-gray-100 w-full justify-center">
                              <Check size={12} className="text-green-500" /> {f}
                            </div>
                          ))}
                        </div>
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="p-4 text-sm font-medium text-gray-600 bg-gray-50/30">Pricing (Entry)</td>
                  {comparisonProducts.map((p) => (
                    <td key={p.slug} className="p-4 text-center text-sm font-semibold text-gray-900">
                      {p.priceText || 'Contact sales'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 text-sm font-medium text-gray-600 bg-gray-50/30">Alternatives</td>
                  {comparisonProducts.map((p) => (
                    <td key={p.slug} className="p-4 text-center">
                      {p.alternativesCount ? (
                        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                          View {p.alternativesCount} Alternatives
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">No data</span>
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
              <tfoot className="bg-gray-50/60">
                <tr>
                  <td className="p-4"></td>
                  {comparisonProducts.map((p) => (
                    <td key={p.slug} className="p-4 text-center">
                      {visitCta(p.websiteUrl || listing.websiteUrl)}
                    </td>
                  ))}
                </tr>
              </tfoot>
            </table>
          </div>
        </section>

        {/* Integrations */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-blue-100 text-blue-600 flex items-center justify-center">
              <ArrowRight size={16} className="rotate-180" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Integrates With</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {comparisonProducts.map((p) => (
              <div key={p.slug} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 text-center">
                  {p.name} Integrations
                </h4>
                <div className="flex flex-wrap justify-center gap-3">
                  {p.worksWith?.length ? p.worksWith.map((integration) => {
                    const href = integration.slug ? `/directory/${integration.slug}` : '#';
                    return (
                      <Link
                        key={integration.slug || integration.title}
                        href={href}
                        className="w-10 h-10 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center p-2 hover:shadow-md hover:border-gray-300 transition-all"
                        title={integration.title}
                      >
                        {integration.logoUrl ? (
                          <img src={integration.logoUrl} alt={integration.title} className="w-6 h-6 object-contain" />
                        ) : (
                          <span className="text-xs font-semibold text-gray-700">
                            {integration.title?.charAt(0)}
                          </span>
                        )}
                      </Link>
                    );
                  }) : (
                    <span className="text-xs text-gray-400">No integrations listed</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Service Areas */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-green-100 text-green-600 flex items-center justify-center">
              <ArrowRight size={16} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Service Areas</h3>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-100">
              <div className="p-4 bg-gray-50/50 flex items-center text-sm font-medium text-gray-600">
                Best suited for...
              </div>
              {comparisonProducts.map((p) => (
                <div key={p.slug} className="p-6">
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    {p.serviceAreas?.length ? p.serviceAreas.map((area) => (
                      <span key={area} className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded border border-gray-200 font-medium">
                        {area}
                      </span>
                    )) : (
                      <span className="text-xs text-gray-400">No data</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Detailed matrix with scoring badges */}
        <ComparisonMatrix
          products={comparisonProducts}
          featureGroups={featureGroups}
        />

        <div className="max-w-5xl mx-auto">
          <StillNotSure />
        </div>
      </div>
    </div>
  );
}
