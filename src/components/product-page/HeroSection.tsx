import React from 'react';
import BackButton from '@/components/ui/BackButton';

interface HeroSectionProps {
    tagline?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ tagline }) => {
    return (
        <div className="bg-gradient-to-r from-brand-orange to-orange-600 min-h-[280px] w-full relative flex flex-col items-center pt-8">
            <div className="w-full max-w-6xl px-4 mb-8">
                <BackButton />
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tight px-4 text-center max-w-4xl">
                {tagline || "Software Solution"}
            </h1>
        </div>
    );
};

export default HeroSection;
