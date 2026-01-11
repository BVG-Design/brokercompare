import React, { useState, useMemo } from 'react';
import { X, ThumbsUp, ThumbsDown, Send, CheckCircle2, Sparkles } from 'lucide-react';

interface ReviewFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
  listingName?: string;
  isAuthenticated?: boolean;
  onRequestLogin?: () => void;
}

type MetricKey = 'setup' | 'usability' | 'support' | 'value' | 'reliability';

const BROKER_TYPES = [
  { id: 'mortgage', label: 'Mortgage Brokers' },
  { id: 'asset', label: 'Asset Brokers' },
  { id: 'commercial', label: 'Commercial Brokers' }
];

const ReviewFormModal: React.FC<ReviewFormModalProps> = ({
  open,
  onClose,
  onSubmit,
  listingName = 'this listing',
  isAuthenticated = false,
  onRequestLogin
}) => {
  const [metrics, setMetrics] = useState<Record<MetricKey, number>>({
    setup: 0,
    usability: 0,
    support: 0,
    value: 0,
    reliability: 0
  });

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [pros, setPros] = useState('');
  const [cons, setCons] = useState('');
  const [recommendations, setRecommendations] = useState<string[]>([]);

  // Calculate Overall Rating as the average of all metrics
  const overallRating = useMemo(() => {
    const values = Object.values(metrics) as number[];
    const sum = values.reduce((acc, curr) => acc + curr, 0);
    const count = values.filter(v => v > 0).length;
    return count > 0 ? Number((sum / count).toFixed(1)) : 0;
  }, [metrics]);

  if (!open) return null;

  const handleMetricChange = (key: MetricKey, val: number) => {
    setMetrics(prev => ({ ...prev, [key]: val }));
  };

  const toggleRecommendation = (id: string) => {
    setRecommendations(prev =>
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      onRequestLogin?.();
      return;
    }

    if (onSubmit) {
      onSubmit({
        metrics,
        overallRating,
        title,
        content,
        pros,
        cons,
        recommendations
      });
    }

    // Reset form
    setMetrics({ setup: 0, usability: 0, support: 0, value: 0, reliability: 0 });
    setTitle('');
    setContent('');
    setPros('');
    setCons('');
    setRecommendations([]);
  };

  const ThumbsUpRatingField = ({ label, value, onChange }: { label: string, value: number, onChange: (v: number) => void }) => {
    const [hover, setHover] = useState(0);

    return (
      <div className={`flex flex-col gap-1 ${!isAuthenticated ? 'opacity-60 pointer-events-none' : ''}`}>
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">{label}</label>
          <span className="text-xs font-bold text-brand-orange">{value > 0 ? value.toFixed(1) : '-'}</span>
        </div>
        <div className="flex items-center gap-1" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((iconIdx) => (
            <div key={iconIdx} className="relative flex h-7 w-7 items-center justify-center">
              {/* Left half for 0.5 increments */}
              <button
                type="button"
                className="w-1/2 h-full absolute left-0 z-10"
                onMouseEnter={() => setHover(iconIdx - 0.5)}
                onClick={() => onChange(iconIdx - 0.5)}
                aria-label={`${label} ${iconIdx - 0.5} stars`}
                disabled={!isAuthenticated}
              />
              {/* Right half for whole increments */}
              <button
                type="button"
                className="w-1/2 h-full absolute right-0 z-10"
                onMouseEnter={() => setHover(iconIdx)}
                onClick={() => onChange(iconIdx)}
                aria-label={`${label} ${iconIdx} stars`}
                disabled={!isAuthenticated}
              />
              <div className="relative">
                <ThumbsUp
                  size={20}
                  className={`
                    transition-colors duration-150
                    ${(hover || value) >= iconIdx
                      ? 'text-brand-orange fill-brand-orange'
                      : (hover || value) >= iconIdx - 0.5
                        ? 'text-gray-200 fill-gray-100' // Partially filled look
                        : 'text-gray-200'}
                  `}
                  strokeWidth={2}
                />
                {/* Visual half fill overlay */}
                {((hover || value) >= iconIdx - 0.5 && (hover || value) < iconIdx) && (
                  <div className="absolute inset-0 overflow-hidden w-1/2">
                    <ThumbsUp size={20} className="text-brand-orange fill-brand-orange" strokeWidth={2} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Write a Review</h2>
            <p className="text-xs text-gray-500">Share your experience with {listingName}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-50 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">

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

          {/* Detailed Ratings Section */}
          <div className="bg-gray-50/50 rounded-2xl border border-gray-100 p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-2">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Performance Metrics</h3>
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">Overall Score</span>
                <div className="flex items-center gap-2">
                  <ThumbsUp size={16} className="text-brand-orange fill-brand-orange" />
                  <span className="text-xl font-bold text-brand-blue leading-none">{overallRating.toFixed(1)}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              <ThumbsUpRatingField label="Seamless Setup" value={metrics.setup} onChange={(v) => handleMetricChange('setup', v)} />
              <ThumbsUpRatingField label="Ease of Use" value={metrics.usability} onChange={(v) => handleMetricChange('usability', v)} />
              <ThumbsUpRatingField label="Quality of Support" value={metrics.support} onChange={(v) => handleMetricChange('support', v)} />
              <ThumbsUpRatingField label="Value for Money" value={metrics.value} onChange={(v) => handleMetricChange('value', v)} />
              <ThumbsUpRatingField label="Reliability" value={metrics.reliability} onChange={(v) => handleMetricChange('reliability', v)} />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-900">Review Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., The best project management tool I've used"
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent text-sm transition-all shadow-sm font-bold"
              required
              disabled={!isAuthenticated}
            />
          </div>

          {/* Content */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-900">Detailed Review</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What did you like or dislike? How are you using it?"
              rows={4}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent text-sm transition-all resize-none shadow-sm font-medium"
              required
              disabled={!isAuthenticated}
            />
          </div>

          {/* Pros & Cons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <ThumbsUp size={14} className="text-emerald-600" /> Pros
              </label>
              <textarea
                value={pros}
                onChange={(e) => setPros(e.target.value)}
                placeholder="What impressed you the most?"
                rows={3}
                className="w-full px-4 py-3 bg-emerald-50/30 border border-emerald-100 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm transition-all resize-none shadow-sm"
                disabled={!isAuthenticated}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <ThumbsDown size={14} className="text-rose-600" /> Cons
              </label>
              <textarea
                value={cons}
                onChange={(e) => setCons(e.target.value)}
                placeholder="What could be better?"
                rows={3}
                className="w-full px-4 py-3 bg-rose-50/30 border border-rose-100 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm transition-all resize-none shadow-sm"
                disabled={!isAuthenticated}
              />
            </div>
          </div>

          {/* Recommendation Section */}
          <div className="pt-2">
            <label className="text-sm font-bold text-gray-900 mb-3 block">
              Would you recommend this for? <span className="text-xs font-normal text-gray-400">(Select all that apply)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {BROKER_TYPES.map(type => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => toggleRecommendation(type.id)}
                  disabled={!isAuthenticated}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold transition-all shadow-sm ${recommendations.includes(type.id)
                    ? 'bg-brand-orange text-white border-brand-orange'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-brand-orange/20'
                    }`}
                >
                  {recommendations.includes(type.id) && <CheckCircle2 size={14} />}
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-6 flex items-center justify-end gap-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl text-sm font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-2.5 bg-[#0f172a] hover:bg-black text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-gray-300 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={!isAuthenticated}
            >
              Submit Review <Send size={14} />
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ReviewFormModal;
