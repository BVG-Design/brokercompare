import React from 'react';
import { Sparkles, MessageCircle } from 'lucide-react';

const CallToAction: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 mb-20">
      <div className="bg-[#111827] rounded-2xl p-10 md:p-14 text-center text-white shadow-xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        
        <div className="relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Still not sure?</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            Talk to our team and we'll help you find the perfect plan for your specific needs.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto bg-white text-gray-900 pl-4 pr-5 py-3 rounded-lg font-semibold flex items-center justify-center gap-2.5 hover:bg-gray-50 transition-colors shadow-sm group">
               <Sparkles size={18} className="text-purple-600" />
               <div className="text-left leading-tight">
                 <span className="block text-sm">Take the Quiz</span>
                 <span className="block text-[10px] font-medium text-gray-500 uppercase tracking-wide group-hover:text-purple-600 transition-colors">AI Recommendations</span>
               </div>
            </button>
            
            <button className="w-full sm:w-auto bg-transparent border border-gray-600 text-white pl-4 pr-5 py-3 rounded-lg font-semibold flex items-center justify-center gap-2.5 hover:bg-gray-800 hover:border-gray-500 transition-all">
               <MessageCircle size={18} className="text-blue-400" />
               <div className="text-left leading-tight">
                 <span className="block text-sm">Schedule a Chat</span>
                 <span className="block text-[10px] font-medium text-gray-400 uppercase tracking-wide">With a human</span>
               </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallToAction;