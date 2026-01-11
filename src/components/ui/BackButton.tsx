'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

const BackButton: React.FC = () => {
    const router = useRouter();

    return (
        <button
            onClick={() => router.back()}
            className="group flex items-center gap-2 text-white/80 hover:text-white transition-colors duration-200"
        >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 group-hover:bg-white/20 transition-all duration-200">
                <ChevronLeft size={18} />
            </div>
            <span className="text-sm font-bold uppercase tracking-widest">Back to Search</span>
        </button>
    );
};

export default BackButton;
