import React from 'react';
import { ExternalLink, BookOpen, FileText, PlayCircle, Star } from 'lucide-react';
import { SoftwareListing } from './types';

interface InfoGridProps {
    listing: SoftwareListing;
    blogs?: any[]; // Using any for simplicity as blog type isn't imported here yet
}

const InfoGrid: React.FC<InfoGridProps> = ({ listing, blogs = [] }) => {
    const { editor, worksWith = [], rating, name } = listing;

    const reviewStats = [ // Mock stats for now as we don't have distribution data yet
        { stars: 5, percent: 70, count: '0' },
        { stars: 4, percent: 20, count: '0' },
        { stars: 3, percent: 10, count: '0' },
        { stars: 2, percent: 0, count: '0' },
        { stars: 1, percent: 0, count: '0' },
    ];

    return (
        <div className="max-w-6xl mx-auto px-4 mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Main Column (Spans 2) */}
                <div className="lg:col-span-2 space-y-8">
                    {/* About Section - Description Removed as per request, just Editor Notes */}
                    <section className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                        {/* Editor Notes */}
                        {editor?.notes && (
                            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                                <h3 className="text-blue-900 font-semibold text-sm mb-2">Editor Notes</h3>
                                <p className="text-blue-800 text-sm leading-relaxed mb-3">
                                    {editor.notes}
                                </p>
                                {editor.author && (
                                    <div className="flex items-center text-xs text-blue-600 font-medium">
                                        <span className="w-6 h-0.5 bg-blue-400 mr-2"></span>
                                        {editor.author}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* If no editor notes, and description removed, this section might be empty. 
                            Ideally we show something or hide the section if empty. 
                            But for now assuming Editor Notes exist for MBJ. 
                        */}
                    </section>

                    {/* Resources Section - Placeholder/Demo Content for now */}
                    <section className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-gray-900">Resources</h2>
                            <span className="text-xs text-gray-400">Curated by our team</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {blogs && blogs.length > 0 ? (
                                blogs.map((blog) => (
                                    <a href={`/blog/${blog.slug?.current || blog.slug}`} key={blog._id} className="group flex flex-col h-full bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                                        <div className="h-24 bg-gray-100 overflow-hidden relative">
                                            {blog.imageUrl ? (
                                                <img src={blog.imageUrl} alt={blog.title} className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500" />
                                            ) : (
                                                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                                                    <FileText size={24} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-3 flex flex-col justify-between flex-grow">
                                            <span className="text-xs font-semibold text-gray-900 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                                {blog.title}
                                            </span>
                                            <span className="text-[10px] text-gray-500 mt-2 flex items-center">
                                                Read Article <ExternalLink size={8} className="ml-1" />
                                            </span>
                                        </div>
                                    </a>
                                ))
                            ) : (
                                <div className="p-4 bg-gray-50 border border-dashed border-gray-300 rounded text-center text-sm text-gray-400 col-span-3">
                                    Resources Coming Soon
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Right Sidebar Column */}
                <div className="space-y-8 flex flex-col h-full">
                    {/* Integrations / Works With */}
                    {worksWith.length > 0 && (
                        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <h3 className="font-bold text-gray-900">Works With</h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {worksWith.map((tool, idx) => (
                                    <div key={idx} className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-gray-700 hover:border-gray-300 cursor-default transition-colors">
                                        {/* Favicon fetcher fallback for now if no logo */}
                                        <img
                                            src={tool.logo || `https://www.google.com/s2/favicons?domain=${tool.websiteUrl || 'google.com'}&sz=32`}
                                            alt={tool.name}
                                            className="w-3.5 h-3.5 rounded-sm object-contain opacity-85"
                                            loading="lazy"
                                        />
                                        {tool.name}
                                    </div >
                                ))}
                            </div >
                        </div >
                    )}

                    {/* User Reviews Summary */}
                    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex-grow flex flex-col">
                        <h3 className="font-bold text-gray-900 mb-5">User Reviews</h3>

                        <div className="flex items-end gap-3 mb-6">
                            <span className="text-5xl font-bold text-gray-900 tracking-tighter leading-none">{rating?.average?.toFixed(1) || '0.0'}</span>
                            <div className="flex flex-col pb-1">
                                <div className="flex gap-0.5 mb-1">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <Star
                                            key={i}
                                            size={14}
                                            className={i <= Math.round(rating?.average || 0) ? "text-orange-400 fill-orange-400" : "text-gray-300"}
                                        />
                                    ))}
                                </div>
                                <span className="text-xs text-gray-500">{rating?.count || 0} reviews</span>
                            </div>
                        </div>

                        {/* Distro - hidden for now as we don't have it */}

                        <button className="w-full py-2.5 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors mt-auto">
                            Write a Review
                        </button>
                    </div>
                </div >
            </div >
        </div >
    );
};

export default InfoGrid;
