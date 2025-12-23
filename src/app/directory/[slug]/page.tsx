
import React from 'react';
import { notFound } from 'next/navigation';
import { fetchDirectoryListingBySlug } from '@/services/sanity';
import HeroSection from '@/components/product-page/HeroSection';
import MainCard from '@/components/product-page/MainCard';
import InfoGrid from '@/components/product-page/InfoGrid';
import StillNotSure from '@/components/product-page/StillNotSure';
import ReviewsSection from '@/components/product-page/ReviewsSection';
import { SoftwareListing } from '@/components/product-page/types';

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

    // Fetch data on the server
    const listing = await fetchDirectoryListingBySlug(slug);

    if (!listing) {
        notFound();
    }

    // Map Sanity data to SoftwareListing interface for components
    const mappedListing: SoftwareListing = {
        name: listing.title,
        slug: listing.slug,
        tagline: listing.tagline,
        description: listing.description,
        category: listing.category?.title,
        websiteUrl: listing.websiteURL,
        logoUrl: listing.logoUrl,
        badges: (listing.badges || []).map((b: any) => ({ title: b.title, color: b.color })),
        // For services, we use serviceAreas. For software, we might use a different field, 
        // but here we align with what the component expects.
        serviceArea: (listing.serviceAreas || []).filter((sa: any) => sa).map((sa: any) => sa.title || sa),
        brokerType: listing.brokerType || [],
        features: (listing.features || []).filter((f: any) => f).map((f: any) => f.title || (typeof f === 'string' ? f : f.feature?.title)),
        pricing: {
            model: listing.pricing?.type,
            min: listing.pricing?.min,
            max: listing.pricing?.max,
            notes: listing.pricing?.notes
        },
        worksWith: (listing.worksWith || []).map((ww: any) => ({
            name: ww.title,
            slug: ww.slug
        })),
        editor: {
            author: listing.author?.name || 'Broker Tools Editor',
            notes: listing.editorNotes
        },
        rating: {
            average: 0,
            count: 0
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50/50">
            <HeroSection tagline={mappedListing.tagline} />

            <main className="flex-grow">
                <MainCard listing={mappedListing} />
                <InfoGrid listing={mappedListing} blogs={MOCK_BLOGS} />
                <ReviewsSection />
                <div className="max-w-6xl mx-auto px-4">
                    <StillNotSure />
                </div>
            </main>
        </div>
    );
}
