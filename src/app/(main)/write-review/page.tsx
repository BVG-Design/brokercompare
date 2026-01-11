'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Mail, Image as ImageIcon, Sparkles, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';
import { fetchDirectoryListings } from '@/services/sanity';
import { toast } from '@/hooks/use-toast';

export default function WriteReviewPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [partners, setPartners] = useState<any[]>([]);
    const [selectedPartner, setselectedPartner] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Debounced search logic could be added here, simplified for now
    React.useEffect(() => {
        const searchpartners = async () => {
            if (searchTerm.length < 2) {
                setPartners([]);
                return;
            }

            setIsLoading(true);
            try {
                const results = await fetchDirectoryListings({ search: searchTerm });
                // Map Sanity results to a simplified format if needed, similar to directory/page.tsx logic
                // Assuming fetchDirectoryListings returns a format we can mostly use
                const mappedpartners = results.map(p => ({
                    id: p.id,
                    company_name: p.name,
                    logo_url: p.logoUrl,
                    slug: p.slug
                })).slice(0, 5); // Limit results
                setPartners(mappedpartners);
            } catch (error) {
                console.error("Failed to search partners", error);
            } finally {
                setIsLoading(false);
            }
        };

        const timer = setTimeout(searchpartners, 300);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handleSelectpartner = (partner: any) => {
        setselectedPartner(partner);
        setSearchTerm(partner.company_name); // Fill input with name
        setPartners([]); // Clear dropdown
    };

    const handleStartReview = () => {
        if (!user) {
            toast({
                title: "Login Required",
                description: "Please login to write a review.",
                variant: "destructive"
            });
            // Redirect to login handled by Auth flow if we link there, or custom
            router.push('/login?next=/write-review');
            return;
        }

        // Feature not ready yet
        toast({
            title: "Coming Soon",
            description: `Review form for ${selectedPartner?.company_name} is under construction.`,
        });
    };

    return (
        <main className="min-h-screen bg-background">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground py-20">
                <div className="container mx-auto px-4 md:px-6 text-center">
                    <Badge className="bg-secondary text-secondary-foreground mb-4 font-semibold px-4 py-1">Feature Coming Soon</Badge>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 font-headline">
                        Help a Broker out - Write a Review.
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-primary-foreground/90">
                        Nobody knows a software or a service better than a fellow broker. 
                        So share your insights and help another broker optimise the way they work.
                    </p>
                </div>
            </div>

            {/* Search Section */}
            <div className="container mx-auto px-4 md:px-6 -mt-8 relative z-10">
                <Card className="shadow-xl max-w-3xl mx-auto border-0">
                    <CardContent className="p-6 md:p-8">
                        <h2 className="text-2xl font-bold mb-6 text-center font-headline">Review a Product or Service</h2>

                        <div className="relative max-w-xl mx-auto">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Search software or services to review..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setselectedPartner(null); // Reset selection on edit
                                    }}
                                    className="pl-12 h-14 text-lg"
                                />
                            </div>

                            {/* Dropdown Results */}
                            {partners.length > 0 && !selectedPartner && (
                                <div className="absolute top-full left-0 right-0 bg-popover border rounded-md shadow-lg mt-1 z-50 overflow-hidden">
                                    {partners.map((partner) => (
                                        <button
                                            key={partner.id}
                                            onClick={() => handleSelectpartner(partner)}
                                            className="w-full text-left px-4 py-3 hover:bg-accent hover:text-accent-foreground flex items-center transition-colors"
                                        >
                                            {/* Fallback for logo if needed */}
                                            <div className="w-8 h-8 rounded bg-muted mr-3 flex items-center justify-center text-xs font-bold text-muted-foreground">
                                                {partner.company_name?.substring(0, 2).toUpperCase()}
                                            </div>
                                            <span className="font-medium">{partner.company_name}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                            {isLoading && searchTerm.length >= 2 && partners.length === 0 && (
                                <div className="absolute top-full left-0 right-0 bg-popover border rounded-md shadow-lg mt-1 z-50 p-4 text-center text-muted-foreground">
                                    Loading...
                                </div>
                            )}
                        </div>

                        {/* Action Area */}
                        <div className="mt-8 text-center space-y-4">
                            {selectedPartner ? (
                                <div className="bg-accent/10 p-6 rounded-lg border border-accent/20 animate-in fade-in zoom-in duration-300">
                                    <h3 className="text-lg font-semibold mb-2">Reviewing: <span className="text-primary">{selectedPartner.company_name}</span></h3>
                                    {!user ? (
                                        <div className="space-y-3">
                                            <p className="text-sm text-muted-foreground">Please login to verify your professional status.</p>
                                            <Button onClick={handleStartReview} size="lg" className="w-full max-w-xs font-bold bg-secondary hover:bg-secondary/90">
                                                Login to Review
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-center gap-2 mb-2">
                                                <Badge variant="outline" className="border-green-500 text-green-600 bg-green-50">Verified Broker</Badge>
                                            </div>
                                            <div className="flex items-center justify-center gap-2 mb-4">
                                                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
                                                    <input type="checkbox" className="rounded border-gray-300 text-secondary focus:ring-secondary" />
                                                    Post anonymously
                                                </label>
                                            </div>
                                            <div className="relative group">
                                                <div className="absolute -inset-0.5 bg-gradient-to-r from-secondary to-accent rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                                                <Button onClick={handleStartReview} size="lg" className="relative w-full max-w-xs font-bold shadow-xl">
                                                    Start Review <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded-full">Coming Soon</span>
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="h-16 flex items-center justify-center text-muted-foreground text-sm italic">
                                    Select a software or service above to begin.
                                </div>
                            )}
                        </div>

                    </CardContent>
                </Card>
            </div>

            {/* Best Practices Section */}
            <div className="container mx-auto px-4 md:px-6 py-16 max-w-4xl">
                <h3 className="text-lg font-bold text-gray-900 mb-8 border-b pb-2">Best practices to get your review approved</h3>

                <div className="space-y-8">
                    <div className="flex gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                            <Mail className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-1">Use Your Work Email</h4>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Providing your work email helps our moderators verify you and your professional experience more quickly.
                                Using Gmail, Hotmail, or any non-business email address makes this process more difficult.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                            <MessageSquare className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-1">Be Authentic</h4>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Write about your real experiences and opinions related to the software you are evaluating.
                                ChatGPT or generative AI can be helpful, but allowing them to write everything does not benefit our community as much.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                            <ImageIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-1">Share a Screenshot</h4>
                            <p className="text-gray-600 text-sm leading-relaxed mb-2">
                                Please make sure to add a screenshot so we can confirm that you are a user of the software.
                                This step is important and can make a big difference in approving your review.
                            </p>
                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-r text-xs text-yellow-800 font-medium flex items-start gap-2">
                                <span className="mt-0.5">⚠️</span>
                                <span>Note: When taking screenshots, please use a tool like Awesome Screenshots to blur private client details.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
