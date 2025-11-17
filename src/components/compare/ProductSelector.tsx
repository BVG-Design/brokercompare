'use client';

import React, { useState } from 'react';
import { useComparison } from './ComparisonContext';
import { software, services } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Search, Plus, Check } from 'lucide-react';
import type { Software, Service } from '@/lib/types';

export function ProductSelector() {
  const { items, addItem, isInComparison, canAddMore, maxItems } = useComparison();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'software' | 'service'>('all');

  const allItems = [
    ...software.map(s => ({ ...s, type: 'software' as const, data: s })),
    ...services.map(s => ({ ...s, type: 'service' as const, data: s })),
  ];

  const filteredItems = allItems.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const handleAdd = (item: Software | Service, type: 'software' | 'service') => {
    if (!canAddMore) {
      alert(`You can compare up to ${maxItems} items. Please remove an item first.`);
      return;
    }
    addItem(item, type);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Add Products to Compare</h3>
            <p className="text-sm text-muted-foreground">
              Select up to {maxItems} items to compare side-by-side. Currently comparing {items.length} of {maxItems}.
            </p>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products or services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={typeFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTypeFilter('all')}
              >
                All
              </Button>
              <Button
                variant={typeFilter === 'software' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTypeFilter('software')}
              >
                Software
              </Button>
              <Button
                variant={typeFilter === 'service' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTypeFilter('service')}
              >
                Services
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto">
            {filteredItems.map((item) => {
              const inComparison = isInComparison(item.id);
              const canAdd = canAddMore && !inComparison;

              return (
                <Card key={item.id} className={inComparison ? 'border-accent bg-accent/5' : ''}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Image
                        src={item.logoUrl}
                        alt={item.name}
                        width={48}
                        height={48}
                        className="rounded border bg-card flex-shrink-0"
                        data-ai-hint="product logo"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="min-w-0">
                            <h4 className="font-semibold text-sm truncate">{item.name}</h4>
                            <Badge variant="secondary" className="text-xs mt-1">
                              {item.category}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                          {item.tagline || item.description.substring(0, 80)}...
                        </p>
                        <Button
                          size="sm"
                          variant={inComparison ? 'outline' : 'default'}
                          className="w-full"
                          onClick={() => canAdd && handleAdd(item.data, item.type)}
                          disabled={!canAdd}
                        >
                          {inComparison ? (
                            <>
                              <Check className="h-3 w-3 mr-1" />
                              Added
                            </>
                          ) : (
                            <>
                              <Plus className="h-3 w-3 mr-1" />
                              Add to Compare
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No items found matching your search.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}


