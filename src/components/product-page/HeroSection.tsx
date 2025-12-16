import React from 'react';

interface HeroSectionProps {
    tagline?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ tagline }) => {
    return (
        <div className="bg-gradient-to-r from-brand-orange to-orange-600 h-[280px] w-full relative flex justify-center pt-16">
            <h1 className="text-4xl font-bold text-white tracking-tight px-4 text-center">
                {tagline || "Software Solution"}
            </h1>
        </div>
    );
};

export default HeroSection;
