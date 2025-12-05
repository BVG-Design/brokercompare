'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Service } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { StarRating } from '@/components/shared/star-rating';
import { useComparison } from '@/components/compare/ComparisonContext';
import { ArrowRight, MapPin, Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const { addItem, isInComparison, canAddMore } = useComparison();
  const averageRating = service.reviews.length > 0
    ? service.reviews.reduce((acc, review) => acc + review.rating, 0) / service.reviews.length
    : 0;

  const inComparison = isInComparison(service.id);

  const handleAddToCompare = () => {
    if (!canAddMore && !inComparison) {
      toast({
        title: "Comparison limit reached",
        description: "You can compare up to 4 items. Please remove an item first.",
        variant: "destructive",
      });
      return;
    }

    if (inComparison) {
      // Item is already in comparison, could navigate to compare page
      return;
    }

    const success = addItem(service, 'service');
    if (success) {
      toast({
        title: "Added to comparison",
        description: `${service.name} has been added to your comparison.`,
      });
    }
  };

  return (
    <Card className="flex flex-col h-full transform hover:-translate-y-1 transition-transform duration-300 ease-in-out shadow-md hover:shadow-xl relative">
      <CardHeader className="flex-row gap-4 items-start">
        {(service.images?.[0] || service.logoUrl) && (
          <Image
            src={service.images?.[0] || service.logoUrl}
            alt={`${service.name} logo`}
            width={64}
            height={64}
            className="rounded-lg border bg-card"
            data-ai-hint="company logo"
          />
        )}
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
      <CardFooter className="flex justify-between items-center gap-2">
        <StarRating rating={averageRating} size={18} />
        <div className="flex gap-2">
          {!inComparison && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddToCompare}
              disabled={!canAddMore}
              className="text-xs"
            >
              <Plus className="h-3 w-3 mr-1" />
              Compare
            </Button>
          )}
          <Button asChild variant="ghost" size="sm" className="text-secondary hover:text-secondary">
            <Link href={`/services/${service.id}`}>
              View Details <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
