'use client';

'use client';

import React, { useMemo, useState } from 'react';
import { Star, ExternalLink, ShieldCheck, CheckCircle2, Plus, Brain } from 'lucide-react';
import { SoftwareListing } from './types';
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import ContactModal from './ContactModal';
import ReviewFormModal from './ReviewFormModal';
import { trackOutboundListingClick } from '@/lib/mixpanel';
import { useAuth } from '@/hooks/use-auth';

interface MainCardProps {
    listing: SoftwareListing;
}



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

const BADGE_STYLES: Record<string, string> = {
    gold: 'bg-[#B45309] text-white',
    purple: 'bg-[#6D28D9] text-white',
    pink: 'bg-[#BE185D] text-white',
    green: 'bg-[#047857] text-white',
    blue: 'bg-[#1D4ED8] text-white',
    orange: 'bg-[#C2410C] text-white',
    grey: 'bg-[#374151] text-white'
};

const MainCard: React.FC<MainCardProps> = ({ listing }) => {
    const {
        name,
        badges = [],
        description,
        websiteUrl,
        features = [],
        pricing,
        brokerType = [],
        logoUrl,
        rating,
        category
    } = listing;

    const [showContactModal, setShowContactModal] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [imageError, setImageError] = useState(false);

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const { user } = useAuth();

    const handleLogin = () => {
        router.push(`/login?next=${encodeURIComponent(pathname)}`);
    };
    const averageRating = rating?.average || 0;
    const reviewCount = rating?.count || 0;

    // UTM logic is handled by trackOutboundListingClick helper now

    // UTM logic is handled by trackOutboundListingClick helper now

    const actionButtonClasses = "min-w-[160px] justify-center";

    return (
        <div className="max-w-6xl mx-auto px-4 -mt-32 relative z-10 mb-8">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 md:p-8">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Left Column: Icon, Details, Features */}
                    <div className="flex-1">
                        <div className="flex gap-6">
                            {/* Logo Box */}
                            <div className="w-20 h-20 bg-white border border-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center p-2 overflow-hidden shadow-sm">
                                {logoUrl && !imageError ? (
                                    <img
                                        src={logoUrl}
                                        alt={`${name} logo`}
                                        className="w-full h-full object-contain"
                                        onError={() => setImageError(true)}
                                    />
                                ) : (
                                    <div className="text-gray-400 font-bold text-3xl">{name?.charAt(0) || 'B'}</div>
                                )}
                            </div>

                            {/* Title & Badges */}
                            <div>
                                <TooltipProvider>
                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                        <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
                                        {badges.map((badge, idx) => {
                                            const badgeColor = badge.color ? badge.color.toLowerCase() : 'orange';
                                            const badgeStyle = BADGE_STYLES[badgeColor] || BADGE_STYLES.orange;

                                            return (
                                                <Tooltip key={idx}>
                                                    <TooltipTrigger asChild>
                                                        <span className={`${badgeStyle} text-xs px-2 py-0.5 rounded font-medium cursor-help`}>
                                                            {badge.title}
                                                        </span>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p className="max-w-xs">{badge.description || badge.title}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            );
                                        })}
                                    </div>
                                </TooltipProvider>

                                <div className="flex items-center gap-2 mb-3 text-sm">
                                    {/* Rating - simplified logic for display */}
                                    <div className="flex text-orange-400">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                size={16}
                                                fill={star <= Math.round(averageRating) ? "currentColor" : "none"}
                                                className={star <= Math.round(averageRating) ? "" : "text-gray-300"}
                                            />
                                        ))}
                                    </div>
                                    {averageRating > 0 && <span className="font-bold text-gray-900">{averageRating.toFixed(1)}</span>}
                                    <span className="text-gray-500">({reviewCount} reviews)</span>
                                    <span className="text-gray-300">|</span>
                                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">{category || 'Software'}</span>
                                </div>

                                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                                    {description}
                                </p>

                                <div className="flex flex-wrap gap-3 mb-8">
                                    {websiteUrl && (
                                        <a
                                            href={websiteUrl}
                                            onClick={(e) => trackOutboundListingClick(e, listing, 'listing_profile', 'Visit Website')}
                                            target="_blank"
                                            rel="noreferrer"
                                            className={`bg-brand-orange hover:bg-orange-600 text-white px-5 py-2 rounded-md font-medium text-sm flex items-center gap-2 transition-colors transition-transform hover:-translate-y-0.5 shadow-sm hover:shadow-md ${actionButtonClasses}`}
                                        >
                                            Visit Website
                                            <ExternalLink size={14} />
                                        </a>
                                    )}

                                    <button
                                        type="button"
                                        onClick={() => setShowReviewModal(true)}
                                        className={`bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-5 py-2 rounded-md font-medium text-sm flex items-center gap-2 transition-colors transition-transform hover:-translate-y-0.5 shadow-sm hover:shadow-md ${actionButtonClasses}`}
                                    >
                                        <ShieldCheck size={14} />
                                        Write Review
                                    </button>

                                    <Link
                                        href="/compare"
                                        className={`bg-brand-green hover:bg-brand-green text-white px-5 py-2 rounded-md font-medium text-sm flex items-center gap-2 transition-colors transition-transform hover:-translate-y-0.5 shadow-sm hover:shadow-md ${actionButtonClasses}`}
                                    >
                                        Compare
                                        <span className="flex items-center justify-center w-5 h-5 rounded border-2 border-white/80 bg-white/10 text-white font-bold leading-none">
                                            <Plus size={12} />
                                        </span>
                                    </Link>
                                </div>

                                {/* Key Features */}
                                {features.length > 0 && (
                                    <div className="mt-6 pt-6 border-t border-gray-100">
                                        <h3 className="text-sm font-bold text-gray-900 mb-3">Key Features</h3>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-4">
                                            {features.map((feature, idx) => (
                                                <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                                                    <CheckCircle2 size={14} className="text-orange-500 flex-shrink-0" />
                                                    <span>{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Pricing & Meta */}
                    <div className="w-full lg:w-72 bg-gray-50 rounded-lg p-5 border border-gray-100 h-fit">
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold text-gray-900">Pricing</span>
                                {pricing?.model && (
                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{pricing.model}</span>
                                )}
                            </div>
                            <div className="flex items-baseline gap-1 mb-2">
                                {(pricing?.min !== undefined && pricing?.min !== null) ? (
                                    <>
                                        <span className="text-2xl font-bold text-gray-900">
                                            ${pricing.min}
                                            {pricing.max ? ` - $${pricing.max}` : '+'}
                                        </span>
                                        <span className="text-gray-500 text-sm">/mo</span>
                                    </>
                                ) : (
                                    <span className="text-lg font-bold text-gray-900">Contact for Pricing</span>
                                )}
                            </div>
                            {pricing?.notes && (
                                <p className="text-xs text-gray-500 leading-snug">
                                    {pricing.notes}
                                </p>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowContactModal(true)}
                            className="w-full mb-6 inline-flex items-center justify-center gap-2 rounded-md bg-primary hover:bg-primary/90 px-4 py-2 text-sm font-semibold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-gray-50 transition-colors"
                        >
                            Contact {name}
                            <Plus size={14} />
                        </button>

                        <ContactModal
                            open={showContactModal}
                            onOpenChange={setShowContactModal}
                            businessName={name}
                            logoUrl={logoUrl}
                        />

                        <ReviewFormModal
                            open={showReviewModal}
                            onClose={() => setShowReviewModal(false)}
                            listingName={name}
                            isAuthenticated={!!user}
                            onRequestLogin={handleLogin}
                        />



                        {brokerType.length > 0 && (
                            <div>
                                <h4 className="text-xs font-semibold text-gray-900 mb-2 uppercase tracking-wide">Broker Type</h4>
                                <TooltipProvider>
                                    <div className="flex flex-wrap gap-2">
                                        {brokerType.map((type, idx) => (
                                            <Tooltip key={idx}>
                                                <TooltipTrigger asChild>
                                                    <span className="px-2 py-1 bg-blue-50 text-primary border border-blue-100 rounded text-xs cursor-pointer group relative inline-flex items-center gap-1">
                                                        {type}
                                                        <Brain className="w-3 h-3 text-primary/50 group-hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </span>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{getBrokerTypeDescription(type)}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        ))}
                                    </div>
                                </TooltipProvider>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default MainCard;
