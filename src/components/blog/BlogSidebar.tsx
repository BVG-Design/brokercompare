'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ChevronRight, MessageCircle, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { navGroups } from '@/lib/blog-categories';

export function BlogSidebar() {
    const searchParams = useSearchParams();
    const currentCategory = searchParams.get('category');

    return (
        <div className="w-64 flex-shrink-0 bg-primary text-primary-foreground h-screen sticky top-0 overflow-y-auto border-r border-primary-foreground/10 hidden lg:flex flex-col">
            <div className="p-4">
                <h2 className="text-lg font-bold font-headline mb-4 text-white p-2">Resources</h2>

                {/* Manual Accordion-like structure or specialized component if available. 
            Since we need custom styling, let's use the standard Tailwind logic for simplicity 
            or if the user strongly implied a specific behavior, we can use the Accordion component.
            User asked "make each area of topic on the side menu an accordion".
            I will use the Radix/Shadcn Accordion if imported, or just standard details/summary for zero-dep.
            Actually, let's use state for a smooth custom accordion to match the "Linear" look exactly without fighting default component styles. 
        */}
                <div className="space-y-4">
                    {navGroups.map((group, groupIndex) => (
                        <CollapsibleGroup key={group.label} group={group} currentCategory={currentCategory} defaultOpen={true} />
                    ))}
                </div>
            </div>

            <div className="mt-8 p-4 border-t border-primary-foreground/10">
                <div className="space-y-1">
                    <Link
                        href="/recommendations"
                        className="flex items-center gap-3 px-3 py-1.5 rounded-md text-sm text-primary-foreground/70 hover:bg-primary-foreground/5 hover:text-white transition-colors"
                    >
                        <Sparkles className="w-4 h-4" />
                        <span>AI Recommendations</span>
                    </Link>
                    <Link
                        href="/workflow-optimisation"
                        className="w-full flex items-center gap-3 px-3 py-1.5 rounded-md text-sm text-primary-foreground/70 hover:bg-primary-foreground/5 hover:text-white transition-colors text-left"
                    >
                        <MessageCircle className="w-4 h-4" />
                        <span>Chat with a Human</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}

// Helper component for the accordion section
function CollapsibleGroup({ group, currentCategory, defaultOpen }: { group: any, currentCategory: string | null, defaultOpen: boolean }) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="space-y-1">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full px-2 py-1 text-sm font-bold text-white uppercase tracking-wider hover:opacity-80 transition-opacity"
            >
                <div className="flex items-center gap-2">
                    {group.label}
                    {group.badge && (
                        <Badge variant="secondary" className="text-[10px] px-1.5 h-5 bg-secondary text-secondary-foreground hover:bg-secondary/90 border-0">
                            {group.badge}
                        </Badge>
                    )}
                </div>
                <ChevronRight className={cn("w-4 h-4 transition-transform", isOpen ? "rotate-90" : "")} />
            </button>

            {isOpen && (
                <ul className="space-y-0.5 animate-in slide-in-from-top-1 fade-in duration-200">
                    {group.items.map((item: any) => {
                        const isActive = currentCategory === item.category ||
                            (!currentCategory && item.category === 'getting-started');

                        return (
                            <li key={item.category}>
                                <Link
                                    href={`/blog?category=${item.category}`}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-1 rounded-md text-xs sm:text-sm transition-colors",
                                        isActive
                                            ? "bg-primary-foreground/10 text-white font-medium shadow-sm"
                                            : "text-primary-foreground/70 hover:bg-primary-foreground/5 hover:text-white"
                                    )}
                                >
                                    <span>{item.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
