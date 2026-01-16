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
  Check
} from 'lucide-react';
import Image from 'next/image';
import { SITE_URLS } from '@/lib/config';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { trackOutboundListingClick } from '@/lib/mixpanel';

export default function PartnerCard({
  partner,
  viewMode = 'grid',
  isComparing,
  onToggleCompare,
  disableCompare,
  maxDescriptionLines // Add to props
}: {
  partner: any;
  viewMode?: 'grid' | 'list';
  isComparing?: boolean;
  onToggleCompare?: (id: string) => void;
  disableCompare?: boolean;
  maxDescriptionLines?: number; // Optional prop to control clamping
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
          "group relative bg-card rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border flex flex-col sm:flex-row p-4 gap-6",
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

        {/* Full Card Link */}
        <Link
          href={`${SITE_URLS.directory}/listings/${partner.slug}`}
          className="absolute inset-0 z-0 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-xl"
        >
          <span className="sr-only">View Listing</span>
        </Link>

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

          {/* Badges with Tooltips */}
          {partner.badges && partner.badges.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4 relative z-10 pointer-events-auto">
              <TooltipProvider>
                {partner.badges.slice(0, 5).map((badge: any, idx: number) => (
                  <Tooltip key={idx}>
                    <TooltipTrigger asChild>
                      <Badge
                        variant="secondary"
                        className="text-xs bg-brand-blue/10 text-brand-blue hover:bg-brand-blue/20 cursor-default"
                      >
                        {badge.title || badge}
                      </Badge>
                    </TooltipTrigger>
                    {badge.description && (
                      <TooltipContent>
                        <p className="max-w-xs text-xs">{badge.description}</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>
          )}

          {/* Actions - relative z-10 to sit above card link */}
          <div className="mt-auto flex gap-3 pt-2 relative z-10">
            {onToggleCompare ? (
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleCompare(partner.id);
                }}
                size="sm"
                className={cn(
                  "px-6 pointer-events-auto",
                  isComparing
                    ? "bg-brand-orange text-white hover:bg-brand-orange/90"
                    : "bg-primary hover:bg-brand-orange text-primary-foreground"
                )}
              >
                {isComparing ? 'Selected' : 'Select'}
              </Button>
            ) : (
              <Link href={`${SITE_URLS.directory}/listings/${partner.slug}`} className="pointer-events-auto">
                <Button size="sm" className="bg-primary hover:bg-brand-orange text-primary-foreground px-6">
                  View Details
                </Button>
              </Link>
            )}
            {partner.websiteUrl && (
              <a
                href={partner.websiteUrl}
                onClick={(e) => trackOutboundListingClick(e, partner, 'partner_card_list', 'Website')}
                className="pointer-events-auto"
              >
                <Button variant="outline" size="sm" className="gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Website
                </Button>
              </a>
            )}
          </div>
        </div>
        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </div>
    );
  }

  // Grid View Layout (Original)
  return (
    <div
      onClick={onToggleCompare ? (e) => onToggleCompare(partner.id) : undefined}
      className={cn(
        "group relative bg-card rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border flex flex-col h-full",
        partner.listing_tier === 'featured' ? 'border-secondary' :
          partner.listing_tier === 'premium' ? 'border-primary' : 'border-border',
        disableCompare && !isComparing ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer',
        isComparing && 'ring-2 ring-brand-orange ring-offset-2'
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

      {/* Comparison Overlay/Checkbox */}
      {onToggleCompare && (
        <div className="absolute top-4 right-4 z-20">
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isComparing
            ? 'bg-brand-orange border-brand-orange'
            : 'bg-white border-gray-200 group-hover:border-brand-orange'}`}
          >
            {isComparing && <Check size={14} className="text-white" />}
          </div>
        </div>
      )}

      {/* Full Card Link */}
      <Link
        href={`${SITE_URLS.directory}/listings/${partner.slug}`}
        className="absolute inset-0 z-0 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-xl"
        onClick={(e) => {
          if (onToggleCompare) {
            // If we are in selection mode, clicking the card typically toggles selection.
            // But we still want to be able to visit the link? 
            // In ComparisonTool, the whole card click toggles. 
            // Let's prevent default if onToggleCompare is present, OR handle it carefully.
            // Usually in selection mode, we might want the card click to select, and the button to visit.
            e.preventDefault();
            onToggleCompare(partner.id);
          }
        }}
      >
        <span className="sr-only">View Listing</span>
      </Link>

      <div className="p-6 flex flex-col flex-1 relative z-10 pointer-events-none">
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
          <div className="flex-1 min-w-0 pr-8">
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
          <p
            className="text-sm text-gray-600 mb-4 flex-grow-0"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: maxDescriptionLines ?? 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {partner.description}
          </p>
        )}

        {/* Badges with Tooltips */}
        {partner.badges && partner.badges.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4 mt-auto relative z-10 pointer-events-auto">
            <TooltipProvider>
              {partner.badges.slice(0, 3).map((badge: any, idx: number) => (
                <Tooltip key={idx}>
                  <TooltipTrigger asChild>
                    <Badge
                      variant="secondary"
                      className="text-xs bg-brand-blue/10 text-brand-blue hover:bg-brand-blue/20 cursor-default"
                    >
                      {badge.title || badge}
                    </Badge>
                  </TooltipTrigger>
                  {badge.description && (
                    <TooltipContent>
                      <p className="max-w-xs text-xs">{badge.description}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              ))}
            </TooltipProvider>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-50 relative z-10">
          <div className="flex-1">
            {onToggleCompare ? (
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleCompare(partner.id);
                }}
                className={cn(
                  "w-full transition-all duration-300 pointer-events-auto",
                  isComparing
                    ? "bg-brand-orange text-white hover:bg-brand-orange/90"
                    : "bg-primary hover:bg-brand-orange text-primary-foreground"
                )}
              >
                {isComparing ? 'Selected' : 'Select'}
              </Button>
            ) : (
              <Link href={`${SITE_URLS.directory}/listings/${partner.slug}`} className="pointer-events-auto block w-full">
                <Button className="w-full bg-primary hover:bg-brand-orange text-primary-foreground">
                  View Details
                </Button>
              </Link>
            )}
          </div>
          {partner.websiteUrl && (
            <a
              href={partner.websiteUrl}
              onClick={(e) => {
                e.stopPropagation(); // Prevent card click
                trackOutboundListingClick(e, partner, 'partner_card_grid', 'Website Icon');
              }}
              className="pointer-events-auto"
            >
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
      <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      {/* Selected Overlay */}
      {isComparing && (
        <div className="absolute inset-0 bg-brand-orange/5 pointer-events-none" />
      )}
    </div>
  );
}
