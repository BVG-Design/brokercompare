import Link from 'next/link';
import Image from 'next/image';
import type { Service } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StarRating } from '@/components/shared/star-rating';
import { ArrowRight, MapPin } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const averageRating = service.reviews.length > 0 
    ? service.reviews.reduce((acc, review) => acc + review.rating, 0) / service.reviews.length
    : 0;

  return (
    <Card className="flex flex-col h-full transform hover:-translate-y-1 transition-transform duration-300 ease-in-out shadow-md hover:shadow-xl">
      <CardHeader className="flex-row gap-4 items-start">
        <Image
          src={service.logoUrl}
          alt={`${service.name} logo`}
          width={64}
          height={64}
          className="rounded-lg border bg-card"
          data-ai-hint="company logo"
        />
        <div className="flex-1">
          <CardTitle className="font-headline text-xl mb-1">{service.name}</CardTitle>
          <CardDescription>{service.tagline}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-accent/20 text-accent-foreground hover:bg-accent/30">{service.category}</Badge>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{service.location}</span>
            </div>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {service.description}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <StarRating rating={averageRating} size={18} />
        <Button asChild variant="ghost" size="sm" className="text-secondary hover:text-secondary">
          <Link href={`/services/${service.id}`}>
            View Details <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
