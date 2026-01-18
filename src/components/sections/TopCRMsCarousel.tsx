'use client';

import React from 'react';
import PartnerCard from '@/components/partners/PartnerCard';

interface Listing {
    id: string;
    company_name: string;
    logo_url?: string;
    slug: string;
    tagline?: string;
    rating?: { average: number; reviewCount: number };
    websiteUrl?: string;
    brokerTypes: string[];
    listing_tier: string;
    description: string;
    badges: any[];
}

interface TopCRMsCarouselProps {
    listings: Listing[];
}

const TopCRMsCarousel: React.FC<TopCRMsCarouselProps> = ({ listings }) => {
    // If no listings, we return null or empty because parent handles "No results" message.
    if (!listings || listings.length === 0) {
        return null;
    }

    return (
        <div className="flex relative w-full overflow-hidden">
            {/* Left Fade Overlay - Darker Grey as per recent requests */}
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-gray-100 to-transparent z-10 pointer-events-none" />
            {/* Right Fade Overlay */}
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-gray-100 to-transparent z-10 pointer-events-none" />

            {/* Infinite Scroll Container */}
            <div className="flex animate-scroll hover:pause gap-6 px-6">
                {/* Triplicate the list to ensure smooth scrolling */}
                {listings
                    .concat(listings)
                    .concat(listings)
                    .map((listing, idx) => (
                        <div key={`${listing.id}-${idx}`} className="w-[350px] flex-shrink-0">
                            <PartnerCard partner={listing} viewMode="grid" />
                        </div>
                    ))}
            </div>
            <style jsx global>{`
                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-33.33%); }
                }
                .animate-scroll {
                    animation: scroll 60s linear infinite;
                    width: max-content;
                }
                .pause:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </div>
    );
};

export default TopCRMsCarousel;
