'use client';

import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';
import { Loader2, MessageSquarePlus } from 'lucide-react';

interface SuggestReviewModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function SuggestReviewModal({
    open,
    onOpenChange,
}: SuggestReviewModalProps) {
    const { user, loading: authLoading } = useAuth();
    const [suggestion, setSuggestion] = useState('');
    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Reset form when dialog opens/closes
    useEffect(() => {
        if (!open) {
            setSuggestion('');
            setFirstName('');
            setEmail('');
            setError(null);
            setSuccess(false);
        }
    }, [open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validation
        if (!suggestion.trim()) {
            setError('Please tell us what you would like us to review');
            return;
        }

        if (!user && (!firstName.trim() || !email.trim())) {
            setError('Please enter your first name and email');
            return;
        }

        setSubmitting(true);

        try {
            // Reuse feedback API or create a new one. For now, using feedback API with a prefix.
            const response = await fetch('/api/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    feedback: `[SUGGESTION] ${suggestion.trim()}`,
                    pageUrl: typeof window !== 'undefined' ? window.location.href : 'Header Suggestion',
                    isLoggedIn: !!user,
                    userId: user?.id || null,
                    userEmail: user?.email || email.trim(),
                    userName: user ? (user.user_metadata?.first_name || user.email) : firstName.trim(),
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to submit suggestion');
            }

            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'An error occurred. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (success) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[425px] bg-brand-cream border-brand-blue/10 text-brand-blue">
                    <DialogHeader>
                        <div className="flex justify-center mb-4">
                            <div className="bg-brand-green/10 p-4 rounded-full">
                                <MessageSquarePlus className="h-8 w-8 text-brand-green" />
                            </div>
                        </div>
                        <DialogTitle className="text-center text-2xl font-bold">Got it!</DialogTitle>
                        <DialogDescription className="text-center text-brand-blue/70">
                            Thanks for the suggestion. We'll look into it and see if we can get a review up soon!
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-center pt-6">
                        <Button
                            onClick={() => onOpenChange(false)}
                            className="w-full bg-brand-blue hover:bg-brand-blue/90 text-white font-bold py-6 text-lg"
                        >
                            Back to Browsing
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] bg-brand-cream border-brand-blue/10 text-brand-blue">
                <DialogHeader>
                    <div className="flex items-center gap-4 mb-2">
                        <img
                            src="https://izjekecdocekznhwqivo.supabase.co/storage/v1/object/public/Media/Simba%20Digging%20Profile.png"
                            alt="BrokerTools"
                            className="h-16 w-16 rounded-xl object-contain bg-white p-1 shadow-sm"
                        />
                        <div>
                            <DialogTitle className="text-2xl font-bold">Suggest a Review</DialogTitle>
                            <DialogDescription className="text-brand-blue/70">
                                Got a Product or Service you want us to review? Let us know here.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                    <div className="space-y-2">
                        <label htmlFor="suggestion" className="text-sm font-semibold">
                            What should we review? <span className="text-brand-orange">*</span>
                        </label>
                        <Textarea
                            id="suggestion"
                            value={suggestion}
                            onChange={(e) => setSuggestion(e.target.value)}
                            placeholder="Tell us the name of the software or service..."
                            className="min-h-[100px] bg-white border-brand-blue/20 text-brand-blue placeholder:text-brand-blue/30"
                            required
                        />
                    </div>

                    {!user && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="firstName" className="text-sm font-semibold">
                                    First Name <span className="text-brand-orange">*</span>
                                </label>
                                <Input
                                    id="firstName"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    placeholder="Your name"
                                    className="bg-white border-brand-blue/20 text-brand-blue placeholder:text-brand-blue/30 h-11"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-semibold">
                                    Email Address <span className="text-brand-orange">*</span>
                                </label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@email.com"
                                    className="bg-white border-brand-blue/20 text-brand-blue placeholder:text-brand-blue/30 h-11"
                                    required
                                />
                            </div>
                        </div>
                    )}

                    {user && (
                        <p className="text-xs text-brand-blue/60 italic">
                            Sending as {user.user_metadata?.first_name || user.email}
                        </p>
                    )}

                    {error && (
                        <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100">
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={submitting || authLoading}
                        className="w-full bg-brand-orange hover:bg-orange-600 text-white font-bold py-6 text-lg shadow-lg"
                    >
                        {submitting ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            'Send Suggestion'
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
