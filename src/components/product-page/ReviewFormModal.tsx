'use client';

import React, { useMemo, useState } from 'react';
import { Star, X, Send, ShieldCheck, Sparkles } from 'lucide-react';
import { computeMarketplaceScore } from '@/lib/marketplace-score';
import type { RubricScores } from '@/lib/types';

type RubricKey = keyof RubricScores;

const RUBRIC_META: Record<RubricKey, { label: string; helper: string; weight: number }> = {
  usability: {
    label: 'Usability',
    helper: 'Ease of use, onboarding clarity, and day-to-day workflows',
    weight: 0.25,
  },
  support: {
    label: 'Support',
    helper: 'Responsiveness, quality of help, and documentation',
    weight: 0.25,
  },
  value: {
    label: 'Value',
    helper: 'Price-to-benefit, ROI, and total cost of ownership',
    weight: 0.25,
  },
  features: {
    label: 'Features',
    helper: 'Depth of functionality and coverage of broker needs',
    weight: 0.25,
  },
};

export interface ReviewFormData {
  overallRating: number;
  rubricScores: RubricScores;
  title: string;
  review: string;
  pros: string;
  cons: string;
}

interface ReviewFormModalProps {
  open: boolean;
  onClose: () => void;
  listingName?: string;
  isAuthenticated: boolean;
  onRequestLogin: () => void;
  onSubmit?: (data: ReviewFormData) => void | Promise<void>;
}

interface StarSelectorProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  size?: number;
}

const StarSelector: React.FC<StarSelectorProps> = ({ value, onChange, disabled = false, size = 28 }) => {
  const [hover, setHover] = useState<number | null>(null);

  return (
    <div className="flex gap-1.5">
      {[1, 2, 3, 4, 5].map((score) => {
        const isActive = (hover ?? value) >= score;
        return (
          <button
            key={score}
            type="button"
            disabled={disabled}
            onClick={() => onChange(score)}
            onMouseEnter={() => setHover(score)}
            onMouseLeave={() => setHover(null)}
            className="transition-transform hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={`Rate ${score} out of 5`}
          >
            <Star
              size={size}
              className={isActive ? 'text-orange-400 fill-orange-400' : 'text-gray-300'}
              strokeWidth={1.5}
            />
          </button>
        );
      })}
    </div>
  );
};

const ReviewFormModal: React.FC<ReviewFormModalProps> = ({
  open,
  onClose,
  listingName = 'this listing',
  isAuthenticated,
  onRequestLogin,
  onSubmit,
}) => {
  const [overallRating, setOverallRating] = useState(0);
  const [rubricScores, setRubricScores] = useState<RubricScores>({
    usability: 0,
    support: 0,
    value: 0,
    features: 0,
  });
  const [title, setTitle] = useState('');
  const [review, setReview] = useState('');
  const [pros, setPros] = useState('');
  const [cons, setCons] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const marketplaceScore = useMemo(
    () =>
      computeMarketplaceScore({
        averageRating: overallRating,
        rubricScores,
      }),
    [overallRating, rubricScores]
  );

  const resetForm = () => {
    setOverallRating(0);
    setRubricScores({ usability: 0, support: 0, value: 0, features: 0 });
    setTitle('');
    setReview('');
    setPros('');
    setCons('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      onRequestLogin();
      return;
    }

    const payload: ReviewFormData = {
      overallRating,
      rubricScores,
      title,
      review,
      pros,
      cons,
    };

    try {
      setIsSubmitting(true);
      await onSubmit?.(payload);
      resetForm();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Write a Review</h2>
            <p className="text-xs text-gray-500">Scoring {listingName} with the marketplace matrix</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-50 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="rounded-lg border border-dashed border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 mt-0.5 text-amber-700" />
            <div>
              <p className="font-semibold">Matrix scoring</p>
              <p className="text-amber-700/90">
                We normalize reviews across four categories—Usability, Support, Value, and Features—weighted evenly per the scoring guide.
              </p>
            </div>
          </div>

          {!isAuthenticated && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 flex items-start gap-3">
              <Sparkles className="w-4 h-4 mt-0.5 text-blue-700" />
              <div className="space-y-1">
                <p className="font-semibold">Login required to submit</p>
                <p className="text-blue-700/90">Sign in to save your review and have it count toward the marketplace score.</p>
                <button
                  type="button"
                  onClick={onRequestLogin}
                  className="inline-flex items-center px-3 py-1.5 bg-blue-700 text-white rounded-md text-xs font-semibold hover:bg-blue-800 transition-colors"
                >
                  Login to continue
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-col items-center justify-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-200">
            <label className="text-sm font-semibold text-gray-700 mb-2">Overall Rating</label>
            <StarSelector value={overallRating} onChange={setOverallRating} disabled={!isAuthenticated} size={32} />
            <p className="text-[11px] text-gray-500 mt-2">Fallback score when rubric data is missing</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Rubric (1-5 for each category)</h3>
              <span className="text-[11px] text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                Equal weights · see docs/scoring-guide.md
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(Object.keys(RUBRIC_META) as RubricKey[]).map((key) => {
                const meta = RUBRIC_META[key];
                return (
                  <div key={key} className="border border-gray-100 rounded-lg p-4 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{meta.label}</p>
                        <p className="text-xs text-gray-500 leading-snug">{meta.helper}</p>
                      </div>
                      <span className="text-[10px] text-gray-500 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-full">
                        {(meta.weight * 100).toFixed(0)}% weight
                      </span>
                    </div>
                    <div className="mt-3">
                      <StarSelector
                        value={rubricScores[key]}
                        onChange={(value) => setRubricScores((prev) => ({ ...prev, [key]: value }))}
                        disabled={!isAuthenticated}
                        size={24}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-900">Review Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={`Summarize your experience with ${listingName}`}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent text-sm transition-all"
                required
                disabled={!isAuthenticated}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-900">Marketplace preview</label>
              <div className="w-full px-4 py-2.5 bg-gray-50 border border-dashed border-gray-200 rounded-lg text-gray-900 text-sm flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-orange-500" />
                  <span className="font-semibold">{marketplaceScore || 0}/100</span>
                </div>
                <span className="text-[11px] text-gray-500">Weighted rubric ×20</span>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-900">Your Review</label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="What worked well? What could be improved?"
              rows={5}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent text-sm transition-all resize-none"
              required
              disabled={!isAuthenticated}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-900">Pros</label>
              <textarea
                value={pros}
                onChange={(e) => setPros(e.target.value)}
                placeholder="What impressed you most?"
                rows={3}
                className="w-full px-4 py-2 bg-green-50/60 border border-green-100 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm transition-all resize-none"
                disabled={!isAuthenticated}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-900">Cons</label>
              <textarea
                value={cons}
                onChange={(e) => setCons(e.target.value)}
                placeholder="Where could it improve?"
                rows={3}
                className="w-full px-4 py-2 bg-red-50/60 border border-red-100 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm transition-all resize-none"
                disabled={!isAuthenticated}
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !isAuthenticated}
              className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-lg shadow-gray-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'} <Send size={14} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewFormModal;
