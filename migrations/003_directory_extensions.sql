-- Directory & scoring extensions to support Sanity directoryListing parity
-- Run after core tables (vendors, categories) exist.

-- Helper to keep updated_at in sync
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

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

-- Trust, scoring, and badges
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

create table if not exists public.scoring_criteria (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  label text not null,
  description text,
  category text, -- e.g. usability, reliability, security
  weight numeric default 1,
  max_score int default 10,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.trust_signals (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid references public.vendors on delete cascade,
  signal_type text, -- e.g. security_cert, uptime, customer_count, case_study
  label text,
  value text,
  evidence_url text,
  verified_by text,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

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

create table if not exists public.listing_badges (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid references public.vendors on delete cascade,
  badge_id uuid references public.badges on delete cascade,
  priority int,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (vendor_id, badge_id)
);

-- Feature coverage per listing
create table if not exists public.listing_features (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid references public.vendors on delete cascade,
  feature_id uuid references public.features on delete cascade,
  availability text check (availability in ('yes','partial','no')) default 'yes',
  score int check (score between 1 and 10),
  limitation_type text, -- plan_limited, add_on, role_limited, usage_limited, beta
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (vendor_id, feature_id)
);

-- Integrations / service providers
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

-- Service areas and linkage
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

create table if not exists public.vendor_service_areas (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid references public.vendors on delete cascade,
  service_area_id uuid references public.service_areas on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (vendor_id, service_area_id)
);

-- Search intents (optional, aligns with Sanity searchIntent)
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

-- Optional vendor column extensions (guards for existing table)
do $$
begin
  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'vendors') then
    alter table public.vendors
      add column if not exists listing_type text check (listing_type in ('software','service')),
      add column if not exists is_featured boolean default false,
      add column if not exists meta_description text,
      add column if not exists synonyms text[],
      add column if not exists sanity_id text;
  end if;
end$$;

-- Triggers for updated_at
create trigger feature_categories_set_updated_at
  before update on public.feature_categories
  for each row execute procedure public.set_updated_at();

create trigger features_set_updated_at
  before update on public.features
  for each row execute procedure public.set_updated_at();

create trigger badges_set_updated_at
  before update on public.badges
  for each row execute procedure public.set_updated_at();

create trigger scoring_criteria_set_updated_at
  before update on public.scoring_criteria
  for each row execute procedure public.set_updated_at();

create trigger trust_signals_set_updated_at
  before update on public.trust_signals
  for each row execute procedure public.set_updated_at();

create trigger listing_scores_set_updated_at
  before update on public.listing_scores
  for each row execute procedure public.set_updated_at();

create trigger listing_badges_set_updated_at
  before update on public.listing_badges
  for each row execute procedure public.set_updated_at();

create trigger listing_features_set_updated_at
  before update on public.listing_features
  for each row execute procedure public.set_updated_at();

create trigger works_with_set_updated_at
  before update on public.works_with
  for each row execute procedure public.set_updated_at();

create trigger service_areas_set_updated_at
  before update on public.service_areas
  for each row execute procedure public.set_updated_at();

create trigger vendor_service_areas_set_updated_at
  before update on public.vendor_service_areas
  for each row execute procedure public.set_updated_at();

create trigger search_intents_set_updated_at
  before update on public.search_intents
  for each row execute procedure public.set_updated_at();
