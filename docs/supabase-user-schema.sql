-- User profile schema that matches the dashboards in /src/app/*
-- (Broker, Vendor, Admin, FAQ, and onboarding flows).

create table if not exists public.user_profiles (
  id uuid primary key references auth.users on delete cascade,
  email text not null,
  full_name text,
  first_name text,
  last_name text,
  profile_image text,
  avatar_url text,
  user_type text not null default 'consumer' check (user_type in ('consumer', 'vendor', 'admin', 'broker')),
  user_access text,
  admin_dashboard boolean default false,
  vendor_dashboard boolean default false,
  broker_dashboard boolean default true, -- default broker landing
  default_dashboard text check (default_dashboard in ('admin','broker','vendor')),
  default_profile text check (default_profile in ('admin','broker','vendor')),
  vendor_id uuid, -- optional: link to vendors table when created
  phone text,
  company text,
  website text,
  notification_frequency text,
  display_name text,
  broker_services text[],
  broker_service_other text,
  commercial_finance_areas text[],
  commercial_finance_other text,
  aggregator text,
  aggregator_other text,
  team_size text,
  team_location text,
  top_priorities text[],
  lead_capture_crm text,
  fact_find_software text,
  email_system text,
  phone_system text,
  has_it_support boolean default false,
  has_accountant boolean default false,
  has_marketing_agency boolean default false,
  has_mindset_coach boolean default false,
  has_lawyer boolean default false,
  has_insurance_broker boolean default false,
  has_ai_specialist boolean default false,
  considering_change boolean default false,
  change_details text,
  onboarding_completed boolean default false,
  heard_from text,
  heard_from_other text,
  created_by uuid,
  updated_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_user_profiles_default_dashboard on public.user_profiles (default_dashboard);

-- Keep updated_at fresh on writes
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists user_profiles_set_updated_at on public.user_profiles;
create trigger user_profiles_set_updated_at
  before update on public.user_profiles
  for each row execute procedure public.set_updated_at();

alter table public.user_profiles enable row level security;

-- Users can read their own profile
create policy "Users can view own profile"
  on public.user_profiles for select
  using (auth.uid() = id);

-- Users can update their own profile
create policy "Users can update own profile"
  on public.user_profiles for update
  using (auth.uid() = id);

-- Service role inserts (e.g., signup/login flows)
create policy "Service role can insert profiles"
  on public.user_profiles for insert
  with check (auth.role() = 'service_role');

-- Admins can manage all profiles (adjust the check to your admin flag)
create policy "Admins can manage profiles"
  on public.user_profiles
  using (coalesce(admin_dashboard, false) or user_access = 'admin')
  with check (coalesce(admin_dashboard, false) or user_access = 'admin');

-- Trigger: seed profile from auth metadata at signup
create or replace function public.handle_new_auth_user()
returns trigger as $$
begin
  insert into public.user_profiles (
    id,
    email,
    full_name,
    first_name,
    last_name,
    user_type,
    heard_from,
    heard_from_other
  )
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    coalesce(new.raw_user_meta_data->>'user_type', 'broker'),
    new.raw_user_meta_data->>'heard_from',
    new.raw_user_meta_data->>'heard_from_other'
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_auth_user();
