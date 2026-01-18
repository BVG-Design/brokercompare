'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { ComparisonProduct } from '@/types/comparison';
import { submitQuestion } from '@/app/(main)/actions/ask-question';

interface AskQuestionModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    listingName?: string;
    listingCategory?: string | null;
    listingSlug?: string;
    products?: ComparisonProduct[];
}

export default function AskQuestionModal({
    open,
    onOpenChange,
    listingName = 'Broker Compare',
    listingCategory,
    listingSlug = '',
    products = []
}: AskQuestionModalProps) {
    const [question, setQuestion] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const options = useMemo(() => {
        const productOptions = products.map((product) => ({
            value: `product:${product.slug}`,
            label: product.name,
            hint: 'Question about this specific software/service'
        }));

        const categoryLabel = (() => {
            if (listingCategory) return listingCategory;
            const words = listingSlug.split('-').filter(Boolean).map((word) => word.charAt(0).toUpperCase() + word.slice(1));
            return words.length ? words.join(' ') : listingName;
        })();

        const categoryOption = {
            value: `category:${listingSlug || 'general'}`,
            label: categoryLabel,
            hint: 'General question about this category'
        };

        const seen = new Set<string>();
        return [categoryOption, ...productOptions].filter((opt) => {
            if (seen.has(opt.value)) return false;
            seen.add(opt.value);
            return true;
        });
    }, [listingName, listingSlug, listingCategory, products]);

    const [selectedOption, setSelectedOption] = useState<string>('');

    useEffect(() => {
        if (open) {
            setQuestion('');
            setFirstName('');
            setLastName('');
            setEmail('');
            setSubmitted(false);
            setSubmitting(false);
            setSelectedOption(options[0]?.value || '');
        }
    }, [open, options]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!question.trim() || !firstName.trim() || !lastName.trim() || !email.trim()) {
            return;
        }

        setSubmitting(true);

        try {
            const payload = {
                firstName,
                lastName,
                email,
                Question: question,
                category: selectedOption,
                listingslug: listingSlug,
                listingname: listingName
            };

            const result = await submitQuestion(payload);

            if (result.error) {
                alert('Failed to submit question. Please try again.');
                setSubmitting(false);
                return;
            }

            setSubmitted(true);
        } catch (err) {
            console.error('Submission exception:', err);
            alert('An error occurred.');
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg bg-white border-4 border-brand-blue shadow-xl text-gray-800">
                {submitted ? (
                    <>
                        <DialogHeader>
                            <DialogTitle className="text-center">Thanks for your question!</DialogTitle>
                        </DialogHeader>
                        <p className="text-sm text-gray-700 text-center">
                            We'll route this to the right team based on the topic you picked.
                        </p>
                        <div className="pt-4">
                            <Button className="w-full" onClick={() => onOpenChange(false)}>
                                Close
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        <DialogHeader>
                            <div className="flex items-center gap-3">
                                <img
                                    src="https://izjekecdocekznhwqivo.supabase.co/storage/v1/object/public/Media/Simba%20Profile.png"
                                    alt="Simba profile"
                                    className="w-14 h-14 rounded-full object-cover border-2 border-brand-blue bg-white"
                                />
                                <div className="space-y-1">
                                    <DialogTitle>Ask a question</DialogTitle>
                                    <DialogDescription className="text-gray-800">
                                        Hi, Simba here, let me know how I or the humans can help...
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="first-name">First Name <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="first-name"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        placeholder="First Name"
                                        required
                                        className="bg-white border-gray-600 text-gray-900"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="last-name">Last Name <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="last-name"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        placeholder="Last Name"
                                        required
                                        className="bg-white border-gray-600 text-gray-900"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    required
                                    className="bg-white border-gray-600 text-gray-900"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="question-about" className="text-sm font-medium">
                                    This is about
                                </Label>
                                <Select value={selectedOption} onValueChange={setSelectedOption}>
                                    <SelectTrigger id="question-about" className="border-gray-600 text-gray-800">
                                        <SelectValue placeholder="Choose a topic" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {options.map((opt) => (
                                            <SelectItem
                                                key={opt.value}
                                                value={opt.value}
                                                className="py-2 data-[highlighted]:bg-gray-100 hover:bg-gray-100"
                                            >
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-900">{opt.label}</span>
                                                    <span className="text-[11px] text-gray-500">{opt.hint}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="question-body">Your question <span className="text-red-500">*</span></Label>
                                <Textarea
                                    id="question-body"
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    placeholder="Share as much detail as you can..."
                                    rows={4}
                                    required
                                    className="border-gray-600 text-gray-800 placeholder:text-gray-600 bg-white"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white font-semibold"
                                disabled={submitting || !question.trim() || !firstName.trim() || !lastName.trim() || !email.trim()}
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    'Send question'
                                )}
                            </Button>
                        </form>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
