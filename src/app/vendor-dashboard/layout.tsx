import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export default async function VendorDashboardLayout({
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
    .select('user_type')
    .eq('id', session.user.id)
    .single();

  if (profile?.user_type === 'admin') {
    redirect('/admin');
  }

  if (profile?.user_type !== 'vendor') {
    redirect('/dashboard');
  }

  return <div className="min-h-screen bg-gray-50">{children}</div>;
}
