'use client';

import React, { useEffect, useMemo, useState, Suspense } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Sparkles, ArrowRight } from 'lucide-react';
import PartnerCard from '@/components/partners/PartnerCard';
import AIChatDialog from '@/components/partners/AIChatDialog';
import { fetchDirectoryListings, fetchCategories, fetchResourcePosts } from '@/services/sanity';
import { SITE_URLS } from '@/lib/config';

function BrowsepartnersContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const initialCategoriesParam = searchParams.get('category') || searchParams.get('categories');
  const initialCategory = initialCategoriesParam || 'all';
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [categoryFilter, setCategoryFilter] = useState<string>(initialCategory);
  const [brokerTypeFilter, setBrokerTypeFilter] = useState(searchParams.get('brokerType') || 'all');
  const [typeFilter, setTypeFilter] = useState(searchParams.get('type') || 'all');
  const [showAIChat, setShowAIChat] = useState(false);
  const [partners, setpartners] = useState<any[]>([]);
  const [resourcePosts, setResourcePosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dynamicCategories, setDynamicCategories] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        let fetchedListings: any[] = [];
        let fetchedCats: any[] = [];

        if (typeFilter === 'resourceGuide') {
          const [posts, cats] = await Promise.all([fetchResourcePosts(), fetchCategories()]);
          setResourcePosts(posts || []);
          fetchedCats = cats || [];
        } else {
          // If no search or filters, fetch default 21 or a larger set and let frontend sort/tip
          const isDefault = !searchTerm && categoryFilter === 'all' && brokerTypeFilter === 'all' && typeFilter === 'all';

          const [listings, cats] = await Promise.all([
            fetchDirectoryListings({
              search: searchTerm || undefined,
              category: categoryFilter !== 'all' ? categoryFilter : undefined,
              brokerType: brokerTypeFilter !== 'all' ? brokerTypeFilter : undefined,
              listingType: typeFilter !== 'all' ? typeFilter : undefined
            }),
            fetchCategories()
          ]);
          fetchedListings = listings || [];
          fetchedCats = cats || [];
          setResourcePosts([]);
        }

        setpartners(fetchedListings);
        setDynamicCategories((fetchedCats || []).map((cat: any) => ({ label: cat.title, value: cat.value })));
      } catch (err) {
        console.error('Failed to fetch partners:', err);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      loadData();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, categoryFilter, typeFilter, brokerTypeFilter]);

  // Keep URL in sync for shareable filters
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('q', searchTerm);
    if (categoryFilter && categoryFilter !== 'all') params.set('category', categoryFilter);
    if (brokerTypeFilter && brokerTypeFilter !== 'all') params.set('brokerType', brokerTypeFilter);
    if (typeFilter && typeFilter !== 'all') params.set('type', typeFilter);

    const queryString = params.toString();
    router.replace(`${pathname}${queryString ? `?${queryString}` : ''}`);
  }, [searchTerm, categoryFilter, brokerTypeFilter, typeFilter, pathname, router]);

  const brokerTypes = [
    { value: 'Mortgage', label: 'Mortgage' },
    { value: 'Asset Finance', label: 'Asset Finance' },
    { value: 'Commercial', label: 'Commercial' }
  ];

  const filteredpartners = useMemo(() => {
    return partners.filter((partner) => {
      // Check for brokerType match
      const partnerBrokerTypes = partner.brokerType || partner.brokerTypes || [];
      const matchesBrokerType = brokerTypeFilter === 'all' ||
        (Array.isArray(partnerBrokerTypes)
          ? partnerBrokerTypes.includes(brokerTypeFilter)
          : partnerBrokerTypes === brokerTypeFilter);
      return matchesBrokerType;
    });
  }, [partners, brokerTypeFilter]);

  const sortedpartners = useMemo(() => {
    // Helper to check if it's a CRM or Fact Find
    const isCrmOrFactFind = (p: any) => {
      const text = `${p.name || ''} ${p.company_name || ''} ${p.description || ''} ${p.synonyms?.join(' ') || ''}`.toLowerCase();
      const categories = (p.categories || []).map((c: any) => (typeof c === 'string' ? c : c.title || '').toLowerCase());

      const searchTerms = ['crm', 'fact find', 'factfind', 'fact-find'];
      return searchTerms.some(term => text.includes(term)) ||
        categories.some((cat: string) => searchTerms.some(term => cat.includes(term)));
    };

    let processed = [...filteredpartners];

    processed.sort((a, b) => {
      // 1. Badge Priority (Lower is better, e.g. 1 before 2)
      const badgeA = typeof a.badgePriority === 'number' ? a.badgePriority : 999;
      const badgeB = typeof b.badgePriority === 'number' ? b.badgePriority : 999;
      if (badgeA !== badgeB) return badgeA - badgeB;

      // 2. CRM / Fact Find priority (Requested by user)
      const isA = isCrmOrFactFind(a);
      const isB = isCrmOrFactFind(b);
      if (isA && !isB) return -1;
      if (!isA && isB) return 1;

      // 3. Featured Tier priority (fallback)
      const tierWeight: Record<string, number> = { featured: 3, premium: 2, free: 1 };
      const aTier = tierWeight[a.listing_tier || a.listingTier] || 0;
      const bTier = tierWeight[b.listing_tier || b.listingTier] || 0;
      if (aTier !== bTier) return bTier - aTier;

      // 4. Popularity (viewCount) - Descending
      const viewA = a.viewCount || 0;
      const viewB = b.viewCount || 0;
      if (viewA !== viewB) return viewB - viewA;

      // 5. Alphabetical fallback
      return (a.name || a.company_name || '').localeCompare(b.name || b.company_name || '');
    });

    // Default view: If no search/filter, limit to 21 results by popularity (and priority)
    const hasSearch = !!searchTerm;
    const hasFilters = (categoryFilter && categoryFilter !== 'all') ||
      (brokerTypeFilter && brokerTypeFilter !== 'all') ||
      (typeFilter && typeFilter !== 'all');

    if (!hasSearch && !hasFilters) {
      return processed.slice(0, 21);
    }

    return processed;
  }, [filteredpartners, searchTerm, categoryFilter, brokerTypeFilter, typeFilter]);

  const clearAll = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setBrokerTypeFilter('all');
    setTypeFilter('all');
  };

  const resourceGuideCards = useMemo(() => {
    return resourcePosts.map((post) => ({
      ...post,
      href: post.link || `${SITE_URLS.resources}/blog/${post.slug}`,
      title: post.title || post.name
    }));
  }, [resourcePosts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <>
      <main className="flex-1 bg-background">
        {/* Header Section */}
        <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 font-headline">Search the Directory</h1>
              <p className="text-xl text-primary-foreground/80">
                Find the perfect solution for your brokerage - Software, Services & More
              </p>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto mb-6">
              <div className="relative flex items-center bg-white rounded-xl shadow-2xl p-2 transition-all focus-within:ring-4 focus-within:ring-brand-green/20">
                <Search className="text-gray-400 ml-4" size={20} />
                <input
                  type="text"
                  placeholder="Search for partners, products, or services..."
                  className="w-full px-4 py-3 outline-none text-gray-700 caret-blue-600 placeholder-gray-400 bg-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" className="bg-brand-orange hover:bg-orange-600 text-white p-3 rounded-lg transition-colors">
                  <Search size={20} />
                </button>
              </div>
            </form>

            <div className="flex justify-center">
              <button
                onClick={() => setShowAIChat(true)}
                className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium transition-colors"
              >
                <Sparkles size={16} className="text-brand-green" />
                <span>Or ask AI for personalised recommendations</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Filters & Results */}
        <div className="container mx-auto px-4 md:px-6 py-12">
          {/* Filter Bar */}
          <div className="bg-card rounded-xl shadow-md p-6 mb-8 border">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-primary">Filters</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Category</label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {dynamicCategories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Broker Type</label>
                <Select value={brokerTypeFilter} onValueChange={setBrokerTypeFilter}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="All Broker Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Broker Types</SelectItem>
                    {brokerTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
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
                    <SelectItem value="all">All Listings</SelectItem>
                    <SelectItem value="software">Software</SelectItem>
                    <SelectItem value="service">Services</SelectItem>
                    <SelectItem value="resourceGuide">Resource Guides</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {(categoryFilter !== 'all' || brokerTypeFilter !== 'all' || typeFilter !== 'all') && (
              <div className="mt-4 pt-4 border-t">
                <Button variant="ghost" size="sm" onClick={clearAll} className="text-secondary hover:text-secondary/80">
                  Clear all filters
                </Button>
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">
              <span className="font-semibold text-primary">
                {typeFilter === 'resourceGuide' ? resourceGuideCards.length : sortedpartners.length}
              </span>{' '}
              items found
            </p>
          </div>

          {/* partners Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-card rounded-xl p-6 border animate-pulse">
                  <div className="w-16 h-16 bg-muted rounded-lg mb-4" />
                  <div className="h-6 bg-muted rounded mb-2" />
                  <div className="h-4 bg-muted rounded mb-4" />
                  <div className="h-20 bg-muted rounded" />
                </div>
              ))}
            </div>
          ) : typeFilter === 'resourceGuide' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resourceGuideCards.map((post: any) => (
                <div key={post.id} className="group rounded-xl border bg-card p-6 shadow-sm hover:shadow-lg transition">
                  <div className="flex items-start gap-4">
                    {post.imageUrl || post.logoUrl ? (
                      <img
                        src={post.imageUrl || post.logoUrl}
                        alt={post.title}
                        className="h-16 w-16 rounded-lg object-cover border"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center text-lg font-semibold">
                        {post.title?.[0] || 'R'}
                      </div>
                    )}
                    <div className="flex-1">
                      <Badge variant="secondary" className="mb-2">
                        Resource Guide
                      </Badge>
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      {post.description && <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{post.description}</p>}
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(post.categories || []).map((cat: string, idx: number) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {cat}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-4">
                    <Link href={post.href} className="text-primary font-semibold hover:underline">
                      Read guide
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : sortedpartners.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">No partners found</h3>
              <p className="text-muted-foreground mb-6">Try adjusting your search or filters</p>
              <Button onClick={clearAll} variant="outline">
                Clear all filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedpartners.map((partner) => (
                <PartnerCard key={partner.id} partner={partner} />
              ))}
            </div>
          )}
        </div>

        {/* AI Chat Dialog */}
        <AIChatDialog open={showAIChat} onOpenChange={setShowAIChat} />
      </main>
    </>
  );
}

export default function BrowsepartnersPage() {
  return (
    <Suspense
      fallback={
        <>
          <main className="flex-1 bg-background">
            <div className="container mx-auto px-4 md:px-6 py-12">
              <div className="text-center">
                <p className="text-muted-foreground">Loading...</p>
              </div>
            </div>
          </main>
        </>
      }
    >
      <BrowsepartnersContent />
    </Suspense>
  );
}
