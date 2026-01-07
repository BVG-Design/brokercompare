
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { flatCategories, brokerTypes, blogTypes } from '@/lib/blog-categories';

interface Author {
    _id: string;
    name: string;
}

interface BlogFiltersProps {
    authors?: Author[];
}

export function BlogFilters({ authors = [] }: BlogFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Get current filter values
    const currentCategory = searchParams.get('category') || 'all';
    const currentBrokerType = searchParams.get('brokerType') || 'all';
    const currentBlogType = searchParams.get('blogType') || 'all';
    const currentAuthor = searchParams.get('author') || 'all';
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

        router.push(`/blog?${params.toString()}`, { scroll: false });
    };

    const clearFilters = () => {
        const params = new URLSearchParams();
        if (currentSearch) params.set('q', currentSearch); // Preserve search
        router.push(`/blog?${params.toString()}`, { scroll: false });
    };

    const hasActiveFilters = currentCategory !== 'all' || currentBrokerType !== 'all' || currentBlogType !== 'all' || currentAuthor !== 'all';

    return (
        <div className="w-full">
            <div className="bg-transparent text-left">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-primary" />
                        <h3 className="font-bold text-primary text-sm uppercase tracking-wider">Refine Results</h3>
                    </div>
                    {hasActiveFilters && (
                        <Button
                            variant="link"
                            size="sm"
                            onClick={clearFilters}
                            className="text-secondary hover:text-secondary/80 p-0 h-auto text-[10px] font-black uppercase tracking-widest"
                        >
                            Reset All
                        </Button>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Category Filter */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">Category</label>
                        <Select
                            value={currentCategory}
                            onValueChange={(val) => updateFilters('category', val)}
                        >
                            <SelectTrigger className="h-10 bg-white border-primary/5 text-primary text-xs rounded-xl shadow-sm focus:ring-2 focus:ring-secondary/20 hover:border-secondary/20 transition-all font-bold">
                                <SelectValue placeholder="All categories" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-primary/5 shadow-2xl">
                                {flatCategories.map((cat) => (
                                    <SelectItem key={cat.value} value={cat.value} className="text-xs font-medium focus:bg-brand-cream">
                                        {cat.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Broker Type Filter */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">Broker Type</label>
                        <Select
                            value={currentBrokerType}
                            onValueChange={(val) => updateFilters('brokerType', val)}
                        >
                            <SelectTrigger className="h-10 bg-white border-primary/5 text-primary text-xs rounded-xl shadow-sm focus:ring-2 focus:ring-secondary/20 hover:border-secondary/20 transition-all font-bold">
                                <SelectValue placeholder="All layouts" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-primary/5 shadow-2xl">
                                {brokerTypes.map((type) => (
                                    <SelectItem key={type.value} value={type.value} className="text-xs font-medium focus:bg-brand-cream">
                                        {type.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Blog Type Filter */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">Article Type</label>
                        <Select
                            value={currentBlogType}
                            onValueChange={(val) => updateFilters('blogType', val)}
                        >
                            <SelectTrigger className="h-10 bg-white border-primary/5 text-primary text-xs rounded-xl shadow-sm focus:ring-2 focus:ring-secondary/20 hover:border-secondary/20 transition-all font-bold">
                                <SelectValue placeholder="Any format" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-primary/5 shadow-2xl">
                                {blogTypes.map((type) => (
                                    <SelectItem key={type.value} value={type.value} className="text-xs font-medium focus:bg-brand-cream">
                                        {type.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Co-Hosts Filter */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">Co-Hosts</label>
                        <Select
                            value={currentAuthor}
                            onValueChange={(val) => updateFilters('author', val)}
                        >
                            <SelectTrigger className="h-10 bg-white border-primary/5 text-primary text-xs rounded-xl shadow-sm focus:ring-2 focus:ring-secondary/20 hover:border-secondary/20 transition-all font-bold">
                                <SelectValue placeholder="All experts" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-primary/5 shadow-2xl">
                                <SelectItem value="all" className="text-xs font-medium">All Expert Co-Hosts</SelectItem>
                                {authors.map((author) => (
                                    <SelectItem key={author._id} value={author._id} className="text-xs font-medium focus:bg-brand-cream">
                                        {author.name}
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
