'use client';

import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { format } from 'date-fns';

export default function BlogCard({
    post,
    viewMode = 'grid',
    aspectRatio = 'aspect-[16/9]' // New prop with default
}: {
    post: any;
    viewMode?: 'grid' | 'list';
    aspectRatio?: string;
}) {
    // List View Layout
    if (viewMode === 'list') {
        return (
            <Link
                href={`/blog/${post.slug}`}
                className="group flex flex-col md:flex-row gap-6 p-4 rounded-xl hover:bg-white transition-all border border-border hover:border-brand-blue hover:shadow-2xl hover:shadow-brand-blue/20"
            >
                <div className={`relative w-full md:w-64 aspect-[16/9] md:aspect-square rounded-lg overflow-hidden flex-shrink-0`}>
                    {post.heroImageUrl || post.imageUrl ? (
                        <Image
                            src={post.heroImageUrl || post.imageUrl}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-xs">No image</div>
                    )}
                </div>
                <div className="flex flex-col flex-1 py-2">
                    <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                            {post.blogType && (
                                <Badge variant="outline" className="text-[10px] font-bold text-brand-blue uppercase tracking-widest border-brand-blue/20">
                                    {post.blogType}
                                </Badge>
                            )}
                        </div>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                            {post.publishedAt ? format(new Date(post.publishedAt), 'MMM d, yyyy') : ''}
                        </span>
                    </div>

                    <h3 className="text-xl font-bold text-brand-blue mb-3 group-hover:text-brand-orange transition-colors line-clamp-2">
                        {post.title}
                    </h3>

                    {post.description && (
                        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                            {post.description}
                        </p>
                    )}

                    <div className="mt-auto flex items-center gap-2 text-brand-blue font-bold text-xs">
                        {post.category && (
                            <Badge variant="secondary" className="mr-auto text-[10px] font-bold text-brand-orange uppercase tracking-widest bg-brand-orange/10 hover:bg-brand-orange/20 border-none">
                                {post.category}
                            </Badge>
                        )}
                        Read More <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            </Link>
        );
    }

    // Grid View Layout
    return (
        <Link
            href={`/blog/${post.slug}`}
            className="group relative bg-card rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-border hover:border-brand-blue hover:shadow-brand-blue/10 flex flex-col h-full"
        >
            <div className={`relative w-full ${aspectRatio} bg-muted overflow-hidden`}>
                {post.heroImageUrl || post.imageUrl ? (
                    <Image
                        src={post.heroImageUrl || post.imageUrl}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                        No image
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3">
                    {post.blogType && (
                        <span className="text-[10px] font-bold text-brand-orange uppercase tracking-widest">
                            {post.blogType}
                        </span>
                    )}
                    <span className="text-[10px] text-muted-foreground ml-auto">
                        {post.readTime ? `${post.readTime} min read` : ''}
                    </span>
                </div>

                <h3 className="text-lg font-bold text-brand-blue mb-3 group-hover:text-brand-orange transition-colors line-clamp-2 leading-tight">
                    {post.title}
                </h3>

                {post.description && (
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-1">
                        {post.description}
                    </p>
                )}

                <div className="flex items-center text-[10px] font-bold text-muted-foreground mt-auto pt-4 border-t border-border/50 uppercase tracking-widest">
                    <span>
                        {post.publishedAt ? format(new Date(post.publishedAt), 'MMM d, yyyy') : ''}
                    </span>
                    <span className="ml-auto flex items-center gap-2">
                        {post.category && (
                            <span className="text-[10px] font-bold text-brand-blue uppercase tracking-wider">
                                {post.category}
                            </span>
                        )}
                        <span className="text-brand-blue flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                            Read <ArrowRight size={12} />
                        </span>
                    </span>
                </div>
            </div>
        </Link>
    );
}
