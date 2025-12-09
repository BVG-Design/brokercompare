'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';

export default function WelcomePage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const supabase = createClientComponentClient();

    const [firstName, setFirstName] = useState<string>('');
    const [selectedOption, setSelectedOption] = useState<string>('');
    const [otherText, setOtherText] = useState<string>('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;

            try {
                const { data, error } = await supabase
                    .from('user_profiles')
                    .select('first_name')
                    .eq('id', user.id)
                    .single();

                if (data?.first_name) {
                    setFirstName(data.first_name);
                } else {
                    setFirstName('');
                }
            } catch (err) {
                console.error('Error fetching profile:', err);
            }
        };

        fetchProfile();
    }, [user, supabase]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setSubmitting(true);
        setError(null);

        const voteData = {
            created_by: user.id,
            vote_dashboard: selectedOption === 'A',
            vote_community: selectedOption === 'B',
            vote_something: selectedOption === 'C',
            something_else: selectedOption === 'C' ? otherText : null,
        };

        try {
            // Using upsert to ensure one vote per person (created_by is unique)
            const { error: voteError } = await supabase
                .from('vote')
                .upsert(voteData, { onConflict: 'created_by' });

            if (voteError) throw voteError;

            // Also mark onboarding as completed in user_profiles if needed, 
            // but user only asked to send data to vote table. 
            // I'll keep the redirect to thank you.

            router.push('/welcome/thank-you');
        } catch (err: any) {
            console.error('Error submitting vote:', err);
            setError('Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
            </div>
        );
    }

    if (!user) {
        router.push('/login');
        return null;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-brand-blue px-4 py-12">
            <Card className="w-full max-w-2xl bg-white shadow-xl animate-in fade-in zoom-in duration-300">
                <CardHeader className="text-center space-y-4">
                    <CardTitle className="text-3xl font-bold text-gray-900">
                        Hi {firstName} and welcome to BrokerTools
                    </CardTitle>
                    <CardDescription className="text-lg text-gray-600 max-w-lg mx-auto">
                        This is where we unpack the tools, systems, and strategies that help brokers optimise the way they work.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-8">
                    <div className="flex flex-col md:flex-row items-center gap-6 bg-blue-50 p-6 rounded-lg">
                        <div className="w-20 h-20 rounded-full flex-shrink-0 overflow-hidden border-2 border-white shadow-md">
                            <img
                                src="https://izjekecdocekznhwqivo.supabase.co/storage/v1/object/public/Media/simbaHost.jpg"
                                alt="Simba"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <p className="text-gray-700 italic">
                            "I'm Simba - your host, and today we would love to know what brought you here!
                            Feel free to comment below and let us know what you would like us to build next."
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <p className="font-semibold text-gray-900">Click to choose:</p>

                            <div
                                className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedOption === 'A' ? 'border-brand-blue bg-blue-50 ring-1 ring-brand-blue' : 'border-gray-200 hover:border-gray-300'}`}
                                onClick={() => setSelectedOption('A')}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedOption === 'A' ? 'border-brand-blue' : 'border-gray-300'}`}>
                                        {selectedOption === 'A' && <div className="w-3 h-3 rounded-full bg-brand-blue" />}
                                    </div>
                                    <div>
                                        <span className="font-bold text-gray-900">A) Dashboard</span>
                                        <p className="text-sm text-gray-600">For you to see your saved searches or comparison</p>
                                    </div>
                                </div>
                            </div>

                            <div
                                className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedOption === 'B' ? 'border-brand-blue bg-blue-50 ring-1 ring-brand-blue' : 'border-gray-200 hover:border-gray-300'}`}
                                onClick={() => setSelectedOption('B')}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedOption === 'B' ? 'border-brand-blue' : 'border-gray-300'}`}>
                                        {selectedOption === 'B' && <div className="w-3 h-3 rounded-full bg-brand-blue" />}
                                    </div>
                                    <div>
                                        <span className="font-bold text-gray-900">B) Community Centre</span>
                                        <p className="text-sm text-gray-600">For you to chat and learn from other brokers and software providers</p>
                                    </div>
                                </div>
                            </div>

                            <div
                                className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedOption === 'C' ? 'border-brand-blue bg-blue-50 ring-1 ring-brand-blue' : 'border-gray-200 hover:border-gray-300'}`}
                                onClick={() => setSelectedOption('C')}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedOption === 'C' ? 'border-brand-blue' : 'border-gray-300'}`}>
                                        {selectedOption === 'C' && <div className="w-3 h-3 rounded-full bg-brand-blue" />}
                                    </div>
                                    <div>
                                        <span className="font-bold text-gray-900">C) Something else</span>
                                        <p className="text-sm text-gray-600">Tell us what</p>
                                    </div>
                                </div>
                            </div>

                            {selectedOption === 'C' && (
                                <div className="animate-in fade-in slide-in-from-top-2">
                                    <Input
                                        placeholder="Tell us what you'd like us to build..."
                                        value={otherText}
                                        onChange={(e) => setOtherText(e.target.value)}
                                        required
                                        className="mt-2"
                                    />
                                </div>
                            )}
                        </div>

                        {error && <p className="text-red-600 text-sm text-center">{error}</p>}

                        <Button
                            type="submit"
                            className="w-full bg-brand-orange hover:bg-orange-600 text-white font-bold py-6 text-lg"
                            disabled={submitting || !selectedOption}
                        >
                            {submitting ? <Loader2 className="animate-spin mr-2" /> : 'Submit Vote'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
