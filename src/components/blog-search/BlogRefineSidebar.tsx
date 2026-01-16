'use client';

import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { QuizWaitlistModal } from '@/components/quiz/quiz-waitlist-modal';

interface BlogRefineSidebarProps {
    categories: { title: string; value: string }[];
    authors: { _id: string; name: string }[];
    filters: {
        category: string;
        brokerType: string;
        blogType: string;
        author: string;
    };
    onFilterChange: (key: string, value: string) => void;
    isOpen: boolean;
    onClose: () => void;
    totalResults: number;
}

export default function BlogRefineSidebar({
    categories,
    authors,
    filters,
    onFilterChange,
    isOpen,
    onClose,
    totalResults,
}: BlogRefineSidebarProps) {
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
                className={`fixed top-0 left-0 bottom-0 z-30 w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out lg:sticky lg:top-32 lg:z-10 lg:h-[calc(100vh-8rem)] lg:overflow-y-auto lg:transform-none lg:shadow-none lg:border-r lg:w-64 lg:block ${isOpen ? 'translate-x-0' : '-translate-x-full'
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
                            {/* Resource Type */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">
                                    Resource Type
                                </h3>
                                <div className="space-y-2">
                                    {[
                                        { label: 'All Resources', value: 'all' },
                                        { label: 'Guides', value: 'guide' },
                                        { label: 'Reviews', value: 'review' },
                                        { label: 'Podcasts', value: 'podcast' },
                                        { label: 'Articles', value: 'article' },
                                    ].map((type) => (
                                        <label
                                            key={type.value}
                                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                                        >
                                            <div className="relative flex items-center">
                                                <input
                                                    type="radio"
                                                    name="blogType"
                                                    className="peer h-4 w-4 border-gray-300 text-brand-blue focus:ring-brand-blue"
                                                    checked={filters.blogType === type.value}
                                                    onChange={() => onFilterChange('blogType', type.value)}
                                                />
                                            </div>
                                            <span
                                                className={`text-sm font-medium ${filters.blogType === type.value
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
                                    Categories
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

                            {/* Authors */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">
                                    Authors
                                </h3>
                                <div className="space-y-2">
                                    <label
                                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                                    >
                                        <div className="relative flex items-center">
                                            <input
                                                type="radio"
                                                name="author"
                                                className="peer h-4 w-4 border-gray-300 text-brand-blue focus:ring-brand-blue"
                                                checked={filters.author === 'all'}
                                                onChange={() => onFilterChange('author', 'all')}
                                            />
                                        </div>
                                        <span
                                            className={`text-sm font-medium ${filters.author === 'all'
                                                ? 'text-brand-blue'
                                                : 'text-gray-600'
                                                }`}
                                        >
                                            All Authors
                                        </span>
                                    </label>
                                    {authors.map((author) => (
                                        <label
                                            key={author._id}
                                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                                        >
                                            <div className="relative flex items-center">
                                                <input
                                                    type="radio"
                                                    name="author"
                                                    className="peer h-4 w-4 border-gray-300 text-brand-blue focus:ring-brand-blue"
                                                    checked={filters.author === author.name}
                                                    onChange={() => onFilterChange('author', author.name)}
                                                />
                                            </div>
                                            <span
                                                className={`text-sm font-medium ${filters.author === author.name
                                                    ? 'text-brand-blue'
                                                    : 'text-gray-600'
                                                    }`}
                                            >
                                                {author.name}
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
                            className="w-full border-gray-500 hover:bg-white hover:text-brand-orange"
                            onClick={() => {
                                onFilterChange('category', 'all');
                                onFilterChange('brokerType', 'all');
                                onFilterChange('blogType', 'all');
                                onFilterChange('author', 'all');
                            }}
                        >
                            Clear Filters
                        </Button>

                        <div className="mt-8 border-t pt-6 text-center">
                            <h4 className="font-bold text-brand-blue mb-2">Still Not Sure?</h4>
                            <p className="text-sm text-gray-600 mb-4">We can help you find the right match.</p>
                            <div className="space-y-2">
                                <QuizWaitlistModal>
                                    <Button
                                        className="w-full bg-brand-green hover:bg-gray-800 text-white border-none"
                                    >
                                        Take the Quiz
                                    </Button>
                                </QuizWaitlistModal>
                                <Button variant="ghost" className="w-full text-sm text-gray-600 hover:text-brand-blue">
                                    Schedule a Chat
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </aside >
        </>
    );
}
