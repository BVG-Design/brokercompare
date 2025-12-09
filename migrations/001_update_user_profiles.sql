-- 1. Add new columns to user_profiles table
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS first_name text,
ADD COLUMN IF NOT EXISTS last_name text,
ADD COLUMN IF NOT EXISTS heard_from text,
ADD COLUMN IF NOT EXISTS heard_from_other text;

-- 2. Update the trigger function to capture metadata
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (
    id, 
    email, 
    first_name, 
    last_name, 
    heard_from, 
    heard_from_other
  )
  VALUES (
    new.id, 
    new.email,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.raw_user_meta_data->>'heard_from',
    new.raw_user_meta_data->>'heard_from_other'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
