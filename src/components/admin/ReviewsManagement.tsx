'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StarRating } from '@/components/shared/star-rating';
import { ThumbsUp, ThumbsDown, Trash2, Star } from 'lucide-react';
import { services, software } from '@/lib/data';

const mockReviews = [
  ...services.flatMap(s => s.reviews.map(r => ({ ...r, vendorName: s.name, status: 'approved' }))),
  ...software.flatMap(s => s.reviews.map(r => ({ ...r, vendorName: s.name, status: 'pending' }))),
].slice(0, 5);


export default function ReviewsManagement() {
  const [reviews, setReviews] = useState(mockReviews);

  const handleStatusChange = (reviewId, status) => {
    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, status } : r));
  };
  
  const handleDelete = (reviewId) => {
     setReviews(prev => prev.filter(r => r.id !== reviewId));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[#132847]">Review Moderation</CardTitle>
      </CardHeader>
      <CardContent>
         {reviews.length > 0 ? (
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {reviews.map((review) => (
              <div key={review.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold">{review.author} on {review.vendorName}</p>
                    <p className="text-xs text-muted-foreground">{new Date(review.date).toLocaleDateString()}</p>
                  </div>
                  <Badge variant={review.status === 'approved' ? 'default' : 'outline'}
                    className={review.status === 'approved' ? 'bg-green-100 text-green-800' : ''}
                  >
                    {review.status}
                  </Badge>
                </div>
                <StarRating rating={review.rating} className="mb-2" />
                <p className="text-sm text-muted-foreground mb-4">{review.comment}</p>
                <div className="flex gap-2">
                  {review.status !== 'approved' && (
                    <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700" onClick={() => handleStatusChange(review.id, 'approved')}>
                      <ThumbsUp className="mr-2 h-4 w-4" /> Approve
                    </Button>
                  )}
                   {review.status !== 'rejected' && (
                     <Button size="sm" variant="outline" className="text-orange-600 border-orange-600 hover:bg-orange-50 hover:text-orange-700" onClick={() => handleStatusChange(review.id, 'rejected')}>
                      <ThumbsDown className="mr-2 h-4 w-4" /> Reject
                    </Button>
                  )}
                  <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => handleDelete(review.id)}>
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </Button>
                </div>
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
