'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users, Monitor, Workflow, Briefcase, Shield, Zap, TrendingUp } from 'lucide-react';
import { cn } from "@/lib/utils";
import DecisionCard from './DecisionCard';
import ArticleCard from './ArticleCard';
import TaskCard from './TaskCard';
import { Star } from 'lucide-react';

const laneConfig: Record<string, any> = {
    people: {
        label: "People",
        icon: Shield,
        color: "bg-amber-500",
        lightBg: "bg-amber-50/30",
        borderColor: "border-amber-100"
    },
    software: {
        label: "Software",
        icon: Zap,
        color: "bg-blue-500",
        lightBg: "bg-blue-50/30",
        borderColor: "border-blue-100"
    },
    processes_automations: {
        label: "Process & Automations",
        icon: TrendingUp,
        color: "bg-violet-500",
        lightBg: "bg-violet-50/30",
        borderColor: "border-violet-100"
    },
    services: {
        label: "Services",
        icon: Star,
        color: "bg-emerald-500",
        lightBg: "bg-emerald-50/30",
        borderColor: "border-emerald-100"
    }
};

interface SwimLaneProps {
    association: string;
    stages: any[];
    items: any[];
    viewMode: 'DIRECTORY' | 'ARTICLE' | 'TASK';
    onSelectItem: (item: any) => void;
    selectedItem?: any;
    onCompare?: (item: any) => void;
}

export default function SwimLane({
    association,
    stages,
    items,
    viewMode,
    onSelectItem,
    selectedItem,
    onCompare
}: SwimLaneProps) {
    const config = laneConfig[association] || laneConfig.software;
    const Icon = config.icon;

    return (
        <div className={cn(
            "flex border-b last:border-b-0 group/lane",
            config.borderColor
        )}>
            {/* Lane Label */}
            <div className={cn(
                "w-48 shrink-0 p-6 border-r sticky left-0 z-10 transition-colors",
                config.lightBg,
                config.borderColor
            )}>
                <div className="flex items-center gap-3">
                    <div className={cn("p-2.5 rounded-xl text-white shadow-lg", config.color)}>
                        <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-black text-slate-900 text-[10px] uppercase tracking-wider">{config.label}</span>
                </div>
            </div>

            {/* Stage Cells */}
            {stages.map((stage) => {
                const stageItems = items.filter(item => {
                    const matchesAssoc = item.journeyAssociations?.includes(association);
                    if (!matchesAssoc) return false;

                    if (item._type === 'blog') {
                        return item.journeyStageIds?.includes(stage.id);
                    }
                    return item.journeyStageId === stage.id;
                });

                return (
                    <div
                        key={stage.id}
                        className={cn(
                            "flex-1 min-w-[240px] p-4 border-r last:border-r-0 transition-colors",
                            config.borderColor,
                            stageItems.length === 0 && "bg-slate-50/10"
                        )}
                    >
                        <div className="space-y-4 min-h-[140px] flex flex-col justify-center">
                            {stageItems.map((item) => {
                                if (viewMode === 'ARTICLE' && item._type === 'blog') {
                                    return <ArticleCard key={item._id} article={item} onSelect={onSelectItem} />;
                                }
                                if (viewMode === 'TASK' && item._type === 'guide') {
                                    return <TaskCard key={item._id} guide={item} onSelect={onSelectItem} />;
                                }
                                if (viewMode === 'DIRECTORY' && item._type === 'directoryListing') {
                                    return (
                                        <DecisionCard
                                            key={item._id}
                                            listing={item}
                                            onSelect={onSelectItem}
                                            isSelected={selectedItem?._id === item._id}
                                            onCompare={onCompare}
                                        />
                                    );
                                }
                                return null;
                            })}

                            {stageItems.length === 0 && (
                                <div className="flex flex-col items-center justify-center opacity-0 group-hover/lane:opacity-100 transition-opacity">
                                    <div className="w-8 h-8 rounded-full border border-dashed border-slate-200 flex items-center justify-center">
                                        <div className="w-1 h-1 rounded-full bg-slate-200" />
                                    </div>
                                    <span className="text-[8px] font-black text-slate-300 mt-2 uppercase tracking-widest">Growth Opportunity</span>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
