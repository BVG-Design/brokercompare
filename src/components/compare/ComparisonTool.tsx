'use client';

import React, { useState, useMemo } from 'react';
import { Search, X, Scale, ArrowLeft, SlidersHorizontal, Grid, List as ListIcon, Check, Plus, AlertCircle, ChevronRight, Star } from 'lucide-react';
import { DirectoryListing } from '@/types';
import PartnerCard from '@/components/partners/PartnerCard';
import Link from 'next/link';
import { ComparisonTable } from './ComparisonTable';
import { ComparisonFeatureGroup, ComparisonProduct } from '@/types/comparison';

interface ComparisonToolProps {
    listings: DirectoryListing[];
    featureGroups: ComparisonFeatureGroup[];
}

const ComparisonTool: React.FC<ComparisonToolProps> = ({ listings, featureGroups }) => {
    const [viewMode, setViewMode] = useState<'selection' | 'comparison'>('selection');
    const [compareIds, setCompareIds] = useState<string[]>([]);
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [targetSlot, setTargetSlot] = useState<number | null>(null);

    const openSearchForSlot = (index: number) => {
        setTargetSlot(index);
        setIsSearchModalOpen(true);
    };

    const onToggleCompare = (id: string) => {
        setCompareIds(prev => {
            if (prev.includes(id)) {
                return prev.filter(item => item !== id);
            }
            if (prev.length >= 4) {
                return prev;
            }
            const newIds = [...prev, id];
            if (isSearchModalOpen) {
                setIsSearchModalOpen(false);
            }
            return newIds;
        });
    };

    const filteredListings = useMemo(() => {
        let results = listings.filter(item => {
            // Assuming item.type is the category or using item.categories array
            const itemCategory = item.type || (item.categories && item.categories[0]) || '';
            const matchesCategory = activeCategory === 'All' || itemCategory === activeCategory;
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchesCategory && matchesSearch;
        });

        // Default sorting: Prioritize CRM and Fact Find badges
        if (!searchQuery && activeCategory === 'All') {
            results.sort((a, b) => {
                const aHasPriority = (a.badges || []).some(b => b === 'CRM' || b === 'Fact Find');
                const bHasPriority = (b.badges || []).some(b => b === 'CRM' || b === 'Fact Find');
                if (aHasPriority && !bHasPriority) return -1;
                if (!aHasPriority && bHasPriority) return 1;
                return 0;
            });
        }

        return results;
    }, [listings, activeCategory, searchQuery]);

    const selectedProducts = useMemo(() => {
        return listings.filter(item => compareIds.includes(item.id));
    }, [listings, compareIds]);

    // Transform directory listings to comparison products for the detailed view
    const comparisonProducts = useMemo((): ComparisonProduct[] => {
        return listings.map(l => ({
            slug: l.slug,
            name: l.name,
            logoUrl: l.logoUrl,
            rating: l.rating,
            priceText: l.pricingModel, // Use available pricing data
            websiteUrl: l.websiteUrl,
            // Map other fields as necessary, ensuring they match ComparisonProduct type
            // Provide defaults for missing optional fields if needed
        }));
    }, [listings]);

    const categories = useMemo(() => {
        const cats = new Set(listings.map(l => l.type || (l.categories && l.categories[0]) || 'Other'));
        return ['All', ...Array.from(cats)].filter(Boolean);
    }, [listings]);


    return (
        <div className="flex-grow bg-gray-50 min-h-screen pt-24 pb-20">
            {/* Search Modal */}
            {isSearchModalOpen && (
                <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                            <div>
                                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Select a tool</h2>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Add to comparison slot {targetSlot !== null ? targetSlot + 1 : ''}</p>
                            </div>
                            <button onClick={() => setIsSearchModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
                            <div className="relative mb-6">
                                <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search tools..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    autoFocus
                                    className="w-full pl-14 pr-6 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 transition-all font-medium"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {filteredListings.map(listing => {
                                    const isSelected = compareIds.includes(listing.id);
                                    if (isSelected) return null; // Already selected
                                    return (
                                        <div key={listing.id} onClick={() => onToggleCompare(listing.id)} className="bg-white p-4 rounded-xl border border-gray-200 hover:border-brand-orange cursor-pointer transition-all hover:shadow-md flex items-center gap-4 group">
                                            <div className="w-12 h-12 bg-white rounded-lg border border-gray-100 flex items-center justify-center p-2">
                                                {listing.logoUrl ? <img src={listing.logoUrl} className="w-full h-full object-contain" /> : <span className="font-bold text-gray-300">{listing.name[0]}</span>}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900 group-hover:text-brand-orange transition-colors">{listing.name}</h3>
                                                <p className="text-xs text-gray-500 line-clamp-1">{listing.tagline}</p>
                                            </div>
                                            <Plus size={16} className="ml-auto text-gray-300 group-hover:text-brand-orange" />
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Comparison Header / Tray */}
            <div className="sticky top-16 z-40 bg-white border-b border-gray-200 shadow-xl shadow-gray-500/50 transition-all duration-300 font-body">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            {/* Back button logic can be handled by parent or left as is if just navigating view modes */}
                            {viewMode === 'comparison' && (
                                <button
                                    onClick={() => setViewMode('selection')}
                                    className="p-2.5 rounded-md hover:bg-black/5 text-gray-900 transition-colors"
                                >
                                    <ArrowLeft size={20} />
                                </button>
                            )}
                            <div>
                                <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight leading-none font-headline">Comparison Hub</h1>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1 font-body">Select up to 3 tools to compare side-by-side</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                {[0, 1, 2, 3].map((i) => {
                                    const product = selectedProducts[i];
                                    return (
                                        <div
                                            key={i}
                                            onClick={() => !product && openSearchForSlot(i)}
                                            className={`w-14 h-14 rounded-md border-2 flex items-center justify-center transition-all cursor-pointer ${product
                                                ? 'bg-white border-white shadow-md scale-100 relative group'
                                                : 'bg-gray-50 border-dashed border-gray-300 scale-95 hover:bg-white hover:border-gray-400 hover:scale-100'
                                                }`}
                                        >
                                            {product ? (
                                                <>
                                                    {product.logoUrl ? (
                                                        <img src={product.logoUrl} alt={product.name} className="w-8 h-8 object-contain" />
                                                    ) : (
                                                        <span className="text-xs font-bold text-gray-400">{product.name.substring(0, 2)}</span>
                                                    )}
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); onToggleCompare(product.id); }}
                                                        className="absolute -top-1 -right-1 bg-gray-900 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                                    >
                                                        <X size={10} />
                                                    </button>
                                                </>
                                            ) : (
                                                <Plus size={20} className="text-gray-400" />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="h-10 w-px bg-gray-200 mx-2"></div>

                            <button
                                onClick={() => setViewMode(viewMode === 'selection' ? 'comparison' : 'selection')}
                                disabled={compareIds.length < 2}
                                className={`px-8 py-3.5 rounded-md text-xs font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 ${compareIds.length >= 2
                                    ? 'bg-brand-blue text-white hover:bg-brand-blue/90 shadow-brand-blue/20'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                                    }`}
                            >
                                {viewMode === 'selection' ? 'Generate Comparison' : 'Edit Selection'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-8">
                {viewMode === 'selection' ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Search and Filters */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                            <div className="relative flex-1 max-w-xl group">
                                <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-blue transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search tools to add..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-14 pr-6 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 transition-all font-medium"
                                />
                            </div>

                            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
                                {categories.slice(0, 5).map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setActiveCategory(cat)}
                                        className={`px-6 py-2.5 rounded-md text-xs font-black uppercase tracking-widest transition-all border ${activeCategory === cat
                                            ? 'bg-brand-orange text-white border-brand-orange shadow-xl'
                                            : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-900'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* List/Grid of Tools */}
                        {filteredListings.length > 0 ? (
                            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8`}>
                                {filteredListings.map((listing) => {
                                    const isSelected = compareIds.includes(listing.id);
                                    const isLimitReached = compareIds.length >= 4;

                                    return (
                                        <div key={listing.id} className="relative group/card">
                                            <PartnerCard
                                                partner={{
                                                    ...listing,
                                                    company_name: listing.name,
                                                    logo_url: listing.logoUrl,
                                                    listing_tier: listing.listingTier || 'free',
                                                    // Map other fields if necessary
                                                }}
                                                viewMode="grid"
                                                isComparing={isSelected}
                                                onToggleCompare={() => onToggleCompare(listing.id)}
                                                disableCompare={isLimitReached && !isSelected}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="py-32 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Search size={32} className="text-gray-300" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No matching tools found</h3>
                                <p className="text-gray-500 text-sm">Try adjusting your search or filters to find what you're looking for.</p>
                                <button
                                    onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                                    className="mt-6 text-sm font-black uppercase tracking-widest text-brand-blue hover:underline"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="animate-in fade-in duration-700">


                        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
                            <div className="mb-6 flex items-center justify-between">
                                <Link
                                    href="/compare"
                                    onClick={(e) => { e.preventDefault(); setViewMode('selection'); }}
                                    className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-brand-blue transition-colors"
                                >
                                    <ArrowLeft size={16} /> Back to Selection
                                </Link>
                            </div>

                            <ComparisonTable
                                items={selectedProducts.map(listing => ({
                                    id: listing.id,
                                    type: listing.type === 'service' ? 'service' : 'software',
                                    name: listing.name,
                                    logoUrl: listing.logoUrl || '',
                                    category: (listing.categories && listing.categories[0]) || 'General',
                                    data: listing as any
                                }))}
                                onRemove={(id) => onToggleCompare(id)}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Comparison Call to Action */}
            {viewMode === 'selection' && compareIds.length > 0 && compareIds.length < 2 && (
                <div
                    className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-10 duration-500 cursor-pointer"
                    onClick={() => setIsSearchModalOpen(true)}
                >
                    <div className="bg-brand-orange text-white px-8 py-5 rounded-xl shadow-2xl flex items-center gap-6 border border-orange-500 ring-4 ring-orange-100 hover:scale-105 transition-transform">
                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                            <Plus size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-black uppercase tracking-widest leading-none mb-1">Select one more</p>
                            <p className="text-xs font-bold text-orange-100 uppercase tracking-wider">You need at least 2 items to compare</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ComparisonTool;
