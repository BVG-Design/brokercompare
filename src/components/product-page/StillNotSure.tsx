import React from 'react';
import { MessageSquare } from 'lucide-react';

const StillNotSure: React.FC = () => {
    return (
        <div className="bg-[#112240] rounded-xl p-8 md:p-12 text-center text-white relative overflow-hidden my-12 mx-4 md:mx-0">
            {/* Background elements if needed, keeping it simple clean dark blue for now matching the image */}

            <h2 className="text-2xl md:text-3xl font-bold mb-3">Still not sure?</h2>
            <p className="text-gray-300 mb-8 max-w-lg mx-auto text-sm md:text-base">
                Talk to our team and we'll help you find the perfect plan for your specific needs.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button className="bg-white text-[#112240] px-6 py-3 rounded-md font-bold text-sm flex items-center gap-2 hover:bg-gray-100 transition-colors min-w-[200px] justify-center">
                    <span className="text-lg">✨</span>
                    <div className="flex flex-col items-start leading-none">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Take the Quiz</span>
                        <span className="font-bold">AI RECOMMENDATIONS</span>
                    </div>
                </button>

                <button className="bg-transparent border border-white/20 text-white px-6 py-3 rounded-md font-medium text-sm flex items-center gap-2 hover:bg-white/10 transition-colors min-w-[200px] justify-center group">
                    <MessageSquare size={18} />
                    <div className="flex flex-col items-start leading-none">
                        <span className="font-bold">Schedule a Chat</span>
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider group-hover:text-gray-300">WITH A HUMAN</span>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default StillNotSure;
