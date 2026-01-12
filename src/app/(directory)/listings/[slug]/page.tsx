
import React from 'react';
import { SITE_URLS } from '@/lib/config';
import { notFound } from 'next/navigation';
import HeroSection from '@/components/product-page/HeroSection';
import MainCard from '@/components/product-page/MainCard';
import InfoGrid from '@/components/product-page/InfoGrid';
import StillNotSure from '@/components/product-page/StillNotSure';
import ReviewsSection from '@/components/product-page/ReviewsSection';
import ComparisonSummary from '@/components/product-page/ComparisonSummary';
import ProvidersSection from '@/components/product-page/ProvidersSection';
import { buildDirectoryPageData } from './comparisonData';
import { getReviewsBySlug } from '@/services/supabase';

// Mock blogs for the InfoGrid sidebar
const MOCK_BLOGS = [
    {
        _id: '1',
        title: 'Top 5 Broker Tools for 2025',
        slug: 'top-5-broker-tools-2025',
        imageUrl: 'https://picsum.photos/300/200?random=10',
        summary: 'A look at the best software to streamline your brokerage.'
    },
    {
        _id: '2',
        title: 'Cybersecurity 101 for Brokers',
        slug: 'cybersecurity-101',
        imageUrl: 'https://picsum.photos/300/200?random=11',
        summary: 'Protecting your client data is more important than ever.'
    },
    {
        _id: '3',
        title: 'Maximising Efficiency with AI',
        slug: 'efficiency-with-ai',
        imageUrl: 'https://picsum.photos/300/200?random=12',
        summary: 'How to use AI tools like ChatGPT in your daily workflow.'
    }
];

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function DirectoryProfilePage(props: PageProps) {
    const params = await props.params;
    const { slug } = params;

    const pageData = await buildDirectoryPageData(slug);
    const reviews = await getReviewsBySlug(slug);

    if (!pageData) {
        notFound();
    }

    const { listing, summaryProducts, summaryFeatures, providers } = pageData;

    return (
        <div className="min-h-screen flex flex-col bg-gray-50/50">
            <HeroSection tagline={listing.tagline} />

            <main className="flex-grow">
                <MainCard listing={listing} />
                <InfoGrid listing={listing} blogs={MOCK_BLOGS} reviews={reviews} />
                <ReviewsSection listingName={listing.name} listingSlug={slug} reviews={reviews} />
                <div className="max-w-6xl mx-auto px-4 space-y-12 pb-24">
                    <ProvidersSection providers={providers} />
                    <StillNotSure />
                    {/* Hide ComparisonSummary as per user request
                    <ComparisonSummary
                        products={summaryProducts}
                        features={summaryFeatures}
                        focusName={listing.name}
                        comparisonHref={`${SITE_URLS.directory}/listings/${slug}/comparison`}
                    />
                    */}
                </div>
            </main>
        </div>
    );
}
