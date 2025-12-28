import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('user_type, user_access, admin_dashboard, vendor_dashboard, broker_dashboard')
    .eq('id', session.user.id)
    .single();

  const canAdmin =
    Boolean(profile?.admin_dashboard) ||
    profile?.user_access === 'admin' ||
    profile?.user_type === 'admin';
  const canVendor = Boolean(profile?.vendor_dashboard) || profile?.user_type === 'vendor';
  const canBroker = Boolean(profile?.broker_dashboard) || profile?.user_type === 'broker';

  if (!canAdmin) {
    if (canVendor) redirect('/dashboard/vendor');
    if (canBroker) redirect('/dashboard/broker');
    redirect('/dashboard');
  }

  return <div className="min-h-screen bg-gray-50">{children}</div>;
}
