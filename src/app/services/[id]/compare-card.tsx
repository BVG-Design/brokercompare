'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Check } from 'lucide-react';
import { useComparison } from '@/components/compare/ComparisonContext';
import { toast } from '@/hooks/use-toast';
import type { Service } from '@/lib/types';

interface CompareCardProps {
    service: Service;
}

export function CompareCard({ service }: CompareCardProps) {
    const { addItem, isInComparison, canAddMore } = useComparison();
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
            toast({
                title: "Already in comparison",
                description: `${service.name} is already in your comparison list.`,
            });
            return;
        }

        const success = addItem(service, 'service');
        if (success) {
            toast({
                title: "Added to comparison",
                description: `${service.name} has been added to your comparison.`,
                duration: 2000,
            });
        }
    };

    return (
        <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
                <CardTitle className="text-center font-headline">Compare Now</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                    Add this provider to your comparison list to evaluate alongside others.
                </p>
                <Button
                    onClick={handleAddToCompare}
                    disabled={inComparison}
                    className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                >
                    {inComparison ? (
                        <>
                            <Check className="mr-2 h-4 w-4" /> Added to Compare
                        </>
                    ) : (
                        <>
                            <Plus className="mr-2 h-4 w-4" /> Add to Compare
                        </>
                    )}
                </Button>
            </CardContent>
        </Card>
    );
}
