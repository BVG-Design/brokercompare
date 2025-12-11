'use client';

import React, { useState, useMemo } from 'react';
import type { Service } from '@/lib/types';
import { ServiceCard } from './service-card';

import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface ServicesContentProps {
    services: Service[];
}

export default function ServicesContent({ services }: ServicesContentProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('All');

    const filteredServices = useMemo(() => {
        return services.filter((service) => {
            const matchesSearch =
                service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                service.tagline.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesCategory = category === 'All' || service.category === category;

            return matchesSearch && matchesCategory;
        });
    }, [searchTerm, category, services]);

    const categories = ['All', ...Array.from(new Set(services.map(s => s.category)))];

    return (
        <>

            <main className="flex-1 bg-background">
                <div className="container mx-auto px-4 md:px-6 py-12">
                    <div className="space-y-4 mb-12 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">Service Provider Directory</h1>
                        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                            Find the perfect partner to help you grow. From marketing gurus to virtual assistants, explore top-rated providers in Australia.
                        </p>
                    </div>

                    <div className="bg-card p-4 rounded-lg shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-center">
                        <div className="relative flex-grow w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search by name, keyword..."
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

                    {filteredServices.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                            {filteredServices.map((service: Service) => (
                                <ServiceCard key={service.id} service={service} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <p className="text-xl text-muted-foreground">No services found matching your criteria.</p>
                        </div>
                    )}
                </div>
            </main>

        </>
    );
}
