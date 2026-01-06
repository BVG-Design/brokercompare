'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, Mail } from 'lucide-react';
import { signInWithMagicLink } from '@/services/supabase';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useMemo(() => createClient(), []);

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nextPath = useMemo(() => {
    const next = searchParams.get('next');
    return next && next.startsWith('/') ? next : null;
  }, [searchParams]);

  const resolveDashboardPath = (profile?: {
    default_dashboard?: 'admin' | 'broker' | 'partner' | null;
    user_type?: string | null;
    admin_dashboard?: boolean | null;
    partner_dashboard?: boolean | null;
    broker_dashboard?: boolean | null;
  }) => {
    // #region agent log
    const logData = { profile, default_dashboard: profile?.default_dashboard, user_type: profile?.user_type, admin_dashboard: profile?.admin_dashboard, partner_dashboard: profile?.partner_dashboard, broker_dashboard: profile?.broker_dashboard };
    fetch('http://127.0.0.1:7242/ingest/fd862b92-28de-446b-a32b-39d1fc192b91', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'login/page.tsx:resolveDashboardPath', message: 'resolveDashboardPath entry', data: logData, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'A,B,C' }) }).catch(() => { });
    // #endregion

    if (profile?.default_dashboard === 'admin') {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/fd862b92-28de-446b-a32b-39d1fc192b91', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'login/page.tsx:resolveDashboardPath', message: 'Returning admin path', data: { reason: 'default_dashboard===admin' }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'A' }) }).catch(() => { });
      // #endregion
      return '/admin';
    }
    if (profile?.default_dashboard === 'partner') {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/fd862b92-28de-446b-a32b-39d1fc192b91', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'login/page.tsx:resolveDashboardPath', message: 'Returning partner path', data: { reason: 'default_dashboard===partner/vendor' }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'A' }) }).catch(() => { });
      // #endregion
      return '/dashboard/partner';
    }
    if (profile?.default_dashboard === 'broker') {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/fd862b92-28de-446b-a32b-39d1fc192b91', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'login/page.tsx:resolveDashboardPath', message: 'Returning broker path', data: { reason: 'default_dashboard===broker' }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'A' }) }).catch(() => { });
      // #endregion
      return '/dashboard/broker';
    }
    if (profile?.admin_dashboard || profile?.user_type === 'admin') {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/fd862b92-28de-446b-a32b-39d1fc192b91', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'login/page.tsx:resolveDashboardPath', message: 'Returning admin path (fallback)', data: { reason: 'admin_dashboard||user_type===admin' }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'A' }) }).catch(() => { });
      // #endregion
      return '/admin';
    }
    if (profile?.partner_dashboard || profile?.user_type === 'partner') {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/fd862b92-28de-446b-a32b-39d1fc192b91', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'login/page.tsx:resolveDashboardPath', message: 'Returning partner path (fallback)', data: { reason: 'partner_dashboard||user_type===vendor' }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'A' }) }).catch(() => { });
      // #endregion
      return '/dashboard/partner';
    }
    if (profile?.broker_dashboard || profile?.user_type === 'broker') {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/fd862b92-28de-446b-a32b-39d1fc192b91', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'login/page.tsx:resolveDashboardPath', message: 'Returning broker path (fallback)', data: { reason: 'broker_dashboard||user_type===broker' }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'A' }) }).catch(() => { });
      // #endregion
      return '/dashboard/broker';
    }
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/fd862b92-28de-446b-a32b-39d1fc192b91', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'login/page.tsx:resolveDashboardPath', message: 'Returning default broker path', data: { reason: 'no dashboard configured' }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'A' }) }).catch(() => { });
    // #endregion
    // Default to broker dashboard if no specific dashboard is configured
    return '/dashboard/broker';
  };

  useEffect(() => {
    const queryError = searchParams.get('error');
    if (queryError) {
      setError(queryError);
    }
  }, [searchParams]);

  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session && isMounted) {
          // Try with default_dashboard first, fallback if column doesn't exist
          let profile: any = null;
          let profileError: any = null;

          const { data: profileWithDefault, error: errorWithDefault } = await supabase
            .from('user_profiles')
            .select('default_dashboard, user_type, admin_dashboard, partner_dashboard, broker_dashboard')
            .eq('id', session.user.id)
            .maybeSingle();

          if (errorWithDefault?.message?.includes('default_dashboard does not exist')) {
            // Column doesn't exist, query without it
            const { data: profileWithoutDefault, error: errorWithoutDefault } = await supabase
              .from('user_profiles')
              .select('user_type, admin_dashboard, partner_dashboard, broker_dashboard')
              .eq('id', session.user.id)
              .maybeSingle();
            profile = profileWithoutDefault;
            profileError = errorWithoutDefault;
          } else {
            profile = profileWithDefault;
            profileError = errorWithDefault;
          }

          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/fd862b92-28de-446b-a32b-39d1fc192b91', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'login/page.tsx:checkSession', message: 'Login page profile query result', data: { hasProfile: !!profile, profileError: profileError?.message, profileData: profile, userId: session.user.id, hasDefaultDashboard: !!profile?.default_dashboard }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'B' }) }).catch(() => { });
          // #endregion

          const destination = nextPath || resolveDashboardPath(profile || undefined);

          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/fd862b92-28de-446b-a32b-39d1fc192b91', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'login/page.tsx:checkSession', message: 'Login page redirect destination', data: { destination, nextPath, resolvedPath: resolveDashboardPath(profile || undefined) }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'A,C,E' }) }).catch(() => { });
          // #endregion

          router.replace(destination);
        }
      } catch (err) {
        console.warn('Session check failed:', err);
      }
    };

    checkSession();

    return () => {
      isMounted = false;
    };
  }, [nextPath, router, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error: authError } = await signInWithMagicLink(email, nextPath || undefined);
      if (authError) {
        // Handle specific error cases similar to original code if needed, 
        // but user's requested code simplifies it. 
        // Adapting to user's requested error handling for now.
        setError(authError);
      } else {
        setIsSent(true);
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email first, then paste the code.');
      return;
    }
    if (!code.trim()) {
      setError('Please enter the code from your email.');
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: code.trim(),
        type: 'email',
      });

      if (verifyError || !data.session) {
        setError(verifyError?.message || 'Invalid or expired code. Please request a new one.');
        return;
      }

      // Session is set client-side; pick destination and continue
      const {
        data: { user },
      } = await supabase.auth.getUser();

      let destination = nextPath || '/dashboard/broker';

      if (user) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select(
            'default_dashboard, user_type, admin_dashboard, partner_dashboard, broker_dashboard',
          )
          .eq('id', user.id)
          .maybeSingle();
        destination = nextPath || resolveDashboardPath(profile || undefined) || destination;
      }

      router.replace(destination);
      router.refresh();
    } catch (err) {
      setError('Unable to verify the code. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const inboxLinks = [
    { label: 'Gmail', href: 'https://mail.google.com' },
    { label: 'Outlook', href: 'https://outlook.live.com/mail' },
  ];

  return (
    <div className="min-h-screen bg-brand-blue flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 animate-in fade-in zoom-in duration-300">
        {!isSent ? (
          <>
            <h1 className="text-2xl font-bold text-brand-blue mb-2">Sign in</h1>
            <p className="text-gray-500 mb-6">Enter your email to get a magic link.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all placeholder-gray-400 text-gray-700"
                  placeholder="Email"
                />
              </div>

              {error && (
                <div className="p-3 rounded bg-red-50 text-red-600 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-lg bg-brand-orange text-white font-bold hover:bg-orange-600 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isLoading && <Loader2 className="animate-spin" size={20} />}
                Get magic link
              </button>
            </form>

            <div className="mt-6 text-center text-xs text-gray-400">
              By proceeding, you agree to our <Link href="/terms" className="underline hover:text-gray-600">Terms of Use</Link> and <Link href="/privacy" className="underline hover:text-gray-600">Privacy Policy</Link>.
            </div>

            <div className="mt-8 text-center text-sm">
              <Link href="/signup" className="text-brand-green font-semibold hover:underline">
                New here? Create an account
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h2 className="text-2xl font-bold text-brand-blue mb-2">Check your email</h2>
            <p className="text-gray-500 mb-6">We've sent a magic link to <span className="font-semibold">{email}</span></p>

            <div className="w-full rounded-lg border border-orange-100 p-4 bg-orange-50 text-center space-y-2 mb-6">
              <div className="text-xs font-bold text-brand-blue uppercase tracking-wide">Open Your Inbox</div>
              <div className="flex items-center justify-center gap-2 text-sm font-semibold text-brand-orange">
                {inboxLinks.map((item, idx) => (
                  <span key={item.label} className="flex items-center gap-2">
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="underline flex items-center gap-1 hover:opacity-80"
                    >
                      <Mail className="w-4 h-4" />
                      {item.label}
                    </a>
                    {idx < inboxLinks.length - 1 && <span className="text-gray-300">|</span>}
                  </span>
                ))}
              </div>
            </div>

            <form onSubmit={handleVerifyCode} className="space-y-3 max-w-xs mx-auto text-left">
              <label className="block text-sm font-semibold text-brand-blue">
                Or paste the 8-digit code from the email
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={8}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all placeholder-gray-400 text-gray-700 text-center tracking-[0.3em]"
                placeholder="12345678"
              />

              <button
                type="submit"
                disabled={isVerifying || code.trim().length < 8}
                className="w-full py-3 rounded-lg bg-brand-blue text-white font-bold hover:bg-blue-900 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isVerifying && <Loader2 className="animate-spin" size={18} />}
                Verify code
              </button>
            </form>

            {error && (
              <div className="mt-4 p-3 rounded bg-red-50 text-red-600 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={() => setIsSent(false)}
              className="text-brand-orange font-medium hover:underline text-sm"
            >
              Back to sign in
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
