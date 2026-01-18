'use client';

import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fetchDirectoryListings } from '@/services/sanity';
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
                const filterBrokerType = activeTab === 'All' ? 'all' : activeTab;

                const results = await fetchDirectoryListings({
                    category: 'broker-industry-tools',
                    brokerType: filterBrokerType
                });

                const mappedListings = results.map((item) => ({
                    id: item.id,
                    company_name: item.name,
                    logo_url: item.logoUrl,
                    slug: item.slug,
                    tagline: item.tagline,
                    rating: item.rating,
                    websiteUrl: item.websiteUrl,
                    brokerTypes: item.brokerTypes || [],
                    listing_tier: item.listingTier || 'free',
                    description: item.description || '',
                    badges: item.badges || []
                }));

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
                        onClick={() => window.location.href = `${SITE_URLS.directory}/search?category=broker-industry-tools&brokerType=${activeTab === 'All' ? 'all' : activeTab}`}
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