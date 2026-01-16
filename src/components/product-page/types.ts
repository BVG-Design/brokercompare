import type { TrustMetrics } from '@/lib/types';

export interface Interaction {
    name: string;
    websiteUrl?: string;
    logo?: string;
}

export interface Badge {
    title: string;
    color?: string;
    description?: string;
}

export interface SoftwareListing {
    name: string;
    slug: string;
    tagline?: string;
    description?: string;
    category?: string;
    websiteUrl?: string;
    location?: string;
    logoUrl?: string;
    badges?: Badge[];
    brokerType?: string[];
    features?: string[];
    pricing?: {
        model?: string;
        min?: number;
        max?: number;
        notes?: string;
    };
    worksWith?: Interaction[];
    editor?: {
        author?: string;
        notes?: string;
    };
    rating?: {
        average: number;
        count: number;
        marketScore?: number;
        rubric?: {
            averages?: Partial<RubricScores>;
            weightedScores?: Partial<RubricScores>;
            weights?: Partial<RubricWeights>;
        };
    };
    trustMetrics?: TrustMetrics;
}

export interface RubricScores {
    usability: number;
    support: number;
    value: number;
    features: number;
}

export interface RubricWeights {
    usability: number;
    support: number;
    value: number;
    features: number;
}
