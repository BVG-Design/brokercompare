'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { StarRating } from '@/components/shared/star-rating';
import { ExternalLink, Award, Star, CheckCircle, Bookmark, ArrowLeftRight, Send, FileText, Video, Calendar, MessageSquare, ThumbsUp, Edit, ChevronRight, ChevronLeft, Download, Play, Save, X, Upload, Plus, MapPin } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import VendorCard from '@/components/vendors/VendorCard';
// TODO: Replace with Supabase queries when tables are ready
// import { vendorQueries } from '@/lib/supabase';

function VendorProfileContent() {
  const params = useParams();
  const router = useRouter();
  const vendorId = params.id as string;

  const [user, setUser] = useState<any>(null);
  const [vendor, setVendor] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isShortlisted, setIsShortlisted] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [similarVendors, setSimilarVendors] = useState<any[]>([]);
  const [worksWellWithVendors, setWorksWellWithVendors] = useState<any[]>([]);
  const [alternativeVendors, setAlternativeVendors] = useState<any[]>([]);

  const [leadData, setLeadData] = useState({
    broker_name: '',
    broker_email: '',
    broker_phone: '',
    broker_type: 'mortgage_broker',
    company_name: '',
    team_size: '',
    aggregator: '',
    enquiry_about: '',
    message: ''
  });

  const [reviewData, setReviewData] = useState({
    rating: 5,
    review_title: '',
    review_content: ''
  });

  // TODO: Replace with Supabase auth when ready
  useEffect(() => {
    // Placeholder: Check authentication
    // const checkAuth = async () => {
    //   const { data: { user } } = await supabase.auth.getUser();
    //   setUser(user);
    // };
    // checkAuth();
  }, []);

  // TODO: Replace with Supabase query when tables are ready
  useEffect(() => {
    if (!vendorId) return;

    const fetchVendor = async () => {
      setIsLoading(true);
      try {
        // Placeholder: This will be replaced with actual Supabase query
        // const data = await vendorQueries.getById(vendorId);
        // if (!data) {
        //   notFound();
        // }
        // setVendor(data);

        // For now, show not found
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching vendor:', error);
        setIsLoading(false);
      }
    };

    fetchVendor();
  }, [vendorId]);

  // TODO: Fetch reviews, similar vendors, etc. when Supabase is ready
  useEffect(() => {
    if (!vendor) return;

    // Fetch reviews
    // Fetch similar vendors
    // Fetch works well with vendors
    // Fetch alternative vendors
  }, [vendor]);

  const handleSubmitLead = async () => {
    // TODO: Implement Supabase mutation
    toast({
      title: 'Lead submitted',
      description: 'Your inquiry has been sent to the vendor.',
    });
    setShowLeadForm(false);
    setLeadData({
      broker_name: '',
      broker_email: '',
      broker_phone: '',
      broker_type: 'mortgage_broker',
      company_name: '',
      team_size: '',
      aggregator: '',
      enquiry_about: '',
      message: ''
    });
  };

  const handleSubmitReview = async () => {
    // TODO: Implement Supabase mutation
    toast({
      title: 'Review submitted',
      description: 'Your review has been submitted and is pending approval.',
    });
    setShowReviewForm(false);
    setReviewData({
      rating: 5,
      review_title: '',
      review_content: ''
    });
  };

  if (isLoading) {
    return (
      <>

        <main className="flex-1 bg-background">
          <div className="container mx-auto px-4 md:px-6 py-12">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
          </div>
        </main>

      </>
    );
  }

  if (!vendor) {
    notFound();
  }

  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;

  const approvedReviews = reviews.filter(r => r.status === 'approved');

  return (
    <>

      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 md:px-6 py-12">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
            <div className="relative">
              <Image
                src={vendor.logo_url || '/placeholder-logo.png'}
                alt={`${vendor.company_name} logo`}
                width={128}
                height={128}
                className="rounded-xl border bg-card shadow-md"
                data-ai-hint="company logo"
              />
              {vendor.listing_tier === 'featured' && (
                <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-secondary to-accent">
                  <Award className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {vendor.categories?.map((cat: string) => (
                  <Badge key={cat} variant="secondary">{cat.replace(/_/g, ' ')}</Badge>
                ))}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary mb-2">
                {vendor.company_name}
              </h1>
              <p className="text-xl text-muted-foreground mb-4">{vendor.tagline}</p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground">
                <StarRating rating={averageRating} size={20} />
                <span className="text-sm">({approvedReviews.length} reviews)</span>
                {vendor.website && (
                  <Link href={vendor.website} target="_blank" className="flex items-center gap-2 hover:text-secondary transition-colors">
                    <ExternalLink className="h-5 w-5" />
                    <span>Visit Website</span>
                  </Link>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowLeadForm(true)}
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Contact Vendor
              </Button>
              <Button variant="outline">
                <Bookmark className="mr-2 h-4 w-4" />
                Save
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>About {vendor.company_name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base leading-relaxed">{vendor.description}</p>
                </CardContent>
              </Card>

              {/* Features */}
              {vendor.features && vendor.features.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Key Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {vendor.features.map((feature: string) => (
                        <li key={feature} className="flex items-start gap-3">
                          <CheckCircle className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Integrations */}
              {vendor.integrations && vendor.integrations.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Integrations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {vendor.integrations.map((integration: string) => (
                        <Badge key={integration} variant="outline">{integration}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Reviews */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>User Reviews</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowReviewForm(true)}
                    >
                      <Star className="mr-2 h-4 w-4" />
                      Write a Review
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {approvedReviews.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No reviews yet. Be the first to review!</p>
                  ) : (
                    approvedReviews.map((review) => (
                      <div key={review.id} className="border-b pb-6 last:border-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold">{review.reviewer_name || 'Anonymous'}</p>
                            <p className="text-xs text-muted-foreground">
                              {review.created_date ? format(new Date(review.created_date), 'MMMM d, yyyy') : ''}
                            </p>
                          </div>
                          <StarRating rating={review.rating} size={16} showText={false} />
                        </div>
                        {review.review_title && (
                          <h4 className="font-semibold mb-2">{review.review_title}</h4>
                        )}
                        <p className="text-sm text-muted-foreground">{review.review_content}</p>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Card */}
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-center font-headline">Contact Vendor</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    Interested in their services? Get in touch directly.
                  </p>
                  <Button
                    className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                    onClick={() => setShowLeadForm(true)}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Enquire Now
                  </Button>
                </CardContent>
              </Card>

              {/* Similar Vendors */}
              {similarVendors.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Similar Vendors</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {similarVendors.map((v) => (
                      <VendorCard key={v.id} vendor={v} />
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* Lead Form Dialog */}
        <Dialog open={showLeadForm} onOpenChange={setShowLeadForm}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Contact {vendor.company_name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="broker_name">Your Name</Label>
                  <Input
                    id="broker_name"
                    value={leadData.broker_name}
                    onChange={(e) => setLeadData({ ...leadData, broker_name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="broker_email">Email</Label>
                  <Input
                    id="broker_email"
                    type="email"
                    value={leadData.broker_email}
                    onChange={(e) => setLeadData({ ...leadData, broker_email: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="broker_phone">Phone</Label>
                <Input
                  id="broker_phone"
                  value={leadData.broker_phone}
                  onChange={(e) => setLeadData({ ...leadData, broker_phone: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="broker_type">Broker Type</Label>
                <Select
                  value={leadData.broker_type}
                  onValueChange={(value) => setLeadData({ ...leadData, broker_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mortgage_broker">Mortgage Broker</SelectItem>
                    <SelectItem value="asset_finance_broker">Asset Finance Broker</SelectItem>
                    <SelectItem value="commercial_finance_broker">Commercial Finance Broker</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={leadData.message}
                  onChange={(e) => setLeadData({ ...leadData, message: e.target.value })}
                  rows={5}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSubmitLead} className="flex-1">
                  <Send className="mr-2 h-4 w-4" />
                  Send Inquiry
                </Button>
                <Button variant="outline" onClick={() => setShowLeadForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Review Form Dialog */}
        <Dialog open={showReviewForm} onOpenChange={setShowReviewForm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Write a Review</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Rating</Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setReviewData({ ...reviewData, rating })}
                      className={`p-2 rounded ${reviewData.rating >= rating
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                        }`}
                    >
                      <Star className="w-6 h-6 fill-current" />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="review_title">Review Title</Label>
                <Input
                  id="review_title"
                  value={reviewData.review_title}
                  onChange={(e) => setReviewData({ ...reviewData, review_title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="review_content">Your Review</Label>
                <Textarea
                  id="review_content"
                  value={reviewData.review_content}
                  onChange={(e) => setReviewData({ ...reviewData, review_content: e.target.value })}
                  rows={5}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSubmitReview} className="flex-1">
                  Submit Review
                </Button>
                <Button variant="outline" onClick={() => setShowReviewForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>

    </>
  );
}

export default function VendorProfilePage() {
  return (
    <Suspense fallback={
      <>

        <main className="flex-1 bg-background">
          <div className="container mx-auto px-4 md:px-6 py-12">
            <div className="text-center">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </div>
        </main>

      </>
    }>
      <VendorProfileContent />
    </Suspense>
  );
}

