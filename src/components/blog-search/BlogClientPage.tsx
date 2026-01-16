'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, SlidersHorizontal, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import BlogCard from '@/components/blog-search/BlogCard';
import BlogRefineSidebar from '@/components/blog-search/BlogRefineSidebar';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*                               Dashboard View                               */
/* -------------------------------------------------------------------------- */

// Helper to render sections in Dashboard
function DashboardSection({ title, link, linkText, posts, viewMode }: any) {
    if (!posts || posts.length === 0) return null;
    return (
        <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-brand-blue">{title}</h2>
                {link && (
                    <Link href={link} className="text-brand-orange font-bold text-sm hover:underline">
                        {linkText || 'View all'}
                    </Link>
                )}
            </div>
            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                {posts.map((post: any) => (
                    <BlogCard key={post._id} post={post} viewMode={viewMode} />
                ))}
            </div>
        </section>
    );
}

function DashboardView({ data, viewMode }: { data: any, viewMode: 'grid' | 'list' }) {
    if (!data) return null;
    return (
        <div className="space-y-4">
            {/* Featured Section */}
            {data.featured && (
                <section className="mb-12">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-3xl font-bold text-brand-blue flex items-center gap-3 decoration-brand-orange/30 decoration-8 underline-offset-4">
                            Featured Articles
                        </h2>
                        <div className="w-12 h-1 bg-brand-orange/20 rounded-full" />
                    </div>
                    <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                        {data.featured.map((post: any) => (
                            <BlogCard key={post._id} post={post} viewMode={viewMode} />
                        ))}
                    </div>
                </section>
            )}

            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                <Link href="/blog?blogType=podcast" className="group relative aspect-[4/3] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 bg-gray-100 flex items-center justify-center border border-transparent hover:border-brand-green">
                    <Image src="https://izjekecdocekznhwqivo.supabase.co/storage/v1/object/public/Media/Podcast.png" alt="Podcasts" fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                </Link>
                <Link href="/blog?blogType=guide" className="group relative aspect-[4/3] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 bg-gray-100 flex items-center justify-center border border-transparent hover:border-brand-green">
                    <Image src="https://izjekecdocekznhwqivo.supabase.co/storage/v1/object/public/Media/Workflow%20Guides.png" alt="Guides" fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                </Link>
                <Link href="/blog?blogType=review" className="group relative aspect-[4/3] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 bg-gray-100 flex items-center justify-center border border-transparent hover:border-brand-green">
                    <Image src="https://izjekecdocekznhwqivo.supabase.co/storage/v1/object/public/Media/Read%20Tech%20Reviews.png" alt="Tech Reviews" fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                </Link>
            </div>

            <DashboardSection title="How To Guides" link="/blog?blogType=guide" posts={data.guides} viewMode={viewMode} />
            <DashboardSection title="Reviews" link="/blog?blogType=review" posts={data.reviews} viewMode={viewMode} />
            <DashboardSection title="Podcasts" link="/blog?blogType=podcast" posts={data.podcasts} viewMode={viewMode} />

            {/* Latest Section */}
            <section className="mb-12">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-brand-blue">Latest Updates</h2>
                </div>
                <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                    {data.latest?.map((post: any) => (
                        <BlogCard key={post._id} post={post} viewMode={viewMode} />
                    ))}
                </div>
            </section>
        </div>
    );
}


/* -------------------------------------------------------------------------- */
/*                             Main Client Page                               */
/* -------------------------------------------------------------------------- */

