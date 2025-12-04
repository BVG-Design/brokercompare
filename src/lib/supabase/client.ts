import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Client-side Supabase instance for use in React components
export const supabase = createClientComponentClient();
