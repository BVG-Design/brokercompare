# Next Actions: Dashboards, Supabase Schema, AI, and Tracking

Context from UI:
- Admin dashboard (`src/app/admin/page.tsx`), Broker dashboard (`src/app/dashboard/broker/page.tsx`), Vendor dashboard (`src/app/dashboard/vendor/page.tsx`), and the vendor profile modals for leads/reviews (`src/app/vendors/[id]/page.tsx`).
- Application form for new vendors (`src/app/apply/page.tsx`).

## Immediate wiring checklist
- Connect all dashboard cards and tables to Supabase (stats, lists, lead/review/activity feeds).
- Replace mock profile updates in the Broker dashboard with Supabase mutations, and wire logo uploads to Supabase Storage.
- Wire vendor profile editing and lead/review retrieval in the Vendor dashboard to Supabase; block sections based on RLS/role checks.
- Back the lead + review modal submits with Supabase tables; surface success/error toasts based on RPC/insert results.
- Protect dashboard routes using existing layout guards plus RLS so client hints cannot bypass access.

## Required Supabase tables

### user_profiles (extends existing)
- id uuid PK references auth.users, email text, first_name text, last_name text, user_type text check ('consumer','vendor','admin','broker'), user_access text, admin_dashboard bool, vendor_dashboard bool, broker_dashboard bool, default_dashboard text check ('admin','broker','vendor'), default_profile text, profile_image text, phone text, company text, website text, notification_frequency text, display_name text.
- Broker-specific fields used in UI: broker_services text[], broker_service_other text, commercial_finance_areas text[], commercial_finance_other text, what_brought_you_here text?, aggregator text, aggregator_other text, team_size text, team_location text, top_priorities text[], lead_capture_crm text, fact_find_software text, email_system text, phone_system text, has_it_support bool, has_accountant bool, has_marketing_agency bool, has_mindset_coach bool, has_lawyer bool, has_insurance_broker bool, has_ai_specialist bool, considering_change bool, change_details text.
- Timestamps: created_at default now(), updated_at, created_by, updated_by.

### vendors
- id uuid PK, owner_profile_id uuid (profile with vendor_dashboard true), company_name text, tagline text, description text, logo_url text, website text, email text, phone text, categories text[], listing_tier text (free/featured/premium), status text (draft/pending/approved/rejected), view_count int default 0, created_at, updated_at.

### vendor_applications
- id uuid PK, user_id uuid references auth.users, business_type text, business_type_other text, company_name text, contact_name text, email text, phone text, website text, company_description text, categories text[], category_other text, commercial_finance_subcategories text[], commercial_finance_other text, broker_types text[], broker_type_other text, features text[], feature_other text, integrations text[], integration_other text, pricing_structure text, pricing_details text, special_offer text, why_join text, referral_source text, referral_name text, status text default 'pending', reviewed_by uuid, reviewed_at timestamptz, created_at, updated_at.

### leads
- id uuid PK, vendor_id uuid references vendors, broker_id uuid references auth.users null, broker_name text, broker_email text, broker_phone text, message text, status text default 'new' (new/in_progress/closed), source text default 'web', created_at timestamptz default now(), updated_at.

### reviews
- id uuid PK, vendor_id uuid references vendors, author text, rating int check (rating between 1 and 5), comment text, status text default 'pending', moderation_status text, is_verified bool default false, created_at timestamptz default now(), updated_at.

### shortlists
- id uuid PK, user_id uuid references auth.users, vendor_id uuid references vendors, vendor_name text, vendor_type text, created_at timestamptz default now().

### what_brought_you_here
- id uuid PK, created_by uuid references auth.users, email text, answer text, first_name text, last_name text, created_at timestamptz default now(), updated_at timestamptz default now(), updated_by uuid.

### faqs (for FAQ + admin inbox)
- id uuid PK, question text, answer text, category text, helpful_count int default 0, status text default 'published', created_by uuid, updated_by uuid, created_at, updated_at.

### ai_chat_logs (AI recs + chat telemetry)
- id uuid PK, user_id uuid references auth.users, context_type text (vendor_search/faq/support/dashboard), input text, response text, recommendations jsonb, model text, latency_ms int, created_at timestamptz default now().

### event_logs (market research + validation)
- id uuid PK, user_id uuid references auth.users null, session_id text, event_type text (page_view, lead_submitted, review_submitted, ai_chat, shortlist_add, subscribe_click, etc), path text, vendor_id uuid null, payload jsonb, created_at timestamptz default now().

### broker_subscriptions
- id uuid PK, user_id uuid references auth.users, plan_id text, status text (trialing/active/past_due/canceled), stripe_customer_id text, stripe_subscription_id text, current_period_end timestamptz, trial_end timestamptz, auto_renew bool, created_at timestamptz default now(), updated_at.

