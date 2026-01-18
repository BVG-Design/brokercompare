'use client';

import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fetchUnifiedSearchResults } from '@/services/sanity';
import { SITE_URLS } from '@/lib/config';
import TopCRMsCarousel from './TopCRMsCarousel';

const TopCRMsSection = () => {
    const [listings, setListings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('All');

    const tabs = ['All', 'Mortgage', 'Asset', 'Commercial'];

    useEffect(() => {
        const loadListings = async () => {
            setLoading(true);
            try {
                const filterBrokerType = activeTab === 'All' ? 'all' : activeTab.toLowerCase();

                // Fetch on client
                console.log(`[TopCRMsSection] Fetching for category: broker-industry-tools, brokerType: ${filterBrokerType}`);

                const results = await fetchUnifiedSearchResults(
                    [''], // Empty search term to get all matching filters
                    ['directoryListing'],
                    {
                        category: 'broker-industry-tools',
                        brokerType: filterBrokerType,
                        type: 'all'
                    }
                );

                console.log('[TopCRMsSection] Raw Results:', results);

                // Extract and map directory listings
                // fetchUnifiedSearchResults returns UnifiedSearchResult[], which is a flat array. 
                // It does NOT return an object with { directoryListings: ... } based on the signature in services/sanity.ts:
                // export const fetchUnifiedSearchResults = async (...): Promise<UnifiedSearchResult[]> => ...
                // Wait, checking the actual file content in previous step (Step 16)
                // It returns [...slugFirst.values(), ...byId.values()] which is an array.
                // However, in the *previous* version of TopCRMsSection (Step 12), it accessed `results.directoryListings || results.listings || []`.
                // This suggests the previous code might have been wrong or the return type changed. 
                // Looking at Step 16 `src/services/sanity.ts`, `fetchUnifiedSearchResults` returns `Promise<UnifiedSearchResult[]>`.
                // So `results` IS the array. The previous code `results.directoryListings` would have been undefined if it was just the array.
                // Let's assume it returns an array. SearchPage expects { success: boolean, results: ... } from API, but here we call the service function directly?
                // Step 12 code: `import { fetchUnifiedSearchResults } from '@/services/sanity';` -> Direct import.
                // SearchPage (Step 13) calls `/api/unified-search`.
                // Direct call returns array.

                const data = Array.isArray(results) ? results : (results as any).results || [];

                const mappedListings = data.map((item: any) => {
                    // Normalize brokerType to array of strings
                    let brokerTypes = [];
                    if (Array.isArray(item.brokerType)) {
                        brokerTypes = item.brokerType.map((bt: any) =>
                            typeof bt === 'string' ? bt : bt.title || bt.name
                        ).filter(Boolean);
                    } else if (typeof item.brokerType === 'string') {
                        brokerTypes = [item.brokerType];
                    }

                    return {
                        id: item._id,
                        company_name: item.title || item.name,
                        logo_url: item.logoUrl,
                        slug: item.slug,
                        tagline: item.tagline || item.description,
                        rating: item.rating ? { average: item.rating, reviewCount: item.reviews || 0 } : null,
                        websiteUrl: item.websiteUrl,
                        brokerTypes: brokerTypes,
                        listing_tier: item.isFeatured ? 'featured' : 'free',
                        description: item.tagline || item.description || '',
                        badges: item.badges || []
                    };
                });

                console.log('[TopCRMsSection] Mapped Listings:', mappedListings);
                setListings(mappedListings);
            } catch (error) {
                console.error('Error fetching Broker Tools:', error);
            } finally {
                setLoading(false);
            }
        };

        loadListings();
    }, [activeTab]);

    return (
        <section className="pt-24 pb-3 bg-gray-100 border-t border-gray-100 overflow-hidden relative">
            <div className="container md:mx-auto px-4 md:px-8 mb-16 relative z-10 w-full overflow-hidden">
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <div className="h-px w-12 bg-brand-orange"></div>
                        <span className="text-brand-orange text-xs font-black uppercase tracking-[0.2em]">Broker Specific</span>
                        <div className="h-px w-12 bg-brand-orange"></div>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-brand-blue mb-6">
                        CRMs, Document Collection and Other Industry Tools
                    </h2>

                    {/* Filter Tabs */}
                    <div className="flex flex-wrap justify-center gap-2 mb-8">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${activeTab === tab
                                    ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20 transform scale-105'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mb-12 min-h-[400px]">
                    {loading ? (
                        <div className="flex items-center justify-center h-[400px]">
                            <div className="text-brand-blue animate-pulse">Loading tools...</div>
                        </div>
                    ) : listings.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300 mx-auto max-w-2xl">
                            <p className="text-gray-500 mb-2">No broker tools found for {activeTab}.</p>
                        </div>
                    ) : (
                        <TopCRMsCarousel listings={listings} />
                    )}
                </div>

                <div className="text-center">
                    <Button
                        onClick={() => window.location.href = `${SITE_URLS.directory}/search?category=broker-industry-tools&brokerType=${activeTab === 'All' ? 'all' : activeTab.toLowerCase()}`}
                        variant="outline"
                        className="group bg-white border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white transition-all px-8 py-6 text-lg rounded-xl shadow-sm"
                    >
                        View All <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default TopCRMsSection;