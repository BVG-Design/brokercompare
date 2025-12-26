'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StarRating } from '@/components/shared/star-rating';
import { ThumbsUp, ThumbsDown, Trash2, Star } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import type { ReviewRecord } from '@/lib/dashboard-data';
import { Loader2 } from 'lucide-react';

export default function ReviewsManagement() {
  const [reviews, setReviews] = useState<
    (ReviewRecord & { vendorName?: string | null })[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const loadReviews = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('reviews')
        .select('*, vendors:vendor_id (company_name)')
        .order('created_at', { ascending: false });

      if (error) {
        setLoadError('Could not load reviews');
      } else {
        const normalized =
          data?.map((review: any) => ({
            ...review,
            vendorName: review.vendors?.company_name ?? null,
          })) ?? [];
        setReviews(normalized);
      }
      setIsLoading(false);
    };

    loadReviews();
  }, []);

  const handleStatusChange = async (reviewId, status) => {
    const { error } = await supabase
      .from('reviews')
      .update({ status, moderation_status: status })
      .eq('id', reviewId);

    if (error) {
      const { error: fallbackError } = await supabase
        .from('reviews')
        .update({ status })
        .eq('id', reviewId);
      if (fallbackError) return;
    }

    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, status, moderation_status: status } : r));
  };
  
  const handleDelete = async (reviewId) => {
    const { error } = await supabase.from('reviews').delete().eq('id', reviewId);
    if (!error) {
      setReviews(prev => prev.filter(r => r.id !== reviewId));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[#132847]">Review Moderation</CardTitle>
      </CardHeader>
      <CardContent>
         {isLoading ? (
          <div className="flex items-center gap-2 text-gray-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading reviews...</span>
          </div>
        ) : loadError ? (
          <p className="text-sm text-red-600">{loadError}</p>
        ) : reviews.length > 0 ? (
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {reviews.map((review) => (
              <div key={review.id} className="p-4 border rounded-lg">
                {(() => {
                  const moderationStatus = review.moderation_status ?? review.moderationStatus ?? review.status ?? 'pending';
                  const isVerified = review.is_verified ?? review.isVerified ?? review.verified ?? false;
                  return (
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold">{review.author} on {review.vendorName || review.vendor_id}</p>
                    <p className="text-xs text-muted-foreground">
                      {review.created_at
                        ? new Date(review.created_at).toLocaleDateString()
                        : 'No date'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {isVerified && (
                      <Badge variant="outline" className="border-emerald-500 text-emerald-600 bg-emerald-50">
                        Verified
                      </Badge>
                    )}
                    <Badge
                      variant={moderationStatus === 'approved' ? 'default' : 'outline'}
                      className={moderationStatus === 'approved' ? 'bg-green-100 text-green-800' : ''}
                    >
                      {moderationStatus}
                    </Badge>
                  </div>
                </div>
                <StarRating rating={review.rating || 0} className="mb-2" />
                <p className="text-sm text-muted-foreground mb-4">{review.comment || 'No comment provided.'}</p>
                <div className="flex gap-2">
                  {moderationStatus !== 'approved' && (
                    <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700" onClick={() => handleStatusChange(review.id, 'approved')}>
                      <ThumbsUp className="mr-2 h-4 w-4" /> Approve
                    </Button>
                  )}
                   {moderationStatus !== 'rejected' && (
                     <Button size="sm" variant="outline" className="text-orange-600 border-orange-600 hover:bg-orange-50 hover:text-orange-700" onClick={() => handleStatusChange(review.id, 'rejected')}>
                      <ThumbsDown className="mr-2 h-4 w-4" /> Reject
                    </Button>
                  )}
                  <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => handleDelete(review.id)}>
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </Button>
                </div>
                  );
                })()}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Star className="mx-auto h-12 w-12 mb-4" />
            <p>No reviews to moderate.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
