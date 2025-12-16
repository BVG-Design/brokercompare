export interface Interaction {
    name: string;
    websiteUrl?: string;
    logo?: string;
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
    badges?: string[];
    serviceArea?: string[];
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
    }
}
