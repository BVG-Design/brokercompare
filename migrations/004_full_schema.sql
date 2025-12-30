-- Full schema bootstrap for Broker Tools directory + dashboards
-- Assumes Supabase defaults (auth.users exists, pgcrypto/gen_random_uuid available).

-- Helpers
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace function public.handle_new_auth_user()
returns trigger as $$
begin
  insert into public.user_profiles (
    id,
    email,
    first_name,
    last_name,
    user_type,
    heard_from,
    heard_from_other
  )
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    coalesce(new.raw_user_meta_data->>'user_type', 'broker'),
    new.raw_user_meta_data->>'heard_from',
    new.raw_user_meta_data->>'heard_from_other'
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_auth_user();

-- Core lookup tables
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique,
  description text,
  meta_description text,
  synonyms text[],
  created_by uuid references auth.users (id),
  updated_by uuid references auth.users (id),
  deleted_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create trigger categories_set_updated_at
  before update on public.categories
  for each row execute procedure public.set_updated_at();

create table if not exists public.service_areas (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique,
  description text,
  meta_description text,
  group_name text,
  icon text,
  synonyms text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger service_areas_set_updated_at
  before update on public.service_areas
  for each row execute procedure public.set_updated_at();

-- Users
create table if not exists public.user_profiles (
  id uuid primary key references auth.users on delete cascade,
  email text not null,
  first_name text,
  last_name text,
  profile_image text,
  user_type text not null default 'consumer' check (user_type in ('consumer','vendor','admin','broker')),
  user_access text,
  admin_dashboard boolean default false,
  vendor_dashboard boolean default false,
  broker_dashboard boolean default true,
  default_dashboard text check (default_dashboard in ('admin','broker','vendor')),
  default_profile text check (default_profile in ('admin','broker','vendor')),
  vendor_id uuid,
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
  created_by uuid references auth.users (id),
  updated_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_user_profiles_default_dashboard on public.user_profiles (default_dashboard);
create trigger user_profiles_set_updated_at
  before update on public.user_profiles
  for each row execute procedure public.set_updated_at();

-- Vendors (directory listings)
create table if not exists public.vendors (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  tagline text,
  description text,
  logo_url text,
  website text,
  email text,
  phone text,
  categories text[],
  listing_tier text check (listing_tier in ('featured','premium','free','draft','unlisted','pending','approved','rejected')) default 'free',
  status text check (status in ('draft','pending','approved','rejected','unlisted')) default 'draft',
  listing_type text check (listing_type in ('software','service')) default 'software',
  view_count int default 0,
  pricing text,
  first_name text,
  last_name text,
  features text[],
  integrations text[],
  team_size text[],
  revenue text[],
  budget_amount text,
  budget_period text check (budget_period in ('monthly','yearly','project')),
  looking_to text[],
  looking_to_other text,
  not_fit_for text,
  materials jsonb,
  is_training_public boolean default true,
  meta_description text,
  synonyms text[],
  sanity_id text,
  created_by uuid references auth.users (id),
  updated_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_vendors_status on public.vendors (status);
create index if not exists idx_vendors_listing_type on public.vendors (listing_type);
create trigger vendors_set_updated_at
  before update on public.vendors
  for each row execute procedure public.set_updated_at();

-- Vendor applications
create table if not exists public.vendor_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id),
  business_type text,
  business_type_other text,
  company_name text,
  contact_name text,
  email text,
  phone text,
  website text,
  company_description text,
  categories text[],
  category_other text,
  commercial_finance_subcategories text[],
  commercial_finance_other text,
  broker_types text[],
  broker_type_other text,
  features text[],
  feature_other text,
  integrations text[],
  integration_other text,
  pricing_structure text,
  pricing_details text,
  special_offer text,
  why_join text,
  referral_source text,
  referral_name text,
  status text check (status in ('pending','approved','rejected','draft')) default 'pending',
  reviewed_by uuid references auth.users (id),
  reviewed_at timestamptz,
  listing_type text check (listing_type in ('software','service')),
  tagline text,
  description text,
  pricing text,
  first_name text,
  last_name text,
  team_size text[],
  revenue text[],
  budget_amount text,
  budget_period text check (budget_period in ('monthly','yearly','project')),
  looking_to text[],
  looking_to_other text,
  not_fit_for text,
  materials jsonb,
  is_training_public boolean default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_vendor_applications_status on public.vendor_applications (status);
create trigger vendor_applications_set_updated_at
  before update on public.vendor_applications
  for each row execute procedure public.set_updated_at();

-- Leads
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid references public.vendors on delete cascade,
  broker_id uuid references auth.users (id),
  broker_name text,
  broker_email text,
  broker_phone text,
  message text,
  status text check (status in ('new','in_progress','closed','won','lost')) default 'new',
  source text default 'web',
  buyer_company_id uuid,
  seller_company_id uuid,
  directory_listing_id uuid,
  created_by uuid references auth.users (id),
  updated_by uuid references auth.users (id),
  deleted_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index if not exists idx_leads_vendor on public.leads (vendor_id);
create trigger leads_set_updated_at
  before update on public.leads
  for each row execute procedure public.set_updated_at();

-- Reviews
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid references public.vendors on delete cascade,
  author text,
  rating numeric check (rating >= 0 and rating <= 5),
  comment text,
  status text check (status in ('pending','approved','rejected','published')) default 'pending',
  moderation_status text,
  is_verified boolean default false,
  reviewer_id uuid references auth.users (id),
  reviewer_company_id uuid,
  directory_listing_id uuid,
  created_by uuid references auth.users (id),
  updated_by uuid references auth.users (id),
  deleted_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index if not exists idx_reviews_vendor on public.reviews (vendor_id);
create trigger reviews_set_updated_at
  before update on public.reviews
  for each row execute procedure public.set_updated_at();

-- Shortlists
create table if not exists public.shortlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id),
  vendor_id uuid references public.vendors on delete cascade,
  vendor_name text,
  vendor_type text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger shortlists_set_updated_at
  before update on public.shortlists
  for each row execute procedure public.set_updated_at();

-- What brought you here (onboarding)
create table if not exists public.what_brought_you_here (
  id uuid primary key default gen_random_uuid(),
  created_by uuid references auth.users (id),
  updated_by uuid references auth.users (id),
  email text,
  answer text,
  first_name text,
  last_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (created_by)
);
create trigger wbyh_set_updated_at
  before update on public.what_brought_you_here
  for each row execute procedure public.set_updated_at();

-- Blog posts
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique,
  excerpt text,
  body text,
  category_id uuid references public.categories (id),
  published boolean default false,
  published_at timestamptz,
  view_count int default 0,
  reading_time int,
  featured_image text,
  tags text[],
  is_featured boolean default false,
  featured_label text,
  created_by uuid references auth.users (id),
  updated_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger blog_posts_set_updated_at
  before update on public.blog_posts
  for each row execute procedure public.set_updated_at();

-- FAQs
create table if not exists public.faq (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  category text,
  helpful_count int default 0,
  view_count int default 0,
  status text check (status in ('draft','published','archived')) default 'published',
  created_by uuid references auth.users (id),
  updated_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger faq_set_updated_at
  before update on public.faq
  for each row execute procedure public.set_updated_at();

-- Ask a question (from FAQ/Comparison/etc.)
create table if not exists public.ask_questions (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  context text, -- extra detail provided by user
  category text, -- aligns to FAQ category or intent
  source_page text, -- e.g., 'faq', 'comparison', 'vendor_profile'
  post_as text check (post_as in ('public','private')) default 'public',
  status text check (status in ('pending','published','archived','rejected')) default 'pending',
  user_id uuid references auth.users (id),
  user_email text,
  user_name text,
  is_logged_in boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger ask_questions_set_updated_at
  before update on public.ask_questions
  for each row execute procedure public.set_updated_at();

-- Feedback (API route)
create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  feedback text not null,
  page_url text,
  software_slug text,
  software_name text,
  is_logged_in boolean default false,
  user_id uuid references auth.users (id),
  user_email text,
  user_name text,
  created_at timestamptz not null default now()
);

-- Quiz waitlist
create table if not exists public.quiz (
  id uuid primary key default gen_random_uuid(),
  first_name text,
  last_name text,
  email text,
  created_at timestamptz not null default now()
);

-- Feature taxonomy
create table if not exists public.feature_categories (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique,
  description text,
  display_order int,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger feature_categories_set_updated_at
  before update on public.feature_categories
  for each row execute procedure public.set_updated_at();

create table if not exists public.features (
  id uuid primary key default gen_random_uuid(),
  feature_category_id uuid references public.feature_categories on delete set null,
  title text not null,
  slug text unique,
  description text,
  synonyms text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger features_set_updated_at
  before update on public.features
  for each row execute procedure public.set_updated_at();

-- Badges
create table if not exists public.badges (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique,
  badge_type text check (badge_type in ('editorial','commercial','status')),
  color text,
  icon_url text,
  priority int,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger badges_set_updated_at
  before update on public.badges
  for each row execute procedure public.set_updated_at();

create table if not exists public.listing_badges (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid references public.vendors on delete cascade,
  badge_id uuid references public.badges on delete cascade,
  priority int,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (vendor_id, badge_id)
);
create trigger listing_badges_set_updated_at
  before update on public.listing_badges
  for each row execute procedure public.set_updated_at();

-- Scoring / trust
create table if not exists public.scoring_criteria (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  label text not null,
  description text,
  category text,
  weight numeric default 1,
  max_score int default 10,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger scoring_criteria_set_updated_at
  before update on public.scoring_criteria
  for each row execute procedure public.set_updated_at();

create table if not exists public.listing_scores (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid references public.vendors on delete cascade,
  criteria_id uuid references public.scoring_criteria on delete cascade,
  score int,
  notes text,
  reviewer text,
  last_reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (vendor_id, criteria_id)
);
create trigger listing_scores_set_updated_at
  before update on public.listing_scores
  for each row execute procedure public.set_updated_at();

create table if not exists public.trust_signals (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid references public.vendors on delete cascade,
  signal_type text,
  label text,
  value text,
  evidence_url text,
  verified_by text,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trust_signals_set_updated_at
  before update on public.trust_signals
  for each row execute procedure public.set_updated_at();

-- Feature coverage per listing
create table if not exists public.listing_features (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid references public.vendors on delete cascade,
  feature_id uuid references public.features on delete cascade,
  availability text check (availability in ('yes','partial','no')) default 'yes',
  score int check (score between 1 and 10),
  limitation_type text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (vendor_id, feature_id)
);
create trigger listing_features_set_updated_at
  before update on public.listing_features
  for each row execute procedure public.set_updated_at();

-- Integrations / service partners
create table if not exists public.works_with (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid references public.vendors on delete cascade,
  related_vendor_id uuid references public.vendors on delete cascade,
  relationship_type text check (relationship_type in ('integration','service_partner')) default 'integration',
  priority int,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint works_with_no_self_ref check (vendor_id is null or related_vendor_id is null or vendor_id <> related_vendor_id)
);
create trigger works_with_set_updated_at
  before update on public.works_with
  for each row execute procedure public.set_updated_at();

-- Service area linkage
create table if not exists public.vendor_service_areas (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid references public.vendors on delete cascade,
  service_area_id uuid references public.service_areas on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (vendor_id, service_area_id)
);
create trigger vendor_service_areas_set_updated_at
  before update on public.vendor_service_areas
  for each row execute procedure public.set_updated_at();

-- Search intents
create table if not exists public.search_intents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique,
  category_key text not null,
  description text,
  synonyms text[],
  example_queries text[],
  priority int default 50,
  is_active boolean default true,
  show_in_nav boolean default false,
  display_order int,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger search_intents_set_updated_at
  before update on public.search_intents
  for each row execute procedure public.set_updated_at();
