'use client';

import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { StarRating } from '@/components/shared/star-rating';
import { computeMarketplaceScore } from '@/lib/marketplace-score';
import { createClient } from '@/lib/supabase/client';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ExternalLink, Loader2, Mail, Star, TrendingUp } from 'lucide-react';

type Partner = {
  id: string;
  company_name?: string | null;
  tagline?: string | null;
  description?: string | null;
  logo_url?: string | null;
  website?: string | null;
  categories?: string[] | null;
  listing_tier?: string | null;
  view_count?: number | null;
};

type Review = {
  id: string;
  partner_id?: string | null;
  author?: string | null;
  rating?: number | null;
  comment?: string | null;
  status?: string | null;
  moderation_status?: string | null;
  moderationStatus?: string | null;
  created_at?: string | null;
};

const supabase = createClient();

function PartnerProfileContent() {
  const params = useParams<{ id: string }>();
  const partnerId = params?.id;

  const [partner, setPartner] = useState<Partner | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [similarPartners, setSimilarPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [leadOpen, setLeadOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const [leadData, setLeadData] = useState({
    broker_name: '',
    broker_email: '',
    broker_phone: '',
    message: '',
  });

  const [reviewData, setReviewData] = useState({
    rating: 5,
    author: '',
    comment: '',
  });

  const approvedReviews = useMemo(() => {
    return reviews.filter((review) => {
      const status =
        (review.status || review.moderation_status || review.moderationStatus || '').toLowerCase();
      return !status || status === 'approved' || status === 'published';
    });
  }, [reviews]);

  const averageRating = useMemo(() => {
    if (!approvedReviews.length) return 0;
    const total = approvedReviews.reduce((sum, review) => sum + (review.rating || 0), 0);
    return Number((total / approvedReviews.length).toFixed(1));
  }, [approvedReviews]);

  const marketplaceScore = computeMarketplaceScore({ averageRating });

  useEffect(() => {
    if (!partnerId) return;

    const fetchData = async () => {
      setLoading(true);

      const { data: partnerRow, error: partnerError } = await supabase
        .from('partners')
        .select('*')
        .eq('id', partnerId)
        .maybeSingle();

      if (partnerError) {
        console.warn('Error fetching partner', partnerError);
        setLoading(false);
        return;
      }

      if (!partnerRow) {
        setLoading(false);
        return;
      }

      setPartner(partnerRow as Partner);

      const { data: reviewRows, error: reviewError } = await supabase
        .from('reviews')
        .select('*')
        .eq('partner_id', partnerId)
        .order('created_at', { ascending: false });

      if (reviewError) {
        console.warn('Error fetching reviews', reviewError);
      }

      setReviews((reviewRows as Review[]) || []);

      if (partnerRow.categories && partnerRow.categories.length) {
        const firstCategory = partnerRow.categories[0];
        const { data: similarRows, error: similarError } = await supabase
          .from('partners')
          .select('id, company_name, tagline, categories, logo_url, listing_tier, website, view_count')
          .contains('categories', [firstCategory])
          .neq('id', partnerId)
          .limit(6);

        if (similarError) {
          console.warn('Error fetching similar partners', similarError);
        } else {
          setSimilarPartners((similarRows as Partner[]) || []);
        }
      }

      setLoading(false);
    };

    fetchData();
  }, [partnerId]);

  const handleSubmitLead = async () => {
    if (!partner) return;
    setLeadSubmitting(true);

    const payload = {
      ...leadData,
      partner_id: partner.id,
      status: 'new',
    };

    const { error } = await supabase.from('leads').insert(payload);

    setLeadSubmitting(false);

    if (error) {
      toast({
        title: 'Could not submit lead',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Lead submitted',
      description: 'We sent your inquiry to the partner.',
    });
    setLeadOpen(false);
    setLeadData({
      broker_name: '',
      broker_email: '',
      broker_phone: '',
      message: '',
    });
  };

  const handleSubmitReview = async () => {
    if (!partner) return;
    setReviewSubmitting(true);

    const payload = {
      partner_id: partner.id,
      rating: reviewData.rating,
      comment: reviewData.comment,
      author: reviewData.author || null,
      status: 'pending',
    };

    const { error } = await supabase.from('reviews').insert(payload);

    setReviewSubmitting(false);

    if (error) {
      toast({
        title: 'Could not submit review',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Review submitted',
      description: 'Thanks for your feedback. We will publish it after moderation.',
    });

    setReviewOpen(false);
    setReviewData({
      rating: 5,
      author: '',
      comment: '',
    });
  };

  if (loading) {
    return (
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 md:px-6 py-16 flex justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </main>
    );
  }

  if (!partner) {
    return (
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 md:px-6 py-16">
          <Card className="max-w-xl mx-auto">
            <CardHeader>
              <CardTitle>Partner not found</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We could not find that partner profile. Try browsing the directory to discover verified partners.
              </p>
              <Button asChild>
                <Link href="/directory">Back to directory</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-background">
      <div className="container mx-auto px-4 md:px-6 py-12 space-y-10">
        <Card className="shadow-md">
          <CardContent className="p-6 md:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="relative h-20 w-20 md:h-24 md:w-24 rounded-xl bg-gray-50 border border-dashed flex items-center justify-center overflow-hidden">
                {partner.logo_url ? (
                  <Image
                    src={partner.logo_url}
                    alt={partner.company_name || 'Partner logo'}
                    fill
                    className="object-contain p-2"
                  />
                ) : (
                  <span className="text-3xl font-semibold text-primary">
                    {partner.company_name?.[0] || 'V'}
                  </span>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <h1 className="text-3xl font-bold text-primary">{partner.company_name}</h1>
                {partner.tagline && <p className="text-lg text-muted-foreground">{partner.tagline}</p>}
                <div className="flex flex-wrap gap-2">
                  {(partner.categories || []).map((category) => (
                    <Badge key={category} variant="secondary" className="bg-gray-100 text-gray-700">
                      {category}
                    </Badge>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Dialog open={leadOpen} onOpenChange={setLeadOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Mail className="w-4 h-4 mr-2" />
                        Contact partner
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Contact {partner.company_name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-3">
                        <Input
                          placeholder="Your name"
                          value={leadData.broker_name}
                          onChange={(e) => setLeadData({ ...leadData, broker_name: e.target.value })}
                        />
                        <Input
                          type="email"
                          placeholder="Work email"
                          value={leadData.broker_email}
                          onChange={(e) => setLeadData({ ...leadData, broker_email: e.target.value })}
                        />
                        <Input
                          placeholder="Phone (optional)"
                          value={leadData.broker_phone}
                          onChange={(e) => setLeadData({ ...leadData, broker_phone: e.target.value })}
                        />
                        <Textarea
                          rows={4}
                          placeholder="What do you want to achieve?"
                          value={leadData.message}
                          onChange={(e) => setLeadData({ ...leadData, message: e.target.value })}
                        />
                        <Button onClick={handleSubmitLead} disabled={leadSubmitting}>
                          {leadSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Send inquiry
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Star className="w-4 h-4 mr-2 text-amber-500" />
                        Write a review
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Share your experience</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-3">
                        <Input
                          placeholder="Your name (optional)"
                          value={reviewData.author}
                          onChange={(e) => setReviewData({ ...reviewData, author: e.target.value })}
                        />
                        <label className="text-sm font-medium text-gray-700">Rating</label>
                        <div className="flex items-center gap-3">
                          <StarRating rating={reviewData.rating} />
                          <Input
                            type="number"
                            min={1}
                            max={5}
                            value={reviewData.rating}
                            onChange={(e) =>
                              setReviewData({
                                ...reviewData,
                                rating: Math.min(5, Math.max(1, Number(e.target.value))),
                              })
                            }
                            className="w-20"
                          />
                        </div>
                        <Textarea
                          rows={5}
                          placeholder="What worked well? What could be better?"
                          value={reviewData.comment}
                          onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                        />
                        <Button onClick={handleSubmitReview} disabled={reviewSubmitting}>
                          {reviewSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Submit review
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {partner.website && (
                    <Button asChild variant="ghost">
                      <a href={vendor.website} target="_blank" rel="noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Visit website
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Marketplace score</p>
                  <div className="flex items-center gap-2 mt-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <p className="text-2xl font-bold text-primary">{marketplaceScore}/100</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Average rating</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
                    <p className="text-2xl font-bold">{averageRating || '—'}</p>
                    <span className="text-sm text-muted-foreground">({approvedReviews.length} reviews)</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Listing tier</p>
                  <p className="text-2xl font-bold capitalize">{partner.listing_tier || 'Standard'}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Profile views</p>
                  <p className="text-2xl font-bold">{partner.view_count ?? '—'}</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                {partner.description || 'This partner has not added a description yet.'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Need help deciding?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Share your goals and we will introduce you to this partner with the right context.
              </p>
              <Button onClick={() => setLeadOpen(true)} className="w-full">
                <Mail className="w-4 h-4 mr-2" />
                Start a conversation
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/compare">Compare partners</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Reviews</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {approvedReviews.length === 0 && (
              <p className="text-sm text-muted-foreground">No reviews yet. Be the first to share feedback.</p>
            )}

            {approvedReviews.map((review) => (
              <div key={review.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                      {review.author || 'Verified broker'}
                    </div>
                    {review.created_at && (
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(review.created_at), 'PPP')}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span className="text-sm font-semibold">{review.rating?.toFixed(1) || '—'}</span>
                  </div>
                </div>
                {review.comment && <p className="text-sm text-gray-700">{review.comment}</p>}
              </div>
            ))}
          </CardContent>
        </Card>

        {similarVendors.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Similar partners</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {similarPartners.map((similar) => (
                <div key={similar.id} className="border rounded-lg p-4 space-y-3 hover:shadow-sm transition">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center text-primary font-semibold">
                      {similar.company_name?.[0] || 'V'}
                    </div>
                    <div>
                      <p className="font-semibold text-primary">{similar.company_name}</p>
                      {similar.tagline && <p className="text-sm text-muted-foreground line-clamp-2">{similar.tagline}</p>}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {(similar.categories || []).slice(0, 3).map((category) => (
                      <Badge key={`${similar.id}-${category}`} variant="secondary" className="bg-gray-100 text-gray-700">
                        {category}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-muted-foreground capitalize">
                      {similar.listing_tier || 'standard'}
                    </span>
                    <Link href={`/vendors/${similar.id}`} className="text-sm font-medium text-primary hover:underline">
                      View profile
                    </Link>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}

export default function PartnerProfilePage() {
  return (
    <Suspense
      fallback={
        <main className="flex-1 bg-background">
          <div className="container mx-auto px-4 md:px-6 py-16 flex justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        </main>
      }
    >
      <PartnerProfileContent />
    </Suspense>
  );
}
