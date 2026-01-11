'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Article {
    _id: string;
    title: string;
    description?: string;
    category?: string;
    mainImage?: {
        asset: {
            url: string;
        };
    };
    publishedAt?: string;
    author?: string;
    slug: {
        current: string;
    } | string;
}

interface RelatedArticlesProps {
    articles?: Article[];
}

const RelatedArticles: React.FC<RelatedArticlesProps> = ({ articles = [] }) => {
    if (!articles || articles.length === 0) return null;

    return (
        <div className="max-w-6xl mx-auto px-4 mb-24 mt-12">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-brand-blue uppercase tracking-tight">Expert Guides & Insights</h2>
                    <p className="text-base text-gray-500 font-medium mt-2">Deep dives and expert advice for your brokerage</p>
                </div>
                <div className="hidden sm:flex gap-3">
                    <Button variant="outline" size="icon" className="w-12 h-12 rounded-2xl border-2 border-gray-100 hover:border-brand-blue transition-all">
                        <ChevronLeft size={24} />
                    </Button>
                    <Button variant="outline" size="icon" className="w-12 h-12 rounded-2xl border-2 border-gray-100 hover:border-brand-blue transition-all">
                        <ChevronRight size={24} />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map((article) => (
                    <div key={article._id} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col overflow-hidden group">
                        <div className="relative h-60 overflow-hidden">
                            <img
                                src={typeof article.mainImage === 'string' ? article.mainImage : article.mainImage?.asset?.url || "https://picsum.photos/400/250"}
                                alt={article.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute top-6 left-6">
                                <span className="bg-brand-green text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg">
                                    {article.category || 'Article'}
                                </span>
                            </div>
                        </div>

                        <div className="p-8 flex flex-col flex-grow">
                            <div className="flex items-center gap-4 mb-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">
                                <span className="flex items-center gap-1.5"><Clock size={14} className="text-brand-orange" /> 5 min read</span>
                                <span className="w-1.5 h-1.5 bg-gray-100 rounded-full" />
                                <span>{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'}</span>
                            </div>

                            <h3 className="text-2xl font-bold text-brand-blue mb-4 leading-tight group-hover:text-brand-green transition-colors line-clamp-2">
                                {article.title}
                            </h3>

                            <p className="text-base text-gray-500 leading-relaxed mb-8 flex-grow line-clamp-3 font-medium">
                                {article.description || 'Read our latest insights and deep dives into the bridge industry.'}
                            </p>

                            <div className="pt-8 border-t border-gray-50 flex items-center justify-between">
                                <span className="text-xs font-bold text-brand-blue uppercase tracking-widest">
                                    {article.author ? `By ${article.author}` : 'By BrokerCompare'}
                                </span>
                                <Link
                                    href={`/blog/${typeof article.slug === 'string' ? article.slug : article.slug?.current || ''}`}
                                    className="p-3 bg-gray-50 rounded-xl text-brand-blue group-hover:bg-brand-orange group-hover:text-white transition-all duration-300"
                                >
                                    <ArrowRight size={20} />
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RelatedArticles;
