'use client';

import React, { useState, useEffect } from 'react';
import { useComparison } from './ComparisonContext';
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
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // Auto-detect the type from existing comparison items
  const comparisonType = items.length > 0 ? items[0].type : 'all';
  const [typeFilter, setTypeFilter] = useState<'all' | 'software' | 'service'>(comparisonType);

  // Update filter when comparison items change
  useEffect(() => {
    if (items.length > 0) {
      setTypeFilter(items[0].type);
    }
  }, [items]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // Fetch both software (products) and services
        const [softwareData, servicesData] = await Promise.all([
          fetch('/api/software').then(res => res.ok ? res.json() : []),
          fetch('/api/services').then(res => res.ok ? res.json() : [])
        ]);

        setSoftware(softwareData);
        setServices(servicesData);
      } catch (error) {
        console.error('Failed to fetch comparison data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const [software, setSoftware] = useState<Software[]>([]);

  const allItems = [
    ...software.map(s => ({ ...s, type: 'software' as const, data: s })),
    ...services.map(s => ({ ...s, type: 'service' as const, data: s })),
  ];

  const filteredItems = allItems.filter(item => {
    const itemName = item.name || '';
    const itemDesc = item.description || '';
    const matchesSearch =
      itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      itemDesc.toLowerCase().includes(searchTerm.toLowerCase());

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

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={`Search ${comparisonType === 'service' ? 'services' : comparisonType === 'software' ? 'software' : 'products or services'}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        {items.length === 0 && (
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
        )}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredItems.map((item) => {
          const inComparison = isInComparison(item.id);
          const canAdd = canAddMore && !inComparison;

          return (
            <Card key={item.id} className={inComparison ? 'border-accent bg-accent/5' : ''}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {(item.logoUrl || (item.data as any).images?.[0]) && (
                    <Image
                      src={(item.data as any).images?.[0] || item.logoUrl}
                      alt={item.name}
                      width={48}
                      height={48}
                      className="rounded border bg-card flex-shrink-0"
                      data-ai-hint="product logo"
                    />
                  )}
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
                      {item.tagline || (item.description ? item.description.substring(0, 80) + '...' : '')}
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
  );
}
