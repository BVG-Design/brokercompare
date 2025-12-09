import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') ?? '/dashboard/broker';

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.exchangeCodeForSession(code);

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
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
