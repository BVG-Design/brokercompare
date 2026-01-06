'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    PlayCircle,
    UserPlus,
    FileText,
    CheckCircle,
    Repeat,
    Clock,
    Zap
} from 'lucide-react';
import { cn } from "@/lib/utils";

const stageIcons: Record<string, any> = {
    'pre-start': PlayCircle,
    'client-acquisition': UserPlus,
    'application': FileText,
    'settlement': CheckCircle,
    'post-settlement': Clock,
    'ongoing': Repeat,
    'ninja-mode': Zap
};

const stageColors: Record<string, string> = {
    'pre-start': "from-slate-500 to-slate-600",
    'client-acquisition': "from-sky-500 to-sky-600",
    'application': "from-indigo-500 to-indigo-600",
    'settlement': "from-emerald-500 to-emerald-600",
    'post-settlement': "from-orange-500 to-orange-600",
    'ongoing': "from-rose-500 to-rose-600",
    'ninja-mode': "from-purple-600 to-purple-700"
};

interface JourneyStage {
    id: string;
    title: string;
    slug: string;
    position: number;
    description?: string;
}

interface StageHeaderProps {
    stages: JourneyStage[];
}

export default function StageHeader({ stages }: StageHeaderProps) {
    return (
        <div className="flex border-b border-slate-200 sticky top-0 z-20 bg-white/95 backdrop-blur-sm">
            {/* Empty cell for lane labels */}
            <div className="w-48 shrink-0 p-4 border-r border-slate-200 bg-slate-50/50">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Category
                </span>
            </div>

            {/* Stage Headers */}
            {stages.map((stage, index) => {
                const Icon = stageIcons[stage.slug] || FileText;
                const gradient = stageColors[stage.slug] || stageColors['pre-start'];

                return (
                    <motion.div
                        key={stage.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex-1 min-w-[240px] p-4 border-r last:border-r-0 border-slate-200"
                    >
                        <div className="flex items-center gap-3">
                            <div className={cn(
                                "p-2 rounded-xl bg-gradient-to-br text-white shadow-md shadow-slate-200",
                                gradient
                            )}>
                                <Icon className="w-4 h-4" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 text-xs tracking-tight uppercase">{stage.title}</h3>
                                <p className="text-[10px] text-slate-500 leading-tight line-clamp-1">{stage.description}</p>
                            </div>
                        </div>

                        {/* Stage Progress Indicator */}
                        <div className="mt-4 flex items-center gap-1.5 px-0.5">
                            {stages.map((_, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        "h-1 flex-1 rounded-full transition-all duration-500",
                                        i <= index ? "bg-slate-900 shadow-sm" : "bg-slate-100"
                                    )}
                                />
                            ))}
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}
