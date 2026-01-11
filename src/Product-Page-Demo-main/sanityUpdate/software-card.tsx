'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Software } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { StarRating } from '@/components/shared/star-rating';
import { useComparison } from '@/components/compare/ComparisonContext';
import { ArrowRight, DollarSign, Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface SoftwareCardProps {
    software: Software;
}

export function SoftwareCard({ software }: SoftwareCardProps) {
    const { addItem, isInComparison, canAddMore } = useComparison();

    // Make reviews safe (Sanity may not provide them)
    const reviews = software.reviews ?? [];

    // If reviews exist (static data), use them. Otherwise use Sanity rating.
    const averageRating = reviews.length > 0
        ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
        : software.rating?.average ?? 0;

    const reviewCount = reviews.length > 0
        ? reviews.length
        : software.rating?.reviewCount ?? 0;



    const inComparison = isInComparison(software.id);

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

        const success = addItem(software, 'software');
        if (success) {
            toast({
                title: "Added to comparison",
                description: `${software.name} has been added to your comparison.`,
            });
        }
    };

    return (
        <Card className="flex flex-col h-full w-full transform hover:-translate-y-1 transition-transform duration-300 ease-in-out shadow-md hover:shadow-xl relative">
            <div className="absolute top-3 right-3 z-10">
                <Badge variant="secondary" className="bg-accent/20 text-accent-foreground hover:bg-accent/30">Editor's Choice</Badge>
            </div>
            <CardHeader className="flex-row gap-4 items-start">
                <Image
                    src={software.logoUrl}
                    alt={`${software.name} logo`}
                    width={64}
                    height={64}
                    className="rounded-lg border bg-card"
                    data-ai-hint="tech logo"
                />
                <div className="flex-1 min-w-0">
                    <CardTitle className="font-headline text-xl mb-1 break-words">{software.name}</CardTitle>
                    <CardDescription>{software.tagline}</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
                <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-accent/20 text-accent-foreground hover:bg-accent/30">{software.category}</Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <span>{software.pricing}</span>
                    </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-3">
                    {software.description}
                </p>
            </CardContent>
            <CardFooter className="flex flex-wrap justify-between items-center gap-3 p-4 pt-0">
                <StarRating rating={averageRating} size={18} />
                <div className="flex flex-wrap gap-2 justify-end">
                    {!inComparison && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleAddToCompare}
                            disabled={!canAddMore}
                            className="text-xs h-8 px-2"
                        >
                            <Plus className="h-3 w-3 mr-1" />
                            Compare
                        </Button>
                    )}
                    <Button asChild variant="ghost" size="sm" className="text-secondary hover:text-secondary text-xs h-8 px-2">
                        <Link href={`/software/${software.slug}`}>
                            View Details <ArrowRight className="ml-1 h-3 w-3" />
                        </Link>
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}