'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, ExternalLink, GripVertical, Check, Shield, Zap, TrendingUp } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const associationStyles: Record<string, any> = {
    people: {
        bg: "bg-amber-50/50",
        border: "border-amber-100",
        accent: "bg-amber-500",
        badge: "bg-amber-100 text-amber-700 hover:bg-amber-200",
        icon: Shield
    },
    software: {
        bg: "bg-blue-50/50",
        border: "border-blue-100",
        accent: "bg-blue-500",
        badge: "bg-blue-100 text-blue-700 hover:bg-blue-200",
        icon: Zap
    },
    processes_automations: {
        bg: "bg-violet-50/50",
        border: "border-violet-100",
        accent: "bg-violet-500",
        badge: "bg-violet-100 text-violet-700 hover:bg-violet-200",
        icon: TrendingUp
    },
    services: {
        bg: "bg-emerald-50/50",
        border: "border-emerald-100",
        accent: "bg-emerald-500",
        badge: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200",
        icon: Star
    }
};

interface DecisionCardProps {
    listing: any;
    onSelect?: (listing: any) => void;
    isSelected?: boolean;
    onCompare?: (listing: any) => void;
    isDragging?: boolean;
    dragHandleProps?: any;
}

export default function DecisionCard({
    listing,
    onSelect,
    isSelected,
    onCompare,
    isDragging,
    dragHandleProps
}: DecisionCardProps) {
    // Use the first association for styling, or default to tools
    const primaryAssoc = listing.journeyAssociations?.[0] || 'software';
    const styles = associationStyles[primaryAssoc] || associationStyles.software;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
            className={cn(
                "group relative rounded-2xl border-2 p-4 cursor-pointer transition-all duration-300 bg-white shadow-sm",
                styles.border,
                isSelected && "ring-2 ring-slate-900 ring-offset-2",
                isDragging && "shadow-2xl rotate-2 z-50 border-slate-900"
            )}
            onClick={() => onSelect?.(listing)}
        >
            {/* Category Accent */}
            <div className={cn("absolute top-0 left-6 w-10 h-1 rounded-b-full", styles.accent)} />

            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                    <h4 className="font-black text-slate-900 text-xs uppercase tracking-tight truncate">{listing.title}</h4>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                        {listing.badges?.map((badge: any) => (
                            <span key={badge._id} className="text-[8px] font-black uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200">
                                {badge.title}
                            </span>
                        ))}
                    </div>
                </div>
                {listing.logo && (
                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-100 bg-white p-1.5 shadow-sm group-hover:scale-110 transition-transform">
                        <img
                            src={listing.logo}
                            alt={listing.title}
                            className="w-full h-full object-contain"
                        />
                    </div>
                )}
            </div>

            {/* Tagline / Snippet */}
            {listing.tagline && (
                <p className="text-[10px] font-medium text-slate-500 line-clamp-2 mb-3 leading-relaxed">
                    {listing.tagline}
                </p>
            )}

            {/* Metrics & Pricing */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-0.5">
                        <Star className="w-2.5 h-2.5 fill-brand-orange text-brand-orange" />
                        <span className="text-[10px] font-bold text-slate-900">{listing.rating?.average || '4.5'}</span>
                    </div>
                    <span className="text-[8px] font-black uppercase text-slate-300">Score</span>
                </div>
                {listing.pricing?.startingFrom !== undefined && (
                    <span className="text-[10px] font-black text-slate-900">${listing.pricing.startingFrom}<span className="text-[8px] text-slate-400">/mo</span></span>
                )}
            </div>

            {/* Quick Actions - Floating */}
            <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onCompare?.(listing);
                    }}
                    className="bg-[#0f172a] text-white p-2 rounded-full shadow-xl hover:bg-slate-800 transition-colors"
                    title="Add to compare"
                >
                    <Check size={14} className="stroke-[3]" />
                </button>
            </div>
        </motion.div>
    );
}
