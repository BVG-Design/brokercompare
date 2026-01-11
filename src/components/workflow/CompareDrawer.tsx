'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Check, Minus, ExternalLink, Columns } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CompareDrawerProps {
    listings: any[];
    onRemove: (id: string) => void;
    onClear: () => void;
}

export default function CompareDrawer({ listings, onRemove, onClear }: CompareDrawerProps) {
    if (!listings?.length) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-slate-200 shadow-[0_-20px_50px_-12px_rgba(0,0,0,0.15)] z-[60] max-h-[70vh] overflow-hidden flex flex-col"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 bg-white">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-brand-blue rounded-xl flex items-center justify-center text-white">
                            <Columns size={20} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-brand-blue uppercase tracking-tight">Strategy Comparison</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{listings.length} Solutions Selected</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" onClick={onClear} className="text-[10px] font-bold uppercase tracking-widest border border-slate-200 rounded-lg">
                            Clear All
                        </Button>
                        Download Matrix
                    </div>
                </div>

                {/* Comparison Grid */}
                <div className="flex-1 overflow-auto bg-slate-50/30 px-8 pb-10">
                    <div className="w-full">
                        <table className="w-full border-collapse">
                            <thead className="sticky top-0 bg-white/80 backdrop-blur-md z-10">
                                <tr>
                                    <th className="py-6 pr-8 text-left w-64 border-b border-slate-100">
                                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Attribute</span>
                                    </th>
                                    {listings.map((item) => (
                                        <th key={item._id} className="p-6 min-w-[280px] border-b border-slate-100">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="relative group">
                                                    <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 p-2.5 shadow-sm overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform">
                                                        {item.logo ? (
                                                            <img src={item.logo} alt={item.title} className="w-full h-full object-contain" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center bg-brand-blue text-white font-bold text-xl">
                                                                {item.title.charAt(0)}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <button
                                                        onClick={() => onRemove(item._id)}
                                                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X className="w-3 h-3 stroke-[3]" />
                                                    </button>
                                                </div>
                                                <span className="font-bold text-brand-blue text-xs uppercase tracking-tight">{item.title}</span>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {/* Score Row */}
                                <tr className="hover:bg-white transition-colors">
                                    <td className="py-6 pr-8">
                                        <span className="text-[10px] font-bold text-brand-blue uppercase tracking-widest">Broker-Fit Score</span>
                                    </td>
                                    {listings.map((item) => (
                                        <td key={item._id} className="p-6 text-center">
                                            <div className="inline-flex items-baseline gap-1 bg-brand-blue text-white px-3 py-1.5 rounded-lg">
                                                <span className="text-base font-bold">4.8</span>
                                                <span className="text-[8px] font-bold text-slate-400">/ 5.0</span>
                                            </div>
                                        </td>
                                    ))}
                                </tr>

                                {/* Stage Fit */}
                                <tr className="hover:bg-white transition-colors">
                                    <td className="py-6 pr-8">
                                        <span className="text-[10px] font-bold text-brand-blue uppercase tracking-widest">Primary Journey Stage</span>
                                    </td>
                                    {listings.map((item) => (
                                        <td key={item._id} className="p-6 text-center">
                                            <span className="text-[10px] font-bold uppercase text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                                                {item.journeyStage?.title || 'General'}
                                            </span>
                                        </td>
                                    ))}
                                </tr>

                                {/* Pricing Row */}
                                <tr className="hover:bg-white transition-colors">
                                    <td className="py-6 pr-8">
                                        <span className="text-[10px] font-bold text-brand-blue uppercase tracking-widest">Starting Price</span>
                                    </td>
                                    {listings.map((item) => (
                                        <td key={item._id} className="p-6 text-center">
                                            <span className="text-sm font-bold text-slate-700">
                                                {item.pricing?.startingFrom ? `$${item.pricing.startingFrom}/mo` : 'Contact for Quote'}
                                            </span>
                                        </td>
                                    ))}
                                </tr>

                                {/* Capability Matrix Row */}
                                <tr className="hover:bg-white transition-colors">
                                    <td className="py-6 pr-8">
                                        <span className="text-[10px] font-bold text-brand-blue uppercase tracking-widest">Core Capabilities</span>
                                    </td>
                                    {listings.map((item) => (
                                        <td key={item._id} className="p-6">
                                            <div className="flex flex-wrap justify-center gap-1.5">
                                                {item.features?.slice(0, 3).map((f: any, i: number) => (
                                                    <span key={i} className="text-[9px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                                                        {typeof f === 'string' ? f : f.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
