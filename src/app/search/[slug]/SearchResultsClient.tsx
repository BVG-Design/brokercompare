'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Sparkles } from 'lucide-react';
import { UnifiedSearchResult } from '@/services/sanity';
import AIChatDialog from '@/components/vendors/AIChatDialog';

interface SearchResultsClientProps {
  rawTerm: string;
  initialResults: UnifiedSearchResult[];
  initialType: string;
  initialCategory: string;
  availableCategories: { label: string; value: string }[];
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
  initialCategory,
  availableCategories
}: SearchResultsClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [typeFilter, setTypeFilter] = useState(initialType || 'all');
  const [categoryFilter, setCategoryFilter] = useState(initialCategory || 'all');
  const [searchQuery, setSearchQuery] = useState(rawTerm);
  const [showAIChat, setShowAIChat] = useState(false);

  const categoryLabelMap = useMemo(() => {
    return new Map(availableCategories.map((cat) => [cat.value, cat.label]));
  }, [availableCategories]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (typeFilter && typeFilter !== 'all') params.set('type', typeFilter);
    if (categoryFilter && categoryFilter !== 'all') params.set('category', categoryFilter);

    const queryString = params.toString();
    router.replace(`${pathname}${queryString ? `?${queryString}` : ''}`);
  }, [categoryFilter, typeFilter, pathname, router]);

  const categoryFiltered = useMemo(() => {
    if (!categoryFilter || categoryFilter === 'all') return initialResults;
    return initialResults.filter((item) => (item.categories || []).includes(categoryFilter));
  }, [initialResults, categoryFilter]);

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

  const clearAll = () => {
    setCategoryFilter('all');
    setTypeFilter('all');
  };

  const handleSearch = () => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    router.push(`/search/${encodeURIComponent(trimmed)}`);
  };

  return (
    <main className="flex-1 bg-background">
      <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-headline">Search the Directory</h1>
            <p className="text-xl text-primary-foreground/80">
              {sortedResults.length} {sortedResults.length === 1 ? 'result' : 'results'} for "{rawTerm}"
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                handleSearch();
              }}
              className="relative max-w-2xl mx-auto mb-6"
            >
              <div className="relative flex items-center bg-white rounded-xl shadow-2xl p-2 transition-all focus-within:ring-4 focus-within:ring-brand-green/20">
                <Search className="text-gray-400 ml-4" size={20} />
                <input
                  type="text"
                  placeholder="Search for vendors, products, or services..."
                  className="w-full px-4 py-3 outline-none text-gray-700 caret-blue-600 placeholder-gray-400 bg-transparent"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                />
                <button
                  type="submit"
                  className="bg-brand-orange hover:bg-orange-600 text-white p-3 rounded-lg transition-colors"
                >
                  <Search size={20} />
                </button>
              </div>
            </form>

            <div className="mt-4 text-center">
              <Button
                onClick={() => setShowAIChat(true)}
                variant="ghost"
                className="text-primary-foreground hover:text-accent hover:bg-primary-foreground/10"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Or ask AI for personalized recommendations
                <span className="ml-2">ƒ+'</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="bg-card rounded-xl shadow-md p-6 mb-8 border">
          <div className="flex items-center gap-2 mb-4">
            <Search className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-primary">Filters</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Category</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {availableCategories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Listing Type</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="All Listings" />
                </SelectTrigger>
                <SelectContent>
                  {typeTabs.map((tab) => (
                    <SelectItem key={tab.value} value={tab.value}>
                      {tab.label} ({countsByType[tab.value as keyof typeof countsByType] || 0})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {(categoryFilter !== 'all' || typeFilter !== 'all') && (
            <div className="mt-4 pt-4 border-t">
              <Button variant="ghost" size="sm" onClick={clearAll} className="text-secondary hover:text-secondary/80">
                Clear all filters
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            <span className="font-semibold text-primary">{sortedResults.length}</span> items found
          </p>
        </div>

        {sortedResults.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">No results found</h3>
            <p className="text-muted-foreground mb-6">Try another search term or adjust filters</p>
            <Button onClick={clearAll} variant="outline">
              Clear all filters
            </Button>
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
                              {categoryLabelMap.get(cat) || cat}
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
      </div>

      <AIChatDialog open={showAIChat} onOpenChange={setShowAIChat} />
    </main>
  );
}
