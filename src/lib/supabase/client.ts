import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  // Browser-side Supabase client for use in client components/hooks
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}

// Convenience instance for components that import `supabase` directly
export const supabase = createClient();
