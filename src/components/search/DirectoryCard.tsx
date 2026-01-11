'use client';

import React from 'react';
import { Star, ExternalLink, CheckCircle2, ChevronRight, Scale, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useComparison } from '@/components/compare/ComparisonContext';
import { toast } from '@/hooks/use-toast';

interface DirectoryCardProps {
    id: string;
    name: string;
    type: string;
    tagline: string;
    description: string;
    rating?: number;
    reviews?: number;
    priceRange?: string;
    pricingType?: string;
    features?: string[];
    logo?: string;
    badges?: string[];
    viewMode?: 'list' | 'grid';
    slug: string;
    resultType: string;
}

const DirectoryCard: React.FC<DirectoryCardProps> = ({
    id,
    name,
    type,
    tagline,
    description,
    rating = 0,
    reviews = 0,
    priceRange = 'Contact for pricing',
    pricingType = 'Standard',
    features = [],
    logo,
    badges = [],
    viewMode = 'grid',
    slug,
    resultType
}) => {
    const { addItem, isInComparison, removeItem, canAddMore } = useComparison();
    const isComparing = isInComparison(id);

    const onToggleCompare = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isComparing) {
            removeItem(id);
        } else {
            if (!canAddMore) {
                toast({
                    title: "Comparison limit reached",
                    description: "You can compare up to 4 items.",
                    variant: "destructive",
                });
                return;
            }
            addItem({
                id,
                name,
                company_name: name,
                description,
                logoUrl: logo,
                slug,
            } as any, resultType as any);
        }
    };

    const CompareCheckbox = () => (
        <label
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl border-2 transition-all cursor-pointer ${isComparing
                ? 'bg-[#E7F6F2] text-[#2C3333] border-[#2C3333] shadow-md'
                : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300'
                } ${!canAddMore && !isComparing ? 'opacity-30 cursor-not-allowed' : ''}`}
            onClick={onToggleCompare}
        >
            <div className={`w-4 h-4 rounded-md border-2 flex items-center justify-center transition-colors ${isComparing ? 'bg-[#2C3333] border-[#2C3333]' : 'bg-gray-50 border-gray-200'
                }`}>
                {isComparing && <CheckCircle2 size={12} className="text-white" />}
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.1em]">{isComparing ? 'Added' : 'Compare'}</span>
        </label>
    );

    if (viewMode === 'grid') {
        return (
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden group flex flex-col h-full relative">
                <div className="p-8 flex-grow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex-1 pr-4">
                            <h3 className="text-2xl font-black text-gray-900 leading-tight mb-2 group-hover:text-[#2C3333] transition-colors">{name}</h3>
                            <div className="flex flex-wrap gap-2">
                                {(badges || []).map((badge, i) => (
                                    <span key={i} className="bg-[#FF6B35]/10 text-[#FF6B35] text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-[#FF6B35]/20">
                                        {badge}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="w-16 h-16 bg-white rounded-2xl shadow-xl border border-gray-50 flex items-center justify-center p-3 shrink-0 group-hover:scale-110 transition-transform duration-500">
                            {logo ? (
                                <img src={logo} alt={name} className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500" />
                            ) : (
                                <div className="w-full h-full bg-gray-50 rounded-xl flex items-center justify-center text-xl text-gray-300 font-black">{name[0]}</div>
                            )}
                        </div>
                    </div>

                    <div className="mb-6">
                        {rating > 0 && (
                            <div className="flex items-center gap-1.5 bg-[#FFD700]/10 px-2.5 py-1 rounded-full border border-[#FFD700]/20 w-fit">
                                <Star size={12} className="text-[#FFD700] fill-[#FFD700]" />
                                <span className="text-xs font-black text-gray-900">{rating}</span>
                                <span className="text-[10px] font-bold text-gray-400">({reviews})</span>
                            </div>
                        )}
                    </div>

                    <p className="text-sm font-bold text-[#00ABB3] italic mb-4 line-clamp-2 leading-relaxed">&ldquo;{tagline}&rdquo;</p>
                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 mb-6 font-medium">{description}</p>
                </div>

                <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-100 mt-auto">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Price Type</span>
                            <span className="text-sm font-black text-gray-900">{pricingType}</span>
                        </div>
                        <span className="text-[10px] font-black text-white bg-[#2C3333] px-3 py-1 rounded-lg uppercase tracking-widest">{type}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Button
                            asChild
                            variant="outline"
                            className="h-12 rounded-[1.25rem] border-2 border-gray-900 text-gray-900 font-black uppercase tracking-widest text-[10px] hover:bg-gray-900 hover:text-white transition-all shadow-md active:scale-95"
                        >
                            <a href={`/directory/${slug}`}>Profile</a>
                        </Button>
                        <CompareCheckbox />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden group">
            <div className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-8">
                    <div className="flex-1">
                        <div className="flex flex-wrap gap-2 mb-4">
                            {(badges || []).map((badge, i) => (
                                <span key={i} className="bg-[#FF6B35]/10 text-[#FF6B35] text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-[#FF6B35]/20">
                                    {badge}
                                </span>
                            ))}
                            <span className="bg-[#2C3333] text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full">{type}</span>
                        </div>
                        <h3 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-none mb-6 group-hover:text-[#2C3333] transition-colors">{name}</h3>
                        <p className="text-lg font-bold text-[#00ABB3] italic leading-relaxed">&ldquo;{tagline}&rdquo;</p>
                    </div>

                    <div className="flex items-center gap-6 self-start md:self-center">
                        {rating > 0 && (
                            <div className="text-right">
                                <div className="flex items-center gap-2 bg-[#FFD700]/10 px-4 py-2 rounded-2xl border border-[#FFD700]/20">
                                    <Star size={20} className="text-[#FFD700] fill-[#FFD700]" />
                                    <span className="text-2xl font-black text-gray-900">{rating}</span>
                                </div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2 mr-1">{reviews} verified reviews</p>
                            </div>
                        )}

                        <div className="w-24 h-24 bg-white rounded-3xl shadow-xl border border-gray-50 flex items-center justify-center p-5 transition-transform group-hover:scale-110 duration-500 shrink-0">
                            {logo ? (
                                <img src={logo} alt={name} className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500" />
                            ) : (
                                <div className="text-3xl font-black text-gray-200">{name[0]}</div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2">
                        <p className="text-gray-500 leading-relaxed mb-10 text-lg font-medium">
                            {description}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {(features || []).slice(0, 9).map((feat, i) => (
                                <div key={i} className="flex items-center gap-3 text-xs font-bold text-gray-600 bg-gray-50/50 px-4 py-3 rounded-xl border border-transparent hover:border-gray-100 transition-colors">
                                    <CheckCircle2 size={16} className="text-[#00ABB3] shrink-0" />
                                    <span className="truncate">{feat}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-[#2C3333] rounded-[2rem] p-8 space-y-8 flex flex-col justify-center text-white relative overflow-hidden group/pricing">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 text-gray-400 mb-2">
                                <Scale size={16} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Pricing Structure</span>
                            </div>
                            <p className="text-2xl font-black">{priceRange}</p>
                            <span className="inline-block mt-2 text-[10px] font-black bg-[#FF6B35] text-white px-3 py-1 rounded-full uppercase tracking-widest">{pricingType}</span>
                        </div>

                        <div className="pt-6 border-t border-white/10 relative z-10">
                            <Button asChild size="lg" className="w-full bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white font-black uppercase tracking-widest text-xs h-14 rounded-2xl transition-all shadow-xl active:scale-95">
                                <a href={`/directory/${slug}`}>View Full Profile</a>
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-6 pt-10 mt-10 border-t border-gray-100">
                    <div className="flex flex-wrap items-center gap-6">
                        <a href={`/directory/${slug}`} className="text-gray-400 hover:text-[#2C3333] text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all px-6 py-4 hover:bg-gray-50 rounded-2xl border-2 border-transparent hover:border-gray-900/5">
                            Visit Official Website <ExternalLink size={18} />
                        </a>
                    </div>

                    <CompareCheckbox />
                </div>
            </div>
        </div>
    );
};

export default DirectoryCard;
