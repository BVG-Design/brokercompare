export interface Review {
  id: number;
  author: string;
  role: string;
  company: string;
  rating: number;
  title: string;
  content: string;
  pros: string[];
  cons: string[];
  helpfulCount: number;
  verified: boolean;
  avatarColor: string;
}

export interface Provider {
  id: number;
  name: string;
  rating: number;
  reviewCount: number;
  description: string;
  location: string;
  tags: string[];
  certified: boolean;
  logoLetter: string;
}

export interface Feature {
  name: string;
  included: boolean;
}

export interface ComparisonProduct {
  name: string;
  logo: string;
  logoLetter?: string;
  rating: number;
  reviews: string;
  price: string;
  features: Feature[];
  current?: boolean;
}