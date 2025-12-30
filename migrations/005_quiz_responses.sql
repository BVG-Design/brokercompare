-- Capture structured quiz responses
create table if not exists public.quiz_responses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id),
  is_logged_in boolean default false,
  contact_first_name text not null,
  contact_last_name text not null,
  contact_email text not null,
  contact_phone text,
  contact_website text,
  contact_location text,
  notes text,
  brokerage_type text,
  aggregator text,
  business_stage text,
  revenue_band text,
  selected_products text[],
  selected_services text[],
  something_else text,
  service_details jsonb,
  product_details jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger quiz_responses_set_updated_at
  before update on public.quiz_responses
  for each row execute procedure public.set_updated_at();
