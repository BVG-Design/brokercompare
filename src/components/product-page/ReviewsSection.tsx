'use client';

import React, { useEffect, useState } from 'react';
import { Star, Sparkles } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import ReviewFormModal, { ReviewFormData } from './ReviewFormModal';
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

  const handleSubmit = async (_data: ReviewFormData) => {
    toast({
      title: 'Review captured',
      description: 'Thanks! Your rubric scores will feed into the marketplace matrix once the pipeline is live.',
    });
    setModalOpen(false);
  };

  return (
    <div id="reviews" className="max-w-6xl mx-auto px-4 mb-12">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-bold text-gray-900">User Reviews</h2>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Sparkles className="w-4 h-4 text-orange-500" />
          <span>Matrix: Usability · Support · Value · Features</span>
        </div>
      </div>

      <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
        <p className="text-gray-500 text-sm mb-6">
          Be the first to review {listingName} with the four-part scoring guide.
        </p>
        <div className="flex items-center gap-6 mb-6">
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold text-gray-900 tracking-tight">0.0</span>
            <div className="flex flex-col items-start">
              <div className="flex gap-0.5 mb-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={14} className="text-gray-300" />
                ))}
              </div>
              <span className="text-xs text-gray-500">Marketplace score pending</span>
            </div>
          </div>
        </div>

        <div className="space-y-2 text-xs text-gray-500 mb-4">
          <p>Scores are weighted evenly across usability, support, value, and features.</p>
          <p>We require login so each review can be verified before it impacts rankings.</p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md font-medium text-sm transition-colors shadow-sm"
        >
          Write a Review
        </button>
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
