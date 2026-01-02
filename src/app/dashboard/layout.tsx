import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('id, full_name, user_type, default_dashboard, admin_dashboard, partner_dashboard, broker_dashboard')
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

  return <div className="min-h-screen bg-gray-50">{children}</div>;
}
