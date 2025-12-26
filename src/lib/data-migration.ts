import type { Service, Software, Review } from './types';

// Ensures legacy Review objects have the new optional fields initialized
export function normalizeReview(review: Review): Review {
  return {
    helpfulCount: 0,
    notHelpfulCount: 0,
    verified: false,
    isVerified: false,
    moderationStatus: review.moderationStatus ?? review.status ?? 'approved',
    status: review.status ?? review.moderationStatus ?? 'approved',
    verificationMethod: review.verificationMethod,
    pros: [],
    cons: [],
    recommendation: undefined,
    useCase: undefined,
    userSegment: undefined,
    brokerType: undefined,
    timeUsed: undefined,
    ...review,
  };
}

// Fill safe defaults for Software new fields to avoid runtime checks across UI
export function normalizeSoftware(item: Software): Software {
  return {
    pricingTiers: [],
    deployment: item.deployment,
    supportOptions: item.supportOptions ?? [],
    integrations: item.integrations ?? [],
    userSegments: item.userSegments ?? [],
    marketPresence: item.marketPresence ?? {},
    screenshots: item.screenshots ?? [],
    badges: item.badges ?? [],
    featureMatrix: item.featureMatrix ?? [],
    alternatives: item.alternatives ?? [],
    brokerSpecific: item.brokerSpecific ?? {},
    ...item,
    reviews: (item.reviews ?? []).map(normalizeReview),
  };
}

// Fill safe defaults for Service new fields to avoid runtime checks across UI
export function normalizeService(item: Service): Service {
  return {
    pricingModel: item.pricingModel,
    pricingRange: item.pricingRange,
    serviceAreas: item.serviceAreas ?? [],
    brokerTypes: item.brokerTypes ?? [],
    caseStudies: item.caseStudies ?? [],
    badges: item.badges ?? [],
    alternatives: item.alternatives ?? [],
    availability: item.availability,
    ...item,
    reviews: (item.reviews ?? []).map(normalizeReview),
  };
}

// Bulk normalizers
export function normalizeSoftwareList(list: Software[]): Software[] {
  return list.map(normalizeSoftware);
}

export function normalizeServiceList(list: Service[]): Service[] {
  return list.map(normalizeService);
}




