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
    .select('id, full_name, user_type, default_dashboard, admin_dashboard, vendor_dashboard, broker_dashboard')
    .eq('id', session.user.id)
    .single();

  // Redirect based on default_dashboard or user_type
  if (profile?.default_dashboard === 'admin' || profile?.admin_dashboard || profile?.user_type === 'admin') {
    redirect('/admin');
  }
  if (profile?.default_dashboard === 'vendor' || profile?.vendor_dashboard || profile?.user_type === 'vendor') {
    redirect('/dashboard/vendor');
  }
  if (profile?.default_dashboard === 'broker' || profile?.broker_dashboard || profile?.user_type === 'broker') {
    redirect('/dashboard/broker');
  }

  return <div className="min-h-screen bg-gray-50">{children}</div>;
}
