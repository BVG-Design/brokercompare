'use client';

import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import ReviewFormModal from './ReviewFormModal';
import { useAuth } from '@/hooks/use-auth';
import { toast } from '@/hooks/use-toast';

interface ReviewsSectionProps {
  listingName?: string;
  listingSlug?: string;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ listingName = 'this listing', listingSlug }) => {
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

  // Static distribution data for now, matching the demo's visual
  // In a real app, this would come from props or a data fetch
  const distribution = [
    { stars: 5, count: 3, percent: 80, color: 'bg-orange-500' },
    { stars: 4, count: 2, percent: 50, color: 'bg-orange-500' },
    { stars: 3, count: 0, percent: 0, color: 'bg-gray-200' },
    { stars: 2, count: 0, percent: 0, color: 'bg-gray-200' },
    { stars: 1, count: 0, percent: 0, color: 'bg-gray-200' },
  ];

  return (
    <div id="reviews" className="max-w-6xl mx-auto px-4 mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">User Reviews</h2>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg font-bold text-sm transition-colors shadow-sm"
        >
          Write a Review
        </button>
      </div>

      <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-12">
        {/* Big Rating Number */}
        <div className="flex flex-col items-center justify-center text-center min-w-[180px]">
          <span className="text-6xl font-bold text-gray-900 tracking-tighter">4.7</span>
          <div className="flex gap-1 my-2">
            {[1, 2, 3, 4].map(i => <Star key={i} size={20} className="text-orange-400 fill-orange-400" />)}
            <Star size={20} className="text-orange-400 fill-orange-400" style={{ clipPath: 'inset(0 30% 0 0)' }} />
          </div>
          <span className="text-sm text-gray-500">Based on 8,542 reviews</span>
        </div>

        {/* Bars */}
        <div className="flex-1 w-full max-w-2xl">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Rating Distribution</h3>
          <div className="space-y-3">
            {distribution.map((item) => (
              <div key={item.stars} className="flex items-center gap-3">
                <div className="flex items-center w-8 gap-1">
                  <span className="text-xs font-semibold text-gray-700">{item.stars}</span>
                  <Star size={10} className="text-orange-400 fill-orange-400" />
                </div>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{ width: `${item.percent}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-400 w-6 text-right">{item.count}</span>
              </div>
            ))}
          </div>
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