### subscription_plans (optional lookup)
- plan_id text PK, name text, price_cents int, interval text, features text[], is_active bool.

## Functions / triggers
- handle_new_auth_user (already present) — keep security definer and ensure inserts new columns from `raw_user_meta_data`.
- set_updated_at triggers on all tables to keep audit columns in sync.
- increment_vendor_view(vendor_id uuid) — RPC to safely bump `view_count` server-side when a vendor page is viewed.
- approve_vendor_application(app_id uuid) — RPC to set status approved and create/update `vendors` row (with owner_profile_id), returning the vendor_id.
- sync_lead_defaults() BEFORE INSERT on leads to set status 'new', source 'web', and broker_email from auth context if missing.
- sync_review_defaults() BEFORE INSERT on reviews to set status 'pending', is_verified false.
- log_ai_chat(user_id, input, response, context_type) — RPC used by AI chat to persist conversations to `ai_chat_logs`.
- log_event(event_type, payload jsonb) — RPC used across UI to write to `event_logs` with session/user context from JWT claims.
- update_default_dashboard(user_id, dashboard_id text) — RPC to gate `default_profile` updates through policy checks.

## RLS policies (high level)
- user_profiles: users can select/update their own row; admin role can select/update all; service role can insert. Block deletes.
- vendors: anyone can select approved/published vendors; vendor owners (owner_profile_id) can update their row; admin can insert/update/delete; insert requires vendor_dashboard or admin.
- vendor_applications: owner (user_id) can select/insert/update own; admin can select/update; no deletes for end users.
- leads: authenticated users can insert; vendors can select leads where vendor_id matches a vendor they own; brokers can select leads where broker_id matches their auth.uid() or broker_email matches their email; admin full access.
- reviews: authenticated insert; public select only rows where status in ('approved','published') OR (auth.uid() = created_by if you track it); admin can update/moderate.
- shortlists: users can select/insert/delete where user_id = auth.uid(); admin full.
- what_brought_you_here: users can select/insert/update their own; admin select; no public select.
- faqs: public select only status = 'published'; admin/editor insert/update; helpful_count increments via secured RPC.
- ai_chat_logs: users select their own rows; admin select all; insert via RPC only.
- event_logs: insert via RPC; select only for admin/analyst role or aggregated views.
- broker_subscriptions: users select their own row; insert/update via secure backend (Stripe webhook + service role); admin select all.

## AI recommendations chatbot — implementation steps
- Replace mock profile in `AIChatDialog` with real broker profile data from `user_profiles` and shortlist/lead history (fetch via server action or API route using service role).
- Use vendor/service catalog data from `vendors` to build the context passed into the AI prompts; add a lightweight embedding search or filtered query by category/broker_services.
- Stream responses and persist each turn into `ai_chat_logs` (RPC above) with latency + model metadata; emit `event_logs` entries for usage analytics.
- Add guardrails: rate limiting per user, max tokens, fallback text when RPC fails; surface moderation flags if AI output references non-approved vendors.
- Offer AI follow-ups to convert to actions: “Add to shortlist”, “Start lead”, “Book demo” — wire these to Supabase mutations and log events.

## Data tracking for market research and client validation
- Instrument key flows to `event_logs`: vendor page views (with vendor_id), lead submits, review submits, shortlist adds/removes, AI chat turns, dashboard tab switches, upgrade/subscribe clicks.
- Build daily materialized view or SQL view for funnel metrics: views → leads → conversions per vendor/category; AI chat to lead conversion; broker onboarding completion.
- Capture qualitative inputs:
  - `what_brought_you_here` answers (already captured in broker dashboard) — ensure table exists and surfaced in admin inbox.
  - “considering_change” and “change_details” from broker profile — store in `user_profiles` and expose aggregated counts for market research.
- Expose admin analytics in `src/app/admin/page.tsx` using Supabase views (read-only service role).

## Broker subscription rollout
- Add plan metadata (`subscription_plans`) and gating in UI: e.g., AI chat depth, shortlist size, lead exports, and vendor contact reveals gated behind active subscription.
- Integrate checkout: Stripe client session → Supabase `broker_subscriptions` row created via webhook (service role key). Store customer/subscription IDs and period end.
- Update dashboard guards to check `broker_subscriptions.status = 'active'` for premium-only sections; show upgrade CTAs otherwise.
- Add billing portal link and cancellation flow; log `subscribe_click`, `checkout_complete`, `cancellation` events.

## Admin + moderation workflow
- Admin dashboard should surface queues: vendor_applications (pending), leads (new), reviews (pending), FAQs (draft/pending), AI chat outliers (flagged).
- RPC for status transitions with audit trail (reviewed_by, reviewed_at) on applications, reviews, and leads.
- Email/notification hooks (webhooks or edge functions) for new leads to vendors and for brokers when responses arrive.
