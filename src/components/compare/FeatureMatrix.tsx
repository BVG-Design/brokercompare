'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import type { Software, Service } from '@/lib/types';

interface FeatureMatrixProps {
  items: Array<{
    id: string;
    type: 'software' | 'service';
    name: string;
    logoUrl: string;
    category: string;
    data: Software | Service;
  }>;
}

export function FeatureMatrix({ items }: FeatureMatrixProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Extract all features from items
  const allFeatures: Record<string, Array<{ name: string; available: boolean }>> = {};

  items.forEach(item => {
    if (item.type === 'software') {
      const software = item.data as Software;
      
      // Use featureMatrix if available, otherwise fall back to features array
      if (software.featureMatrix && software.featureMatrix.length > 0) {
        software.featureMatrix.forEach(category => {
          if (!allFeatures[category.category]) {
            allFeatures[category.category] = [];
          }
          category.items.forEach(feature => {
            const existing = allFeatures[category.category].find(f => f.name === feature.name);
            if (!existing) {
              allFeatures[category.category].push({
                name: feature.name,
                available: feature.available,
              });
            }
          });
        });
      } else {
        // Fall back to features array
        if (!allFeatures['Core Features']) {
          allFeatures['Core Features'] = [];
        }
        software.features?.forEach(feature => {
          if (!allFeatures['Core Features'].find(f => f.name === feature)) {
            allFeatures['Core Features'].push({
              name: feature,
              available: true,
            });
          }
        });
      }
    } else {
      // For services, use features array
      const service = item.data as Service;
      if (!allFeatures['Core Services']) {
        allFeatures['Core Services'] = [];
      }
      service.features?.forEach(feature => {
        if (!allFeatures['Core Services'].find(f => f.name === feature)) {
          allFeatures['Core Services'].push({
            name: feature,
            available: true,
          });
        }
      });
    }
  });

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const checkFeature = (itemId: string, category: string, featureName: string): boolean => {
    const item = items.find(i => i.id === itemId);
    if (!item) return false;

    if (item.type === 'software') {
      const software = item.data as Software;
      if (software.featureMatrix) {
        const cat = software.featureMatrix.find(c => c.category === category);
        if (cat) {
          const feature = cat.items.find(f => f.name === featureName);
          return feature?.available ?? false;
        }
      }
      // Fall back to features array
      return software.features?.includes(featureName) ?? false;
    } else {
      const service = item.data as Service;
      return service.features?.includes(featureName) ?? false;
    }
  };

  if (Object.keys(allFeatures).length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">
            Feature details not available for the selected items.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Feature Comparison Matrix</CardTitle>
        <p className="text-sm text-muted-foreground">
          Compare detailed features across all selected products and services
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-semibold sticky left-0 bg-background z-10 min-w-[200px]">
                  Feature
                </th>
                {items.map(item => (
                  <th key={item.id} className="text-center p-3 font-semibold min-w-[150px]">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-sm">{item.name}</span>
                      <span className="text-xs text-muted-foreground">{item.category}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(allFeatures).map(([category, features]) => {
                const isExpanded = expandedCategories.has(category);
                return (
                  <React.Fragment key={category}>
                    <tr className="border-b bg-muted/50">
                      <td colSpan={items.length + 1} className="p-0">
                        <Collapsible open={isExpanded} onOpenChange={() => toggleCategory(category)}>
                          <CollapsibleTrigger asChild>
                            <Button
                              variant="ghost"
                              className="w-full justify-between p-3 h-auto font-semibold"
                            >
                              <span>{category}</span>
                              {isExpanded ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </Button>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <table className="w-full">
                              <tbody>
                                {features.map((feature, idx) => (
                                  <tr key={idx} className="border-b hover:bg-muted/30">
                                    <td className="p-3 pl-6 text-sm">{feature.name}</td>
                                    {items.map(item => {
                                      const available = checkFeature(item.id, category, feature.name);
                                      return (
                                        <td key={item.id} className="text-center p-3">
                                          {available ? (
                                            <Check className="h-5 w-5 text-accent mx-auto" />
                                          ) : (
                                            <X className="h-5 w-5 text-muted-foreground mx-auto" />
                                          )}
                                        </td>
                                      );
                                    })}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </CollapsibleContent>
                        </Collapsible>
                      </td>
                    </tr>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}


