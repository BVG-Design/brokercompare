'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
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
import { createClient } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';

interface FeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  softwareName?: string;
  softwareSlug?: string;
}

// Helper to format name as "FirstName F"
function formatUserName(fullName: string | null | undefined): string {
  if (!fullName) return '';
  const parts = fullName.trim().split(' ');
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0];
  const firstName = parts[0];
  const lastNameInitial = parts[parts.length - 1][0]?.toUpperCase() || '';
  return `${firstName} ${lastNameInitial}`;
}

export function FeedbackDialog({
  open,
  onOpenChange,
  softwareName,
  softwareSlug,
}: FeedbackDialogProps) {
  const { user, loading: authLoading } = useAuth();
  const pathname = usePathname();
  const [feedback, setFeedback] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [userFullName, setUserFullName] = useState<string | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Fetch user profile when user is logged in
  useEffect(() => {
    if (user && open) {
      setLoadingProfile(true);
      const supabase = createClient();
      supabase
        .from('user_profiles')
        .select('full_name')
        .eq('id', user.id)
        .single()
        .then(({ data, error }) => {
          if (!error && data) {
            setUserFullName(data.full_name);
          } else {
            // Fallback to user_metadata if profile doesn't exist
            const firstName = user.user_metadata?.first_name || '';
            const lastName = user.user_metadata?.last_name || '';
            if (firstName || lastName) {
              setUserFullName(`${firstName} ${lastName}`.trim());
            }
          }
        })
        .catch(() => {
          // Ignore errors if Supabase isn't configured yet
        })
        .finally(() => {
          setLoadingProfile(false);
        });
    }
  }, [user, open]);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setFeedback('');
      setFirstName('');
      setLastName('');
      setEmail('');
      setError(null);
      setSuccess(false);
      setUserFullName(null);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!feedback.trim()) {
      setError('Please enter your feedback');
      return;
    }

    if (!user && (!firstName.trim() || !email.trim())) {
      setError('Please enter your first name and email');
      return;
    }

    setSubmitting(true);

    try {
      // Get the full URL for logging
      const pageUrl = typeof window !== 'undefined' ? window.location.href : pathname;
      const pageInfo = softwareName || pathname;

      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          feedback: feedback.trim(),
          pageUrl,
          softwareSlug: softwareSlug || pathname,
          softwareName: pageInfo,
          isLoggedIn: !!user,
          userId: user?.id || null,
          userEmail: user?.email || email.trim(),
          userName: user ? (userFullName || user.email) : `${firstName.trim()} ${lastName.trim()}`.trim(),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit feedback');
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center text-xl">Thanks for your feedback!</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center pt-4">
            <Button
              onClick={() => onOpenChange(false)}
              className="w-full bg-brand-green hover:bg-brand-green/90 text-white"
            >
              Continue Exploring →
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Show loading state while checking auth
  if (authLoading || loadingProfile) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const displayName = user && userFullName ? formatUserName(userFullName) : '';
  const isLoggedIn = !!user;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white text-gray-800">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <img
              src="https://izjekecdocekznhwqivo.supabase.co/storage/v1/object/public/Media/Simba%20Digging%20Profile.png"
              alt="Simba profile Tail"
              className="w-20 h-20 rounded-xl object-contain border-2 border-white bg-white p-1"
            />
            <div className="space-y-1">
              <DialogTitle className="text-brand-blue-800">Share your feedback</DialogTitle>
              <DialogDescription className="text-gray-800">
                Hi, Simba here, let me and the humans know how we can improve, please share your feedback.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Page/Software Info - Auto-filled */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Page
              </label>
              <div className="p-3 bg-muted rounded-md text-sm">
                {softwareName || pathname}
              </div>
            </div>

            {/* Feedback Text Area */}
            <div className="space-y-2">
              <label htmlFor="feedback" className="text-sm font-medium">
                Your feedback
              </label>
              <Textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Tell us what needs to be updated or corrected..."
                className="min-h-[120px] border-gray-600 text-gray-800 placeholder:text-gray-600 bg-white"
                required
              />
            </div>

            {/* User Info - Logged In Display or Name/Email Inputs */}
            {isLoggedIn ? (
              <div className="text-sm text-muted-foreground">
                Logged in as: {displayName || user.email}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First name"
                      className="border-gray-600 text-gray-800 placeholder:text-gray-600"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium">
                      Last Name
                    </label>
                    <Input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last name"
                      className="border-gray-600 text-gray-800 placeholder:text-gray-600"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Your email <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="border-gray-600 text-gray-800 placeholder:text-gray-600"
                    required
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 rounded-md bg-red-50 text-red-600 text-sm border border-red-200">
                {error}
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={submitting || !feedback.trim() || (!user && (!firstName.trim() || !email.trim()))}
              className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
