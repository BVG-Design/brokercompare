'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, ExternalLink, Check, AlertCircle, DollarSign, Shield, Zap, TrendingUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const associationConfig: Record<string, any> = {
    people: { color: "bg-amber-500", icon: Shield },
    tools: { color: "bg-blue-500", icon: Zap },
    processes_automations: { color: "bg-violet-500", icon: TrendingUp }
};

interface ToolDetailPanelProps {
    listing: any;
    onClose: () => void;
    onCompare?: (listing: any) => void;
}

export default function ToolDetailPanel({ listing, onClose, onCompare }: ToolDetailPanelProps) {
    if (!listing) return null;

    const primaryAssoc = listing.journeyAssociations?.[0] || 'tools';
    const config = associationConfig[primaryAssoc] || associationConfig.tools;
    const Icon = config.icon;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-[-20px_0_50px_rgba(0,0,0,0.1)] z-[100] overflow-y-auto"
            >
                {/* Header */}
                <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 border-b border-slate-100">
                    <div className="p-8">
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-5">
                                {listing.logo ? (
                                    <div className="w-20 h-20 rounded-2xl bg-white border border-slate-100 p-2.5 shadow-sm overflow-hidden flex items-center justify-center">
                                        <img
                                            src={listing.logo}
                                            alt={listing.title}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                ) : (
                                    <div className={cn(
                                        "w-20 h-20 rounded-2xl flex items-center justify-center text-white text-3xl font-bold",
                                        config.color
                                    )}>
                                        {listing.title.charAt(0)}
                                    </div>
                                )}
                                <div>
                                    <h2 className="text-2xl font-bold text-brand-blue tracking-tight uppercase">{listing.title}</h2>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest bg-slate-50 border-slate-200">
                                            {primaryAssoc.replace(/_/g, ' ')}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6 text-slate-400" />
                            </button>
                        </div>

                        {/* Quick Stats */}
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-1.5">
                                <Star className="w-5 h-5 fill-brand-orange text-brand-orange" />
                                <span className="text-lg font-bold text-brand-blue">4.8</span>
                                <span className="text-slate-400 font-bold text-sm">/ 5.0</span>
                            </div>
                            <div className="h-4 w-px bg-slate-100" />
                            <div className="flex items-center gap-1.5 text-slate-600">
                                <DollarSign className="w-5 h-5 text-emerald-500" />
                                <span className="text-sm font-bold uppercase tracking-wide">
                                    {listing.pricing?.startingFrom ? `From $${listing.pricing.startingFrom}/mo` : 'Price on Request'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 space-y-10">
                    {/* Tagline & Description */}
                    <div>
                        <h3 className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-4">Strategic Overview</h3>
                        <p className="text-brand-blue font-bold text-lg leading-snug mb-4">{listing.tagline}</p>
                        <p className="text-slate-500 text-sm leading-relaxed">{listing.description}</p>
                    </div>

                    {/* Capabilities */}
                    {listing.features?.length > 0 && (
                        <div>
                            <h3 className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-6">Core Capabilities</h3>
                            <div className="grid grid-cols-1 gap-3">
                                {listing.features.map((feature: any, index: number) => (
                                    <div key={index} className="flex items-center gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100 group hover:border-slate-200 transition-colors">
                                        <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-sm text-emerald-500 group-hover:scale-110 transition-transform">
                                            <Check className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm font-bold text-slate-700">{typeof feature === 'string' ? feature : feature.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="sticky bottom-0 bg-white/80 backdrop-blur-md border-t border-slate-100 p-8 shadow-[0_-20px_50px_rgba(0,0,0,0.05)]">
                    <div className="flex gap-4">
                        <Button
                            variant="outline"
                            className="flex-1 h-12 text-[10px] font-bold uppercase tracking-widest rounded-xl border-2"
                            onClick={() => onCompare?.(listing)}
                        >
                            Add to Matrix
                        </Button>
                        <Button className="flex-1 h-12 bg-brand-orange hover:bg-orange-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl">
                            Visit Provider
                            <ExternalLink className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
