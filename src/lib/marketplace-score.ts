import type { RubricScores, RubricWeights } from '@/lib/types';

type ComputeMarketplaceScoreInput = {
  averageRating?: number;
  rubricScores?: Partial<RubricScores>;
  rubricWeights?: Partial<RubricWeights>;
};

const DEFAULT_RUBRIC_WEIGHTS: RubricWeights = {
  usability: 0.25,
  support: 0.25,
  value: 0.25,
  features: 0.25,
};

const clampRating = (value: number) => Math.min(Math.max(value, 0), 5);

const normalizeWeights = (weights?: Partial<RubricWeights>): RubricWeights => {
  if (!weights) {
    return { ...DEFAULT_RUBRIC_WEIGHTS };
  }

  const entries = Object.entries({ ...DEFAULT_RUBRIC_WEIGHTS, ...weights }) as Array<[keyof RubricWeights, number]>;
  const total = entries.reduce((sum, [, weight]) => sum + (Number.isFinite(weight) ? weight : 0), 0);

  if (!Number.isFinite(total) || total <= 0) {
    return { ...DEFAULT_RUBRIC_WEIGHTS };
  }

  return entries.reduce<RubricWeights>((acc, [key, weight]) => {
    acc[key] = (Number.isFinite(weight) ? weight : 0) / total;
    return acc;
  }, { ...DEFAULT_RUBRIC_WEIGHTS });
};

export const computeMarketplaceScore = ({ averageRating = 0, rubricScores, rubricWeights }: ComputeMarketplaceScoreInput) => {
  const hasRubricScores = rubricScores && Object.values(rubricScores).some((value) => value !== undefined);

  const ratingSource = hasRubricScores
    ? Object.entries(normalizeWeights(rubricWeights)).reduce((total, [key, weight]) => {
      const score = rubricScores?.[key as keyof RubricScores];
      const safeScore = Number.isFinite(score) ? clampRating(score as number) : 0;
      return total + safeScore * weight;
    }, 0)
    : clampRating(averageRating);

  return Math.round(ratingSource * 20);
};
