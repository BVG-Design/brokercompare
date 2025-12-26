export interface Review {
  id: string;
  author: string;
  avatarUrl: string;
  rating: number;
  comment: string;
  date: string;
  // Enhanced review metadata (G2-style)
  helpfulCount?: number;
  notHelpfulCount?: number;
  verified?: boolean;
  rubric?: {
    scores?: Partial<RubricScores>;
    weightedScores?: Partial<RubricScores>;
    overall?: number;
  };
  pros?: string[];
  cons?: string[];
  useCase?: string;
  userSegment?: 'Solo Broker' | 'Small Team (2-5)' | 'Mid-Size (6-20)' | 'Large (20+)';
  brokerType?: 'Mortgage' | 'Asset Finance' | 'Commercial';
  timeUsed?: string; // e.g., "6 months", "2 years"
  recommendation?: boolean;
}

export type RubricCategoryKey = 'usability' | 'support' | 'value' | 'features';

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

export interface Service {
  id: string;
  name: string;
  category: 'Marketing' | 'Virtual Assistant' | 'Commercial Finance';
  logoUrl: string;
  images?: string[]; // Array of image URLs
  tagline: string;
  description: string;
  location: string;
  website: string;
  reviews: Review[];
  features: string[];
  // Enhanced service fields
  pricingModel?: 'Fixed' | 'Hourly' | 'Project-based' | 'Retainer';
  pricingRange?: { min?: number; max?: number } | string;
  serviceAreas?: string[]; // types of services offered
  brokerTypes?: Array<'Mortgage' | 'Asset Finance' | 'Commercial'>;
  caseStudies?: Array<{ title: string; url?: string; summary?: string }>;
  badges?: string[]; // e.g., ['Leader', 'High Performer']
  alternatives?: string[]; // related service IDs
  availability?: string; // e.g., "Australia-wide", "NSW, VIC"
  trustMetrics?: TrustMetrics;
}

export interface TrustMetrics {
  responseTimeHours?: number;
  verifiedRatio?: number; // 0-1 or 0-100
  reviewRecencyDays?: number;
}

export interface Software {
  id: string;
  slug: string;
  name: string;
  category: 'CRM' | 'Loan Processing' | 'Compliance' | 'Marketing Automation';
  logoUrl: string;
  tagline: string;
  description: string;
  pricing: string;
  compatibility: string[];
  reviews?: Review[];
  websiteUrl?: string;
  pricingNotes?: string;
  tags?: string[];
  rating?: {
    average: number;
    reviewCount: number;
    marketScore?: number;
    rubric?: {
      averages?: Partial<RubricScores>;
      weightedScores?: Partial<RubricScores>;
      weights?: Partial<RubricWeights>;
    };
  };
  features: string[];
  // Enhanced software fields
  pricingTiers?: Array<{
    name: string; // e.g., "Starter", "Pro", "Enterprise"
    price?: string; // human-readable (e.g., "$99/mo")
    features?: string[];
  }>;
  deployment?: 'Cloud' | 'On-Premise' | 'Hybrid';
  supportOptions?: Array<'Email' | 'Phone' | 'Chat' | 'Dedicated'>;
  integrations?: Array<{ name: string; category?: 'Lender' | 'Accounting' | 'Marketing' | 'Other' }>;
  userSegments?: Array<'Solo Broker' | 'Small Team (2-5)' | 'Mid-Size (6-20)' | 'Large (20+)'>;
  marketPresence?: { activeUsers?: number; adoptionRate?: number }; // percentages 0-100
  screenshots?: string[];
  badges?: string[]; // e.g., ['Leader', 'Best Value']
  featureMatrix?: Array<{ category: string; items: Array<{ name: string; available: boolean }> }>;
  alternatives?: string[]; // related software IDs
  brokerSpecific?: {
    lenderConnections?: string[];
    complianceTools?: string[];
    commissionTracking?: boolean;
  };
  trustMetrics?: TrustMetrics;
}
