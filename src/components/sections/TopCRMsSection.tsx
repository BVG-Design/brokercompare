'use client';

import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { fetchTopCRMs } from '@/services/sanity';
import PartnerCard from '@/components/partners/PartnerCard';
import { Button } from '@/components/ui/button';
import { SITE_URLS } from '@/lib/config';

const TopCRMsSection = () => {
    const [listings, setListings] = useState<any[]>([]);
    const [filteredListings, setFilteredListings] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState('All');
    const [loading, setLoading] = useState(true);

    const tabs = ['All', 'Mortgage', 'Asset', 'Commercial'];

    useEffect(() => {
        const loadListings = async () => {
            try {
                const data = await fetchTopCRMs();

                // Map Sanity data to PartnerCard props
                const mappedData = data.map((item: any) => ({
                    id: item._id,
                    company_name: item.title,
                    logo_url: item.logo,
                    slug: item.slug,
                    tagline: item.tagline,
                    rating: item.rating,
                    websiteUrl: item.websiteURL,
                    brokerTypes: item.brokerType || [],
                    listing_tier: 'free', // Default or fetch if available
                    description: item.tagline || '', // Use tagline as description if description is missing or short
                    badges: item.subCategory?.map((s: any) => s.title).filter(Boolean) || [] // Use subCategory array as badges
                }));

                setListings(mappedData);
                setFilteredListings(mappedData.slice(0, 9));
            } catch (error) {
                console.error('Error fetching Top CRMs:', error);
            } finally {
                setLoading(false);
            }
        };

        loadListings();
    }, []);

    useEffect(() => {
        if (activeTab === 'All') {
            setFilteredListings(listings.slice(0, 9));
        } else {
            const filtered = listings.filter(item =>
                item.brokerTypes?.includes(activeTab)
            );
            setFilteredListings(filtered.slice(0, 9));
        }
    }, [activeTab, listings]);

    if (loading) return null; // Or a skeleton loader

    if (listings.length === 0) return null;

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4 md:px-8">
                <div className="text-center mb-12">
                    <span className="text-xs font-bold tracking-widest text-brand-orange uppercase mb-2 block">Curated Selection</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-brand-blue mb-6">Top 9 CRMs & Document Collection</h2>

                    {/* Filter Tabs */}
                    <div className="flex flex-wrap justify-center gap-2 mb-8">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${activeTab === tab
                                    ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20 transform scale-105'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {filteredListings.map((listing) => (
                        <div key={listing.id} className="h-full">
                            <PartnerCard
                                partner={listing}
                                viewMode="grid"
                                disableCompare={true} // We don't need comparison here
                            />
                        </div>
                    ))}
                </div>

                <div className="text-center">
                    <Button
                        onClick={() => window.location.href = `${SITE_URLS.directory}/search?category=crm`}
                        variant="outline"
                        className="group border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white transition-all px-8 py-6 text-lg rounded-xl"
                    >
                        View More <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default TopCRMsSection;
