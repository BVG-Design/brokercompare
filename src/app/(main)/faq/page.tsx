'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { fetchFaqPosts, fetchCategories, fetchSubCategories } from '@/services/sanity';
import FAQRefineSidebar from '@/components/faq/FAQRefineSidebar';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from 'next/link';
import { SlidersHorizontal, ArrowRight, BookOpen } from 'lucide-react';
import StillNotSure from '@/components/product-page/StillNotSure';
import { useDebounce } from 'use-debounce';

function FAQContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || 'all',
    subCategory: searchParams.get('subCategory') || 'all',
    brokerType: searchParams.get('brokerType') || 'all',
    search: searchParams.get('search') || '',
  });

  // Debounce search to avoid excessive API calls
  const [debouncedSearch] = useDebounce(filters.search, 500);

  const [faqs, setFaqs] = useState<any[]>([]);
  const [categories, setCategories] = useState<{ title: string; value: string }[]>([]);
  const [subCategories, setSubCategories] = useState<{ title: string; value: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Initial Data Load (Categories)
  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const cats = await fetchCategories();
        console.log('Fetched Categories:', cats); // DEBUG: Check if categories are fetched
        setCategories(cats);
      } catch (error) {
        console.error('Failed to load categories', error);
      }
    };
    loadMetadata();
  }, []);

  // Load Subcategories when Category Changes
  useEffect(() => {
    const loadSubCats = async () => {
      try {
        const subs = await fetchSubCategories(filters.category);
        setSubCategories(subs);
      } catch (error) {
        console.error('Failed to load subcategories', error);
      }
    };
    loadSubCats();
  }, [filters.category]);

  // Load FAQs based on filters
  useEffect(() => {
    const loadFaqs = async () => {
      setIsLoading(true);
      try {
        console.log('Fetching FAQs with filters:', { ...filters, search: debouncedSearch }); // DEBUG
        const data = await fetchFaqPosts({
          category: filters.category,
          subCategory: filters.subCategory,
          brokerType: filters.brokerType,
          search: debouncedSearch,
        });
        console.log('Fetched FAQs:', data); // DEBUG
        setFaqs(data);
      } catch (error) {
        console.error('Failed to load FAQs', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadFaqs();
  }, [filters, debouncedSearch]);


  const updateFilter = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };

    // If changing category, reset subCategory
    if (key === 'category') {
      newFilters.subCategory = 'all';
    }

    setFilters(newFilters);

    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== 'all') {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    // Handle dependencies in URL
    if (key === 'category') {
      params.delete('subCategory');
    }

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground py-10">
        <div className="container mx-auto px-4 md:px-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Everything you need to know about navigating the broker tech landscape.
          </p>
        </div>
      </div>

      {/* Mobile Filter Button */}
      <div className="lg:hidden container mx-auto px-4 py-4">
        <Button
          variant="outline"
          className="w-full gap-2"
          onClick={() => setIsSidebarOpen(true)}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>
      </div>

      <div className="flex-1 container mx-auto px-4 py-8 flex items-start gap-8">
        {/* Sidebar */}
        <FAQRefineSidebar
          categories={categories}
          subCategories={subCategories}
          filters={filters}
          onFilterChange={updateFilter}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          totalResults={faqs.length}
        />

        {/* Main Content */}
        <div className="flex-1 w-full min-w-0">
          <div className="bg-white rounded-xl shadow-sm border p-6 md:p-8">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : faqs.length > 0 ? (
              <Accordion type="single" collapsible className="w-full space-y-4">
                {faqs.map((faq) => (
                  <AccordionItem key={faq._id} value={faq._id} className="border rounded-lg px-4">
                    <AccordionTrigger className="text-left font-semibold text-lg hover:no-underline py-4">
                      {faq.title}
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4">
                      <div className="text-gray-600 mb-4 whitespace-pre-wrap">
                        {faq.summary || "No summary available."}
                      </div>
                      <div className="flex justify-end pt-2 border-t">
                        <Link
                          href={`/resources/blog/${faq.slug}`}
                          className="inline-flex items-center text-brand-blue hover:text-brand-blue/80 font-medium text-sm gap-1 group"
                        >
                          <BookOpen className="w-4 h-4" />
                          Read full answer
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No FAQs found matching your criteria.</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    updateFilter('search', '');
                    updateFilter('category', 'all');
                    updateFilter('subCategory', 'all');
                    updateFilter('brokerType', 'all');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>

          <div className="mt-12">
            <StillNotSure />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FAQPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <FAQContent />
    </Suspense>
  );
}
