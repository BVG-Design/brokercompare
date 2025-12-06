-- User profile schema (no other tables included yet)
create table if not exists public.user_profiles (
  id uuid primary key references auth.users on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  user_type text not null default 'consumer' check (user_type in ('consumer', 'vendor', 'admin')),
  vendor_id uuid, -- optional: link to vendors table when created
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_profiles enable row level security;

-- Users can read their own profile
create policy "Users can view own profile"
  on public.user_profiles for select
  using (auth.uid() = id);

-- Users can update their own profile
create policy "Users can update own profile"
  on public.user_profiles for update
  using (auth.uid() = id);

-- Admins can manage all profiles (requires a future admin RLS helper)
-- Replace `is_admin()` with your preferred check or remove until implemented.
-- create policy "Admins can manage profiles"
--   on public.user_profiles
--   using (is_admin(auth.uid()))
--   with check (is_admin(auth.uid()));

create or replace function public.handle_new_auth_user()
returns trigger as $$
begin
  insert into public.user_profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_auth_user();
