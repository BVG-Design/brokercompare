import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('full_name, user_type')
    .eq('id', session?.user.id)
    .single();

  return (
    <main className="mx-auto max-w-5xl px-6 py-12 space-y-6">
      <div className="space-y-2">
        <p className="text-sm text-gray-500">Signed in as {session?.user.email}</p>
        <h1 className="text-3xl font-semibold">
          {profile?.full_name ? `Welcome, ${profile.full_name}` : 'Dashboard'}
        </h1>
        <p className="text-gray-600">
          This is the consumer dashboard shell. Hook up real data for reviews, saved
          comparisons, and bookmarks once Supabase tables are in place.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="text-lg font-semibold">Next steps</h2>
          <ul className="mt-3 space-y-2 text-sm text-gray-600">
            <li>• Add onboarding to capture full name and user type.</li>
            <li>• Replace static data with Supabase queries.</li>
            <li>• Wire up saved comparisons, bookmarks, and settings.</li>
          </ul>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="text-lg font-semibold">Switch dashboards</h2>
          <p className="mt-3 text-sm text-gray-600">
            Vendor and admin users will be redirected automatically. For testing, update
            your `user_profiles.user_type` to `vendor` or `admin`.
          </p>
          <div className="mt-4 flex gap-3 text-sm">
            <Link className="text-blue-600 hover:underline" href="/vendor-dashboard">
              Vendor dashboard
            </Link>
            <Link className="text-blue-600 hover:underline" href="/admin">
              Admin tools
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
