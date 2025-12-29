-- Add default_dashboard column to user_profiles if it doesn't exist
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS default_dashboard text CHECK (default_dashboard IN ('admin', 'broker', 'vendor'));

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_default_dashboard ON public.user_profiles(default_dashboard);

