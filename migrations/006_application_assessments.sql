-- Migration to support advanced assessment features
-- Adds missing columns to application_assessments or creates it if it doesn't exist

create table if not exists public.application_assessments (
    id uuid primary key default gen_random_uuid(),
    application_id text unique not null,
    overall_score numeric(4,2),
    category_scores jsonb,
    selected_badges text[],
    assessment_features jsonb,
    product_alternatives text[],
    faqs jsonb,
    service_area text[],
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Add enhancements for feature audit and section publishing
alter table public.application_assessments 
  add column if not exists published_sections jsonb default '{"categorise": true, "mapping": true, "features": true, "scores": false}'::jsonb,
  add column if not exists audit_in_progress boolean default false,
  add column if not exists pricing_entry text,
  add column if not exists linked_resources jsonb default '[]'::jsonb;

-- Trigger for updated_at
create trigger application_assessments_set_updated_at
  before update on public.application_assessments
  for each row execute procedure public.set_updated_at();
