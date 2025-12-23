'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Sparkles } from 'lucide-react';
import VendorCard from '@/components/vendors/VendorCard';
import AIChatDialog from '@/components/vendors/AIChatDialog';
import { fetchDirectoryListings, fetchCategories, fetchResourcePosts } from '@/services/sanity';

function BrowseVendorsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState(initialCategory);
  const [brokerTypeFilter, setBrokerTypeFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showAIChat, setShowAIChat] = useState(false);
  const [vendors, setVendors] = useState<any[]>([]);
  const [resourcePosts, setResourcePosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dynamicCategories, setDynamicCategories] = useState<{ label: string, value: string }[]>([]);

  React.useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        let fetchedListings = [];
        let fetchedCats = [];
        if (typeFilter === 'resourceGuide') {
          // Fetch resource guide posts
          const [posts, cats] = await Promise.all([
            fetchResourcePosts(),
            fetchCategories()
          ]);
          fetchedListings = [];
          setResourcePosts(posts);
          fetchedCats = cats;
        } else {
          const [listings, cats] = await Promise.all([
            fetchDirectoryListings({
              search: searchTerm,
              category: categoryFilter,
              brokerType: brokerTypeFilter,
              type: typeFilter !== 'all' ? typeFilter : undefined
            }),
            fetchCategories()
          ]);
          fetchedListings = listings;
          fetchedCats = cats;
        }




      } catch (err) {
        console.error("Failed to fetch vendors:", err);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      loadData();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, categoryFilter, typeFilter, brokerTypeFilter]);

  const brokerTypes = [
    { value: 'all', label: 'All Broker Types' },
    { value: 'Mortgage', label: 'Mortgage' },
    { value: 'Asset Finance', label: 'Asset Finance' },
    { value: 'Commercial', label: 'Commercial' },
  ];

  const filteredVendors = useMemo(() => {
    return vendors.filter(vendor => {
      const matchesBrokerType = brokerTypeFilter === 'all' ||
        vendor.brokerTypes?.includes(brokerTypeFilter);

      return matchesBrokerType;
    });
  }, [vendors, brokerTypeFilter]);

  const sortedVendors = useMemo(() => {
    return [...filteredVendors].sort((a, b) => {
      const tierWeight: Record<string, number> = { featured: 3, premium: 2, free: 1 };
      const aTier = tierWeight[a.listingTier] || 0;
      const bTier = tierWeight[b.listingTier] || 0;
      if (aTier !== bTier) return bTier - aTier;
      return a.name.localeCompare(b.name);
    });
  }, [filteredVendors]);



  const handleSearch = () => {
    // Search is handled by the searchTerm state
  };

  return (
    <>
      <main className="flex-1 bg-background">
        {/* Header Section */}
        <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 font-headline">
                Search the Directory
              </h1>
              <p className="text-xl text-primary-foreground/80">
                Find the perfect solution for your brokerage - Software, Services & More
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-3xl mx-auto">
              <div className="bg-background rounded-2xl shadow-2xl p-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search for vendors, products, or services..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="pl-12 pr-4 h-14 text-lg border-0 focus-visible:ring-0"
                    />
                  </div>
                  <Button
                    onClick={handleSearch}
                    size="lg"
                    className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-8 h-14"
                  >
                    <Search className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* AI Chat Button */}
              <div className="mt-4 text-center">
                <Button
                  onClick={() => setShowAIChat(true)}
                  variant="ghost"
                  className="text-primary-foreground hover:text-accent hover:bg-primary-foreground/10"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Or ask AI for personalized recommendations
                  <span className="ml-2">→</span>
                </Button>
              </div>
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
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {dynamicCategories.map((cat: { label: string, value: string }) => (
                      <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Broker Type</label>
                <Select value={brokerTypeFilter} onValueChange={setBrokerTypeFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {brokerTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Listing Type</label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Listings</SelectItem>
                    <SelectItem value="service">Services</SelectItem>
                    <SelectItem value="software">Software</SelectItem>
                    <SelectItem value="resourceGuide">Resource Guide</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {(categoryFilter !== 'all' || brokerTypeFilter !== 'all' || typeFilter !== 'all') && (
              <div className="mt-4 pt-4 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setCategoryFilter('all');
                    setBrokerTypeFilter('all');
                    setTypeFilter('all');
                  }}
                  className="text-secondary hover:text-secondary/80"
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">
              <span className="font-semibold text-primary">{typeFilter === 'resourceGuide' ? resourcePosts.length : sortedVendors.length}</span> items found
            </p>
          </div>

          {/* Vendors Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
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
              {resourcePosts.map(post => (
                <VendorCard key={post.id} vendor={post} />
              ))}
            </div>
          ) : sortedVendors.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">No vendors found</h3>
              <p className="text-muted-foreground mb-6">Try adjusting your search or filters</p>
              <Button
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('all');
                  setBrokerTypeFilter('all');
                  setTypeFilter('all');
                }}
                variant="outline"
              >
                Clear all filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedVendors.map(vendor => (
                <VendorCard key={vendor.id} vendor={vendor} />
              ))}
            </div>
          )
        </div>

        {/* AI Chat Dialog */}
        <AIChatDialog open={showAIChat} onOpenChange={setShowAIChat} />
      </main>
    </>
  );
}

export default function BrowseVendorsPage() {
  return (
    <Suspense fallback={
      <>
        <main className="flex-1 bg-background">
          <div className="container mx-auto px-4 md:px-6 py-12">
            <div className="text-center">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </div>
        </main>
      </>
    }>
      <BrowseVendorsContent />
    </Suspense>
  );
}

