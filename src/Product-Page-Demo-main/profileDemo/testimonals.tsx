import React from 'react';
import { Star, Check, X, ThumbsUp, ChevronLeft, ChevronRight, BadgeCheck } from 'lucide-react';
import { Review } from '../types';

const Testimonials: React.FC = () => {
    const reviews: Review[] = [
        {
            id: 1,
            author: "Michael Thompson",
            role: "Product Manager",
            company: "TechStart Inc.",
            rating: 5.0,
            title: "Game-changer for our team productivity",
            content: "ClickUp has completely transformed how our team works. The flexibility to customize everything from task statuses to views has allowed us to create workflows that actually match how we operate.",
            pros: ["Highly customizable", "All-in-one solution"],
            cons: ["Steep learning curve"],
            helpfulCount: 47,
            verified: true,
            avatarColor: "bg-purple-500"
        },
        {
            id: 2,
            author: "Emily Rodriguez",
            role: "Marketing Director",
            company: "GrowthLabs",
            rating: 5.0,
            title: "Finally replaced 5 different tools with one",
            content: "We were using Asana for tasks, Notion for docs, Slack for chat, and several other tools. ClickUp let us consolidate everything into one platform. Our team collaboration has improved significantly.",
            pros: ["Replaces multiple tools", "Excellent integrations"],
            cons: ["Mobile app could be better"],
            helpfulCount: 32,
            verified: true,
            avatarColor: "bg-blue-500"
        },
        {
            id: 3,
            author: "David Chen",
            role: "Engineering Lead",
            company: "DataFlow Systems",
            rating: 4.0,
            title: "Powerful but can be overwhelming",
            content: "ClickUp is incredibly powerful with features for almost everything you can imagine. The automations and custom fields are fantastic for our development workflows. However, the sheer number of options...",
            pros: ["Powerful automations", "Custom fields"],
            cons: ["Can be overwhelming"],
            helpfulCount: 28,
            verified: true,
            avatarColor: "bg-indigo-500"
        }
    ];

    return (
        <div className="max-w-6xl mx-auto px-4 mb-12">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">What Users Are Saying</h2>
                <span className="text-sm text-gray-500">5 reviews</span>
            </div>

            <div className="relative">
                {/* Navigation Buttons */}
                <button className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-md text-gray-600 hover:text-gray-900 hover:bg-gray-50">
                    <ChevronLeft size={16} />
                </button>
                <button className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-md text-gray-600 hover:text-gray-900 hover:bg-gray-50">
                    <ChevronRight size={16} />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reviews.map((review) => (
                        <div key={review.id} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex flex-col h-full">
                            <div className="flex items-start gap-3 mb-4">
                                <div className={`w-10 h-10 rounded-full ${review.avatarColor} text-white flex items-center justify-center font-bold text-sm`}>
                                    {review.author.charAt(0)}
                                </div>
                                <div>
                                    <div className="flex items-center gap-1">
                                        <h4 className="font-semibold text-gray-900 text-sm">{review.author}</h4>
                                        {review.verified && <BadgeCheck size={14} className="text-green-500" />}
                                    </div>
                                    <p className="text-xs text-gray-500">{review.role}</p>
                                    <p className="text-xs text-gray-400">{review.company}</p>
                                </div>
                            </div>

                            <div className="flex gap-1 mb-2">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={12} className={`${i < Math.floor(review.rating) ? 'text-orange-400 fill-orange-400' : 'text-gray-200'}`} />
                                ))}
                                <span className="text-xs font-semibold ml-1 text-gray-700">{review.rating.toFixed(1)}</span>
                            </div>

                            <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">{review.title}</h3>
                            <p className="text-gray-600 text-xs leading-relaxed mb-4 flex-grow relative pl-3 border-l-2 border-gray-200">
                                {review.content}
                            </p>

                            <div className="space-y-1 mb-6">
                                {review.pros.map(pro => (
                                    <div key={pro} className="flex items-center gap-2">
                                        <Check size={12} className="text-green-500" />
                                        <span className="text-xs text-gray-600">{pro}</span>
                                    </div>
                                ))}
                                {review.cons.map(con => (
                                    <div key={con} className="flex items-center gap-2">
                                        <X size={12} className="text-red-500" />
                                        <span className="text-xs text-gray-600">{con}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                                <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700">
                                    <ThumbsUp size={14} />
                                    Helpful ({review.helpfulCount})
                                </button>
                                {review.verified && (
                                    <span className="text-xs text-green-600 font-medium">Verified User</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Testimonials;