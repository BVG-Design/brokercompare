'use client';

import React, { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useComparison } from '@/components/compare/ComparisonContext';
import { ComparisonTable } from '@/components/compare/ComparisonTable';
import { ProductSelector } from '@/components/compare/ProductSelector';
import { FeatureMatrix } from '@/components/compare/FeatureMatrix';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Download, Share2 } from 'lucide-react';
import Link from 'next/link';
import { software, services } from '@/lib/data';

function ComparePageContent() {
  const { items, clearAll, addItem } = useComparison();
  const searchParams = useSearchParams();

  // Load items from URL parameters on mount
  useEffect(() => {
    const itemsParam = searchParams.get('items');
    if (itemsParam && items.length === 0) {
      const itemIds = itemsParam.split(',').filter(Boolean);
      itemIds.forEach(id => {
        // Try to find in software first
        const softwareItem = software.find(s => s.id === id);
        if (softwareItem) {
          addItem(softwareItem, 'software');
          return;
        }
        // Then try services
        const serviceItem = services.find(s => s.id === id);
        if (serviceItem) {
          addItem(serviceItem, 'service');
        }
      });
    }
  }, [searchParams, items.length, addItem]);

  const handleExportCSV = () => {
    // TODO: Implement CSV export
    alert('CSV export coming soon!');
  };

  const handleShare = () => {
    const ids = items.map(item => item.id).join(',');
    const url = `${window.location.origin}/compare?items=${ids}`;
    navigator.clipboard.writeText(url);
    alert('Comparison link copied to clipboard!');
  };

  if (items.length === 0) {
    return (
        <main className="flex-1 bg-background">
          <div className="container mx-auto px-4 md:px-6 py-12">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">
                Compare Products & Services
              </h1>
              <p className="text-lg text-muted-foreground">
                Select products and services to compare side-by-side. Add items from the listings to get started.
              </p>
              <div className="flex gap-4 justify-center">
                <Button asChild>
                  <Link href="/software">Browse Software</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/services">Browse Services</Link>
                </Button>
              </div>
            </div>

            <div className="mt-12">
              <ProductSelector />
            </div>
          </div>
        </main>
    );
  }

  if (items.length === 1) {
    return (
        <main className="flex-1 bg-background">
          <div className="container mx-auto px-4 md:px-6 py-12">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">
                    Compare Products & Services
                  </h1>
                  <p className="text-muted-foreground mt-2">
                    Add at least one more item to compare
                  </p>
                </div>
                <Button variant="outline" onClick={clearAll}>
                  Clear All
                </Button>
              </div>

              <ProductSelector />
            </div>
          </div>
        </main>
    );
  }

  return (
    <>
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 md:px-6 py-12">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">
                  Compare {items.length} Items
                </h1>
                <p className="text-muted-foreground mt-2">
                  Side-by-side comparison of products and services
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" onClick={handleExportCSV}>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
                <Button variant="outline" onClick={clearAll}>
                  Clear All
                </Button>
              </div>
            </div>

            {/* Comparison Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="add">Add More</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <ComparisonTable items={items} />
              </TabsContent>

              <TabsContent value="features" className="space-y-6">
                <FeatureMatrix items={items} />
              </TabsContent>

              <TabsContent value="add" className="space-y-6">
                <ProductSelector />
              </TabsContent>
            </Tabs>
          </div>
        </div>
        </main>
    );
  }

export default function ComparePage() {
  return (
    <Suspense fallback={
      <>
        <main className="flex-1 bg-background">
          <div className="container mx-auto px-4 md:px-6 py-12">
            <div className="text-center">
              <p className="text-muted-foreground">Loading comparison...</p>
            </div>
          </div>
        </main>
      </>
    }>
      <ComparePageContent />
    </Suspense>
  );
}

