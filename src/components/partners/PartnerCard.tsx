'use client';
import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ExternalLink,
  Star,
  Award,
  TrendingUp,
  Eye,
} from 'lucide-react';
import Image from 'next/image';
import { SITE_URLS } from '@/lib/config';
import { cn } from '@/lib/utils';

export default function PartnerCard({
  partner,
  viewMode = 'grid'
}: {
  partner: any;
  viewMode?: 'grid' | 'list'
}) {
  const tierBadges: Record<string, any> = {
    featured: {
      label: 'Featured',
      color: 'bg-gradient-to-r from-secondary to-accent text-white',
      icon: Award,
    },
    premium: {
      label: 'Premium',
      color: 'bg-primary text-primary-foreground',
      icon: TrendingUp,
    },
    free: null,
  };

  const tierInfo = tierBadges[partner.listing_tier];

  // List View Layout
  if (viewMode === 'list') {
    return (
      <div
        className={cn(
          "group relative bg-card rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border flex flex-col sm:flex-row p-4 gap-6",
          partner.listing_tier === 'featured' ? 'border-secondary' :
            partner.listing_tier === 'premium' ? 'border-primary' : 'border-border'
        )}
      >
        {tierInfo && (
          <div
            className={`absolute top-0 right-0 ${tierInfo.color} px-3 py-1 rounded-bl-lg flex items-center gap-1.5 text-xs font-semibold z-10`}
          >
            <tierInfo.icon className="w-3.5 h-3.5" />
            {tierInfo.label}
          </div>
        )}

        {/* Logo Section */}
        <div className="flex-shrink-0">
          {partner.logo_url ? (
            <div className="w-24 h-24 relative mx-auto sm:mx-0">
              <Image
                src={partner.logo_url}
                alt={partner.company_name}
                fill
                className="rounded-lg object-contain bg-gray-50 border border-gray-200 p-1"
              />
            </div>
          ) : (
            <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-3xl font-bold mx-auto sm:mx-0">
              {partner.company_name?.[0] || 'V'}
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-xl font-bold text-primary truncate group-hover:text-secondary transition-colors pr-16">
                {partner.company_name}
              </h3>
              {partner.tagline && (
                <p className="text-sm text-gray-600 font-medium">
                  {partner.tagline}
                </p>
              )}
            </div>
          </div>

          <div className="mb-3">
            {partner.description && (
              <p className="text-sm text-gray-600 line-clamp-2">
                {partner.description}
              </p>
            )}
          </div>

          {/* Expanded Categories */}
          {partner.categories && partner.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {partner.categories.slice(0, 5).map((cat: any, idx: number) => (
                <Badge
                  key={idx}
                  variant="secondary"
                  className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  {typeof cat === 'string' ? cat : (cat.title || cat.slug?.current || cat)}
                </Badge>
              ))}
            </div>
          )}

          <div className="mt-auto flex gap-3 pt-2">
            <Link href={`${SITE_URLS.directory}/listings/${partner.slug}`} className="w-auto">
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground px-6">
                View Details
              </Button>
            </Link>
            {partner.websiteUrl && (
              <a href={partner.websiteUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Website
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Grid View Layout (Original)
  return (
    <div
      className={cn(
        "group relative bg-card rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border flex flex-col h-full",
        partner.listing_tier === 'featured' ? 'border-secondary' :
          partner.listing_tier === 'premium' ? 'border-primary' : 'border-border'
      )}
    >
      {tierInfo && (
        <div
          className={`absolute top-0 right-0 ${tierInfo.color} px-3 py-1 rounded-bl-lg flex items-center gap-1.5 text-xs font-semibold z-10`}
        >
          <tierInfo.icon className="w-3.5 h-3.5" />
          {tierInfo.label}
        </div>
      )}

      <div className="p-6 flex flex-col flex-1">
        {/* Logo & Company Name */}
        <div className="flex items-start gap-4 mb-4">
          {partner.logo_url ? (
            <div className="w-16 h-16 relative flex-shrink-0">
              <Image
                src={partner.logo_url}
                alt={partner.company_name}
                fill
                className="rounded-lg object-contain bg-gray-50 border border-gray-200 p-1"
              />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-2xl font-bold flex-shrink-0">
              {partner.company_name?.[0] || 'V'}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-primary mb-1 truncate group-hover:text-secondary transition-colors">
              {partner.company_name}
            </h3>
            {partner.tagline && (
              <p className="text-sm text-gray-600 line-clamp-1">
                {partner.tagline}
              </p>
            )}
          </div>
        </div>

        {/* Description */}
        {partner.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-3 h-[3.75rem] flex-grow-0">
            {partner.description}
          </p>
        )}

        {/* Categories */}
        {partner.categories && partner.categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4 mt-auto">
            {partner.categories.slice(0, 3).map((cat: any, idx: number) => (
              <Badge
                key={idx}
                variant="secondary"
                className="text-xs bg-gray-100 text-gray-700"
              >
                {typeof cat === 'string' ? cat : (cat.title || cat.slug?.current || cat)}
              </Badge>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-50">
          <Link href={`${SITE_URLS.directory}/listings/${partner.slug}`} className="flex-1">
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              View Details
            </Button>
          </Link>
          {partner.websiteUrl && (
            <a href={partner.websiteUrl} target="_blank" rel="noopener noreferrer">
              <Button
                variant="outline"
                size="icon"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            </a>
          )}
        </div>
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
}
