import React from 'react';
import { ChevronLeft, ChevronRight, Clock, ArrowRight } from 'lucide-react';

interface Article {
    id: number;
    title: string;
    excerpt: string;
    category: string;
    date: string;
    readTime: string;
    image: string;
    author: string;
}

const RelatedArticles: React.FC = () => {
    const articles: Article[] = [
        {
            id: 1,
            title: "How to automate your mortgage application workflow",
            excerpt: "Discover the 5 key automation steps that saved top-performing brokers over 15 hours per week in manual data entry.",
            category: "Automation",
            date: "Oct 12, 2024",
            readTime: "6 min read",
            image: "https://picsum.photos/400/250?random=40",
            author: "Sarah Jenkins"
        },
        {
            id: 2,
            title: "Selecting the right CRM for a scaling brokerage",
            excerpt: "Not all CRMs are created equal. We compare the top 3 platforms currently dominating the Australian mortgage market.",
            category: "Software",
            date: "Oct 08, 2024",
            readTime: "8 min read",
            image: "https://picsum.photos/400/250?random=41",
            author: "David Miller"
        },
        {
            id: 3,
            title: "The rise of AI Assistants in loan processing",
            excerpt: "Can AI really replace a human processor? We look at the current state of AI agents and where they provide the most value.",
            category: "AI & Tech",
            date: "Sep 28, 2024",
            readTime: "5 min read",
            image: "https://picsum.photos/400/250?random=42",
            author: "James Wilson"
        }
    ];

    return (
        <div className="max-w-6xl mx-auto px-4 mb-20">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Related Articles</h2>
                    <p className="text-sm text-gray-500 font-medium">Deep dives and expert advice for your business</p>
                </div>
                <div className="flex gap-2">
                    <button className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm text-gray-400 hover:text-gray-900 transition-all">
                        <ChevronLeft size={20} />
                    </button>
                    <button className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm text-gray-400 hover:text-gray-900 transition-all">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                    <div key={article.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group">
                        <div className="relative h-48 overflow-hidden">
                            <img
                                src={article.image}
                                alt={article.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-4 left-4">
                                <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-primary shadow-sm">
                                    {article.category}
                                </span>
                            </div>
                        </div>

                        <div className="p-6 flex flex-col flex-grow">
                            <div className="flex items-center gap-3 mb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                <span className="flex items-center gap-1"><Clock size={12} /> {article.readTime}</span>
                                <span>•</span>
                                <span>{article.date}</span>
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 mb-3 leading-tight group-hover:text-primary transition-colors">
                                {article.title}
                            </h3>

                            <p className="text-sm text-gray-500 leading-relaxed mb-6 flex-grow line-clamp-3">
                                {article.excerpt}
                            </p>

                            <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                                <span className="text-xs font-bold text-gray-900">By {article.author}</span>
                                <button className="text-primary text-xs font-black uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
                                    Read More <ArrowRight size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RelatedArticles;