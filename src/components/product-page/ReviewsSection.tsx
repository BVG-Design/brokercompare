'use client';

import React, { useEffect, useState } from 'react';
import { Star, Check, X, ThumbsUp, ChevronLeft, ChevronRight, BadgeCheck } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import ReviewFormModal from './ReviewFormModal';
import { useAuth } from '@/hooks/use-auth';
import { toast } from '@/hooks/use-toast';

interface ReviewsSectionProps {
  listingName?: string;
  listingSlug?: string;
  reviews?: any[];
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ listingName = 'this listing', listingSlug, reviews = [] }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const handleOpenModal = () => setModalOpen(true);

    if (typeof window !== 'undefined') {
      window.addEventListener('open-review-modal', handleOpenModal);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('open-review-modal', handleOpenModal);
      }
    };
  }, []);

  const handleRequestLogin = () => {
    const targetPath = listingSlug ? `/directory/${listingSlug}` : pathname || '/';
    router.push(`/login?next=${encodeURIComponent(targetPath)}`);
  };

  const handleSubmit = async (data: any) => {
    try {
      // We pass the listingSlug so the server action can look up the ID if needed
      const payload = {
        ...data,
        listingSlug: listingSlug,
        listingName: listingName
      };

      const { submitReview } = await import('@/app/actions/submit-review');
      const result = await submitReview(payload);

      if (result.success) {
        toast({
          title: 'Review submitted!',
          description: 'Thanks! Your review has been submitted for moderation.',
        });
        setModalOpen(false);
      } else {
        toast({
          title: 'Submission failed',
          description: result.error || 'Please try again later.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Failed to submit review:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
    }
  };

  // Calculate dynamic stats from reviews
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? reviews.reduce((acc, r) => acc + (r.overall_rating || 0), 0) / totalReviews
    : 0;

  // Calculate distribution
  const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach(r => {
    const rating = Math.round(r.overall_rating || 0);
    if (rating >= 1 && rating <= 5) {
      counts[rating as keyof typeof counts]++;
    }
  });

  const distribution = [5, 4, 3, 2, 1].map(stars => ({
    stars,
    count: counts[stars as keyof typeof counts],
    percent: totalReviews > 0 ? (counts[stars as keyof typeof counts] / totalReviews) * 100 : 0,
    color: stars >= 4 ? 'bg-orange-500' : 'bg-gray-200'
  }));

  // Helper to get random color for avatar if not present
  const getAvatarColor = (id: string) => {
    const colors = ["bg-purple-500", "bg-blue-500", "bg-indigo-500", "bg-green-500", "bg-orange-500"];
    const index = id.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div id="reviews" className="max-w-6xl mx-auto px-4 mb-12">
      {/* What Users Are Saying Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">What Users Are Saying</h2>
        <span className="text-sm text-gray-500">{totalReviews} reviews</span>
      </div>

      <div className="relative">
        {/* Navigation Buttons (Visual only for now, or could implement scroll) */}
        <button className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white border border-gray-200 rounded-full items-center justify-center shadow-md text-gray-600 hover:text-gray-900 hover:bg-gray-50">
          <ChevronLeft size={16} />
        </button>
        <button className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white border border-gray-200 rounded-full items-center justify-center shadow-md text-gray-600 hover:text-gray-900 hover:bg-gray-50">
          <ChevronRight size={16} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.length > 0 ? (
            reviews.map((review) => {
              const authorName = review.reviewer_name || "Verified User";
              const avatarLetter = authorName.charAt(0);
              const avatarColor = getAvatarColor(review.id || authorName);
              const role = review.reviewer_role || "Broker";
              const company = review.reviewer_company || "";

              return (
                <div key={review.id} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex flex-col h-full">
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-full ${avatarColor} text-white flex items-center justify-center font-bold text-sm`}>
                      {avatarLetter}
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <h4 className="font-semibold text-gray-900 text-sm">{authorName}</h4>
                        <BadgeCheck size={14} className="text-green-500" />
                      </div>
                      <p className="text-xs text-gray-500">{role}</p>
                      {company && <p className="text-xs text-gray-400">{company}</p>}
                    </div>
                  </div>

                  <div className="flex gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} className={`${i < Math.round(review.overall_rating || 0) ? 'text-orange-400 fill-orange-400' : 'text-gray-200'}`} />
                    ))}
                    <span className="text-xs font-semibold ml-1 text-gray-700">{(review.overall_rating || 0).toFixed(1)}</span>
                  </div>

                  <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">{review.title}</h3>
                  <p className="text-gray-600 text-xs leading-relaxed mb-4 flex-grow relative pl-3 border-l-2 border-gray-200">
                    {review.content}
                  </p>

                  <div className="space-y-1 mb-6">
                    {(review.pros?.length > 0) ? (
                      review.pros instanceof Array ? review.pros.slice(0, 2).map((pro: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-2">
                          <Check size={12} className="text-green-500" />
                          <span className="text-xs text-gray-600 line-clamp-1">{pro}</span>
                        </div>
                      )) : (
                        // Fallback if pros is a string (legacy)
                        <div className="flex items-center gap-2">
                          <Check size={12} className="text-green-500" />
                          <span className="text-xs text-gray-600 line-clamp-1">{review.pros}</span>
                        </div>
                      )
                    ) : null}
                    {(review.cons?.length > 0) ? (
                      review.cons instanceof Array ? review.cons.slice(0, 1).map((con: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-2">
                          <X size={12} className="text-red-500" />
                          <span className="text-xs text-gray-600 line-clamp-1">{con}</span>
                        </div>
                      )) : (
                        <div className="flex items-center gap-2">
                          <X size={12} className="text-red-500" />
                          <span className="text-xs text-gray-600 line-clamp-1">{review.cons}</span>
                        </div>
                      )
                    ) : null}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                    <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700">
                      <ThumbsUp size={14} />
                      Helpful ({review.helpful_count || 0})
                    </button>
                    <span className="text-xs text-green-600 font-medium">Verified User</span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No reviews yet</h3>
              <p className="text-gray-500 mb-6">Be the first to share your experience!</p>
              <button
                onClick={() => setModalOpen(true)}
                className="text-orange-500 font-bold hover:underline"
              >
                Write a Review
              </button>
            </div>
          )}
        </div>
      </div>

      <ReviewFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        listingName={listingName}
        isAuthenticated={!!user}
        onRequestLogin={handleRequestLogin}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default ReviewsSection;
