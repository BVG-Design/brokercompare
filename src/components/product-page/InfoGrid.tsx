'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ExternalLink, FileText, Star, Brain, ShieldCheck } from 'lucide-react';
import { SoftwareListing } from './types';
import { FeedbackDialog } from '@/components/shared/FeedbackDialog';
import { computeMarketplaceScore } from '@/lib/marketplace-score';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

interface InfoGridProps {
    listing: SoftwareListing;
    blogs?: any[];
    reviews?: any[];
}

const InfoGrid: React.FC<InfoGridProps> = ({ listing, blogs = [], reviews = [] }) => {
    const { editor, worksWith = [], rating, name, slug, brokerType = [], trustMetrics } = listing;
    const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);

    const triggerReviewModal = () => {
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('open-review-modal'));
        }
    };

    // Helper function to get tooltip description for broker types
    const getBrokerTypeDescription = (type: string): string => {
        const descriptions: Record<string, string> = {
            'Mortgage': 'Services designed for mortgage brokers',
            'Asset': 'Services for asset finance brokers',
            'Commercial': 'Services for commercial finance brokers',
            'Asset Finance': 'Services for asset finance brokers',
        };
        return descriptions[type] || `Ideal for ${type} brokers`;
    };

    const slugify = (text: string) =>
        text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');

    const getTargetSlug = (toolName: string, websiteUrl?: string) => {
        if (websiteUrl) {
            try {
                const url = new URL(websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`);
                const parts = url.pathname.split('/').filter(Boolean);
                const lastSegment = parts.length > 0 ? parts[parts.length - 1] : url.hostname;
                return slugify(lastSegment);
            } catch {
                return slugify(toolName);
            }
        }
        return slugify(toolName);
    };

    // Calculate dynamic stats from reviews if available, otherwise fallback to listing data
    const totalReviews = reviews.length > 0 ? reviews.length : (rating?.count || 0);
    const averageRating = reviews.length > 0
        ? reviews.reduce((acc, r) => acc + (r.overall_rating || 0), 0) / reviews.length
        : (rating?.average || 0);

    // Calculate distribution
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    if (reviews.length > 0) {
        reviews.forEach(r => {
            const rRating = Math.round(r.overall_rating || 0);
            if (rRating >= 1 && rRating <= 5) {
                counts[rRating as keyof typeof counts]++;
            }
        });
    }

    const distribution = [5, 4, 3, 2, 1].map(stars => ({
        stars,
        count: counts[stars as keyof typeof counts],
        percent: reviews.length > 0 ? (counts[stars as keyof typeof counts] / reviews.length) * 100 : 0
    }));

    const marketplaceScore = computeMarketplaceScore({
        ratingAverage: averageRating,
        ratingCount: totalReviews,
        trustMetrics
    });

    return (
        <>
            <div className="max-w-6xl mx-auto px-4 mb-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Main Column (Spans 2) */}
                    <div className="lg:col-span-2 space-y-8">
                        <section className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                            {editor?.notes && (
                                <div className="space-y-3">
                                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                                        <h3 className="text-blue-900 font-semibold text-sm mb-2">Editor Notes</h3>
                                        <p className="text-blue-800 text-sm leading-relaxed">
                                            {editor.notes}
                                        </p>
                                        {editor.author && (
                                            <div className="flex items-center text-xs text-blue-600 font-medium mt-2">
                                                <span className="w-6 h-0.5 bg-blue-400 mr-2"></span>
                                                {editor.author}
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-4 text-center space-y-2">
                                        <h4 className="text-sm font-semibold text-gray-900">Got feedback?</h4>
                                        <div className="text-sm text-gray-700 leading-relaxed space-y-2">
                                            <p>
                                                If any detail about this product or service isn&apos;t quite right, or if we&apos;ve misunderstood how it works, we&apos;d love to hear from you. Share your feedback and help educate us!
                                            </p>
                                            <p>
                                                This feedback is <i>not</i> used for public reviews and your personal details will remain private.
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setFeedbackDialogOpen(true)}
                                            className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-brand-blue hover:bg-brand-blue/90 rounded-md transition-colors"
                                        >
                                            Share feedback
                                        </button>
                                    </div>
                                </div>
                            )}
                        </section>

                        <section className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-gray-900">Resources</h2>
                                <span className="text-xs text-gray-400">Curated by our team</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {blogs && blogs.length > 0 ? (
                                    blogs.map((blog) => (
                                        <a href={`/blog/${blog.slug?.current || blog.slug}`} key={blog._id} className="group flex flex-col h-full bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                                            <div className="h-24 bg-gray-100 overflow-hidden relative">
                                                {blog.imageUrl ? (
                                                    <img src={blog.imageUrl} alt={blog.title} className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500" />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                                                        <FileText size={24} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-3 flex flex-col justify-between flex-grow">
                                                <span className="text-xs font-semibold text-gray-900 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                                    {blog.title}
                                                </span>
                                                <span className="text-[10px] text-gray-500 mt-2 flex items-center">
                                                    Read Article <ExternalLink size={8} className="ml-1" />
                                                </span>
                                            </div>
                                        </a>
                                    ))
                                ) : (
                                    <div className="p-4 bg-gray-50 border border-dashed border-gray-300 rounded text-center text-sm text-gray-400 col-span-3">
                                        Resources Coming Soon
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Right Sidebar Column */}
                    <div className="space-y-8 flex flex-col h-full">

                        {/* Integrations / Works With */}
                        {worksWith.length > 0 && (
                            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                                <div className="flex items-center gap-2 mb-4">
                                    <h3 className="font-bold text-gray-900">Works/Integrates With</h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {worksWith.map((tool, idx) => {
                                        const targetSlug = tool.slug || getTargetSlug(tool.name, tool.websiteUrl);
                                        return (
                                            <Link
                                                key={idx}
                                                href={`/directory/${targetSlug}`}
                                                className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-gray-700 hover:border-gray-300 cursor-pointer transition-colors"
                                                title={tool.name}
                                            >
                                                <img
                                                    src={tool.logo || `https://www.google.com/s2/favicons?domain=${tool.websiteUrl || 'google.com'}&sz=32`}
                                                    alt={tool.name}
                                                    className="w-3.5 h-3.5 rounded-sm object-contain opacity-85"
                                                    loading="lazy"
                                                />
                                                {tool.name}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* User Reviews Summary */}
                        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex-grow flex flex-col">
                            <h3 className="font-bold text-gray-900 mb-5">User Reviews</h3>

                            <div className="flex items-end gap-3 mb-6">
                                <span className="text-5xl font-bold text-gray-900 tracking-tighter leading-none">{averageRating.toFixed(1)}</span>
                                <div className="flex flex-col pb-1">
                                    <div className="flex gap-0.5 mb-1">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <Star
                                                key={i}
                                                size={14}
                                                className={i <= Math.round(averageRating) ? "text-orange-400 fill-orange-400" : "text-gray-300"}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-xs text-gray-500">{totalReviews} reviews</span>
                                </div>
                            </div>

                            {/* Rating Distribution Bars */}
                            <div className="space-y-2 mb-6">
                                {distribution.map((item) => (
                                    <div key={item.stars} className="flex items-center gap-2">
                                        <div className="flex items-center w-4 gap-1">
                                            <span className="text-[10px] font-semibold text-gray-600">{item.stars}</span>
                                            <Star size={8} className="text-orange-400 fill-orange-400" />
                                        </div>
                                        <div className="flex-1 h-1.5 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                                            <div
                                                className={`h-full rounded-full ${item.percent > 0 ? 'bg-orange-400' : 'bg-transparent'}`}
                                                style={{ width: `${item.percent}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-[10px] text-gray-400 w-3 text-right">{item.count}</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={triggerReviewModal}
                                className="w-full py-2.5 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors mt-auto"
                            >
                                Write a Review
                            </button>
                        </div>
                    </div>
                </div>
            </div >

            <FeedbackDialog
                open={feedbackDialogOpen}
                onOpenChange={setFeedbackDialogOpen}
                softwareName={name}
                softwareSlug={slug}
            />
        </>
    );
};

export default InfoGrid;
