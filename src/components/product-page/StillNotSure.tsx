import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { QuizWaitlistModal } from '@/components/quiz/quiz-waitlist-modal';

const StillNotSure: React.FC = () => {
    return (
        <div className="bg-[#112240] rounded-xl p-8 md:p-12 text-center text-white relative overflow-hidden my-12 mx-4 md:mx-0">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Still not sure?</h2>
            <p className="text-gray-300 mb-8 max-w-lg mx-auto text-sm md:text-base">
                Talk to our team and we'll help you find the perfect plan for your specific needs.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                    href="/optimise-workflow"
                    className="bg-[#1f345f] border border-[#334a7c] text-white px-6 py-3 rounded-xl font-semibold text-base flex items-center gap-3 hover:bg-[#213b6f] transition-colors min-w-[220px] justify-center shadow-[0_4px_12px_rgba(0,0,0,0.25)]"
                >
                    <span>Schedule a Chat</span>
                    <ArrowRight size={18} className="opacity-80" />
                </Link>

                <QuizWaitlistModal>
                    <button className="bg-[#00cdb2] text-[#0f284d] px-6 py-3 rounded-xl font-semibold text-base flex items-center gap-3 hover:bg-[#00b9a2] transition-colors min-w-[220px] justify-center shadow-[0_6px_14px_rgba(0,205,178,0.35)]">
                        <span>Take the Quiz</span>
                        <ArrowRight size={18} className="opacity-80" />
                    </button>
                </QuizWaitlistModal>
            </div>
        </div>
    );
};

export default StillNotSure;
