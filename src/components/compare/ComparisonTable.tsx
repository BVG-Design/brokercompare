'use client';

import React from 'react';
import Image from 'next/image';
import { useComparison } from './ComparisonContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/shared/star-rating';
import { X, ExternalLink, DollarSign, MapPin, Check, X as XIcon } from 'lucide-react';
import type { Software, Service } from '@/lib/types';

interface ComparisonTableProps {
  items: Array<{
    id: string;
    type: 'software' | 'service';
    name: string;
    logoUrl: string;
    category: string;
    data: Software | Service;
  }>;
}

export function ComparisonTable({ items }: ComparisonTableProps) {
  const { removeItem } = useComparison();

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No items to compare. Add items from the listings to get started.</p>
        </CardContent>
      </Card>
    );
  }

  const getAverageRating = (reviews: typeof items[0]['data']['reviews']) => {
    if (!reviews || reviews.length === 0) return 0;
    return reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
  };

  const comparisonRows = [
    {
      label: 'Overview',
      cells: items.map(item => ({
        name: item.name,
        logo: item.logoUrl,
        category: item.category,
        tagline: item.data.tagline || item.data.description.substring(0, 100) + '...',
      })),
    },
    {
      label: 'Rating',
      cells: items.map(item => ({
        rating: getAverageRating(item.data.reviews),
        reviewCount: item.data.reviews?.length || 0,
      })),
    },
    {
      label: 'Pricing',
      cells: items.map(item => {
        if (item.type === 'software') {
          const software = item.data as Software;
          return {
            pricing: software.pricing || 'Contact for pricing',
            tiers: software.pricingTiers,
          };
        } else {
          const service = item.data as Service;
          return {
            pricing: typeof service.pricingRange === 'string' 
              ? service.pricingRange 
              : service.pricingModel || 'Contact for pricing',
          };
        }
      }),
    },
    {
      label: 'Key Features',
      cells: items.map(item => ({
        features: item.data.features || [],
      })),
    },
    {
      label: 'Deployment/Service Type',
      cells: items.map(item => {
        if (item.type === 'software') {
          const software = item.data as Software;
          return { deployment: software.deployment || 'N/A' };
        } else {
          const service = item.data as Service;
          return { location: service.location || 'N/A' };
        }
      }),
    },
    {
      label: 'Support Options',
      cells: items.map(item => {
        if (item.type === 'software') {
          const software = item.data as Software;
          return { support: software.supportOptions || [] };
        } else {
          return { support: 'N/A' };
        }
      }),
    },
    {
      label: 'Integrations',
      cells: items.map(item => {
        if (item.type === 'software') {
          const software = item.data as Software;
          return { 
            integrations: software.integrations?.map(i => i.name || i) || software.compatibility || [] 
          };
        } else {
          return { integrations: [] };
        }
      }),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Row with Product Cards */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}>
        {items.map((item) => (
          <Card key={item.id} className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6"
              onClick={() => removeItem(item.id)}
              aria-label={`Remove ${item.name}`}
            >
              <X className="h-4 w-4" />
            </Button>
            <CardHeader className="pb-3">
              <div className="flex flex-col items-center text-center space-y-3">
                <Image
                  src={item.logoUrl}
                  alt={item.name}
                  width={64}
                  height={64}
                  className="rounded-lg border bg-card"
                  data-ai-hint="product logo"
                />
                <div>
                  <Badge variant="secondary" className="mb-2 text-xs">
                    {item.category}
                  </Badge>
                  <CardTitle className="text-lg font-headline">{item.name}</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {item.data.tagline || item.data.description.substring(0, 60) + '...'}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2 text-center">
                <div className="flex items-center justify-center gap-1">
                  <StarRating 
                    rating={getAverageRating(item.data.reviews)} 
                    size={16} 
                    showText={false}
                  />
                  <span className="text-xs text-muted-foreground">
                    ({item.data.reviews?.length || 0} reviews)
                  </span>
                </div>
                {item.data.website && (
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <a href={item.data.website} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Visit Website
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Comparison Rows */}
      <div className="space-y-4">
        {comparisonRows.map((row, rowIndex) => (
          <Card key={rowIndex}>
            <CardHeader>
              <CardTitle className="text-base font-headline">{row.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="grid gap-4" 
                style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}
              >
                {row.cells.map((cell, cellIndex) => (
                  <div key={cellIndex} className="min-h-[60px]">
                    {row.label === 'Overview' && 'name' in cell && (
                      <div className="space-y-2">
                        <h4 className="font-semibold">{cell.name}</h4>
                        <p className="text-sm text-muted-foreground">{cell.tagline}</p>
                      </div>
                    )}
                    
                    {row.label === 'Rating' && 'rating' in cell && (
                      <div className="flex flex-col items-center gap-2">
                        <StarRating rating={cell.rating} size={20} />
                        <span className="text-xs text-muted-foreground">
                          {cell.reviewCount} {cell.reviewCount === 1 ? 'review' : 'reviews'}
                        </span>
                      </div>
                    )}
                    
                    {row.label === 'Pricing' && 'pricing' in cell && (
                      <div className="space-y-2">
                        <p className="font-medium">{cell.pricing}</p>
                        {cell.tiers && cell.tiers.length > 0 && (
                          <div className="text-xs text-muted-foreground space-y-1">
                            {cell.tiers.map((tier, i) => (
                              <div key={i}>
                                {tier.name}: {tier.price || 'Contact'}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    
                    {row.label === 'Key Features' && 'features' in cell && (
                      <ul className="space-y-1">
                        {cell.features.slice(0, 5).map((feature, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <Check className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                        {cell.features.length > 5 && (
                          <li className="text-xs text-muted-foreground">
                            +{cell.features.length - 5} more
                          </li>
                        )}
                      </ul>
                    )}
                    
                    {row.label === 'Deployment/Service Type' && (
                      <div className="text-sm">
                        {'deployment' in cell && <p>{cell.deployment}</p>}
                        {'location' in cell && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{cell.location}</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {row.label === 'Support Options' && 'support' in cell && (
                      <div className="text-sm">
                        {Array.isArray(cell.support) && cell.support.length > 0 ? (
                          <ul className="space-y-1">
                            {cell.support.map((opt, i) => (
                              <li key={i} className="flex items-center gap-2">
                                <Check className="h-3 w-3 text-accent" />
                                <span>{opt}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-muted-foreground">{cell.support}</span>
                        )}
                      </div>
                    )}
                    
                    {row.label === 'Integrations' && 'integrations' in cell && (
                      <div className="text-sm">
                        {Array.isArray(cell.integrations) && cell.integrations.length > 0 ? (
                          <ul className="space-y-1">
                            {cell.integrations.slice(0, 5).map((integration, i) => (
                              <li key={i} className="flex items-center gap-2">
                                <Check className="h-3 w-3 text-accent" />
                                <span>{typeof integration === 'string' ? integration : integration.name}</span>
                              </li>
                            ))}
                            {cell.integrations.length > 5 && (
                              <li className="text-xs text-muted-foreground">
                                +{cell.integrations.length - 5} more
                              </li>
                            )}
                          </ul>
                        ) : (
                          <span className="text-muted-foreground">None listed</span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}


