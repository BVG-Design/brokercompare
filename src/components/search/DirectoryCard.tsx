'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Star, ExternalLink, CheckCircle2, ChevronRight, Scale, X, Info, DollarSign, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useComparison } from '@/components/compare/ComparisonContext';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { SITE_URLS } from '@/lib/config';

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
    websiteUrl?: string;
    isComparing?: boolean;
    onToggleCompare?: (id: string) => void;
    disableCompare?: boolean;
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
    resultType,
    websiteUrl,
    isComparing: isComparingProp,
    onToggleCompare: onToggleCompareProp,
    disableCompare
}) => {
    const { addItem, isInComparison, removeItem, canAddMore } = useComparison();
    // Use prop if provided (for ComparisonTool), otherwise fallback to context (global behavior)
    const isComparing = isComparingProp !== undefined ? isComparingProp : isInComparison(id);
    const router = useRouter();

    const handleCardClick = () => {
        router.push(`${SITE_URLS.directory}/listings/${slug}`);
    };

    const onToggleCompare = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (onToggleCompareProp) {
            onToggleCompareProp(id);
            return;
        }

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
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl border-2 transition-all ${disableCompare && !isComparing ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
                } ${isComparing
                    ? 'bg-[#E7F6F2] text-[#2C3333] border-[#2C3333] shadow-md'
                    : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300'
                }`}
            onClick={disableCompare && !isComparing ? (e) => { e.preventDefault(); e.stopPropagation(); } : onToggleCompare}
        >
            <div className={`w-4 h-4 rounded-md border-2 flex items-center justify-center transition-colors ${isComparing ? 'bg-[#2C3333] border-[#2C3333]' : 'bg-gray-50 border-gray-200'
                }`}>
                {isComparing && <CheckCircle2 size={12} className="text-white" />}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.1em]">{isComparing ? 'Added' : 'Compare'}</span>
        </label>
    );

    if (viewMode === 'grid') {
        const cardVariants = {
            initial: {
                boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
                borderColor: "rgb(156 163 175)" // border-gray-400
            },
            hover: {
                boxShadow: "0 20px 50px rgba(34, 197, 94, 0.15)",
                borderColor: "rgba(34, 197, 94, 0.4)",
                transition: { duration: 0.3 }
            }
        };

        const logoVariants = {
            hover: {
                y: [0, -8, 0],
                transition: {
                    duration: 0.4,
                }
            }
        };

        return (
            <TooltipProvider>
                <motion.div
                    initial="initial"
                    whileHover="hover"
                    variants={cardVariants}
                    onClick={handleCardClick}
                    className="bg-white rounded-[2rem] border-gray-400 border transition-all duration-500 overflow-hidden group flex flex-col h-full relative cursor-pointer"
                >
                    <div className="p-8 flex-grow">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex-1 pr-4">
                                <h3 className="text-2xl font-bold text-brand-blue leading-tight mb-3 transition-colors uppercase group-hover:text-brand-orange">{name}</h3>
                                <div className="flex flex-wrap gap-2 items-center">
                                    {(badges || []).map((badge, i) => (
                                        <Tooltip key={i}>
                                            <TooltipTrigger asChild>
                                                <span className="bg-purple-50 text-purple-700 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-purple-100 cursor-help transition-colors hover:bg-purple-100">
                                                    {badge}
                                                </span>
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-gray-900 text-white text-[10px] border-none px-3 py-2 rounded-lg font-bold">
                                                Certified {badge} status for broker-fit efficiency.
                                            </TooltipContent>
                                        </Tooltip>
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2 shrink-0">
                                <motion.div
                                    variants={logoVariants}
                                    className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center p-2.5 relative z-10 overflow-hidden"
                                >
                                    {logo ? (
                                        <img src={logo} alt={name} className="w-full h-full object-contain transition-all duration-500" />
                                    ) : (
                                        <div className="w-full h-full bg-gray-50 rounded-xl flex items-center justify-center text-lg text-gray-300 font-bold">{name[0]}</div>
                                    )}
                                </motion.div>
                                <div className="flex flex-col items-end gap-0.5">
                                    <div className="flex items-center gap-1 bg-brand-orange/10 px-2 py-0.5 rounded-lg border border-brand-orange/10 shrink-0">
                                        <Star size={10} className="text-brand-orange fill-brand-orange" />
                                        <span className="text-[10px] font-bold text-brand-blue">{rating > 0 ? rating : '0.0'}</span>
                                    </div>
                                    <span className="text-[7px] font-bold text-gray-400 uppercase tracking-tighter">{reviews} REVIEWS</span>
                                </div>
                            </div>
                        </div>

                        <p className="text-sm font-bold text-brand-orange italic mb-4 leading-relaxed transition-colors group-hover:text-brand-blue">&ldquo;{tagline}&rdquo;</p>
                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-3 mb-6 font-medium">{description}</p>

                        <div className="space-y-2 mb-6">
                            {(features || []).slice(0, 3).map((feat, i) => (
                                <div key={i} className="flex items-center gap-2 text-[10px] font-bold text-gray-600">
                                    <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                                    <span className="truncate">{feat}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="px-8 py-6 bg-gray-50/20 border-t border-gray-100 mt-auto">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex flex-col">
                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Starting from</span>
                                <span className="text-lg font-bold text-brand-blue">{priceRange}</span>
                            </div>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <span className="text-[10px] font-bold text-gray-600 border border-gray-400 px-3 py-1 rounded-full uppercase tracking-widest cursor-help hover:bg-gray-100 transition-colors">
                                        {type}
                                    </span>
                                </TooltipTrigger>
                                <TooltipContent className="bg-gray-900 text-white text-[10px] border-none px-3 py-2 rounded-lg font-bold">
                                    Official {type} classification.
                                </TooltipContent>
                            </Tooltip>
                        </div>

                        <div className="flex flex-col gap-4">
                            <Button
                                asChild
                                className="h-12 w-full rounded-2xl bg-brand-green text-brand-blue font-bold uppercase tracking-widest text-[11px] hover:bg-gray-800 hover:text-white transition-all shadow-md active:scale-95 border-none"
                            >
                                <a href={`${SITE_URLS.directory}/listings/${slug}`} onClick={(e) => e.stopPropagation()}>View Profile</a>
                            </Button>

                            <div className="flex items-center justify-between px-1">
                                <a href={websiteUrl || `/listings/${slug}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-brand-blue hover:text-brand-blue/80 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 transition-all">
                                    Visit Website <ExternalLink size={12} />
                                </a>
                                <div
                                    className="text-brand-orange hover:text-brand-orange/80 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 transition-all cursor-pointer"
                                    onClick={onToggleCompare}
                                >
                                    <div className={`w-3.5 h-3.5 rounded border border-brand-orange/30 flex items-center justify-center transition-colors ${isComparing ? 'bg-brand-orange border-brand-orange' : 'bg-white'}`}>
                                        {isComparing && <CheckCircle2 size={10} className="text-white" />}
                                    </div>
                                    {isComparing ? 'Added' : 'Compare'}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </TooltipProvider>
        );
    }

    const cardVariants = {
        initial: {
            boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
            borderColor: "rgb(156 163 175)" // border-gray-400
        },
        hover: {
            boxShadow: "0 20px 50px rgba(34, 197, 94, 0.15)",
            borderColor: "rgba(34, 197, 94, 0.4)",
            transition: { duration: 0.3 }
        }
    };

    const logoVariants = {
        hover: {
            y: [0, -8, 0],
            transition: {
                duration: 0.4
            }
        }
    };

    return (
        <TooltipProvider>
            <motion.div
                initial="initial"
                whileHover="hover"
                variants={cardVariants}
                onClick={handleCardClick}
                className="bg-white rounded-[2rem] border border-gray-400 transition-all duration-500 overflow-hidden group relative p-8 cursor-pointer"
            >
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Left Side: Information */}
                    <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-3xl font-bold text-brand-blue tracking-tight leading-none transition-colors uppercase group-hover:text-brand-orange">{name}</h3>
                            <div className="flex flex-col items-end gap-2 md:hidden">
                                <div className="flex flex-col items-end">
                                    <div className="flex items-center gap-1.5 bg-brand-orange/10 px-3 py-1 rounded-lg border border-brand-orange/10">
                                        <Star size={14} className="text-brand-orange fill-brand-orange" />
                                        <span className="text-sm font-bold text-brand-blue">{rating > 0 ? rating : '0.0'}</span>
                                    </div>
                                    <span className="text-[8px] font-bold text-gray-400 mt-1 uppercase tracking-wider">{reviews} REVIEWS</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2 mb-4">
                            {(badges || []).slice(0, 3).map((badge, i) => (
                                <Tooltip key={i}>
                                    <TooltipTrigger asChild>
                                        <span className="bg-purple-50 text-purple-700 text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border border-purple-100">
                                            {badge}
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-gray-900 text-white text-[10px] border-none px-3 py-2 rounded-lg font-bold">
                                        Official {badge} certification.
                                    </TooltipContent>
                                </Tooltip>
                            ))}
                        </div>

                        <p className="text-base font-bold text-brand-orange italic leading-relaxed mb-4 transition-colors group-hover:text-brand-blue">&ldquo;{tagline}&rdquo;</p>
                        <p className="text-sm text-gray-500 leading-relaxed mb-6 font-medium line-clamp-3">{description}</p>

                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6 mb-8">
                            {(features || []).slice(0, 6).map((feat, i) => (
                                <div key={i} className="flex items-center gap-3 text-xs font-bold text-gray-600">
                                    <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                                        <CheckCircle2 size={12} className="text-emerald-500" />
                                    </div>
                                    <span className="truncate">{feat}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Side: Rating & Boxes */}
                    <div className="w-full md:w-72 flex flex-col gap-4">
                        <div className="hidden md:flex justify-end items-start gap-4 mb-2">
                            <div className="flex flex-col items-end">
                                <div className="flex items-center gap-1.5 bg-brand-orange/10 px-3 py-1 rounded-lg border border-brand-orange/10">
                                    <Star size={14} className="text-brand-orange fill-brand-orange" />
                                    <span className="text-sm font-bold text-brand-blue">{rating > 0 ? rating : '0.0'}</span>
                                </div>
                                <span className="text-[8px] font-bold text-gray-400 mt-1 uppercase tracking-wider">{reviews} REVIEWS</span>
                            </div>
                            <motion.div variants={logoVariants} className="w-16 h-16 bg-white rounded-2xl shadow-md border border-gray-100 flex items-center justify-center p-3">
                                {logo ? (
                                    <img src={logo} alt={name} className="w-full h-full object-contain" />
                                ) : (
                                    <div className="text-2xl font-bold text-gray-200">{name[0]}</div>
                                )}
                            </motion.div>
                        </div>

                        <div className="bg-gray-50/50 rounded-2xl border border-gray-100 p-5 space-y-4">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-2 text-gray-400">
                                    <DollarSign size={14} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Entry Pricing</span>
                                </div>
                                <div className="text-right">
                                    <p className="text-base font-bold text-brand-blue leading-tight whitespace-nowrap">{priceRange}</p>
                                    <span className="text-[8px] font-bold text-brand-blue bg-blue-100 px-1.5 py-0.5 rounded uppercase tracking-tighter mt-1 block w-fit ml-auto">FREEMIUM</span>
                                </div>
                            </div>
                            <div className="h-px bg-gray-100 w-full" />
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-2 text-gray-400">
                                    <Tag size={14} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Category</span>
                                </div>
                                <span className="text-[10px] font-bold text-gray-600 border border-gray-300 px-3 py-1 rounded-full uppercase tracking-widest uppercase">
                                    {type}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Row */}
                <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6">
                    <div className="flex items-center gap-8">
                        <Button asChild className="bg-brand-green text-brand-blue hover:bg-gray-800 hover:text-white font-bold uppercase tracking-widest text-[11px] h-12 px-10 rounded-xl transition-all shadow-md active:scale-95 border-none">
                            <a href={`${SITE_URLS.directory}/listings/${slug}`} onClick={(e) => e.stopPropagation()}>View Profile</a>
                        </Button>
                        <a href={websiteUrl || `/listings/${slug}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-brand-blue hover:text-brand-blue/80 text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 transition-all group/link">
                            Visit Website <ExternalLink size={14} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                        </a>
                    </div>
                    <div
                        className="text-brand-orange hover:text-brand-orange/80 text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 transition-all cursor-pointer"
                        onClick={onToggleCompare}
                    >
                        <div className={`w-4 h-4 rounded border border-brand-orange/30 flex items-center justify-center transition-colors ${isComparing ? 'bg-brand-orange border-brand-orange shadow-inner' : 'bg-white'}`}>
                            {isComparing && <CheckCircle2 size={12} className="text-white" />}
                        </div>
                        Compare
                    </div>
                </div>
            </motion.div>
        </TooltipProvider>
    );
};

export default DirectoryCard;
