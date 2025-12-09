'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { checkUserExists, registerUser } from '@/services/supabase';

function SignupContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const prefillEmail = useMemo(() => searchParams.get('email') || '', [searchParams]);

  const [email, setEmail] = useState(prefillEmail);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // Referral Source State
  const [referralSource, setReferralSource] = useState('');
  const [referralSourceOther, setReferralSourceOther] = useState('');

  const [consent, setConsent] = useState(false);
  const [aiConsent, setAiConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // 1️⃣ FIRST: Check if user already exists
      const userExists = await checkUserExists(email);

      // ✅ If user EXISTS → force login message
      if (userExists) {
        setMessage('Email exists – please login.');
        return;
      }

      const { error: signupError } = await registerUser({
        email,
        firstName,
        lastName,
        heardFrom: referralSource,
        heardFromOther: referralSource === 'other' ? referralSourceOther : undefined
      });

      if (signupError) {
        throw new Error(signupError);
      }

      // ✅ Success: user created + confirmation email sent
      router.push(`/signup/thank-you?email=${encodeURIComponent(email)}`);

    } catch (err: any) {
      setMessage(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = useMemo(() => {
    const basicFields = email && firstName && lastName && referralSource && consent && aiConsent;
    if (!basicFields) return false;

    if (referralSource === 'other') {
      return referralSourceOther.trim().length > 0;
    }
    return true;
  }, [email, firstName, lastName, referralSource, referralSourceOther, consent, aiConsent]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-blue px-4 py-8 text-white">
      <div className="w-full max-w-md bg-white text-brand-blue shadow-lg rounded-xl p-8 space-y-6 animate-in fade-in zoom-in duration-300">
        <div className="space-y-2 text-center md:text-left">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-sm text-gray-500">
            Tell us a bit about you so we can tailor your dashboard.
          </p>
        </div>

        <form className="space-y-3" onSubmit={handleSignup}>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name"
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-brand-blue text-gray-800 placeholder-gray-400"
            />
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last name"
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-brand-blue text-gray-800 placeholder-gray-400"
            />
          </div>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full border border-gray-200 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-brand-blue text-gray-800 placeholder-gray-400"
          />

          {/* How did you hear about us */}
          <div>
            <select
              value={referralSource}
              onChange={(e) => setReferralSource(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-brand-blue text-gray-800 bg-white"
            >
              <option value="" disabled>How did you hear about us?</option>
              <option value="podcast">Podcast</option>
              <option value="youtube">YouTube</option>
              <option value="linkedin">LinkedIn</option>
              <option value="colleague">Colleague/Friend</option>
              <option value="other">Other</option>
            </select>
          </div>

          {referralSource === 'other' && (
            <input
              type="text"
              value={referralSourceOther}
              onChange={(e) => setReferralSourceOther(e.target.value)}
              placeholder="Please specify..."
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-brand-blue text-gray-800 placeholder-gray-400 animate-in fade-in slide-in-from-top-2"
            />
          )}

          {/* Consent Checkboxes */}
          <div className="pt-2 space-y-3">
            <label className="flex items-start gap-3 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-brand-blue focus:ring-2 focus:ring-brand-blue"
                required
              />
              <span>
                By signing up and checking this box, you agree to our{' '}
                <Link className="underline hover:text-brand-blue" href="/terms" target="_blank">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link className="underline hover:text-brand-blue" href="/privacy" target="_blank">
                  Privacy Policy
                </Link>
                , and consent to receive marketing communications. You can opt out at any time in your settings.
              </span>
            </label>
            <label className="flex items-start gap-3 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={aiConsent}
                onChange={(e) => setAiConsent(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-brand-blue focus:ring-2 focus:ring-brand-blue"
                required
              />
              <span>
                You acknowledge that this platform uses AI to generate recommendations and analyse data for software and services benchmarking. No personal data is sold. You may opt out at any time. For details, view the{' '}
                <Link className="underline hover:text-brand-blue" href="/ai-data-use-policy" target="_blank">
                  AI &amp; Data Use Policy
                </Link>
                .
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || !isFormValid}
            className="w-full bg-brand-orange text-white rounded-lg py-3 font-bold hover:bg-orange-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-4"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Create account'}
          </button>
        </form>

        <div className="text-center">
          <Link
            href="/login"
            className="block w-full text-sm text-brand-green font-bold hover:underline"
          >
            Already have an account? Sign in
          </Link>
        </div>

        {message && (
          <p className="text-sm text-center text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

function SignupPageFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-blue px-4 py-8 text-white">
      <div className="w-full max-w-md bg-white text-brand-blue shadow-lg rounded-xl p-8 space-y-6 animate-in fade-in zoom-in duration-300">
        <div className="space-y-2 text-center md:text-left">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-sm text-gray-500">Loading sign up...</p>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<SignupPageFallback />}>
      <SignupContent />
    </Suspense>
  );
}
