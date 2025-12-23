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

export default function VendorCard({ vendor }: { vendor: any }) {
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

  const tierInfo = tierBadges[vendor.listing_tier];

  return (
    <div
      className={`group relative bg-card rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border ${vendor.listing_tier === 'featured'
          ? 'border-secondary'
          : vendor.listing_tier === 'premium'
            ? 'border-primary'
            : 'border-border'
        }`}
    >
      {tierInfo && (
        <div
          className={`absolute top-0 right-0 ${tierInfo.color} px-3 py-1 rounded-bl-lg flex items-center gap-1.5 text-xs font-semibold z-10`}
        >
          <tierInfo.icon className="w-3.5 h-3.5" />
          {tierInfo.label}
        </div>
      )}

      <div className="p-6">
        {/* Logo & Company Name */}
        <div className="flex items-start gap-4 mb-4">
          {vendor.logo_url ? (
            <div className="w-16 h-16 relative">
              <Image
                src={vendor.logo_url}
                alt={vendor.company_name}
                fill
                className="rounded-lg object-contain bg-gray-50 border border-gray-200 p-1"
              />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-2xl font-bold">
              {vendor.company_name?.[0] || 'V'}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-primary mb-1 truncate group-hover:text-secondary transition-colors">
              {vendor.company_name}
            </h3>
            {vendor.tagline && (
              <p className="text-sm text-gray-600 line-clamp-1">
                {vendor.tagline}
              </p>
            )}
          </div>
        </div>

        {/* Description */}
        {vendor.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-3 h-15">
            {vendor.description}
          </p>
        )}

        {/* Categories */}
        {vendor.categories && vendor.categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {vendor.categories.slice(0, 3).map((cat: any, idx: number) => (
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
        <div className="flex gap-2 mt-auto">
          <Link href={`/directory/${vendor.slug}`} className="flex-1">
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              View Details
            </Button>
          </Link>
          {vendor.websiteUrl && (
            <a href={vendor.websiteUrl} target="_blank" rel="noopener noreferrer">
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
