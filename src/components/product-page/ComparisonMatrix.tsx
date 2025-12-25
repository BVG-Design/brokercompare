import React from 'react';
import { Check, Minus, Star, X } from 'lucide-react';
import {
  ComparisonFeatureGroup,
  ComparisonProduct,
  FeatureAvailability
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

const ComparisonMatrix: React.FC<ComparisonMatrixProps> = ({ products, featureGroups }) => {
  if (!featureGroups.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 text-sm text-gray-600">
        No comparison data available yet.
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
                {group.features.map((feature) => (
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
