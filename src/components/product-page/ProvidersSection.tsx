import React from 'react';
import Link from 'next/link';
import { ExternalLink, Star } from 'lucide-react';
import { ProviderCard } from '@/types/comparison';

interface ProvidersSectionProps {
  providers: ProviderCard[];
}

const renderStars = (rating?: number | null) => {
  const value = rating || 0;
  return (
    <div className="flex text-orange-400">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={10}
          className={i <= Math.round(value) ? 'fill-orange-400' : 'text-gray-300'}
        />
      ))}
    </div>
  );
};

const ProvidersSection: React.FC<ProvidersSectionProps> = ({ providers }) => {
  if (!providers.length) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 mb-16">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            Service Providers (Implementation)
          </h2>
          <p className="text-sm text-gray-500">
            Certified partners to help you implement and optimize
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {providers.map((provider) => (
          <div
            key={provider.id}
            className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 mb-3">
              {provider.logoUrl ? (
                <img
                  src={provider.logoUrl}
                  alt={provider.name}
                  className="w-10 h-10 rounded bg-gray-50 object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-100 rounded text-gray-600 font-bold flex items-center justify-center text-lg">
                  {provider.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <h3 className="font-semibold text-gray-900 text-sm truncate max-w-[140px]">
                    {provider.name}
                  </h3>
                </div>
                <div className="flex items-center gap-1">
                  {renderStars(provider.rating)}
                  {provider.reviewCount ? (
                    <span className="text-xs text-gray-500">({provider.reviewCount})</span>
                  ) : null}
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-600 mb-4 line-clamp-3 leading-relaxed flex-grow">
              {provider.description || 'Specialist implementation partner for this category.'}
            </p>

            {provider.badges?.length ? (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {provider.badges.map((badge, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium border"
                    style={{
                      borderColor: badge.color || '#e5e7eb',
                      color: badge.color || '#374151',
                      backgroundColor: badge.color ? `${badge.color}10` : '#f9fafb'
                    }}
                  >
                    {badge.iconUrl ? (
                      <img src={badge.iconUrl} alt="" className="w-3 h-3 object-contain" />
                    ) : null}
                    {badge.title}
                  </span>
                ))}
              </div>
            ) : null}

            {provider.tags?.length ? (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {provider.tags.slice(0, 4).map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-50 text-gray-600 border border-gray-100 px-2 py-0.5 rounded text-[10px]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="mt-auto space-y-2">
              <Link
                href={provider.slug ? `/directory/${provider.slug}` : '#'}
                className="w-full bg-gray-900 text-white py-2 rounded-md text-xs font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                aria-disabled={!provider.slug}
              >
                View Profile <ExternalLink size={12} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProvidersSection;
