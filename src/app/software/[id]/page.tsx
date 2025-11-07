import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { software } from '@/lib/data';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StarRating } from '@/components/shared/star-rating';
import { ExternalLink, Check, MessageSquare, Star, SlidersHorizontal, DollarSign } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

export async function generateStaticParams() {
  return software.map((item) => ({
    id: item.id,
  }));
}

export default function SoftwareDetailPage({ params }: { params: { id: string } }) {
  const item = software.find((s) => s.id === params.id);

  if (!item) {
    notFound();
  }

  const averageRating = item.reviews.length > 0 
    ? item.reviews.reduce((acc, review) => acc + review.rating, 0) / item.reviews.length
    : 0;

  return (
    <>
      <Header />
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 md:px-6 py-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
            <Image
              src={item.logoUrl}
              alt={`${item.name} logo`}
              width={128}
              height={128}
              className="rounded-xl border bg-card shadow-md"
              data-ai-hint="tech logo"
            />
            <div className="flex-1">
              <Badge variant="secondary" className="mb-2 bg-accent/20 text-accent-foreground">{item.category}</Badge>
              <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary mb-2">{item.name}</h1>
              <p className="text-xl text-muted-foreground mb-4">{item.tagline}</p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground">
                <StarRating rating={averageRating} size={20} />
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  <span>{item.pricing}</span>
                </div>
                 <Link href="#" className="flex items-center gap-2 hover:text-secondary transition-colors">
                  <ExternalLink className="h-5 w-5" />
                  <span>Visit Website</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>About {item.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>

              {/* Features */}
              <Card>
                <CardHeader>
                  <CardTitle>Key Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {item.features.map(feature => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                        <span>{feature}</span>
                      </li>
))}
                  </ul>
                </CardContent>
              </Card>

              {/* Reviews */}
              <Card>
                <CardHeader>
                  <CardTitle>User Reviews</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {item.reviews.map((review, index) => (
                    <React.Fragment key={review.id}>
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
                      {index < item.reviews.length - 1 && <Separator />}
                    </React.Fragment>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                  <CardHeader>
                      <CardTitle>Compatibility</CardTitle>
                  </CardHeader>
                  <CardContent>
                       <ul className="space-y-2">
                        {item.compatibility.map(comp => (
                          <li key={comp} className="flex items-center gap-2 text-sm">
                            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                            <span>{comp}</span>
                          </li>
                        ))}
                      </ul>
                  </CardContent>
              </Card>
              <Card className="bg-primary/5 border-primary/20">
                  <CardHeader>
                      <CardTitle className="text-center font-headline">Leave a Review</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                      <p className="text-sm text-muted-foreground mb-4">Share your experience with this software to help others.</p>
                      <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                          <Star className="mr-2 h-4 w-4" /> Write a Review
                      </Button>
                  </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
