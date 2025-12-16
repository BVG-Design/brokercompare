import React from 'react';
import { Star } from 'lucide-react';

const ReviewsSection: React.FC = () => {
    return (
        <div className="max-w-6xl mx-auto px-4 mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-6">User Reviews</h2>
            <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
                <p className="text-gray-500 text-sm mb-6">Be the first to review this product!</p>
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md font-medium text-sm transition-colors">
                    Write a Review
                </button>
            </div>
        </div>
    );
};

export default ReviewsSection;
