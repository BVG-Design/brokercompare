-- Rename core vendor constructs to partner equivalents
do $$
begin
  -- user_profiles flags and ids
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'user_profiles' and column_name = 'vendor_dashboard') then
    alter table public.user_profiles rename column vendor_dashboard to partner_dashboard;
  end if;
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'user_profiles' and column_name = 'vendor_id') then
    alter table public.user_profiles rename column vendor_id to partner_id;
  end if;

  -- drop old checks if present
  if exists (select 1 from pg_constraint where conname = 'user_profiles_user_type_check') then
    alter table public.user_profiles drop constraint user_profiles_user_type_check;
  end if;
  if exists (select 1 from pg_constraint where conname = 'user_profiles_default_dashboard_check') then
    alter table public.user_profiles drop constraint user_profiles_default_dashboard_check;
  end if;
  if exists (select 1 from pg_constraint where conname = 'user_profiles_default_profile_check') then
    alter table public.user_profiles drop constraint user_profiles_default_profile_check;
  end if;

  -- normalize existing data
  update public.user_profiles set user_type = 'partner' where user_type = 'vendor';
  update public.user_profiles set default_dashboard = 'partner' where default_dashboard = 'vendor';
  update public.user_profiles set default_profile = 'partner' where default_profile = 'vendor';

  -- add partner-oriented checks
  alter table public.user_profiles
    add constraint user_profiles_user_type_check check (user_type in ('consumer','partner','admin','broker')),
    add constraint user_profiles_default_dashboard_check check (default_dashboard in ('admin','broker','partner')),
    add constraint user_profiles_default_profile_check check (default_profile in ('admin','broker','partner'));

  -- rename base tables
  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'vendors') then
    alter table public.vendors rename to partners;
  end if;
  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'vendor_applications') then
    alter table public.vendor_applications rename to partner_application;
  end if;
  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'vendor_service_areas') then
    alter table public.vendor_service_areas rename to partner_service_areas;
  end if;

  -- rename core indices/triggers
  if exists (select 1 from pg_class where relname = 'idx_vendors_status') then
    alter index idx_vendors_status rename to idx_partners_status;
  end if;
  if exists (select 1 from pg_class where relname = 'idx_vendors_listing_type') then
    alter index idx_vendors_listing_type rename to idx_partners_listing_type;
  end if;
  if exists (select 1 from pg_trigger where tgname = 'vendors_set_updated_at') then
    alter trigger vendors_set_updated_at on public.partners rename to partners_set_updated_at;
  end if;
  if exists (select 1 from pg_class where relname = 'idx_vendor_applications_status') then
    alter index idx_vendor_applications_status rename to idx_partner_application_status;
  end if;
  if exists (select 1 from pg_trigger where tgname = 'vendor_applications_set_updated_at') then
    alter trigger vendor_applications_set_updated_at on public.partner_application rename to partner_application_set_updated_at;
  end if;
  if exists (select 1 from pg_trigger where tgname = 'vendor_service_areas_set_updated_at') then
    alter trigger vendor_service_areas_set_updated_at on public.partner_service_areas rename to partner_service_areas_set_updated_at;
  end if;

  -- rename foreign keys/columns pointing at vendors
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'partner_application' and column_name = 'vendor_id') then
    alter table public.partner_application rename column vendor_id to partner_id;
  end if;
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'leads' and column_name = 'vendor_id') then
    alter table public.leads rename column vendor_id to partner_id;
  end if;
  if exists (select 1 from pg_class where relname = 'idx_leads_vendor') then
    alter index idx_leads_vendor rename to idx_leads_partner;
  end if;
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'reviews' and column_name = 'vendor_id') then
    alter table public.reviews rename column vendor_id to partner_id;
  end if;
  if exists (select 1 from pg_class where relname = 'idx_reviews_vendor') then
    alter index idx_reviews_vendor rename to idx_reviews_partner;
  end if;
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'shortlists' and column_name = 'vendor_id') then
    alter table public.shortlists rename column vendor_id to partner_id;
  end if;
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'shortlists' and column_name = 'vendor_name') then
    alter table public.shortlists rename column vendor_name to partner_name;
  end if;
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'shortlists' and column_name = 'vendor_type') then
    alter table public.shortlists rename column vendor_type to partner_type;
  end if;

  -- listing metadata tables
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'listing_badges' and column_name = 'vendor_id') then
    alter table public.listing_badges rename column vendor_id to partner_id;
  end if;
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'listing_scores' and column_name = 'vendor_id') then
    alter table public.listing_scores rename column vendor_id to partner_id;
  end if;
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'trust_signals' and column_name = 'vendor_id') then
    alter table public.trust_signals rename column vendor_id to partner_id;
  end if;
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'listing_features' and column_name = 'vendor_id') then
    alter table public.listing_features rename column vendor_id to partner_id;
  end if;

  -- works_with relationships
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'works_with' and column_name = 'vendor_id') then
    alter table public.works_with rename column vendor_id to partner_id;
  end if;
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'works_with' and column_name = 'related_vendor_id') then
    alter table public.works_with rename column related_vendor_id to related_partner_id;
  end if;
  if exists (select 1 from pg_constraint where conname = 'works_with_no_self_ref') then
    alter table public.works_with drop constraint works_with_no_self_ref;
  end if;
  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'works_with') then
    alter table public.works_with
      add constraint works_with_no_self_ref check (partner_id is null or related_partner_id is null or partner_id <> related_partner_id);
  end if;

  -- service areas
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'partner_service_areas' and column_name = 'vendor_id') then
    alter table public.partner_service_areas rename column vendor_id to partner_id;
  end if;

  -- compatibility views for legacy references
  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'partners') then
    create or replace view public.vendors as select * from public.partners;
  end if;
  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'partner_application') then
    create or replace view public.vendor_applications as select * from public.partner_application;
  end if;
  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'partner_service_areas') then
    create or replace view public.vendor_service_areas as select * from public.partner_service_areas;
  end if;
end$$;
