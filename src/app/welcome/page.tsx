'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/use-auth';

export default function WelcomePage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const supabase = createClientComponentClient();

    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [comment, setComment] = useState<string>('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;

            try {
                const { data, error } = await supabase
                    .from('user_profiles')
                .select('first_name, last_name')
                .eq('id', user.id)
                .single();

                if (data?.first_name) {
                    setFirstName(data.first_name);
                } else {
                    setFirstName('');
                }
                if (data?.last_name) {
                    setLastName(data.last_name);
                } else {
                    setLastName('');
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

        if (!comment.trim()) {
            setError('Please tell us what brought you here.');
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            const answer = comment.trim();
            const { data: profile, error: profileError } = await supabase
                .from('user_profiles')
                .select('id')
                .eq('id', user.id)
                .single();

            if (profileError) throw profileError;

            const entry = {
                answer,
                first_name: firstName || null,
                last_name: lastName || null,
                email: user.email,
                created_at: new Date().toISOString(),
                created_by: user.id,
            };

            const { data: existing } = await supabase
                .from('what_brought_you_here')
                .select('id')
                .eq('created_by', user.id)
                .maybeSingle();

            let mutationError = null;
            if (existing?.id) {
                const { error } = await supabase
                    .from('what_brought_you_here')
                    .update(entry)
                    .eq('id', existing.id);
                mutationError = error;
            } else {
                const { error } = await supabase
                    .from('what_brought_you_here')
                    .insert(entry);
                mutationError = error;
            }

            if (mutationError) throw mutationError;

            await supabase
                .from('user_profiles')
                .update({ onboarding_completed: true })
                .eq('id', user.id);

            router.push('/dashboard/broker');
        } catch (err: any) {
            console.error('Error submitting response:', err);
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
                            <p className="font-semibold text-gray-900">What brought you here?</p>
                            <Textarea
                                placeholder="Tell us what you'd like us to build or explore..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows={5}
                                required
                            />
                        </div>

                        {error && <p className="text-red-600 text-sm text-center">{error}</p>}

                        <Button
                            type="submit"
                            className="w-full bg-brand-orange hover:bg-orange-600 text-white font-bold py-6 text-lg"
                            disabled={submitting}
                        >
                            {submitting ? <Loader2 className="animate-spin mr-2" /> : 'Submit'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
