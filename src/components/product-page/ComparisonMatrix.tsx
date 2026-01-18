import React from 'react';
import { Check, Minus, Star, X } from 'lucide-react';
import {
  ComparisonFeatureGroup,
  ComparisonProduct,
  FeatureAvailability,
  RubricCategoryScore
} from '@/types/comparison';

interface ComparisonMatrixProps {
  products: ComparisonProduct[];
  featureGroups: ComparisonFeatureGroup[];
}

const renderAvailability = (status: FeatureAvailability | undefined, score?: number) => {
  if (status === 'yes') {
    return (
      <div className="flex items-center justify-center gap-2">
        <Check size={18} className="text-green-500" strokeWidth={2.5} />
        {score !== undefined && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-700 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-full">
            <Star size={12} className="text-orange-400 fill-orange-400" />
            {score}/10
          </span>
        )}
      </div>
    );
  }

  if (status === 'partial') {
    return (
      <div className="inline-flex items-center gap-2 text-amber-500 text-xs font-medium">
        <Minus size={14} strokeWidth={2.25} />
        Partial
        {score !== undefined && (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
            {score}/10
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <X size={18} className="text-gray-300" />
      {score !== undefined && (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-500 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-full">
          {score}/10
        </span>
      )}
    </div>
  );
};

const getCategoryScore = (
  scores: RubricCategoryScore[] | undefined,
  categoryTitle: string
): number | null => {
  if (!scores?.length) return null;
  const match = scores.find((score) => score.title === categoryTitle);
  return match?.score ?? null;
};

const ComparisonMatrix: React.FC<ComparisonMatrixProps> = ({ products, featureGroups }) => {
  if (!featureGroups.length) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative min-h-[400px]">
        {/* Blurred Content Placeholder */}
        <div className="absolute inset-0 z-0 opacity-30 blur-sm pointer-events-none select-none overflow-hidden">
          <div className="p-8 space-y-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                <div className="grid grid-cols-4 gap-4">
                  <div className="h-24 bg-gray-100 rounded"></div>
                  <div className="h-24 bg-gray-100 rounded"></div>
                  <div className="h-24 bg-gray-100 rounded"></div>
                  <div className="h-24 bg-gray-100 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Overlay Content */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm p-8 text-center">
          <div className="max-w-md space-y-6">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
            </div>

            <h3 className="text-xl font-bold text-gray-900">
              {products.length > 0
                ? `${products.map(p => p.name).join(', ')} ${products.length === 1 ? 'is' : 'are'} under assessment`
                : 'Products are under assessment'
              }
            </h3>

            <p className="text-gray-500 font-medium leading-relaxed">
              Our team is currently reviewing the feature sets for these products. Join the waitlist to get notified when the detailed comparison is ready.
            </p>

            <button
              className="inline-flex items-center justify-center px-8 py-3 text-sm font-bold text-white transition-all bg-brand-blue rounded-md shadow-lg hover:bg-brand-blue/90 hover:shadow-brand-blue/20 active:scale-95 uppercase tracking-wider"
              onClick={() => alert('Added to waitlist!')}
            >
              Join Waitlist
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {featureGroups.map((group) => (
        <section key={group.title} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/70">
            <h3 className="text-sm font-semibold text-gray-900">{group.title}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="bg-white text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100">
                  <th className="px-4 py-3 text-left w-1/3">Feature</th>
                  {products.map((p) => (
                    <th key={p.slug} className="px-4 py-3 text-center w-auto">
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="bg-gray-50/70">
                  <td className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Category score
                  </td>
                  {products.map((p) => {
                    const score = getCategoryScore(p.rubricCategoryScores, group.title);
                    return (
                      <td key={p.slug} className="px-4 py-3 text-center">
                        {score !== null ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-700 bg-white border border-gray-200 px-2 py-0.5 rounded-full">
                            <Star size={12} className="text-orange-400 fill-orange-400" />
                            {score.toFixed(1)}/10
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">Not scored</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
                {(group.features || []).map((feature) => (
                  <tr key={feature.title}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-700">{feature.title}</td>
                    {products.map((p) => (
                      <td key={p.slug} className="px-4 py-3 text-center">
                        {renderAvailability(feature.availability[p.slug], feature.score)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
};

export default ComparisonMatrix;
