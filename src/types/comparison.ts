export type FeatureAvailability = 'yes' | 'partial' | 'no';

export interface ComparisonProduct {
  slug: string;
  name: string;
  logoUrl?: string;
  tagline?: string;
  priceText?: string;
  rating?: number | null;
  overallRubricScore?: number | null;
  rubricCategoryScores?: RubricCategoryScore[];
  isCurrent?: boolean;
  websiteUrl?: string;
  worksWith?: { title: string; slug?: string; logoUrl?: string }[];
  serviceAreas?: string[];
  alternativesCount?: number;
}

export interface RubricCategoryScore {
  title: string;
  score: number;
  order?: number;
}

export interface ComparisonFeatureRow {
  title: string;
  score?: number;
  availability: Record<string, FeatureAvailability | undefined>;
}

export interface ComparisonFeatureGroup {
  title: string;
  order: number;
  features: ComparisonFeatureRow[];
}

export interface ProviderCard {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  logoUrl?: string;
  rating?: number | null;
  reviewCount?: number | null;
  tags?: string[];
  location?: string;
  websiteUrl?: string;
  badges?: { title: string; color?: string; iconUrl?: string }[];
}
