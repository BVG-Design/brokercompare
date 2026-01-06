import React from 'react';
import { Star } from 'lucide-react';

const ReviewsSection: React.FC = () => {
    const distribution = [
        { stars: 5, count: 3, percent: 80, color: 'bg-orange-500' },
        { stars: 4, count: 2, percent: 50, color: 'bg-orange-500' },
        { stars: 3, count: 0, percent: 0, color: 'bg-gray-200' },
        { stars: 2, count: 0, percent: 0, color: 'bg-gray-200' },
        { stars: 1, count: 0, percent: 0, color: 'bg-gray-200' },
    ];

    return (
        <div className="max-w-6xl mx-auto px-4 mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-6">User Reviews</h2>
            <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-12">

                {/* Big Rating Number */}
                <div className="flex flex-col items-center justify-center text-center min-w-[180px]">
                    <span className="text-6xl font-bold text-gray-900 tracking-tighter">4.7</span>
                    <div className="flex gap-1 my-2">
                        {[1, 2, 3, 4].map(i => <Star key={i} size={20} className="text-orange-400 fill-orange-400" />)}
                        <Star size={20} className="text-orange-400 fill-orange-400" style={{ clipPath: 'inset(0 30% 0 0)' }} />
                    </div>
                    <span className="text-sm text-gray-500">Based on 8,542 reviews</span>
                </div>

                {/* Bars */}
                <div className="flex-1 w-full max-w-2xl">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Rating Distribution</h3>
                    <div className="space-y-3">
                        {distribution.map((item) => (
                            <div key={item.stars} className="flex items-center gap-3">
                                <div className="flex items-center w-8 gap-1">
                                    <span className="text-xs font-semibold text-gray-700">{item.stars}</span>
                                    <Star size={10} className="text-orange-400 fill-orange-400" />
                                </div>
                                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${item.color}`}
                                        style={{ width: `${item.percent}%` }}
                                    ></div>
                                </div>
                                <span className="text-xs text-gray-400 w-6 text-right">{item.count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewsSection;