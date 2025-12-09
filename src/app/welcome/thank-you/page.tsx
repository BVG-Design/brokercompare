'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Sparkles, Search, Users } from 'lucide-react';

export default function ThankYouPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex items-center justify-center bg-brand-blue px-4 py-12">
            <Card className="w-full max-w-2xl bg-white shadow-xl animate-in fade-in zoom-in duration-300">
                <CardHeader className="text-center space-y-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="w-8 h-8 text-green-600" />
                    </div>
                    <CardTitle className="text-3xl font-bold text-gray-900">
                        Thank you for your feedback!
                    </CardTitle>
                    <CardDescription className="text-lg text-gray-600">
                        You ROCK &#129304; &#x1F436;
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-8">
                    <div className="space-y-4">
                        <h3 className="text-center font-bold text-gray-900 text-xl">What do you want to do next?</h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Button
                                variant="outline"
                                className="h-auto py-6 flex flex-col items-center gap-2 hover:border-brand-blue hover:bg-blue-50"
                                onClick={() => router.push('/dashboard/broker')}
                            >
                                <Search className="w-6 h-6 text-brand-blue" />
                                <span>Browse More</span>
                            </Button>

                            <Button
                                variant="outline"
                                className="h-auto py-6 flex flex-col items-center gap-2 hover:border-brand-purple hover:bg-purple-50"
                                onClick={() => router.push('/ai-recommendations')}
                            // Assuming route exists or placeholder
                            >
                                <Sparkles className="w-6 h-6 text-brand-purple" />
                                <span>Get AI Recommendations</span>
                            </Button>

                            <Button
                                variant="outline"
                                className="h-auto py-6 flex flex-col items-center gap-2 hover:border-brand-orange hover:bg-orange-50"
                                onClick={() => {
                                    // Simple share logic or copy link
                                    navigator.clipboard.writeText('https://brokertools.com.au');
                                    alert('Link copied to clipboard!');
                                }}
                            >
                                <Users className="w-6 h-6 text-brand-orange" />
                                <span>Share with a Friend</span>
                            </Button>
                        </div>
                    </div>

                    <div className="text-center">
                        <Link href="/" className="text-gray-500 hover:text-gray-900 text-sm underline">
                            Return to Home
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
