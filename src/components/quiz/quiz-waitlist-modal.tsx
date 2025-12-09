'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { joinQuizWaitlist } from '@/services/supabase';
import { Loader2, CheckCircle2, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QuizWaitlistModalProps {
    children: React.ReactNode;
}

export function QuizWaitlistModal({ children }: QuizWaitlistModalProps) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { error } = await joinQuizWaitlist({
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
            });

            if (error) {
                throw new Error(error);
            }

            setIsSuccess(true);
            toast({
                title: "You're on the list!",
                description: "We'll be in touch as soon as the quiz is ready.",
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Something went wrong",
                description: "Please try again later.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (!newOpen) {
            // Reset form on close after a short delay so user doesn't see it reset while closing
            setTimeout(() => {
                setIsSuccess(false);
                setFormData({ firstName: '', lastName: '', email: '' });
            }, 300);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center text-brand-blue">
                        {isSuccess ? "You're on the list!" : "Coming Soon"}
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        {isSuccess
                            ? "Thanks for your interest. We'll verify your details and get back to you shortly."
                            : "A guided Quiz is currently being tested. Leave your name and email to be one of the first to try it out."}
                    </DialogDescription>
                </DialogHeader>

                {isSuccess ? (
                    <div className="flex flex-col items-center justify-center py-8 space-y-4">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                            <CheckCircle2 size={32} />
                        </div>
                        <Button
                            onClick={() => setOpen(false)}
                            className="mt-4 bg-brand-blue hover:bg-brand-blue/90"
                        >
                            Close
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First name</Label>
                                <Input
                                    id="firstName"
                                    placeholder="Enter first name"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData(e.target.value ? { ...formData, firstName: e.target.value } : formData)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last name</Label>
                                <Input
                                    id="lastName"
                                    placeholder="Enter last name"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData(e.target.value ? { ...formData, lastName: e.target.value } : formData)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={(e) => setFormData(e.target.value ? { ...formData, email: e.target.value } : formData)}
                                required
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white font-bold"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Joining...
                                </>
                            ) : (
                                <>
                                    Join Waitlist <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </Button>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
