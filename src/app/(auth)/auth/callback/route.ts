import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

const TWELVE_HOURS_IN_SECONDS = 60 * 60 * 12;

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const nextParam = requestUrl.searchParams.get('next');
  const next = nextParam && nextParam.startsWith('/') ? nextParam : '/dashboard/broker';

  const errorRedirect = (message: string) =>
    NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(message)}&next=${encodeURIComponent(next)}`, requestUrl.origin));

  if (!code) {
    return errorRedirect('The sign-in link is missing a code. Please request a new one.');
  }

  const supabase = createRouteHandlerClient({
    cookies,
    cookieOptions: {
      lifetime: TWELVE_HOURS_IN_SECONDS,
    },
  });
  const {
    data: { session },
    error,
  } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return errorRedirect('This sign-in link is invalid or has expired. Please request a new one.');
  }

  const user = session?.user;

  if (user) {
    const fullName = [user.user_metadata?.first_name, user.user_metadata?.last_name]
      .filter(Boolean)
      .join(' ')
      .trim();

    // Check if profile exists and getting onboarding status
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('onboarding_completed')
      .eq('id', user.id)
      .single();

    // Ensure a user profile exists
    if (!profile) {
      await supabase.from('user_profiles').upsert({
        id: user.id,
        email: user.email,
        full_name: fullName || user.email,
        user_type: 'broker',
        onboarding_completed: false, // Default to false for new profiles
      });
    }

    // If onboarding is NOT completed, redirect to welcome
    if (!profile?.onboarding_completed) {
      return NextResponse.redirect(new URL('/welcome', requestUrl.origin));
    }
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
