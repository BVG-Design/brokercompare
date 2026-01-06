'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Shield, Zap, TrendingUp, Star } from 'lucide-react';
import { cn } from "@/lib/utils";

const associationStyles: Record<string, any> = {
    people: { border: "border-amber-100", accent: "bg-amber-500", icon: Shield },
    software: { border: "border-blue-100", accent: "bg-blue-500", icon: Zap },
    processes_automations: { border: "border-violet-100", accent: "bg-violet-500", icon: TrendingUp },
    services: { border: "border-emerald-100", accent: "bg-emerald-500", icon: Star }
};

interface ArticleCardProps {
    article: any;
    onSelect?: (article: any) => void;
}

export default function ArticleCard({ article, onSelect }: ArticleCardProps) {
    const primaryAssoc = article.journeyAssociations?.[0] || 'software';
    const styles = associationStyles[primaryAssoc] || associationStyles.software;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
            className={cn(
                "group relative rounded-2xl border-2 p-4 cursor-pointer transition-all duration-300 bg-white shadow-sm",
                styles.border
            )}
            onClick={() => onSelect?.(article)}
        >
            <div className={cn("absolute top-0 left-6 w-10 h-1 rounded-b-full", styles.accent)} />

            <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1">
                    <h4 className="font-black text-slate-900 text-xs uppercase tracking-tight line-clamp-2">{article.title}</h4>
                </div>
                {article.logo && (
                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-100 bg-slate-50 flex-shrink-0">
                        <img src={article.logo} alt="" className="w-full h-full object-cover" />
                    </div>
                )}
            </div>

            {article.summary && (
                <p className="text-[10px] font-medium text-slate-500 line-clamp-2 mb-3 leading-relaxed">
                    {article.summary}
                </p>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                <div className="flex items-center gap-1.5">
                    <BookOpen className="w-3 h-3 text-slate-400" />
                    <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Article</span>
                </div>
                {article.readTime && (
                    <div className="flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5 text-slate-400" />
                        <span className="text-[9px] font-bold text-slate-500">{article.readTime} min</span>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
