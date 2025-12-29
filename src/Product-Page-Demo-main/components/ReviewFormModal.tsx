import React, { useState } from 'react';
import { X, Star, ThumbsUp, ThumbsDown, Send } from 'lucide-react';

interface ReviewFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const ReviewFormModal: React.FC<ReviewFormModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [pros, setPros] = useState('');
  const [cons, setCons] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ rating, title, content, pros, cons });
    // Reset form
    setRating(0);
    setTitle('');
    setContent('');
    setPros('');
    setCons('');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
          <div>
             <h2 className="text-lg font-bold text-gray-900">Write a Review</h2>
             <p className="text-xs text-gray-500">Share your experience with ClickUp</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-50 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Rating */}
          <div className="flex flex-col items-center justify-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-200">
            <label className="text-sm font-semibold text-gray-700 mb-2">Overall Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="transition-transform hover:scale-110 focus:outline-none"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star 
                    size={32} 
                    className={`${(hoverRating || rating) >= star ? 'text-orange-400 fill-orange-400' : 'text-gray-300'}`} 
                    strokeWidth={1.5}
                  />
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2 h-4 font-medium">
              {hoverRating === 1 ? "Terrible" : hoverRating === 2 ? "Poor" : hoverRating === 3 ? "Average" : hoverRating === 4 ? "Very Good" : hoverRating === 5 ? "Excellent" : ""}
            </p>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-900">Review Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., The best project management tool I've used"
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
              required
            />
          </div>

          {/* Content */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-900">Your Review</label>
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What did you like or dislike? How are you using it?"
              rows={5}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all resize-none"
              required
            />
          </div>

          {/* Pros & Cons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <ThumbsUp size={14} className="text-green-600" /> Pros
              </label>
              <textarea 
                value={pros}
                onChange={(e) => setPros(e.target.value)}
                placeholder="What impressed you the most?"
                rows={3}
                className="w-full px-4 py-2 bg-green-50/50 border border-green-100 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm transition-all resize-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <ThumbsDown size={14} className="text-red-600" /> Cons
              </label>
              <textarea 
                value={cons}
                onChange={(e) => setCons(e.target.value)}
                placeholder="What could be better?"
                rows={3}
                className="w-full px-4 py-2 bg-red-50/50 border border-red-100 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm transition-all resize-none"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
            <button 
              type="button" 
              onClick={onClose}
              className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-lg shadow-gray-200"
            >
              Submit Review <Send size={14} />
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ReviewFormModal;