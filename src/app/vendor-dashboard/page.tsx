import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export default async function VendorDashboardPage() {
  const dynamic = "force-dynamic";
  const supabase = createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <main className="mx-auto max-w-5xl px-6 py-12 space-y-6">
      <div className="space-y-2">
        <p className="text-sm text-gray-500">Signed in as {session?.user.email}</p>
        <h1 className="text-3xl font-semibold">Vendor dashboard</h1>
        <p className="text-gray-600">
          Replace this shell with the full vendor experience (review responses, analytics,
          profile settings, subscription/billing) once Supabase tables and queries are in
          place.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-3">
        <h2 className="text-lg font-semibold">Next steps for vendors</h2>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• Link vendor accounts via `user_profiles.vendor_id`.</li>
          <li>• Query leads/reviews from Supabase with RLS scoped to the vendor.</li>
          <li>• Add storage uploads for logos and profile assets.</li>
          <li>• Surface billing/subscription state from your payments provider.</li>
        </ul>
        <Link className="text-blue-600 hover:underline text-sm" href="/dashboard">
          Go back to consumer dashboard
        </Link>
      </div>
    </main>
  );
}
