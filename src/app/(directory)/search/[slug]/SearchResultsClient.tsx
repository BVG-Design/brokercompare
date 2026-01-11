'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { UnifiedSearchResult } from '@/services/sanity';

interface SearchResultsClientProps {
  rawTerm: string;
  initialResults: UnifiedSearchResult[];
  initialType: string;
  initialCategories: string[];
}

const typeTabs = [
  { value: 'all', label: 'All' },
  { value: 'software', label: 'Software' },
  { value: 'service', label: 'Services' },
  { value: 'resourceGuide', label: 'Resource Guides' }
];

const TYPE_LABELS: Record<string, string> = {
  software: 'Software',
  service: 'Service',
  resourceGuide: 'Resource Guide',
  other: 'Other'
};

function matchesType(result: UnifiedSearchResult, filter: string) {
  if (filter === 'all') return true;
  return result.resultType === filter;
}

export default function SearchResultsClient({
  rawTerm,
  initialResults,
  initialType,
  initialCategories
}: SearchResultsClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [typeFilter, setTypeFilter] = useState(initialType || 'all');
  const [categoryFilters, setCategoryFilters] = useState<string[]>(initialCategories);

  const allCategories = useMemo(() => {
    const values = new Set<string>();
    initialResults.forEach((item) => {
      (item.categories || []).forEach((cat) => {
        if (cat) values.add(cat);
      });
    });
    return Array.from(values);
  }, [initialResults]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (typeFilter && typeFilter !== 'all') {
      params.set('type', typeFilter);
    } else {
      params.delete('type');
    }

    if (categoryFilters.length > 0) {
      params.set('categories', categoryFilters.join(','));
    } else {
      params.delete('categories');
    }

    router.replace(`${pathname}?${params.toString()}`);
  }, [categoryFilters, typeFilter, pathname, router, searchParams]);

  const categoryFiltered = useMemo(() => {
    if (categoryFilters.length === 0) return initialResults;
    return initialResults.filter((item) =>
      (item.categories || []).some((cat) => categoryFilters.includes(cat))
    );
  }, [initialResults, categoryFilters]);

  const sortedResults = useMemo(() => {
    const filtered = categoryFiltered.filter((item) => matchesType(item, typeFilter));
    return filtered.sort((a, b) => {
      const badgeA = typeof a.badgePriority === 'number' ? a.badgePriority : 999;
      const badgeB = typeof b.badgePriority === 'number' ? b.badgePriority : 999;
      if (badgeA !== badgeB) return badgeA - badgeB;

      const titleA = a.title || a.name || '';
      const titleB = b.title || b.name || '';
      return titleA.localeCompare(titleB);
    });
  }, [categoryFiltered, typeFilter]);

  const countsByType = useMemo(() => {
    const base = categoryFiltered;
    return {
      all: base.length,
      software: base.filter((i) => matchesType(i, 'software')).length,
      service: base.filter((i) => matchesType(i, 'service')).length,
      resourceGuide: base.filter((i) => matchesType(i, 'resourceGuide')).length
    };
  }, [categoryFiltered]);

  const toggleCategory = (value: string) => {
    setCategoryFilters((prev) => {
      if (prev.includes(value)) {
        return prev.filter((v) => v !== value);
      }
      return [...prev, value];
    });
  };

  return (
    <main className="container mx-auto px-4 md:px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">Search results</h1>
        <p className="text-muted-foreground mt-2">
          {sortedResults.length} {sortedResults.length === 1 ? 'result' : 'results'} for "{rawTerm}"
        </p>
      </div>

      <div className="bg-card border rounded-xl p-4 mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {typeTabs.map((tab) => (
            <Button
              key={tab.value}
              variant={typeFilter === tab.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTypeFilter(tab.value)}
            >
              {tab.label} ({countsByType[tab.value as keyof typeof countsByType] || 0})
            </Button>
          ))}
        </div>

        <div>
          <p className="text-sm font-medium text-foreground mb-2">Filter by categories</p>
          <div className="flex flex-wrap gap-3">
            {allCategories.length === 0 && <p className="text-sm text-muted-foreground">No categories available.</p>}
            {allCategories.map((cat) => (
              <label key={cat} className="flex items-center gap-2">
                <Checkbox
                  checked={categoryFilters.includes(cat)}
                  onCheckedChange={() => toggleCategory(cat)}
                  className="border-primary data-[state=checked]:bg-primary"
                />
                <span className="text-sm text-foreground">{cat}</span>
              </label>
            ))}
          </div>
          {categoryFilters.length > 0 && (
            <div className="mt-2">
              <Button variant="ghost" size="sm" onClick={() => setCategoryFilters([])}>
                Clear categories
              </Button>
            </div>
          )}
        </div>
      </div>

      {sortedResults.length === 0 ? (
        <div className="rounded-lg border border-dashed border-muted-foreground/40 p-8 text-center">
          <p className="text-lg font-medium">No results found.</p>
          <p className="text-muted-foreground mt-2">Try another search term or adjust filters.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {sortedResults.map((item) => {
            const title = item.title || item.name || 'Untitled';
            const imageUrl = item.logoUrl || item.heroImageUrl;
            const href = item._type === 'blog' ? `/blog/${item.slug}` : `/directory/${item.slug}`;
            const categoryLabel =
              TYPE_LABELS[item.resultType || 'other'] || item.category || 'Uncategorized';

            return (
              <Link
                key={item._id}
                href={href}
                className="group rounded-xl border border-border bg-card p-5 transition hover:shadow-md"
              >
                <div className="flex gap-4">
                  {imageUrl ? (
                    <img src={imageUrl} alt={title} className="h-16 w-16 shrink-0 rounded-lg object-cover" />
                  ) : (
                    <div className="h-16 w-16 shrink-0 rounded-lg bg-muted flex items-center justify-center text-lg font-semibold">
                      {title[0]}
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary">{categoryLabel}</Badge>
                      {typeof item.badgePriority === 'number' && item.badgePriority < 999 && (
                        <Badge variant="outline">Priority {item.badgePriority}</Badge>
                      )}
                    </div>
                    <h2 className="text-xl font-semibold text-foreground group-hover:text-primary">
                      {title}
                    </h2>
                    {item.description ? (
                      <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    ) : null}
                    {(item.categories || []).length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {(item.categories || []).slice(0, 4).map((cat) => (
                          <Badge key={cat} variant="outline" className="text-xs">
                            {cat}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
