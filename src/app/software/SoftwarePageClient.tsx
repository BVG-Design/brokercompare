'use client';

import React, { useState, useMemo } from 'react';
import type { Software } from '@/lib/types';
import { SoftwareCard } from './software-card';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

type Props = {
  software: Software[];
};

export default function SoftwarePageClient({ software }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');

  const filteredSoftware = useMemo(() => {
    return software.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tagline.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = category === 'All' || item.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [software, searchTerm, category]);

  const categories = ['All', ...Array.from(new Set(software.map(s => s.category)))];

  return (
    <>
      <Header />
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 md:px-6 py-12">
          <div className="space-y-4 mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">Software Directory</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Discover the best CRMs, loan processing tools, and compliance software to streamline your brokerage operations.
            </p>
          </div>

          <div className="bg-card p-4 rounded-lg shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-grow w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by name, feature..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
            <div className="w-full md:w-auto">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {filteredSoftware.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredSoftware.map((item: Software) => (
                <SoftwareCard key={item.id} software={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground">No software found matching your criteria.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
