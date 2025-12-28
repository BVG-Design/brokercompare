import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

const TWELVE_HOURS_IN_SECONDS = 60 * 60 * 12;

// Server-side Supabase instance used in layouts/routes
export function createServerSupabaseClient() {
  return createServerComponentClient({
    cookies,
    cookieOptions: {
      lifetime: TWELVE_HOURS_IN_SECONDS,
    },
  });
}
