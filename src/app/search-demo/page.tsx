'use client';

import React, { useEffect, useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, SlidersHorizontal, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PartnerCard from '@/components/partners/PartnerCard';
import RefineSidebar from '@/components/search/RefineSidebar';
import { fetchUnifiedSearchResults, fetchCategories } from '@/services/sanity';

function SearchDemoContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // State
    const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
    const [filters, setFilters] = useState({
        category: searchParams.get('category') || 'all',
        type: searchParams.get('type') || 'all',
        brokerType: searchParams.get('brokerType') || 'all',
    });
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [results, setResults] = useState<any[]>([]);
    const [categories, setCategories] = useState<{ title: string; value: string }[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Load Data
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const [cats, searchResults] = await Promise.all([
                    fetchCategories(),
                    fetchUnifiedSearchResults(
                        [searchTerm],
                        ['directoryListing', 'blog'], // Explicitly asking for listings and blogs
                        filters
                    )
                ]);

                setCategories(cats || []);
                setResults(searchResults || []);
            } catch (err) {
                console.error('Failed to fetch data:', err);
            } finally {
                setIsLoading(false);
            }
        };

        const timer = setTimeout(loadData, 300);
        return () => clearTimeout(timer);
    }, [searchTerm, filters]);

    // Update URL
    const updateFilter = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        const params = new URLSearchParams(searchParams.toString());
        if (value && value !== 'all') {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        router.push(`?${params.toString()}`);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams.toString());
        if (searchTerm) {
            params.set('q', searchTerm);
        } else {
            params.delete('q');
        }
        router.push(`?${params.toString()}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Search Header */}
            <div className="bg-white border-b sticky top-0 z-30">
                <div className="container mx-auto px-4 py-4 flex items-center gap-4">
                    <div className="flex-1 max-w-2xl relative">
                        <form onSubmit={handleSearch}>
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <Input
                                placeholder="Search..."
                                className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </form>
                    </div>
                    <Button
                        variant="outline"
                        className="lg:hidden gap-2"
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <SlidersHorizontal className="h-4 w-4" />
                        Filters
                    </Button>

                    <div className="hidden lg:flex items-center gap-1 bg-white border rounded-lg p-1 ml-4">
                        <Button
                            variant={viewMode === 'grid' ? "secondary" : "ghost"}
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setViewMode('grid')}
                        >
                            <Grid className="h-4 w-4" />
                        </Button>
                        <Button
                            variant={viewMode === 'list' ? "secondary" : "ghost"}
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setViewMode('list')}
                        >
                            <List className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex-1 container mx-auto px-4 py-8 flex items-start gap-8">
                {/* Sidebar (Desktop) */}
                <RefineSidebar
                    categories={categories}
                    filters={filters}
                    onFilterChange={updateFilter}
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    totalResults={results.length}
                />

                {/* Results Grid */}
                <div className="flex-1">
                    {isLoading ? (
                        <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className={`bg-gray-100 rounded-xl animate-pulse ${viewMode === 'grid' ? 'h-80' : 'h-48'}`} />
                            ))}
                        </div>
                    ) : results.length > 0 ? (
                        <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                            {results.map((item) => (
                                <PartnerCard
                                    key={item._id}
                                    viewMode={viewMode}
                                    partner={{
                                        ...item,
                                        company_name: item.name || item.title,
                                        logo_url: item.logoUrl,
                                        listing_tier: item.isFeatured ? 'featured' : 'free', // Mapping for card
                                        categories: item.category ? [item.category] : []
                                    }}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-xl border border-dashed text-gray-500">
                            <p>No results found.</p>
                            <Button
                                variant="link"
                                onClick={() => {
                                    setSearchTerm('');
                                    setFilters({ category: 'all', type: 'all', brokerType: 'all' });
                                }}
                            >
                                Clear all filters
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function SearchDemoPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center">Loading search demo...</div>}>
            <SearchDemoContent />
        </Suspense>
    );
}
