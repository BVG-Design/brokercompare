-- Feedback table schema for storing user feedback on software profiles
-- Run this SQL in your Supabase SQL editor to create the feedback table

CREATE TABLE IF NOT EXISTS public.feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    feedback TEXT NOT NULL,
    page_url TEXT NOT NULL,
    software_slug TEXT,
    software_name TEXT,
    is_logged_in BOOLEAN NOT NULL DEFAULT false,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_email TEXT,
    user_name TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_feedback_software_slug ON public.feedback(software_slug);
CREATE INDEX IF NOT EXISTS idx_feedback_user_id ON public.feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON public.feedback(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own feedback
CREATE POLICY "Users can view own feedback"
    ON public.feedback FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Anyone can insert feedback (for logged out users)
CREATE POLICY "Anyone can insert feedback"
    ON public.feedback FOR INSERT
    WITH CHECK (true);

-- Policy: Admins can view all feedback (requires admin check function)
-- Uncomment and implement if you have an admin check function
-- CREATE POLICY "Admins can view all feedback"
--     ON public.feedback FOR SELECT
--     USING (is_admin(auth.uid()));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_feedback_updated_at ON public.feedback;
CREATE TRIGGER update_feedback_updated_at
    BEFORE UPDATE ON public.feedback
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Grant necessary permissions
GRANT INSERT, SELECT ON public.feedback TO authenticated;
GRANT INSERT ON public.feedback TO anon;

