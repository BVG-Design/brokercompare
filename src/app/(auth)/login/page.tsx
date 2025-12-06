'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleMagicLink = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          shouldCreateUser: false, // require existing user
        },
      });
      if (error) {
        const msg = error.message?.toLowerCase() || '';
        if (msg.includes('user') && msg.includes('not found')) {
          router.push(`/signup?email=${encodeURIComponent(email)}`);
          return;
        }
        if (msg.includes('signups not allowed for otp')) {
          setMessage('Email Not Found - Create an Account');
          return;
        }        
        throw error;
      }
      setMessage('Check your email for your magic link.');
    } catch (err: any) {
      setMessage('Email Not Found - Create an Account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary px-4 text-primary-foreground">
      <div className="w-full max-w-md bg-white text-foreground shadow-lg rounded-xl p-8 space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">
            Sign in
          </h1>
          <p className="text-sm text-gray-500">
            Enter your email to get a magic link.
          </p>
        </div>

        <form className="space-y-3" onSubmit={handleMagicLink}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full border border-gray-200 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-secondary text-secondary-foreground rounded-lg py-3 font-medium hover:brightness-95 disabled:opacity-60"
          >
            {loading ? 'Please wait...' : 'Get magic link'}
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
          href="/signup"
          className="block w-full text-sm text-center text-accent font-semibold hover:brightness-90"
        >
          New here? Create an account
        </a>

        {message && (
          <p className="text-sm text-center text-red font-semibold bg-gray-200 border border-red-600 rounded-lg p-5">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
