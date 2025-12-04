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

      // Ensure a user profile exists and default to broker dashboard
      await supabase.from('user_profiles').upsert({
        id: user.id,
        email: user.email,
        full_name: fullName || user.email,
        user_type: 'broker',
      });
    }
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
