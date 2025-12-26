import { TrustMetrics } from './types';

interface MarketplaceScoreInput {
  ratingAverage?: number | null;
  ratingCount?: number | null;
  trustMetrics?: TrustMetrics | null;
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const normalizeRatio = (value?: number | null) => {
  if (value === null || value === undefined || Number.isNaN(value)) return null;
  if (value <= 1) return clamp(value, 0, 1);
  return clamp(value / 100, 0, 1);
};

const getResponseTimeScore = (hours?: number | null) => {
  if (hours === null || hours === undefined || Number.isNaN(hours)) return null;
  if (hours <= 1) return 100;
  if (hours <= 4) return 90;
  if (hours <= 12) return 80;
  if (hours <= 24) return 70;
  if (hours <= 72) return 55;
  if (hours <= 168) return 40;
  return 25;
};

const getReviewRecencyScore = (days?: number | null) => {
  if (days === null || days === undefined || Number.isNaN(days)) return null;
  if (days <= 7) return 100;
  if (days <= 30) return 90;
  if (days <= 90) return 75;
  if (days <= 180) return 60;
  if (days <= 365) return 45;
  return 30;
};

export const computeMarketplaceScore = ({
  ratingAverage,
  ratingCount,
  trustMetrics
}: MarketplaceScoreInput): number | null => {
  const weights = {
    rating: 0.6,
    responseTime: 0.15,
    verifiedRatio: 0.15,
    reviewRecency: 0.1
  };

  const ratingScore =
    ratingAverage !== null && ratingAverage !== undefined
      ? clamp((ratingAverage / 5) * 100, 0, 100)
      : null;
  const responseTimeScore = getResponseTimeScore(trustMetrics?.responseTimeHours ?? null);
  const verifiedRatioScore = normalizeRatio(trustMetrics?.verifiedRatio ?? null);
  const reviewRecencyScore = getReviewRecencyScore(trustMetrics?.reviewRecencyDays ?? null);

  const weightedScores: Array<{ score: number; weight: number }> = [];

  if (ratingScore !== null) {
    const countBoost = ratingCount && ratingCount > 0 ? clamp(Math.log10(ratingCount + 1) / 2, 0, 1) : 0.5;
    weightedScores.push({
      score: ratingScore * (0.7 + 0.3 * countBoost),
      weight: weights.rating
    });
  }

  if (responseTimeScore !== null) {
    weightedScores.push({ score: responseTimeScore, weight: weights.responseTime });
  }

  if (verifiedRatioScore !== null) {
    weightedScores.push({ score: verifiedRatioScore * 100, weight: weights.verifiedRatio });
  }

  if (reviewRecencyScore !== null) {
    weightedScores.push({ score: reviewRecencyScore, weight: weights.reviewRecency });
  }

  if (!weightedScores.length) return null;

  const totalWeight = weightedScores.reduce((acc, item) => acc + item.weight, 0);
  const scoreSum = weightedScores.reduce((acc, item) => acc + item.score * item.weight, 0);

  return clamp(scoreSum / totalWeight, 0, 100);
};
