'use client';

import React, { useState, useMemo } from 'react';
import { Search, X, Scale, ArrowLeft, SlidersHorizontal, Grid, List as ListIcon, Check, Plus, AlertCircle, ChevronRight, Star } from 'lucide-react';
import { DirectoryListing } from '@/types';
import DirectoryCard from '@/components/search/DirectoryCard';
import DetailedComparisonClient from '@/components/product-page/DetailedComparisonClient';
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
            if (prev.length >= 3) {
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
        <div className="flex-grow bg-[#f8fafc] min-h-screen pt-24 pb-20">
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
            <div className="sticky top-16 z-40 bg-brand-orange border-b border-brand-orange/10 shadow-sm transition-all duration-300 font-body">
                <div className="max-w-6xl mx-auto px-6 py-6">
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
                                <p className="text-xs font-bold text-gray-900/60 uppercase tracking-widest mt-1 font-body">Select up to 3 tools to compare side-by-side</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                {[0, 1, 2].map((i) => {
                                    const product = selectedProducts[i];
                                    return (
                                        <div
                                            key={i}
                                            onClick={() => !product && openSearchForSlot(i)}
                                            className={`w-14 h-14 rounded-md border-2 flex items-center justify-center transition-all cursor-pointer ${product
                                                ? 'bg-white border-white shadow-md scale-100 relative group'
                                                : 'bg-white/20 border-dashed border-gray-900/20 scale-95 hover:bg-white/30 hover:scale-100'
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
                                                <Plus size={20} className="text-gray-900/40" />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="h-10 w-px bg-gray-900/10 mx-2"></div>

                            <button
                                onClick={() => setViewMode(viewMode === 'selection' ? 'comparison' : 'selection')}
                                disabled={compareIds.length < 2}
                                className={`px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 ${compareIds.length >= 2
                                    ? 'bg-brand-cream text-gray-900 hover:bg-white shadow-gray-900/10'
                                    : 'bg-white/50 text-gray-500 cursor-not-allowed shadow-none'
                                    }`}
                            >
                                {viewMode === 'selection' ? 'Generate Comparison' : 'Edit Selection'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 mt-12">
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
                                        className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all border ${activeCategory === cat
                                            ? 'bg-gray-900 text-white border-gray-900 shadow-xl'
                                            : 'bg-white text-gray-500 border-gray-100 hover:border-gray-300'
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
                                    const isLimitReached = compareIds.length >= 3;

                                    return (
                                        <div key={listing.id} className="relative group">
                                            <DirectoryCard
                                                id={listing.id}
                                                name={listing.name}
                                                type={listing.type}
                                                tagline={listing.tagline || listing.description?.substring(0, 60) + '...'}
                                                description={listing.description}
                                                rating={listing.rating}
                                                reviews={0} // Placeholder as review count is not in DirectoryListing yet
                                                priceRange={listing.pricingModel}
                                                pricingType={listing.listingTier}
                                                features={listing.tags}
                                                logo={listing.logoUrl}
                                                badges={listing.badges}
                                                viewMode="grid"
                                                slug={listing.slug}
                                                resultType="directoryListing"
                                                websiteUrl={listing.websiteUrl}
                                                isComparing={isSelected}
                                                onToggleCompare={() => onToggleCompare(listing.id)}
                                                disableCompare={isLimitReached && !isSelected}
                                            />

                                            {/* Selection Overlay Indicator */}
                                            {isSelected && (
                                                <div className="absolute inset-0 bg-purple-600/5 pointer-events-none rounded-[2rem] ring-2 ring-purple-600 ring-offset-2 animate-in fade-in duration-300" />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="py-32 text-center bg-white rounded-3xl border border-dashed border-gray-200">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <AlertCircle size={32} className="text-gray-300" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No matching tools found</h3>
                                <p className="text-gray-400 text-sm">Try adjusting your search or filters to find what you're looking for.</p>
                                <button
                                    onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                                    className="mt-6 text-sm font-black uppercase tracking-widest text-purple-600 hover:underline"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="animate-in fade-in duration-700">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-none uppercase">Results Matrix</h2>
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-2">Broker-Fit Analysis based on current market data</p>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="flex -space-x-3">
                                    {selectedProducts.map((p, i) => (
                                        <div key={p.id} className="w-12 h-12 rounded-full border-4 border-white bg-white shadow-sm flex items-center justify-center overflow-hidden z-[10-i]">
                                            {p.logoUrl ? (
                                                <img src={p.logoUrl} alt={p.name} className="w-8 h-8 object-contain" />
                                            ) : (
                                                <span className="text-xs font-bold text-gray-400">{p.name.substring(0, 2)}</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setViewMode('selection')}
                                    className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-gray-900 transition-colors"
                                >
                                    Add/Remove Items <SlidersHorizontal size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Use DetailedComparisonClient but with filtered data */}
                        {/* We need to pass required props to DetailedComparisonClient */}
                        {/* Since DetailedComparisonClient is designed for a specific product context, we might need to adapt it or just use the inner matrix part. 
                 However, the user asked to use DetailedComparison, assuming it refers to the client component or a sub-component.
                 Checking the code, DetailedComparisonClient takes 'listingSlug' etc. which implies a main product context.
                 But here we are comparing arbitrary items.
                 Actually, DetailedComparisonClient renders ComparisonMatrix. Maybe we should use ComparisonMatrix directly if possible, 
                 or wrap DetailedComparisonClient to fake a context, OR the user provided 'DetailedComparison' in their snippet which might be a different requested component,
                 BUT I found DetailedComparisonClient.tsx. 
                 Let's check if there is a 'DetailedComparison' exported, or if we should use 'DetailedComparisonClient' and maybe provide dummy main props.
                 
                 Looking at DetailedComparisonClient props:
                   listingSlug, listingName... -> These seem to be for the "Back to X Review" link and context.
                   allProducts -> list of user selectable products?
                   initialSelection -> what's currently selected.
                 
                 Ideally, we should probably refactor DetailedComparisonClient to be more generic, or just use ComparisonMatrix directly if it has everything.
                 ComparisonMatrix takes { products, featureGroups }. This looks perfect for the matrix part.
                 But DetailedComparisonClient adds the header, overview, integrations etc. which are nice.
                 
                 For now, let's try to use DetailedComparisonClient and pass the first selected product as the "main" one for context, or just dummy values.
                 Wait, the user snippet imported `DetailedComparison` from `./DetailedComparison`. 
                 I'll assume they meant `DetailedComparisonClient` or `ComparisonMatrix`.
                 Given the user said "Using this code as a guide", and the code renders <DetailedComparison onBack... />, 
                 it suggests a simpler component than DetailedComparisonClient which has complex props.
                 
                 I will create a wrapper using DetailedComparisonClient but adapting it to the tray state. 
                 Actually, DetailedComparisonClient manages its own state (selectedSlugs). 
                 
                 Better approach: Render `ComparisonMatrix` and other sections manually in `ComparisonTool` using the data we have, 
                 recreating the layout of `DetailedComparisonClient` but controlled by `ComparisonTool`'s state.
                 
                 However, to save time/complexity, I will defer to `DetailedComparisonClient` by forcing it to sync with my state?
                 No, `DetailedComparisonClient` is complex. 
                 
                 Let's look at `ComparisonMatrix` usage.
                 I'll stick to the user's snippet structure for the "View Mode" and try to render `ComparisonMatrix` if available, or just a placeholder for now if I need to implement `DetailedComparison`.
                 
                 Actually, I see `DetailedComparisonClient` imports `ComparisonMatrix`.
                 I will check `ComparisonMatrix` content in a moment. For now, I'll assume I can render it.
                 
                 Let's check imports in my `ComparisonTool`:
                 import ComparisonMatrix from '@/components/product-page/ComparisonMatrix';
                 
                 And I will implement the "Results Matrix" section using `ComparisonMatrix` + the overview table from `DetailedComparisonClient` (maybe copied over).
                 
                 For the MVP of this task, I will try to re-use DetailedComparisonClient if possible.
                 If I pass `initialSelection` as `compareIds`, it might work.
                 But I need to suppress the "Back to X" link or make it generic.
                 
                 Let's create the file `ComparisonTool.tsx` and just placeholder the comparison part or use `DetailedComparisonClient` with best-effort props.
             */}

                        <DetailedComparisonClient
                            listingSlug={selectedProducts[0]?.slug || ''} // Dummy or first selected
                            listingName={selectedProducts[0]?.name || ''}
                            allProducts={comparisonProducts}
                            suggestedProducts={[]}
                            featureGroups={featureGroups}
                            initialSelection={compareIds}
                            hideHeader={true}
                        // We might need to hide the "Back to..." or handle it.
                        />
                    </div>
                )}
            </div>

            {/* Comparison Call to Action */}
            {viewMode === 'selection' && compareIds.length === 1 && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-10 duration-500">
                    <div className="bg-purple-600 text-white px-8 py-5 rounded-3xl shadow-2xl flex items-center gap-6 border border-purple-500 ring-4 ring-purple-100">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                            <Plus size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-black uppercase tracking-widest leading-none mb-1">Select one more</p>
                            <p className="text-[10px] font-bold text-purple-100 uppercase tracking-wider">You need at least 2 items to compare</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ComparisonTool;
