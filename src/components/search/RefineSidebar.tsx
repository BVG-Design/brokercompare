'use client';

import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface RefineSidebarProps {
    categories: { title: string; value: string }[];
    filters: {
        category: string;
        brokerType: string;
        type: string;
    };
    onFilterChange: (key: string, value: string) => void;
    isOpen: boolean;
    onClose: () => void;
    totalResults: number;
}

export default function RefineSidebar({
    categories,
    filters,
    onFilterChange,
    isOpen,
    onClose,
    totalResults,
}: RefineSidebarProps) {
    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 bottom-0 z-50 w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out lg:static lg:transform-none lg:shadow-none lg:border-r lg:w-64 lg:block ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="h-full flex flex-col">
                    {/* Header */}
                    <div className="p-6 border-b flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Refine</h2>
                            <p className="text-sm text-gray-500 mt-1">{totalResults} results found</p>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden"
                            onClick={onClose}
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    <ScrollArea className="flex-1 px-6 py-6">
                        <div className="space-y-8">
                            {/* Listing Type */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">
                                    Listing Type
                                </h3>
                                <div className="space-y-2">
                                    {[
                                        { label: 'All Types', value: 'all' },
                                        { label: 'Software', value: 'software' },
                                        { label: 'Services', value: 'service' },
                                        { label: 'Resource Guides', value: 'resourceGuide' },
                                    ].map((type) => (
                                        <label
                                            key={type.value}
                                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                                        >
                                            <div className="relative flex items-center">
                                                <input
                                                    type="radio"
                                                    name="listingType"
                                                    className="peer h-4 w-4 border-gray-300 text-brand-blue focus:ring-brand-blue"
                                                    checked={filters.type === type.value}
                                                    onChange={() => onFilterChange('type', type.value)}
                                                />
                                            </div>
                                            <span
                                                className={`text-sm font-medium ${filters.type === type.value
                                                        ? 'text-brand-blue'
                                                        : 'text-gray-600'
                                                    }`}
                                            >
                                                {type.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Broker Type */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">
                                    Broker Type
                                </h3>
                                <div className="space-y-2">
                                    {[
                                        { label: 'All Broker Types', value: 'all' },
                                        { label: 'Mortgage Broker', value: 'Mortgage' },
                                        { label: 'Asset Finance', value: 'Asset Finance' },
                                        { label: 'Commercial Broker', value: 'Commercial' },
                                    ].map((type) => (
                                        <label
                                            key={type.value}
                                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                                        >
                                            <div className="relative flex items-center">
                                                <input
                                                    type="radio"
                                                    name="brokerType"
                                                    className="peer h-4 w-4 border-gray-300 text-brand-blue focus:ring-brand-blue"
                                                    checked={filters.brokerType === type.value}
                                                    onChange={() => onFilterChange('brokerType', type.value)}
                                                />
                                            </div>
                                            <span
                                                className={`text-sm font-medium ${filters.brokerType === type.value
                                                        ? 'text-brand-blue'
                                                        : 'text-gray-600'
                                                    }`}
                                            >
                                                {type.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Categories */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">
                                    Category
                                </h3>
                                <div className="space-y-2">
                                    <label
                                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                                    >
                                        <div className="relative flex items-center">
                                            <input
                                                type="radio"
                                                name="category"
                                                className="peer h-4 w-4 border-gray-300 text-brand-blue focus:ring-brand-blue"
                                                checked={filters.category === 'all'}
                                                onChange={() => onFilterChange('category', 'all')}
                                            />
                                        </div>
                                        <span
                                            className={`text-sm font-medium ${filters.category === 'all'
                                                    ? 'text-brand-blue'
                                                    : 'text-gray-600'
                                                }`}
                                        >
                                            All Categories
                                        </span>
                                    </label>
                                    {categories.map((cat) => (
                                        <label
                                            key={cat.value}
                                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                                        >
                                            <div className="relative flex items-center">
                                                <input
                                                    type="radio"
                                                    name="category"
                                                    className="peer h-4 w-4 border-gray-300 text-brand-blue focus:ring-brand-blue"
                                                    checked={filters.category === cat.value}
                                                    onChange={() => onFilterChange('category', cat.value)}
                                                />
                                            </div>
                                            <span
                                                className={`text-sm font-medium ${filters.category === cat.value
                                                        ? 'text-brand-blue'
                                                        : 'text-gray-600'
                                                    }`}
                                            >
                                                {cat.title}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </ScrollArea>

                    {/* Footer Actions */}
                    <div className="p-6 border-t bg-gray-50">
                        <Button
                            variant="outline"
                            className="w-full border-gray-200 hover:bg-white hover:text-brand-orange"
                            onClick={() => {
                                onFilterChange('category', 'all');
                                onFilterChange('brokerType', 'all');
                                onFilterChange('type', 'all');
                            }}
                        >
                            Clear Filters
                        </Button>
                    </div>
                </div>
            </aside>
        </>
    );
}
