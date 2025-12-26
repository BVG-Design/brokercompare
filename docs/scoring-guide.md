# Marketplace Scoring Guide (G2-Style)

## Overview
BrokerCompare uses a G2-style rubric to translate review inputs into a normalized **Marketplace Score (0–100)**. This score balances overall sentiment with weighted sub-criteria so buyers can compare products consistently.

## Overall Rating
- **Scale:** 1–5 stars
- **Source:** Reviewers submit an overall rating in addition to sub-criteria.
- **Usage:** Used as the fallback score when sub-criteria data is missing.

## Rubric Sub-Criteria
Each review can include category scores (1–5) for the following criteria:

| Category   | Description | Weight (Default) |
|------------|-------------|------------------|
| Usability  | Ease of use, onboarding clarity, and day-to-day workflows | 25% |
| Support    | Responsiveness, quality of help, and documentation | 25% |
| Value      | Price-to-benefit, ROI, and total cost of ownership | 25% |
| Features   | Depth of functionality and coverage of broker needs | 25% |

> Weights can be tuned per category or per listing, but must sum to 100%.

## Marketplace Score (0–100)
1. **Collect rubric scores** (1–5) for Usability, Support, Value, and Features.
2. **Apply weights** to compute a weighted average (still on a 1–5 scale).
3. **Normalize** to a 0–100 score by multiplying the weighted average by 20.

If no rubric scores are available, the overall star rating is used instead.

### Example
- Usability: 4.5
- Support: 4.0
- Value: 4.5
- Features: 5.0
- Weights: 25% each

Weighted average = 4.5
Marketplace Score = 4.5 × 20 = **90**

## Minimum Review Thresholds
To publish a Marketplace Score, listings must meet these minimums:

- **Minimum approved reviews:** 5
- **Minimum recent reviews:** 2 in the last 12 months
- **Category coverage:** At least 70% of approved reviews include rubric sub-criteria

If thresholds are not met, the UI should display the star rating only and mark the Marketplace Score as “insufficient data.”
