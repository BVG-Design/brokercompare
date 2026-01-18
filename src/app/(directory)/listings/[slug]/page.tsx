
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
import { fetchRelatedArticles } from '@/services/sanity';


// Mock blogs for the InfoGrid sidebar


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

    let relatedBlogs = listing.resources || [];

    if (relatedBlogs.length === 0) {
        const fallbackArticles = await fetchRelatedArticles(3);
        relatedBlogs = fallbackArticles.map((article: any) => ({
            _id: article._id,
            title: article.title,
            slug: article.slug || '#',
            imageUrl: article.mainImage?.asset?.url,
            summary: article.description, // Mapping description to summary
            category: article.category,
            publishedAt: article.publishedAt
        }));
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50/50">
            <HeroSection tagline={listing.tagline} />

            <main className="flex-grow">
                <MainCard listing={listing} />
                <InfoGrid listing={listing} blogs={relatedBlogs} reviews={reviews} />
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
