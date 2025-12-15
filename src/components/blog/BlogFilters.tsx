'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { flatCategories, brokerTypes, listingTypes } from '@/lib/blog-categories';

export function BlogFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Get current filter values
    const currentCategory = searchParams.get('category') || 'all';
    const currentBrokerType = searchParams.get('brokerType') || 'all';
    const currentListingType = searchParams.get('listingType') || 'all';
    const currentSearch = searchParams.get('q');

    const updateFilters = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (value && value !== 'all') {
            params.set(key, value);
        } else {
            params.delete(key);
        }

        // Always preserve search if it exists
        if (!currentSearch) {
            params.delete('q');
        }

        // Reset pagination if implementation existed (not yet, but good practice)
        // params.delete('page');

        router.push(`/blog?${params.toString()}`);
    };

    const clearFilters = () => {
        const params = new URLSearchParams();
        if (currentSearch) params.set('q', currentSearch); // Preserve search
        router.push(`/blog?${params.toString()}`);
    };

    const hasActiveFilters = currentCategory !== 'all' || currentBrokerType !== 'all' || currentListingType !== 'all';



    return (
        <div className="w-full max-w-5xl mx-auto mt-4">
            <div className="bg-white rounded-xl shadow-sm border border-border/10 p-3 text-left">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-primary" />
                        <h3 className="font-bold text-primary text-base">Filters</h3>
                    </div>
                    {hasActiveFilters && (
                        <Button
                            variant="link"
                            size="sm"
                            onClick={clearFilters}
                            className="text-[#f97316] hover:text-[#ea580c] p-0 h-auto text-xs font-semibold"
                        >
                            Clear all filters
                        </Button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Category Filter */}
                    <div>
                        <label className="text-[10px] font-bold text-primary mb-1 block uppercase tracking-wide">Category</label>
                        <Select
                            value={currentCategory}
                            onValueChange={(val) => updateFilters('category', val)}
                        >
                            <SelectTrigger className="h-9 bg-[#FEFCE8] border-border/40 text-foreground text-xs rounded-lg shadow-sm focus:ring-1 focus:ring-primary/20">
                                <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent>
                                {flatCategories.map((cat) => (
                                    <SelectItem key={cat.value} value={cat.value}>
                                        {cat.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Broker Type Filter */}
                    <div>
                        <label className="text-[10px] font-bold text-primary mb-1 block uppercase tracking-wide">Broker Type</label>
                        <Select
                            value={currentBrokerType}
                            onValueChange={(val) => updateFilters('brokerType', val)}
                        >
                            <SelectTrigger className="h-9 bg-[#FEFCE8] border-border/40 text-foreground text-xs rounded-lg shadow-sm focus:ring-1 focus:ring-primary/20">
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

                    {/* Listing Type (Article Type) Filter */}
                    <div>
                        <label className="text-[10px] font-bold text-primary mb-1 block uppercase tracking-wide">Listing Type</label>
                        <Select
                            value={currentListingType}
                            onValueChange={(val) => updateFilters('listingType', val)}
                        >
                            <SelectTrigger className="h-9 bg-[#FEFCE8] border-border/40 text-foreground text-xs rounded-lg shadow-sm focus:ring-1 focus:ring-primary/20">
                                <SelectValue placeholder="All listing type" />
                            </SelectTrigger>
                            <SelectContent>
                                {listingTypes.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                        {type.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
        </div>
    );
}
