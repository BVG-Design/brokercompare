import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { sanity } from '../../../../lib/sanity';
import { SERVICE_BY_ID_QUERY, SERVICES_SLUGS_QUERY } from '@/sanity/lib/queries';
import type { Service } from '@/lib/types';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StarRating } from '@/components/shared/star-rating';
import { ExternalLink, MapPin, Check, MessageSquare, Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { CompareCard } from './compare-card';

export const revalidate = 60;

export async function generateStaticParams() {
  const services = await sanity.fetch(SERVICES_SLUGS_QUERY);
  if (!services || !Array.isArray(services)) return [];
  return services.map((service: { id: string }) => ({
    id: service.id,
  }));
}

export default async function ServiceDetailPage({ params }: { params: { id: string } }) {
  const service: Service = await sanity.fetch(SERVICE_BY_ID_QUERY, { slug: params.id });

  if (!service) {
    notFound();
  }

  const averageRating = service.reviews && service.reviews.length > 0
    ? service.reviews.reduce((acc, review) => acc + review.rating, 0) / service.reviews.length
    : 0;

  return (
    <>

      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 md:px-6 py-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
            {(service.images?.[0] || service.logoUrl) && (
              <Image
                src={service.images?.[0] || service.logoUrl}
                alt={`${service.name} logo`}
                width={128}
                height={128}
                className="rounded-xl border bg-card shadow-md"
                data-ai-hint="company logo"
              />
            )}
            <div className="flex-1">
              <Badge variant="secondary" className="mb-2 bg-accent/20 text-accent-foreground">{service.category}</Badge>
              <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary mb-2">{service.name}</h1>
              <p className="text-xl text-muted-foreground mb-4">{service.tagline}</p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground">
                <StarRating rating={averageRating} size={20} />
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <span>{service.location}</span>
                </div>
                {service.website && (
                  <Link href={service.website} target="_blank" className="flex items-center gap-2 hover:text-secondary transition-colors">
                    <ExternalLink className="h-5 w-5" />
                    <span>{service.website}</span>
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>About {service.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base leading-relaxed">{service.description}</p>
                </CardContent>
              </Card>

              {/* Features */}
              {service.features && service.features.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Core Services</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {service.features.map(feature => (
                        <li key={feature} className="flex items-start gap-3">
                          <Check className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Reviews */}
              {service.reviews && service.reviews.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>User Reviews</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {service.reviews.map((review, index) => (
                      <React.Fragment key={index}>
                        <div className="flex gap-4">
                          <Avatar>
                            <AvatarImage src={review.avatarUrl} alt={review.author} data-ai-hint="person portrait" />
                            <AvatarFallback>{review.author.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                              <p className="font-semibold">{review.author}</p>
                              <span className="text-xs text-muted-foreground">{review.date}</span>
                            </div>
                            <StarRating rating={review.rating} size={16} showText={false} className="mb-2" />
                            <p className="text-sm text-muted-foreground">{review.comment}</p>
                          </div>
                        </div>
                        {index < service.reviews.length - 1 && <Separator />}
                      </React.Fragment>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* CTA Sidebar */}
            <div className="space-y-6">
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-center font-headline">Leave a Review</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">Share your experience with this provider to help others in the community.</p>
                  <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                    <Star className="mr-2 h-4 w-4" /> Write a Review
                  </Button>
                </CardContent>
              </Card>
              <CompareCard service={service} />
              <Card>
                <CardHeader>
                  <CardTitle className="text-center font-headline">Contact Provider</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">Interested in their services? Get in touch directly.</p>
                  <Button asChild className="w-full">
                    <Link href={service.website || '#'} target="_blank">
                      <MessageSquare className="mr-2 h-4 w-4" /> Enquire Now
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

    </>
  );
}
