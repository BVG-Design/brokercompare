'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function SignupPage() {
  const searchParams = useSearchParams();
  const prefillEmail = useMemo(() => searchParams.get('email') || '', [searchParams]);

  const [email, setEmail] = useState(prefillEmail);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
  
    try {
      // 1️⃣ FIRST: Check if user already exists
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false, // IMPORTANT: only check existence
        },
      });
  
      // ✅ If NO error → user EXISTS → force login message
      if (!otpError) {
        setMessage('Email exists – please login.');
        return;
      }
  
      // 2️⃣ If we reach here → user does NOT exist → create account
      const generatedPassword = `${crypto.randomUUID()}Aa1!`;
  
      const { error: signupError } = await supabase.auth.signUp({
        email,
        password: generatedPassword,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
  
      if (signupError) {
        throw signupError;
      }
  
      // ✅ Success: user created + confirmation email sent
      setMessage('Check your email to confirm your new account.');
  
    } catch (err: any) {
      setMessage(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };  

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary px-4 text-primary-foreground">
      <div className="w-full max-w-md bg-white text-foreground shadow-lg rounded-xl p-8 space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Create your account</h1>
          <p className="text-sm text-gray-500">
            Tell us a bit about you so we can tailor your dashboard.
          </p>
        </div>

        <form className="space-y-3" onSubmit={handleSignup}>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First name"
            required
            className="w-full border border-gray-200 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last name"
            required
            className="w-full border border-gray-200 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full border border-gray-200 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <label className="flex items-start gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary"
              required
            />
            <span>
              By signing up and checking this box, you agree to our{' '}
              <a className="underline" href="/terms">
                Terms of Service
              </a>{' '}
              and{' '}
              <a className="underline" href="/privacy">
                Privacy Policy
              </a>
              , and consent to receive marketing communications. You can opt out at any time in your settings.
            </span>
          </label>

          <button
            type="submit"
            disabled={loading || !consent}
            className="w-full bg-secondary text-secondary-foreground rounded-lg py-3 font-medium hover:brightness-95 disabled:opacity-60"
          >
            {loading ? 'Please wait...' : 'Create account'}
          </button>
        </form>

        <p className="text-xs text-center text-gray-500">
          By proceeding, you agree to our{' '}
          <a className="underline" href="/terms">
            Terms of Use
          </a>{' '}
          and{' '}
          <a className="underline" href="/privacy">
            Privacy Policy
          </a>
          .
        </p>

        <a
          href="/login"
          className="block w-full text-sm text-center text-accent font-semibold hover:brightness-90"
        >
          Already have an account? Sign in
        </a>

        {message && (
          <p className="text-sm text-center text-gray-600 bg-gray-50 border border-gray-100 rounded-lg p-3">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
