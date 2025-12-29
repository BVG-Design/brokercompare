# Dashboard Rollout Plan

## Scope & Ground Rules
- Remove broker onboarding questionnaire; keep only “What brought you here?” capture.
- Inbox remains “Coming soon” visually until Supabase data is ready.
- Shortlist persists to Supabase and surfaces in broker dashboard.
- Reviews/Questions/Recommendations modals show real data (or clear calls-to-action if none).
- Recommendations, comparisons, shortlist, and profile fields wired to Supabase.
- Vendor dashboard/profile wired to Supabase + Supabase Storage.
- Status flows (leads, reviews, applications, upgrades) wired end-to-end.
- No data seeding; rely on migrations + policies.

## Supabase Data Model & Plumbing
- Tables
  - `user_profiles`: `id (uuid pk)`, `first_name`, `last_name`, `user_type (broker|vendor|admin)`, `email`, `created_at`.
  - `broker_profiles`: `user_id fk user_profiles.id`, `website`, `company`, `display_name`, `notification_frequency`, `profile_image`, `what_brought_you_here`, `broker_services[]`, `commercial_finance_areas[]`, `top_priorities[]`, `lead_capture_crm`, `fact_find_software`, `email_system`, `phone_system`, `service_providers jsonb`, `considering_change`, `change_details`, `aggregator`, `team_size`, `team_location`, `shortlist_ids[]` (optional cache), timestamps.
  - `vendor_profiles`: `user_id fk`, `company_name`, `tagline`, `description`, `website`, `categories[]`, `features[]`, `integrations[]`, `listing_tier`, `logo_url`, `hero_media_url`, `view_count`, `lead_count`, `status`.
  - `leads`: `id`, `vendor_id fk`, `broker_id fk (nullable)`, `broker_email`, `message`, `status enum (new|contacted|qualified|converted|lost)`, `notes`, `created_at`.
  - `reviews`: `id`, `vendor_id fk`, `user_id fk`, `rating`, `title`, `body`, `status enum (pending|approved|rejected)`, `created_at`.
  - `shortlist`: `id`, `user_id`, `item_id`, `item_type enum (software|service|vendor)`, `metadata jsonb`, `created_at`.
  - `recommendations`: `id`, `user_id`, `type enum (product|software|service)`, `name`, `business`, `email`, `website`, `notes`, `created_at`.
  - `comparisons`: `id`, `user_id`, `items jsonb`, `created_at`.
  - `vendor_applications`: existing; ensure `status enum (pending|approved|rejected)` + `reject_reason`.
  - `upgrade_requests`: `id`, `vendor_id`, `current_tier`, `requested_tier`, `status`, `notes`, `created_at`.
  - `blog_posts`: for admin blog tab.
  - `referrals` (optional if needed later): `referrer_id`, `ref_code`, `clicks`, `signups`.
- Storage
  - Buckets: `profile-images` (broker/admin), `vendor-logos`, `vendor-media`.
  - Use signed URLs for public display; validate mime/size in upload handlers.
- Realtime
  - Channels on `leads`, `reviews`, `recommendations` for admin/vendor live updates.
- Procedures / RPCs
  - `increment_view(vendor_id)`.
  - `create_lead(vendor_id, broker_email, message, …)` that enforces status default and notifies.
  - `update_lead_status(lead_id, status, notes?)` with role checks.
  - `upsert_broker_profile(user_id, payload)`; `upsert_vendor_profile(user_id, payload)`.
  - `save_shortlist(user_id, item_id, item_type, metadata)`.
  - `save_recommendation(user_id, payload)`.
  - `save_comparison(user_id, items jsonb)`.
- Policies (RLS)
  - Brokers can read/update their `user_profiles`, `broker_profiles`, `shortlist`, `comparisons`, `recommendations`, and leads where `broker_email` matches.
  - Vendors can read/update their `vendor_profiles`, `leads` where `vendor_id` matches, and reviews on them (read; respond via status/notes if allowed).
  - Admins: full access.
  - Public read for approved vendors/reviews as needed via `status = approved`.
  - Storage: object-level policy `auth.uid() = profile.user_id` for uploads; admins bypass.
- Auth Routing
  - Use `user_profiles.user_type` to route to broker/vendor/admin dashboards server-side; guard client renders with session checks.

## Broker Dashboard Tasks (`src/app/dashboard/broker/page.tsx`)
- Remove onboarding questionnaire references; keep “What brought you here?” persistence.
- Inbox: label as “Coming soon” (no Supabase reads yet), keep nav item disabled/read-only state.
- Wire shortlist save/load via `shortlist` table; hydrate cards from Supabase.
- Wire recommendations & comparisons:
  - Persist recommendations to `recommendations` table (type + contact fields).
  - Persist comparison selections to `comparisons` table.
  - Track clicks/actions for analytics via RPC or inserts.
- Modals:
  - Reviews Written: fetch broker-authored reviews; if none, show CTA button to open “write review” modal/form.
  - Questions Answered: show most recent answered question; if none, link to community FAQ page.
  - Change “Referrals Made” to “Recommendations”; show count of recommendations; on click show latest recommendation or CTA to make one.
- Profile save: call `upsert_broker_profile` to persist all fields (aggregator, priorities, systems, providers, considering_change, display_name, notification frequency, what_brought_you_here).
- File upload: wire profile image to Storage bucket with signed URL; store path in profile.

## Vendor Dashboard Tasks (`src/app/dashboard/vendor/page.tsx`)
- Wire profile form to `upsert_vendor_profile`; include categories/features/integrations/listing_tier.
- Logo upload to `vendor-logos` bucket; save URL to profile.
- Leads: fetch from `leads` table by `vendor_id`; enable status updates via `update_lead_status` RPC; include notes.
- Reviews: list vendor reviews; show status; allow responding if required (optional reply field).
- Analytics: compute views/leads/conversion + last-30-days via Supabase view or client aggregation.
- Upgrade plan/settings: hook to `upgrade_requests` table (submit + status view).

## Admin Dashboard Tasks (`src/app/admin/page.tsx`)
- Applications tab: approve/reject with reason (update `vendor_applications`).
- Directory tab: manage `vendor_profiles` status/tier; edit key fields.
- Leads tab: filter by status/vendor; update status; assign if needed.
- Reviews tab: moderate (approve/reject) `reviews`.
- Blog tab: CRUD `blog_posts`.
- Analytics tab: add Supabase aggregates (views, leads, conversions, signups) and charts.
- Upgrade requests tab: manage `upgrade_requests`.

## Status Wiring
- Standardize enums:
  - Leads: `new`, `contacted`, `qualified`, `converted`, `lost`.
  - Reviews: `pending`, `approved`, `rejected`.
  - Applications: `pending`, `approved`, `rejected`.
  - Upgrade requests: `pending`, `approved`, `rejected`.
- Ensure UI filters/actions map to these values and RPCs enforce transitions.

## Release Steps (no seeding)
1) Create/verify Supabase tables, enums, buckets, policies, and RPCs (no seed data).
2) Wire Broker dashboard features as above; mark Inbox “Coming soon”.
3) Wire Vendor dashboard/profile + storage; enable lead status updates and analytics.
4) Expand Admin dashboard tabs to full functionality and moderation actions.
5) Add Realtime subscriptions for leads/reviews/recommendations where useful.
6) Smoke test role routing + RLS; confirm uploads and signed URLs work.