export default function BlogClientPage({
    initialDashboardData,
    categories
}: {
    initialDashboardData: any,
    categories: { title: string; value: string }[]
}) {
    const searchParams = useSearchParams();
    const router = useRouter();

    // -- State --
    const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
    const [filters, setFilters] = useState({
        category: searchParams.get('category') || 'all',
        brokerType: searchParams.get('brokerType') || 'all',
        blogType: searchParams.get('blogType') || 'all',
        author: searchParams.get('author') || 'all',
    });

    // View Config
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Search Results State
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Authors Data
    const authors = initialDashboardData?.authors || [];

    // Derived State: Are we in "Search Mode" or "Dashboard Mode"?
    // Search mode if: searchTerm exists OR any filter is not 'all'
    const isSearchActive = !!searchTerm || filters.category !== 'all' || filters.brokerType !== 'all' || filters.blogType !== 'all' || filters.author !== 'all';

    // -- Effects --
    useEffect(() => {
        // Sync state from URL on mount/update
        setSearchTerm(searchParams.get('q') || '');
        setFilters({
            category: searchParams.get('category') || 'all',
            brokerType: searchParams.get('brokerType') || 'all',
            blogType: searchParams.get('blogType') || 'all',
            author: searchParams.get('author') || 'all',
        });
    }, [searchParams]);

    useEffect(() => {
        const fetchResults = async () => {
            if (!isSearchActive) {
                setSearchResults([]);
                setIsSearching(false);
                return;
            }

            setIsSearching(true);
            setIsLoading(true);

            try {
                const query = new URLSearchParams();
                if (searchTerm) query.set('q', searchTerm);
                if (filters.category && filters.category !== 'all') query.set('category', filters.category);
                if (filters.brokerType && filters.brokerType !== 'all') query.set('brokerType', filters.brokerType);
                if (filters.blogType && filters.blogType !== 'all') query.set('blogType', filters.blogType);
                if (filters.author && filters.author !== 'all') query.set('author', filters.author);

                const res = await fetch(`/api/blog-search?${query.toString()}`);
                const data = await res.json();

                if (data.success) {
                    // Normalize data for BlogCard
                    const normalized = data.results.map((item: any) => ({
                        ...item,
                        // Ensure fields match BlogCard expectation
                        imageUrl: item.heroImageUrl || item.imageUrl || item.logoUrl
                    }));
                    setSearchResults(normalized);
                } else {
                    setSearchResults([]);
                }
            } catch (err) {
                console.error("Search failed", err);
                setSearchResults([]);
            } finally {
                setIsLoading(false);
            }
        };

        const timer = setTimeout(fetchResults, 300);
        return () => clearTimeout(timer);
    }, [searchTerm, filters, isSearchActive]);


    // -- Handlers --
    const updateFilter = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        const params = new URLSearchParams(searchParams.toString());
        if (value && value !== 'all') {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        // Always reset page to 1 if we had pagination (not yet implemented)
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

    const clearFilters = () => {
        setSearchTerm('');
        setFilters({ category: 'all', brokerType: 'all', blogType: 'all', author: 'all' });
        router.push('?');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-body">
            {/* Search Header */}
            <div className="bg-white border-b sticky top-0 z-30">
                <div className="container mx-auto px-4 py-4 flex items-center gap-4">
                    <div className="flex-1 max-w-2xl relative">
                        <form onSubmit={handleSearch}>
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <Input
                                placeholder="Search resources..."
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
                {/* Sidebar */}
                <BlogRefineSidebar
                    categories={categories}
                    authors={authors}
                    filters={filters}
                    onFilterChange={updateFilter}
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    totalResults={isSearchActive ? searchResults.length : (initialDashboardData?.latest?.length || 0)} // Approx
                />

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                    {!isSearchActive ? (
                        <>
                            <div className="mb-8">
                                <h1 className="text-4xl font-bold text-brand-blue mb-4">Resource Centre</h1>
                                <p className="text-lg text-brand-blue/70">
                                    The Broker Tools blog is your go-to resource for all things related to Broker optimisation.
                                </p>
                            </div>
                            <DashboardView data={initialDashboardData} viewMode={viewMode} />
                        </>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h1 className="text-2xl font-bold text-brand-blue">
                                    {isLoading ? 'Searching...' : `${searchResults.length} Results Found`}
                                </h1>
                                {isSearchActive && (
                                    <Button variant="ghost" onClick={clearFilters} className="text-sm text-brand-orange hover:text-gray-700">
                                        Clear all filters
                                    </Button>
                                )}
                            </div>

                            {isLoading ? (
                                <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                                    {[1, 2, 3, 4, 5, 6].map((i) => (
                                        <div key={i} className={`bg-gray-100 rounded-xl animate-pulse ${viewMode === 'grid' ? 'h-80' : 'h-48'}`} />
                                    ))}
                                </div>
                            ) : searchResults.length > 0 ? (
                                <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                                    {searchResults.map((item) => (
                                        <BlogCard key={item._id} post={item} viewMode={viewMode} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-white rounded-xl border border-dashed text-gray-500">
                                    <p>No results found for your search.</p>
                                    <Button variant="link" onClick={clearFilters}>
                                        Clear filters
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
