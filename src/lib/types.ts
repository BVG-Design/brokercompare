export interface Review {
  id: string;
  author: string;
  avatarUrl: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Service {
  id: string;
  name: string;
  category: 'Marketing' | 'Virtual Assistant' | 'Commercial Finance';
  logoUrl: string;
  tagline: string;
  description: string;
  location: string;
  website: string;
  reviews: Review[];
  features: string[];
}

export interface Software {
  id: string;
  name: string;
  category: 'CRM' | 'Loan Processing' | 'Compliance' | 'Marketing Automation';
  logoUrl: string;
  tagline: string;
  description: string;
  pricing: string;
  compatibility: string[];
  reviews: Review[];
  features: string[];
}
