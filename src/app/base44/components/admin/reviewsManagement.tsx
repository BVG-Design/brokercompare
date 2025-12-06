import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, X, Star, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function ReviewsManagement() {
  const queryClient = useQueryClient();
  const [selectedReview, setSelectedReview] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['admin-reviews'],
    queryFn: () => base44.entities.Review.list('-created_date'),
  });

  const approveReviewMutation = useMutation({
    mutationFn: async (review) => {
      await base44.entities.Review.update(review.id, {
        ...review,
        status: 'approved'
      });

      const allApprovedReviews = await base44.entities.Review.filter({ 
        vendor_id: review.vendor_id, 
        status: 'approved' 
      });
      
      const sumRatings = allApprovedReviews.reduce((sum, r) => sum + r.rating, 0);
      const avgRating = allApprovedReviews.length > 0 ? sumRatings / allApprovedReviews.length : 0;

      const vendors = await base44.entities.Vendor.filter({ id: review.vendor_id });
      if (vendors.length > 0) {
        const vendor = vendors[0];
        await base44.entities.Vendor.update(vendor.id, {
          ...vendor,
          rating: avgRating,
          review_count: allApprovedReviews.length
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['all-approved-vendors'] });
      toast.success("Review approved");
      setSelectedReview(null);
    },
  });

  const rejectReviewMutation = useMutation({
    mutationFn: async ({ review, reason }) => {
      await base44.entities.Review.update(review.id, {
        ...review,
        status: 'rejected'
      });

      if (reason) {
        await base44.integrations.Core.SendEmail({
          to: review.reviewer_email,
          subject: "Update on Your Review",
          body: `Dear ${review.reviewer_name},\n\nThank you for taking the time to submit a review for ${review.vendor_name}. After reviewing your submission, we are unable to approve it at this time.\n\nReason: ${reason}\n\nIf you have any questions, please don't hesitate to reach out.\n\nBest regards,\nThe BrokerTools Team`
        });
      }

      // Recalculate vendor rating after rejection (in case it was previously approved)
      const allApprovedReviews = await base44.entities.Review.filter({ 
        vendor_id: review.vendor_id, 
        status: 'approved' 
      });
      
      const sumRatings = allApprovedReviews.reduce((sum, r) => sum + r.rating, 0);
      const avgRating = allApprovedReviews.length > 0 ? sumRatings / allApprovedReviews.length : 0;

      const vendors = await base44.entities.Vendor.filter({ id: review.vendor_id });
      if (vendors.length > 0) {
        const vendor = vendors[0];
        await base44.entities.Vendor.update(vendor.id, {
          ...vendor,
          rating: avgRating,
          review_count: allApprovedReviews.length
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['all-approved-vendors'] });
      toast.success("Review rejected");
      setSelectedReview(null);
      setRejectReason("");
    },
  });

  const pendingReviews = reviews.filter(r => r.status === 'pending');
  const approvedReviews = reviews.filter(r => r.status === 'approved');
  const rejectedReviews = reviews.filter(r => r.status === 'rejected');

  return (
    <div className="space-y-6">
      {/* Pending Reviews */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#132847]">
            Pending Reviews ({pendingReviews.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingReviews.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No pending reviews</p>
          ) : (
            <div className="space-y-4">
              {pendingReviews.map(review => (
                <div 
                  key={review.id} 
                  className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedReview(review)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-[#132847]">{review.reviewer_name}</h4>
                        <Badge className="bg-orange-500">Pending</Badge>
                        {review.verified && (
                          <Badge variant="outline" className="border-green-600 text-green-600">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">For: {review.vendor_name}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <h5 className="font-medium text-[#132847] mb-1">"{review.review_title}"</h5>
                  <p className="text-sm text-gray-700 line-clamp-2">{review.review_content}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Approved Reviews */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#132847] flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Approved Reviews ({approvedReviews.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {approvedReviews.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No approved reviews</p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {approvedReviews.map(review => (
                <div 
                  key={review.id} 
                  className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                  onClick={() => setSelectedReview(review)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-[#132847]">{review.reviewer_name}</p>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star
                            key={star}
                            className={`w-3 h-3 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{review.vendor_name}</p>
                  </div>
                  <Badge className="bg-green-500">Approved</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rejected Reviews */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#132847] flex items-center gap-2">
            <X className="w-5 h-5 text-red-600" />
            Rejected Reviews ({rejectedReviews.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {rejectedReviews.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No rejected reviews</p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {rejectedReviews.map(review => (
                <div 
                  key={review.id} 
                  className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                  onClick={() => setSelectedReview(review)}
                >
                  <div>
                    <p className="font-semibold text-[#132847]">{review.reviewer_name}</p>
                    <p className="text-sm text-gray-600">{review.vendor_name}</p>
                  </div>
                  <Badge className="bg-red-500">Rejected</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Details Dialog */}
      <Dialog open={!!selectedReview} onOpenChange={() => {
        setSelectedReview(null);
        setRejectReason("");
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Review Details</DialogTitle>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-4">
              {/* Review Status & Actions */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge className={
                    selectedReview.status === 'approved' ? 'bg-green-500' :
                    selectedReview.status === 'rejected' ? 'bg-red-500' : 'bg-orange-500'
                  }>
                    {selectedReview.status}
                  </Badge>
                  {selectedReview.verified && (
                    <Badge variant="outline" className="border-green-600 text-green-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified via {selectedReview.verification_method}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${star <= selectedReview.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                  <span className="ml-2 font-semibold">{selectedReview.rating}/5</span>
                </div>
              </div>

              {/* Reviewer Info */}
              <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Reviewer Name</p>
                  <p className="font-semibold">{selectedReview.reviewer_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold">{selectedReview.reviewer_email}</p>
                </div>
                {selectedReview.reviewer_company && (
                  <div>
                    <p className="text-sm text-gray-600">Company</p>
                    <p className="font-semibold">{selectedReview.reviewer_company}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600">Submitted</p>
                  <p className="font-semibold">{new Date(selectedReview.created_date).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Directory Listing */}
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Directory Listing</p>
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-[#132847]">{selectedReview.vendor_name}</p>
                  <Link to={createPageUrl(`VendorProfile?id=${selectedReview.vendor_id}`)}>
                    <Button variant="outline" size="sm">
                      View Profile
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Review Content */}
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Review Title</p>
                  <p className="font-bold text-lg text-[#132847]">"{selectedReview.review_title}"</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Review</p>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedReview.review_content}</p>
                  </div>
                </div>
              </div>

              {/* Helpful Count */}
              {selectedReview.helpful_count > 0 && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4" />
                  {selectedReview.helpful_count} users found this helpful
                </div>
              )}

              {/* Rejection Reason Input (for pending/approved reviews) */}
              {selectedReview.status !== 'rejected' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rejection Reason (will be sent to reviewer)
                  </label>
                  <Textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Provide a reason for rejecting this review..."
                    rows={3}
                  />
                </div>
              )}

              {/* Warning for Approved Reviews */}
              {selectedReview.status === 'approved' && (
                <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-semibold mb-1">Warning: This review is currently live</p>
                    <p>Rejecting this review will remove it from the vendor profile and recalculate their rating.</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                {selectedReview.status === 'pending' && (
                  <>
                    <Button
                      onClick={() => approveReviewMutation.mutate(selectedReview)}
                      disabled={approveReviewMutation.isPending}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve Review
                    </Button>
                    <Button
                      onClick={() => {
                        if (rejectReason.trim()) {
                          rejectReviewMutation.mutate({ review: selectedReview, reason: rejectReason });
                        } else {
                          toast.error("Please provide a rejection reason");
                        }
                      }}
                      disabled={rejectReviewMutation.isPending}
                      variant="destructive"
                      className="flex-1"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Reject Review
                    </Button>
                  </>
                )}

                {selectedReview.status === 'approved' && (
                  <Button
                    onClick={() => {
                      if (rejectReason.trim()) {
                        rejectReviewMutation.mutate({ review: selectedReview, reason: rejectReason });
                      } else {
                        toast.error("Please provide a rejection reason");
                      }
                    }}
                    disabled={rejectReviewMutation.isPending}
                    variant="destructive"
                    className="flex-1"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Reject This Review
                  </Button>
                )}

                {selectedReview.status === 'rejected' && (
                  <Button
                    onClick={() => approveReviewMutation.mutate(selectedReview)}
                    disabled={approveReviewMutation.isPending}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Re-approve Review
                  </Button>
                )}

                <Button
                  onClick={() => {
                    setSelectedReview(null);
                    setRejectReason("");
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}