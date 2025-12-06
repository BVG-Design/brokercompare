import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

// Server-side Supabase instance used in layouts/routes
export function createServerSupabaseClient() {
  return createServerComponentClient({
    cookies,
  });
}
