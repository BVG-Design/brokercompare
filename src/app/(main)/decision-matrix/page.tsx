'use client';

import React, { useState, useEffect } from 'react';
import StageHeader from '@/components/workflow/StageHeader';
import SwimLane from '@/components/workflow/SwimLane';
import CompareDrawer from '@/components/workflow/CompareDrawer';
import ToolDetailPanel from '@/components/workflow/ToolDetailPanel';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Info } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const ASSOCIATIONS = ["people", "software", "processes_automations", "services"];

type ViewMode = 'DIRECTORY' | 'ARTICLE' | 'ACTIVITY';

export default function DecisionMatrixPage() {
    const [stages, setStages] = useState<any[]>([]);
    const [listings, setListings] = useState<any[]>([]);
    const [blogs, setBlogs] = useState<any[]>([]);
    const [guides, setGuides] = useState<any[]>([]);
    const [viewMode, setViewMode] = useState<ViewMode>('DIRECTORY');
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [compareListings, setCompareListings] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const {
                    fetchJourneyStages,
                    fetchDirectoryListingsMatrix,
                    fetchBlogPostsMatrix,
                    fetchGuidesMatrix
                } = await import('@/services/sanity');

                const [fetchedStages, fetchedListings, fetchedBlogs, fetchedGuides] = await Promise.all([
                    fetchJourneyStages(),
                    fetchDirectoryListingsMatrix(),
                    fetchBlogPostsMatrix(),
                    fetchGuidesMatrix()
                ]);
                setStages(fetchedStages);
                setListings(fetchedListings || []);
                setBlogs(fetchedBlogs || []);
                setGuides(fetchedGuides || []);
            } catch (err) {
                console.error("Failed to load matrix data:", err);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    const currentItems = viewMode === 'DIRECTORY' ? listings : viewMode === 'ARTICLE' ? blogs : guides;

    const filteredItems = currentItems.filter(item =>
        !searchQuery ||
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tagline?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCompare = (listing: any) => {
        if (compareListings.find(l => l._id === listing._id)) {
            setCompareListings(compareListings.filter(l => l._id !== listing._id));
        } else if (compareListings.length < 4) {
            setCompareListings([...compareListings, listing]);
        }
    };

    const removeFromCompare = (id: string) => {
        setCompareListings(compareListings.filter(l => l._id !== id));
    };

    return (
        <div className="min-h-screen bg-[#FDFDFC]">
            {/* Header */}
            <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 px-8 py-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 max-w-[1800px] mx-auto">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Badge variant="secondary" className="bg-brand-orange/10 text-brand-orange border-none font-bold text-[10px] uppercase px-2 py-0.5">
                                Strategic Tool
                            </Badge>
                        </div>
                        <h1 className="text-3xl font-bold text-brand-blue tracking-tighter uppercase">
                            Broker Tech Stack
                        </h1>
                        <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">
                            Map your journey from pre-start to ongoing success
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex bg-slate-100 p-1 rounded-xl mr-4">
                            <Button
                                variant={viewMode === 'ACTIVITY' ? 'default' : 'ghost'}
                                onClick={() => setViewMode('ACTIVITY')}
                                className={cn(
                                    "h-9 px-4 rounded-lg text-[10px] font-bold uppercase tracking-wider",
                                    viewMode === 'ACTIVITY' ? "bg-white text-brand-blue shadow-sm hover:bg-white" : "text-slate-500 hover:text-brand-blue"
                                )}
                            >
                                Activity View
                            </Button>
                            <Button
                                variant={viewMode === 'ARTICLE' ? 'default' : 'ghost'}
                                onClick={() => setViewMode('ARTICLE')}
                                className={cn(
                                    "h-9 px-4 rounded-lg text-[10px] font-bold uppercase tracking-wider",
                                    viewMode === 'ARTICLE' ? "bg-white text-brand-blue shadow-sm hover:bg-white" : "text-slate-500 hover:text-brand-blue"
                                )}
                            >
                                Article Mode
                            </Button>
                            <Button
                                variant={viewMode === 'DIRECTORY' ? 'default' : 'ghost'}
                                onClick={() => setViewMode('DIRECTORY')}
                                className={cn(
                                    "h-9 px-4 rounded-lg text-[10px] font-bold uppercase tracking-wider",
                                    viewMode === 'DIRECTORY' ? "bg-white text-brand-blue shadow-sm hover:bg-white" : "text-slate-500 hover:text-brand-blue"
                                )}
                            >
                                Directory
                            </Button>
                        </div>

                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                placeholder={`Search ${viewMode === 'ACTIVITY' ? 'activities' : viewMode.toLowerCase()}...`}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-11 w-64 bg-slate-50 border-slate-200 rounded-xl text-sm font-medium focus:bg-white transition-all shadow-sm"
                            />
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="overflow-x-auto bg-[#FDFDFC]">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-orange" />
                        <span className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Building Matrix...</span>
                    </div>
                ) : stages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[60vh] gap-6 text-center px-4">
                        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                            <Info className="w-8 h-8 text-amber-500 mb-2 mx-auto" />
                            <h2 className="text-sm font-bold text-brand-blue uppercase tracking-tight">No Journey Stages Found</h2>
                            <p className="text-xs font-medium text-slate-500 mt-2 max-w-sm">
                                The matrix requires "Journey Stage" documents to be present in Sanity.
                                Please ensure you have imported the `journeyStages.ndjson` and published them.
                            </p>
                        </div>
                        <Button
                            onClick={() => window.location.reload()}
                            className="bg-brand-blue text-white font-bold text-[10px] uppercase px-8"
                        >
                            Refresh Page
                        </Button>
                    </div>
                ) : (
                    <div className="min-w-[1600px] p-8">
                        <div className="rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/50 overflow-hidden">
                            <StageHeader stages={stages} />

                            {ASSOCIATIONS.map(assoc => (
                                <SwimLane
                                    key={assoc}
                                    association={assoc}
                                    stages={stages}
                                    items={filteredItems}
                                    viewMode={viewMode}
                                    onSelectItem={setSelectedItem}
                                    selectedItem={selectedItem}
                                    onCompare={handleCompare}
                                />
                            ))}
                        </div>

                        {/* Legend / Info */}
                        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl px-4">
                            <div className="flex items-start gap-4">
                                <div className="mt-1 p-2 bg-blue-50 rounded-lg text-blue-600">
                                    <Info size={16} />
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-bold uppercase text-brand-blue mb-1">Gap Analysis</h4>
                                    <p className="text-[10px] font-medium text-slate-500 leading-relaxed">
                                        Empty cells represent potential bottlenecks or areas where your business logic could be further automated.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Task-based planning popup or Detail Panel */}
            <AnimatePresence>
                {selectedItem && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[90]"
                            onClick={() => setSelectedItem(null)}
                        />
                        {selectedItem._type === 'directoryListing' ? (
                            <ToolDetailPanel
                                listing={selectedItem}
                                onClose={() => setSelectedItem(null)}
                                onCompare={handleCompare}
                            />
                        ) : (
                            <div className="fixed top-0 right-0 w-[500px] h-full bg-white z-[100] shadow-2xl p-8 overflow-y-auto">
                                <Button variant="ghost" className="mb-4" onClick={() => setSelectedItem(null)}>Close</Button>
                                <h2 className="text-2xl font-bold mb-4">{selectedItem.title}</h2>
                                <p className="text-slate-600">{selectedItem.summary || selectedItem.description}</p>
                                <div className="mt-8">
                                    <Button onClick={() => window.open(`/blog/${selectedItem.slug}`, '_blank')}>Read Full Post</Button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </AnimatePresence>

            {/* Compare Drawer */}
            <CompareDrawer
                listings={compareListings}
                onRemove={removeFromCompare}
                onClear={() => setCompareListings([])}
            />
        </div>
    );
}
