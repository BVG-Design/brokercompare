export interface ResourcePost {
    id: string;
    title: string;
    description: string;
    category: string;
    ctaText: string;
    imageUrl?: string;
    link: string;
    featuredLabel?: string;
    listingType?: string;
    blogType?: string;
}
export interface DirectoryListing {
    id: string;
    name: string;
    description: string;
    logoUrl?: string;
    categories: string[];
    brokerTypes: string[];
    listingTier: 'free' | 'premium' | 'featured';
    slug: string;
    rating?: any;
    viewCount?: number;
    trustMetrics?: {
        responseTimeHours?: number;
        verifiedRatio?: number;
        reviewRecencyDays?: number;
    };
    tags?: string[];
    websiteUrl?: string;
    pricingModel?: string;
    type: 'software' | 'service' | 'product'; // To distinguish source
    badges?: string[];
    synonyms?: string[];
    tagline?: string;
}
