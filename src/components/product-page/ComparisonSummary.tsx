import React from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Info, Minus, Star, X } from 'lucide-react';
import {
  ComparisonFeatureRow,
  ComparisonProduct,
  FeatureAvailability,
  RubricCategoryScore
} from '@/types/comparison';

interface ComparisonSummaryProps {
  products: ComparisonProduct[];
  features: ComparisonFeatureRow[];
  focusName?: string;
  comparisonHref: string;
}

const renderAvailability = (status: FeatureAvailability | undefined) => {
  if (status === 'yes') {
    return <Check size={18} className="mx-auto text-green-500" strokeWidth={2.5} />;
  }

  if (status === 'partial') {
    return <Minus size={18} className="mx-auto text-amber-400" strokeWidth={2.5} />;
  }

  return <X size={18} className="mx-auto text-gray-300" />;
};

const renderRubricScore = (score: number | null | undefined) => {
  if (typeof score === 'number') {
    return (
      <div className="flex items-center justify-center gap-1 text-sm font-bold text-gray-900">
        <Star size={14} className="text-orange-500 fill-orange-500" />
        {score.toFixed(1)}
      </div>
    );
  }

  return <span className="text-xs text-gray-400">Not scored</span>;
};

const collectRubricCategories = (products: ComparisonProduct[]): RubricCategoryScore[] => {
  const categories = new Map<string, RubricCategoryScore>();

  products.forEach((product) => {
    product.rubricCategoryScores?.forEach((score) => {
      const existing = categories.get(score.title);
      if (!existing || (score.order ?? 999) < (existing.order ?? 999)) {
        categories.set(score.title, score);
      }
    });
  });

  return Array.from(categories.values()).sort(
    (a, b) => (a.order ?? 999) - (b.order ?? 999) || a.title.localeCompare(b.title)
  );
};

const renderLogo = (product: ComparisonProduct) => {
  if (product.logoUrl) {
    return (
      <img
        src={product.logoUrl}
        alt={product.name}
        className="w-10 h-10 rounded-lg object-cover shadow-sm"
      />
    );
  }

  return (
    <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg mb-0 shadow-sm bg-gray-900 text-white">
      {product.name.charAt(0).toUpperCase()}
    </div>
  );
};

const ComparisonSummary: React.FC<ComparisonSummaryProps> = ({
  products,
  features,
  focusName,
  comparisonHref
}) => {
  if (!products.length) return null;

  const titleProduct = focusName || products.find((p) => p.isCurrent)?.name || products[0].name;
  const rubricCategories = collectRubricCategories(products);

  return (
    <div className="max-w-6xl mx-auto px-4 mb-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Compare Alternatives</h2>
          <p className="text-sm text-gray-500">
            See how {titleProduct} stacks up against the competition
          </p>
        </div>
        <Link
          href={comparisonHref}
          className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          More Comparisons <ArrowRight size={16} />
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr>
                <th className="p-4 text-left w-1/4">Features</th>
                {products.map((p) => (
                  <th key={p.slug} className="p-4 w-1/4 pb-6">
                    <div className="flex flex-col items-center gap-2">
                      {renderLogo(p)}
                      <span className="font-bold text-gray-900">{p.name}</span>
                      {p.isCurrent && (
                        <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">
                          Current
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="bg-gray-50/50">
                <td className="p-4 text-sm font-medium text-gray-900">Rating</td>
                {products.map((p) => (
                  <td key={p.slug} className="p-4 text-center">
                    {p.rating ? (
                      <div className="flex items-center justify-center gap-1 text-sm font-bold text-gray-900">
                        <Star size={14} className="text-orange-500 fill-orange-500" />
                        {p.rating.toFixed(1)}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">No rating</span>
                    )}
                  </td>
                ))}
              </tr>
              {rubricCategories.length > 0 && (
                <>
                  <tr className="bg-gray-50/50">
                    <td className="p-4 text-sm font-medium text-gray-900">
                      <div className="flex items-center gap-2">
                        Rubric score
                        <Link
                          href="/docs/scoring-guide.md"
                          className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-700"
                        >
                          <Info size={14} />
                          How scoring works
                        </Link>
                      </div>
                    </td>
                    {products.map((p) => (
                      <td key={p.slug} className="p-4 text-center">
                        {renderRubricScore(p.overallRubricScore)}
                      </td>
                    ))}
                  </tr>
                  {rubricCategories.map((category) => (
                    <tr key={category.title} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 text-sm font-medium text-gray-600">{category.title}</td>
                      {products.map((p) => {
                        const score = p.rubricCategoryScores?.find(
                          (entry) => entry.title === category.title
                        );
                        return (
                          <td key={p.slug} className="p-4 text-center">
                            {renderRubricScore(score?.score)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </>
              )}
              <tr className="bg-gray-50/50">
                <td className="p-4 text-sm font-medium text-gray-900">Starting Price</td>
                {products.map((p) => (
                  <td key={p.slug} className="p-4 text-center text-sm text-gray-700">
                    {p.priceText || 'Contact sales'}
                  </td>
                ))}
              </tr>
              {features.map((feature, idx) => (
                <tr key={feature.title + idx} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 text-sm font-medium text-gray-600">{feature.title}</td>
                  {products.map((p) => (
                    <td key={p.slug} className="p-4 text-center">
                      {renderAvailability(feature.availability[p.slug])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ComparisonSummary;
