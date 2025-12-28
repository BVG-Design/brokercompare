import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

const TWELVE_HOURS_IN_SECONDS = 60 * 60 * 12;

const resolveDashboardPath = (profile?: {
  default_dashboard?: 'admin' | 'broker' | 'vendor' | null;
  user_type?: string | null;
  admin_dashboard?: boolean | null;
  vendor_dashboard?: boolean | null;
  broker_dashboard?: boolean | null;
}) => {
  // #region agent log
  const logData = {profile,default_dashboard:profile?.default_dashboard,user_type:profile?.user_type,admin_dashboard:profile?.admin_dashboard,vendor_dashboard:profile?.vendor_dashboard,broker_dashboard:profile?.broker_dashboard};
  fetch('http://127.0.0.1:7242/ingest/fd862b92-28de-446b-a32b-39d1fc192b91',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth/callback/route.ts:resolveDashboardPath',message:'resolveDashboardPath entry',data:logData,timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,B,C'})}).catch(()=>{});
  // #endregion
  
  if (profile?.default_dashboard === 'admin') {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/fd862b92-28de-446b-a32b-39d1fc192b91',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth/callback/route.ts:resolveDashboardPath',message:'Returning admin path',data:{reason:'default_dashboard===admin'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    return '/admin';
  }
  if (profile?.default_dashboard === 'vendor') {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/fd862b92-28de-446b-a32b-39d1fc192b91',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth/callback/route.ts:resolveDashboardPath',message:'Returning vendor path',data:{reason:'default_dashboard===vendor'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    return '/dashboard/vendor';
  }
  if (profile?.default_dashboard === 'broker') {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/fd862b92-28de-446b-a32b-39d1fc192b91',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth/callback/route.ts:resolveDashboardPath',message:'Returning broker path',data:{reason:'default_dashboard===broker'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    return '/dashboard/broker';
  }
  if (profile?.admin_dashboard || profile?.user_type === 'admin') {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/fd862b92-28de-446b-a32b-39d1fc192b91',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth/callback/route.ts:resolveDashboardPath',message:'Returning admin path (fallback)',data:{reason:'admin_dashboard||user_type===admin'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    return '/admin';
  }
  if (profile?.vendor_dashboard || profile?.user_type === 'vendor') {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/fd862b92-28de-446b-a32b-39d1fc192b91',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth/callback/route.ts:resolveDashboardPath',message:'Returning vendor path (fallback)',data:{reason:'vendor_dashboard||user_type===vendor'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    return '/dashboard/vendor';
  }
  if (profile?.broker_dashboard || profile?.user_type === 'broker') {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/fd862b92-28de-446b-a32b-39d1fc192b91',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth/callback/route.ts:resolveDashboardPath',message:'Returning broker path (fallback)',data:{reason:'broker_dashboard||user_type===broker'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    return '/dashboard/broker';
  }
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/fd862b92-28de-446b-a32b-39d1fc192b91',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth/callback/route.ts:resolveDashboardPath',message:'Returning default broker path',data:{reason:'no dashboard configured'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  // Default to broker dashboard if no specific dashboard is configured
  return '/dashboard/broker';
};

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const nextParam = requestUrl.searchParams.get('next');
  const nextFromParam = nextParam && nextParam.startsWith('/') ? nextParam : null;

  const errorRedirect = (message: string) =>
    NextResponse.redirect(
      new URL(
        `/login?error=${encodeURIComponent(message)}${nextFromParam ? `&next=${encodeURIComponent(nextFromParam)}` : ''}`,
        requestUrl.origin,
      ),
    );

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
    // Try with default_dashboard first, fallback if column doesn't exist
    let profile: any = null;
    let profileError: any = null;
    
    const { data: profileWithDefault, error: errorWithDefault } = await supabase
      .from('user_profiles')
      .select('onboarding_completed, user_type, admin_dashboard, vendor_dashboard, broker_dashboard, default_dashboard')
      .eq('id', user.id)
      .maybeSingle();
    
    if (errorWithDefault?.message?.includes('default_dashboard does not exist')) {
      // Column doesn't exist, query without it
      const { data: profileWithoutDefault, error: errorWithoutDefault } = await supabase
        .from('user_profiles')
        .select('onboarding_completed, user_type, admin_dashboard, vendor_dashboard, broker_dashboard')
        .eq('id', user.id)
        .maybeSingle();
      profile = profileWithoutDefault;
      profileError = errorWithoutDefault;
    } else {
      profile = profileWithDefault;
      profileError = errorWithDefault;
    }

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/fd862b92-28de-446b-a32b-39d1fc192b91',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth/callback/route.ts:88',message:'Profile query result',data:{hasProfile:!!profile,profileError:profileError?.message,profileData:profile,userId:user.id,hasDefaultDashboard:!!profile?.default_dashboard},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion

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
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/fd862b92-28de-446b-a32b-39d1fc192b91',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth/callback/route.ts:95',message:'Redirecting to welcome (onboarding not completed)',data:{onboarding_completed:profile?.onboarding_completed},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      return NextResponse.redirect(new URL('/welcome', requestUrl.origin));
    }

    const destination = nextFromParam || resolveDashboardPath(profile) || '/dashboard/broker';
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/fd862b92-28de-446b-a32b-39d1fc192b91',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth/callback/route.ts:100',message:'Final redirect destination',data:{destination,nextFromParam,resolvedPath:resolveDashboardPath(profile)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,C'})}).catch(()=>{});
    // #endregion
    return NextResponse.redirect(new URL(destination, requestUrl.origin));
  }

  const fallbackDestination = nextFromParam || '/dashboard/broker';
  return NextResponse.redirect(new URL(fallbackDestination, requestUrl.origin));
}
