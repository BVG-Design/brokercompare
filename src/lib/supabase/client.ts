import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const TWELVE_HOURS_IN_SECONDS = 60 * 60 * 12;

export function createClient() {
  // Client-side Supabase instance that keeps auth state in cookies for server compatibility
  return createClientComponentClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    cookieOptions: {
      lifetime: TWELVE_HOURS_IN_SECONDS,
    },
  });
}

// Convenience instance for components that import `supabase` directly
export const supabase = createClient();
