import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50/50">
            {/* Hero Skeleton */}
            <div className="bg-gradient-to-r from-gray-200 to-gray-300 h-[280px] w-full relative flex flex-col items-center pt-8">
                <div className="w-full max-w-6xl px-4 mb-8">
                    <Skeleton className="h-8 w-32 bg-white/20 rounded-full" />
                </div>
                <Skeleton className="h-10 w-2/3 max-w-lg bg-white/20 rounded-lg" />
            </div>

            <main className="flex-grow">
                {/* Main Card Skeleton */}
                <div className="max-w-6xl mx-auto px-4 -mt-32 relative z-10 mb-12">
                    <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-gray-100">
                        <div className="flex flex-col md:flex-row gap-10">
                            <Skeleton className="w-48 h-48 rounded-3xl shrink-0" />
                            <div className="flex-grow space-y-6">
                                <div className="space-y-2">
                                    <Skeleton className="h-10 w-3/4 rounded-lg" />
                                    <Skeleton className="h-6 w-1/2 rounded-md" />
                                </div>
                                <div className="flex gap-2">
                                    <Skeleton className="h-6 w-20 rounded-full" />
                                    <Skeleton className="h-6 w-24 rounded-full" />
                                </div>
                                <div className="space-y-2 pt-4">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-[90%]" />
                                    <Skeleton className="h-4 w-[80%]" />
                                </div>
                            </div>
                            <div className="w-full md:w-64 space-y-4">
                                <Skeleton className="h-14 w-full rounded-2xl" />
                                <Skeleton className="h-14 w-full rounded-2xl" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Grid Skeleton */}
                <div className="max-w-6xl mx-auto px-4 mb-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        <div className="lg:col-span-8 space-y-8">
                            <div className="bg-white rounded-3xl p-8 border border-gray-100 space-y-6">
                                <Skeleton className="h-8 w-48 rounded-lg" />
                                <div className="grid grid-cols-2 gap-4">
                                    {[1, 2, 3, 4, 5, 6].map((i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <Skeleton className="w-5 h-5 rounded-full" />
                                            <Skeleton className="h-4 w-32" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="lg:col-span-4 space-y-8">
                            <div className="bg-white rounded-3xl p-8 border border-gray-100 space-y-6">
                                <Skeleton className="h-8 w-48 rounded-lg" />
                                <div className="space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex gap-4">
                                            <Skeleton className="w-20 h-20 rounded-xl shrink-0" />
                                            <div className="space-y-2 flex-grow">
                                                <Skeleton className="h-4 w-full" />
                                                <Skeleton className="h-3 w-3/4" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
