import React from 'react';
import { Star, ExternalLink, ShieldCheck, CheckCircle2, ChevronRight, TrendingUp, Tag, DollarSign, Scale } from 'lucide-react';

interface DirectoryCardProps {
    name: string;
    type: string;
    tagline: string;
    description: string;
    rating: number;
    reviews: number;
    priceRange: string;
    pricingType: string;
    features: string[];
    logo: string;
    badges: string[];
    viewMode?: 'list' | 'grid';
    onViewDetails?: () => void;
    isComparing?: boolean;
    onToggleCompare?: () => void;
    disableCompare?: boolean;
}

const DirectoryCard: React.FC<DirectoryCardProps> = ({
    name,
    type,
    tagline,
    description,
    rating,
    reviews,
    priceRange,
    pricingType,
    features,
    logo,
    badges,
    viewMode = 'grid',
    onViewDetails,
    isComparing = false,
    onToggleCompare,
    disableCompare = false
}) => {
    const CompareCheckbox = () => (
        <label
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${isComparing
                    ? 'bg-purple-600 text-white border-purple-600 shadow-lg shadow-purple-100'
                    : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300'
                } ${disableCompare && !isComparing ? 'opacity-30 cursor-not-allowed' : ''}`}
            onClick={(e) => e.stopPropagation()}
        >
            <input
                type="checkbox"
                checked={isComparing}
                onChange={onToggleCompare}
                disabled={disableCompare && !isComparing}
                className="hidden"
            />
            <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors ${isComparing ? 'bg-white border-white' : 'bg-gray-50 border-gray-200'
                }`}>
                {isComparing && <div className="w-1.5 h-1.5 bg-purple-600 rounded-sm" />}
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest">Compare</span>
        </label>
    );

    if (viewMode === 'grid') {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col h-full relative">
                {/* Grid View Layout */}
                <div className="p-6 flex-grow">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-black text-gray-900 leading-tight truncate flex-1 pr-2">{name}</h3>
                        <div className="w-10 h-10 bg-white rounded-lg shadow-sm border border-gray-100 flex items-center justify-center p-1.5 shrink-0">
                            <img src={logo} alt={name} className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all" />
                        </div>
                    </div>

                    {/* Badges (Left) inline with rating Score (Right) - Under Title */}
                    <div className="flex items-center justify-between gap-3 mb-4">
                        <div className="flex flex-wrap gap-1">
                            {badges.map((badge, i) => (
                                <span key={i} className="bg-purple-50 text-purple-700 text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border border-purple-100 whitespace-nowrap">
                                    {badge}
                                </span>
                            ))}
                        </div>
                        <div className="flex items-center gap-1 bg-orange-50 px-1.5 py-0.5 rounded-lg border border-orange-100 shrink-0">
                            <Star size={10} className="text-orange-500 fill-orange-500" />
                            <span className="text-[10px] font-black text-gray-900">{rating}</span>
                        </div>
                    </div>

                    <p className="text-[11px] font-bold text-primary italic mb-3 line-clamp-1">{tagline}</p>
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-3 mb-5">{description}</p>

                    <div className="space-y-1.5 mb-6">
                        {features.slice(0, 3).map((feat, i) => (
                            <div key={i} className="flex items-center gap-2 text-[10px] font-bold text-gray-600">
                                <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                                <span className="truncate">{feat}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 mt-auto">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex flex-col">
                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Starting from</span>
                            <span className="text-sm font-black text-gray-900">{priceRange}</span>
                        </div>
                        <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase">{type}</span>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={onViewDetails}
                            className="w-full bg-gray-900 text-white py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-md active:scale-95"
                        >
                            View Profile
                        </button>
                        <div className="flex items-center justify-between">
                            <button className="text-[9px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 flex items-center gap-1 transition-colors">
                                Visit Website <ExternalLink size={10} />
                            </button>
                            <CompareCheckbox />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group">
            <div className="p-6 md:p-10">
                {/* Header Row: Title on Left, Rating + Logo on Right */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-4">
                    <div className="flex-1">
                        <h3 className="text-3xl font-black text-gray-900 tracking-tight leading-none mb-4">{name}</h3>

                        {/* List View: Badges under title, above tagline */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {badges.map((badge, i) => (
                                <span key={i} className="bg-purple-50 text-purple-700 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded border border-purple-100">
                                    {badge}
                                </span>
                            ))}
                        </div>

                        <p className="text-base font-bold text-primary italic">{tagline}</p>
                    </div>

                    <div className="flex items-center gap-5 self-start md:self-center">
                        {/* Rating left of logo */}
                        <div className="text-right">
                            <div className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-xl border border-orange-100">
                                <Star size={16} className="text-orange-500 fill-orange-500" />
                                <span className="text-lg font-black text-gray-900">{rating}</span>
                            </div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 mr-1">{reviews} reviews</p>
                        </div>

                        {/* Logo on the far right */}
                        <div className="w-20 h-20 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center p-4 transition-transform group-hover:scale-105 duration-300 shrink-0">
                            <img src={logo} alt={name} className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all" />
                        </div>
                    </div>
                </div>

                {/* Content Body */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2">
                        <p className="text-gray-500 leading-relaxed mb-8 text-base">
                            {description}
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {features.slice(0, 9).map((feat, i) => (
                                <div key={i} className="flex items-center gap-2.5 text-[11px] font-bold text-gray-600 bg-gray-50/50 px-3 py-2 rounded-lg border border-transparent hover:border-gray-100 transition-colors">
                                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                                    <span className="truncate">{feat}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Meta Stats integrated into main card flow */}
                    <div className="bg-gray-50/50 rounded-2xl p-6 space-y-6 flex flex-col justify-center border border-gray-100">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                            <div className="flex items-center gap-2 text-gray-400">
                                <DollarSign size={14} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Entry Pricing</span>
                            </div>
                            <div className="text-right">
                                <p className="text-base font-black text-gray-900">{priceRange}</p>
                                <span className="text-[9px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded uppercase">{pricingType}</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2 text-gray-400">
                                <Tag size={14} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Category</span>
                            </div>
                            <span className="text-xs font-bold text-gray-700 bg-white border border-gray-200 px-3 py-1.5 rounded-lg">{type}</span>
                        </div>
                    </div>
                </div>

                {/* Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-8 mt-8 border-t border-gray-100">
                    <div className="flex flex-wrap items-center gap-4">
                        <button
                            onClick={onViewDetails}
                            className="bg-gray-900 text-white px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-gray-200 hover:-translate-y-0.5 active:scale-95"
                        >
                            View Profile
                        </button>
                        <button className="text-gray-400 hover:text-gray-900 text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all px-4 py-3.5 hover:bg-gray-50 rounded-2xl">
                            Visit Website <ExternalLink size={18} />
                        </button>
                    </div>

                    <CompareCheckbox />
                </div>
            </div>
        </div>
    );
};

export default DirectoryCard;