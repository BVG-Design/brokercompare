import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { AccessDeniedCard } from '@/components/shared/AccessDeniedCard';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('first_name, full_name, email, default_dashboard, user_type, admin_dashboard, partner_dashboard, broker_dashboard')
    .eq('id', session.user.id)
    .single();

  // Honor explicit default_dashboard first, then fall back to allowed dashboards
  if (profile?.default_dashboard === 'admin') {
    redirect('/admin');
  }
  if (profile?.default_dashboard === 'partner' || profile?.default_dashboard === 'vendor') {
    redirect('/dashboard/vendor');
  }
  if (profile?.default_dashboard === 'broker') {
    redirect('/dashboard/broker');
  }

  if (profile?.admin_dashboard || profile?.user_type === 'admin') {
    redirect('/admin');
  }
  if (profile?.partner_dashboard || profile?.user_type === 'vendor') {
    redirect('/dashboard/vendor');
  }
  if (profile?.broker_dashboard || profile?.user_type === 'broker') {
    redirect('/dashboard/broker');
  }

  // If no dashboard is configured, show access denied
  const firstName = profile?.first_name || profile?.full_name?.split(' ')?.[0] || null;
  const userEmail = profile?.email || session.user.email || null;

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <AccessDeniedCard
        firstName={firstName}
        email={userEmail}
        page="/dashboard"
        backHref="/login"
      />
    </main>
  );
}
