'use client';

import React from 'react';
import Link from 'next/link';
import { SITE_URLS } from '@/lib/config';
import Image from 'next/image';
import { useComparison } from './ComparisonContext';
import { Button } from '@/components/ui/button';
import { X, GitCompare, Plus } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ProductSelector } from './ProductSelector';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export function ComparisonBar() {
  const { items, removeItem, clearAll, canAddMore, maxItems } = useComparison();

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <GitCompare className="h-4 w-4 text-secondary" />
              <span className="hidden sm:inline">Comparing:</span>
              <span className="text-secondary">{items.length} of {maxItems}</span>
            </div>

            <ScrollArea className="flex-1 max-w-[calc(100vw-300px)]">
              <div className="flex items-center gap-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 bg-muted rounded-lg px-3 py-1.5 flex-shrink-0"
                  >
                    {item.logoUrl && (
                      <Image
                        src={item.logoUrl}
                        alt={item.name}
                        width={24}
                        height={24}
                        className="rounded object-contain"
                        data-ai-hint="product logo"
                      />
                    )}
                    <span className="text-xs font-medium truncate max-w-[100px]">
                      {item.name}
                    </span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="ml-1 hover:bg-destructive/20 rounded p-0.5 transition-colors"
                      aria-label={`Remove ${item.name} from comparison`}
                    >
                      <X className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                    </button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {canAddMore && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add More
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:max-w-lg flex flex-col">
                  <SheetHeader className="flex-shrink-0">
                    <SheetTitle>
                      {items.length > 0
                        ? `Add ${items[0].type === 'service' ? 'Services' : 'Software'} to Compare`
                        : 'Add Items to Compare'
                      }
                    </SheetTitle>
                    <SheetDescription>
                      {items.length > 0
                        ? `Comparing ${items[0].type === 'service' ? 'services' : 'software'}. Select up to ${maxItems} items. Currently: ${items.length} of ${maxItems}.`
                        : `Select items to add to your comparison list (max ${maxItems})`
                      }
                    </SheetDescription>
                  </SheetHeader>
                  <div className="flex-1 overflow-y-auto mt-6">
                    <ProductSelector />
                  </div>
                </SheetContent>
              </Sheet>
            )}

            {items.length > 1 ? (
              <Button asChild className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                <Link href={`${SITE_URLS.directory}/compare`}>
                  Compare Now ({items.length})
                </Link>
              </Button>
            ) : (
              <Button disabled variant="outline" className="opacity-50">
                Add {maxItems - items.length} more to compare
              </Button>
            )}

            {items.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                className="text-muted-foreground hover:text-destructive"
              >
                Clear
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
