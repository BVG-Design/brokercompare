'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, Filter, Sparkles, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { UnifiedSearchResult } from '@/services/sanity';
import { brokerTypes } from '@/lib/blog-categories';
import AIChatDialog from '@/components/partners/AIChatDialog';


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
}

export default function SearchPageClient({
    initialResults,
    categories,
    initialSearchTerm,
    initialFilters,
    isSearchIntent = false,
}: SearchPageClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // State for inputs (synced with URL via props)
    const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
    const [showAIChat, setShowAIChat] = useState(false);

    // Update URL helper
    const updateFilters = useCallback((key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value && value !== 'all') {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        router.push(`?${params.toString()}`);
    }, [searchParams, router]);

    const handleSearch = () => {
        // Since this is a dynamic route /search/[slug], changing the term technically implies a navigation 
        // to a new slug or just a param update? 
        // The directory page uses ?q=... but this page is /search/[slug].
        // If the user types a new term, typically we'd navigate to /search/new-term or update a 'q' param if we supported it.
        // Current architectural pattern: /search/[term]. 
        // Let's assume for now we don't change the route slug on every keystroke, but maybe we should redirect on Enter?
        // For server-side filtering of *results* matching the *slug*, we are fine.
        // But if user wants to change the search term:
        if (searchTerm !== initialSearchTerm) {
            // Navigate to new slug
            router.push(`/search/${encodeURIComponent(searchTerm)}`);
        }
    };

    const clearAll = () => {
        setSearchTerm(''); // This might need to redirect to global search or clean slug?
        // Actually, clearing all filters usually implies keeping the search term or resetting everything?
        // If we stay on /search/[slug], we can't easily "clear" the search term slug.
        // Let's just clear the *filters* (category, etc) and keep the term.
        router.push(`/search/${encodeURIComponent(initialSearchTerm)}`);
    };

    return (
        <>
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
                            <Select
                                value={initialFilters.category}
                                onValueChange={(val) => updateFilters('category', val)}
                            >
                                <SelectTrigger className="h-12">
                                    <SelectValue placeholder="All Categories" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.value} value={cat.value}>
                                            {cat.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-foreground mb-2 block">Broker Type</label>
                            <Select
                                value={initialFilters.brokerType}
                                onValueChange={(val) => updateFilters('brokerType', val)}
                            >
                                <SelectTrigger className="h-12">
                                    <SelectValue placeholder="All Broker Types" />
                                </SelectTrigger>
                                <SelectContent>
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
                            <Select
                                value={initialFilters.type}
                                onValueChange={(val) => updateFilters('type', val)}
                            >
                                <SelectTrigger className="h-12">
                                    <SelectValue placeholder="All Listings" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Listings</SelectItem>
                                    <SelectItem value="software">Software</SelectItem>
                                    <SelectItem value="service">Services</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* AI Chat CTA - Centered below filters */}
                    <div className="mt-8 mb-8 text-center">
                        <Button
                            onClick={() => setShowAIChat(true)}
                            size="lg"
                            className="bg-brand-orange hover:bg-orange-600 text-white shadow-lg hover:shadow-xl transition-all h-14 px-8 text-lg rounded-lg"
                        >
                            <Sparkles className="w-5 h-5 mr-2 animate-pulse" />
                            Ask AI for personalized recommendations
                        </Button>
                    </div>

                    {(initialFilters.category !== 'all' || initialFilters.brokerType !== 'all' || initialFilters.type !== 'all') && (
                        <div className="mt-4 pt-4 border-t flex justify-center">
                            <Button variant="ghost" size="sm" onClick={clearAll} className="text-muted-foreground hover:text-foreground">
                                <X className="w-4 h-4 mr-2" />
                                Clear all filters
                            </Button>
                        </div>
                    )}
                </div>

                {!isSearchIntent && (
                    <div className="mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-foreground">Search results</h1>
                        <p className="text-muted-foreground mt-2">
                            {initialResults.length} {initialResults.length === 1 ? 'result' : 'results'} for "{searchTerm}"
                        </p>
                    </div>
                )}

                {initialResults.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-muted-foreground/40 p-8 text-center">
                        <p className="text-lg font-medium">No results found.</p>
                        <p className="text-muted-foreground mt-2">Try adjusting your filters or search term.</p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {initialResults.map((item) => {
                            const title = item.title || item.name || 'Untitled';
                            const imageUrl = item.logoUrl || item.heroImageUrl;
                            const href = item._type === 'blog' ? `/blog/${item.slug}` : `/directory/${item.slug}`;

                            return (
                                <Link
                                    key={item._id}
                                    href={href}
                                    className="group flex flex-col rounded-xl border border-border bg-card p-5 transition hover:shadow-md h-full"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        {imageUrl ? (
                                            <img
                                                src={imageUrl}
                                                alt={title}
                                                className="h-16 w-16 rounded-lg object-contain bg-white p-1 border hover:scale-105 transition-transform"
                                            />
                                        ) : (
                                            <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center p-2">
                                                <Search className="h-8 w-8 text-muted-foreground/50" />
                                            </div>
                                        )}
                                        <div className="flex flex-col items-end gap-2">
                                            {item.tags?.slice(0, 1).map((tag) => (
                                                <span key={tag} className="inline-flex items-center rounded-full bg-brand-blue/10 px-2.5 py-0.5 text-xs font-medium text-brand-blue border border-brand-blue/20">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-2 mb-2">
                                            <span className="text-xs font-semibold text-brand-orange uppercase tracking-wider">{item.category}</span>
                                            {(Array.isArray(item.brokerType) ? item.brokerType : [item.brokerType]).filter(Boolean).slice(0, 2).map((bt) => (
                                                <span key={bt} className="text-[10px] px-1.5 py-0.5 bg-muted rounded text-muted-foreground font-medium">
                                                    {bt}
                                                </span>
                                            ))}
                                        </div>

                                        <h2 className="text-xl font-bold text-foreground group-hover:text-primary line-clamp-1 mb-2">
                                            {title}
                                        </h2>

                                        {item.description ? (
                                            <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                                                {item.description}
                                            </p>
                                        ) : null}
                                    </div>

                                    <div className="pt-4 mt-auto border-t border-border/50">
                                        <Button
                                            variant="outline"
                                            className="w-full group-hover:bg-brand-orange group-hover:text-white group-hover:border-brand-orange transition-all"
                                        >
                                            See More
                                        </Button>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div >
            <AIChatDialog open={showAIChat} onOpenChange={setShowAIChat} />
        </>
    );
}
