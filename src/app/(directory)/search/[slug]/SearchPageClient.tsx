'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, Grid, List as ListIcon, X, ArrowRight, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '@/components/ui/input';

import { Button } from '@/components/ui/button';
import { UnifiedSearchResult } from '@/services/sanity';
import DirectoryCard from '@/components/search/DirectoryCard';
import RelatedArticles from '@/components/search/RelatedArticles';
import StillNotSure from '@/components/product-page/StillNotSure';
import { SITE_URLS } from '@/lib/config';

interface SearchPageClientProps {
    initialResults: UnifiedSearchResult[];
    categories: { title: string; value: string }[];
    initialSearchTerm: string;
    initialFilters: {
        category: string;
        brokerType: string;
        type: string;
    };
    isSearchIntent?: boolean;
    relatedArticles?: any[];
}

export default function SearchPageClient({
    initialResults,
    categories,
    initialSearchTerm,
    initialFilters,
    isSearchIntent = false,
    relatedArticles = [],
}: SearchPageClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
    const [activeCategory, setActiveCategory] = useState(initialFilters.type || 'all');
    const [isRefineOpen, setIsRefineOpen] = useState(true);
    const refineSectionRef = useRef<HTMLDivElement>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState(initialSearchTerm);
    const itemsPerPage = 9;

    // Dynamically determine available listing types from results, but always ensure Software and Service are present
    const availableListingTypes = useMemo(() => {
        const types = new Set<string>(['software', 'service']);
        (initialResults || []).forEach(item => {
            if (item.listingType && typeof item.listingType === 'string') {
                // Normalize for display
                const t = item.listingType.toLowerCase();
                if (['software', 'service', 'product', 'products', 'resourceGuide'].includes(t)) {
                    types.add(t);
                }
            }
        });

        // Ensure we handle naming consistency for display
        return Array.from(types).map(t => {
            let label = t.charAt(0).toUpperCase() + t.slice(1);
            if (t === 'resourceGuide') label = 'Resource Guides';
            if (t === 'products') label = 'Products';

            return {
                label,
                value: t
            };
        });
    }, [initialResults]);

    const filteredResults = useMemo(() => {
        if (activeCategory === 'all') return (initialResults || []);
        return (initialResults || []).filter(item => {
            const lType = typeof item.listingType === 'string' ? item.listingType : '';
            return lType.toLowerCase() === activeCategory.toLowerCase();
        });
    }, [initialResults, activeCategory]);

    const handleCategoryChange = (category: string) => {
        setActiveCategory(category);
        setCurrentPage(1); // Reset to first page
        const params = new URLSearchParams(searchParams.toString());
        if (category && category !== 'all') {
            params.set('type', category);
        } else {
            params.delete('type');
        }
        router.replace(`?${params.toString()}`, { scroll: false });
    };

    const paginatedResults = useMemo(() => {
        return filteredResults.slice(0, currentPage * itemsPerPage);
    }, [filteredResults, currentPage]);

    const hasMore = paginatedResults.length < filteredResults.length;

    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search/${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const updateFilterParams = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value && value !== 'all') {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        router.push(`?${params.toString()}`);
    };

    const scrollToRefine = () => {
        setIsRefineOpen(true);
        setTimeout(() => {
            refineSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };

    return (
        <div className="bg-[#f8fafc] py-12">
            <div className="max-w-6xl mx-auto px-4 md:px-8">
                {/* Search Header */}
                {!isSearchIntent && (
                    <div className="mb-12">
                        <h1 className="text-3xl md:text-5xl font-bold text-brand-blue tracking-tight">Search results</h1>
                        <p className="text-gray-500 mt-3 font-medium">
                            {filteredResults.length} {filteredResults.length === 1 ? 'result' : 'results'} for "{initialSearchTerm}"
                        </p>
                    </div>
                )}

                {/* Filters Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
                        <button
                            onClick={() => handleCategoryChange('all')}
                            className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all border ${activeCategory === 'all' ? 'bg-brand-blue text-white border-brand-blue shadow-xl' : 'bg-white text-gray-500 border-gray-100 hover:border-gray-300'}`}
                        >
                            All
                        </button>
                        {availableListingTypes.map(type => (
                            <button
                                key={type.value}
                                onClick={() => handleCategoryChange(type.value)}
                                className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all border ${activeCategory === type.value ? 'bg-brand-blue text-white border-brand-blue shadow-xl' : 'bg-white text-gray-500 border-gray-100 hover:border-gray-300'}`}
                            >
                                {type.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={scrollToRefine}
                            className={`flex items-center gap-2 px-4 py-2.5 bg-white border ${isRefineOpen ? 'border-brand-blue border-2' : 'border-gray-100'} rounded-xl text-xs font-bold uppercase tracking-widest text-gray-600 hover:bg-gray-50 transition-all`}
                        >
                            <SlidersHorizontal size={14} /> Refine
                        </button>
                        <div className="h-6 w-px bg-gray-200"></div>
                        <div className="flex bg-white border border-gray-100 rounded-xl p-1 shadow-sm">
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-gray-100 text-brand-blue' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <ListIcon size={16} />
                            </button>
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-gray-100 text-brand-blue' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <Grid size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results Grid/List */}
                {filteredResults.length === 0 ? (
                    <div className="bg-white rounded-3xl border-2 border-dashed border-gray-100 p-20 text-center mb-20">
                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Search className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-brand-blue mb-2">No results found</h3>
                        <p className="text-gray-500 font-medium">Try adjusting your filters or search term.</p>
                    </div>
                ) : (
                    <>
                        <div className={`mb-12 ${viewMode === 'list' ? 'space-y-8' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'}`}>
                            {paginatedResults.map((item) => (
                                <DirectoryCard
                                    key={item._id}
                                    id={item._id}
                                    name={item.title || item.name || 'Untitled'}
                                    type={item.listingType || ''}
                                    tagline={typeof item.description === 'string' ? (item.description.substring(0, 80) + (item.description.length > 80 ? '...' : '')) : ''}
                                    description={item.description || ''}
                                    logo={item.logoUrl}
                                    viewMode={viewMode}
                                    slug={item.slug || ''}
                                    resultType={item._type}
                                    badges={item.badges}
                                    features={item.features}
                                    rating={item.rating || 0}
                                    reviews={item.reviews || 0}
                                    websiteUrl={item.websiteUrl}
                                />
                            ))}
                        </div>

                        {hasMore && (
                            <div className="flex justify-center mb-20">
                                <Button
                                    onClick={() => setCurrentPage(prev => prev + 1)}
                                    className="bg-brand-blue text-white hover:bg-brand-blue/90 rounded-full px-8 py-6 h-auto text-sm font-bold uppercase tracking-widest shadow-xl"
                                >
                                    Load More Results
                                </Button>
                            </div>
                        )}
                    </>
                )}

                {/* Refine Section at Bottom */}
                {isRefineOpen && (
                    <div ref={refineSectionRef} className="bg-white rounded-3xl p-8 mb-20 shadow-2xl border border-gray-100 animate-in slide-in-from-bottom-4 scroll-mt-8">
                        <div className="flex items-center justify-between mb-8 pb-4 border-b">
                            <h3 className="text-xl font-bold text-brand-blue uppercase tracking-tight">Refine Options</h3>
                            <button onClick={() => setIsRefineOpen(false)} className="p-2 hover:bg-gray-50 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="space-y-4">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Category</label>
                                <select
                                    className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-brand-blue outline-none"
                                    value={initialFilters.category || 'all'}
                                    onChange={(e) => updateFilterParams('category', e.target.value)}
                                >
                                    <option value="all">All Categories</option>
                                    {(categories || []).map(cat => (
                                        <option key={cat.value} value={cat.value}>{cat.title}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-4">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Broker Type</label>
                                <select
                                    className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-brand-blue outline-none"
                                    value={initialFilters.brokerType || 'all'}
                                    onChange={(e) => updateFilterParams('brokerType', e.target.value)}
                                >
                                    <option value="all">All Broker Types</option>
                                    <option value="Mortgage">Mortgage Broker</option>
                                    <option value="Asset Finance">Asset Finance Broker</option>
                                    <option value="Commercial">Commercial Finance Broker</option>
                                </select>
                            </div>
                            <div className="space-y-4">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Listing Type</label>
                                <select
                                    className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-brand-blue outline-none"
                                    value={initialFilters.type || 'all'}
                                    onChange={(e) => updateFilterParams('type', e.target.value)}
                                >
                                    <option value="all">All Types</option>
                                    <option value="software">Software</option>
                                    <option value="service">Service</option>
                                    <option value="resourceGuide">Resource Guide</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {/* Bottom Search Bar & Ask AI */}
                <div className="bg-gray-900 rounded-[3rem] p-12 mb-20 text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800/50 to-transparent pointer-events-none" />
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 relative z-10 leading-tight">
                        Still Not Found What You Are After?<br />
                        <span className="text-gray-400 font-medium text-lg md:text-xl mt-4 block leading-relaxed">
                            Try searching again or ask our AI for recommendations.
                        </span>
                    </h2>

                    <div className="max-w-2xl mx-auto space-y-6 relative z-10">
                        <form onSubmit={handleSearch} className="relative group/input">
                            <Input
                                placeholder="Search for vendors, products, or services"
                                className="h-16 pl-8 pr-32 rounded-3xl text-white bg-white/10 border-white/20 focus:bg-white focus:text-brand-blue transition-all shadow-2xl text-base font-bold placeholder:text-gray-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                <Button
                                    type="submit"
                                    className="h-10 rounded-2xl bg-white text-brand-blue hover:bg-gray-100 px-6 font-bold uppercase tracking-widest text-[10px]"
                                >
                                    Search
                                </Button>
                            </div>
                        </form>

                        <div className="pt-4">
                            <button
                                onClick={() => router.push(`${SITE_URLS.main}/recommendations`)}
                                className="inline-flex items-center gap-3 text-white/60 hover:text-white transition-all font-bold uppercase tracking-[0.2em] text-xs group/ai"
                            >
                                <span className="p-2 bg-white/5 rounded-xl group-hover/ai:bg-white/10 group-hover/ai:scale-110 transition-all">
                                    <MessageSquare size={16} />
                                </span>
                                Or ask AI for personalized recommendations
                                <ArrowRight size={16} className="group-hover/ai:translate-x-2 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Related Content */}
                <RelatedArticles articles={relatedArticles} />
                <StillNotSure />
            </div>
        </div>
    );
}
