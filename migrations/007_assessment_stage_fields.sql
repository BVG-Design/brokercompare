-- Add stage metadata to application assessments and provide flexible catalog tables
-- (avoids Postgres enums so stages/associations can evolve without migrations)

alter table if exists public.application_assessments
  add column if not exists stage text,
  add column if not exists stage_associations text[] default '{}'::text[];

create table if not exists public.assessment_stages (
  id text primary key,
  label text not null,
  position int default 0,
  is_active boolean default true,
  created_at timestamptz not null default now()
);

create table if not exists public.assessment_stage_associations (
  id text primary key,
  label text not null,
  created_at timestamptz not null default now()
);

-- Seed defaults (safe to re-run)
insert into public.assessment_stages (id, label, position)
values
  ('pre_start', 'Pre-Start', 1),
  ('client_acquisition', 'Client Acquisition', 2),
  ('application', 'Application', 3),
  ('settlement', 'Settlement', 4),
  ('post_settlement', 'Post-Settlement', 5),
  ('ongoing', 'Ongoing', 6),
  ('ninja_mode', 'Ninja-Mode', 7)
on conflict (id) do update set label = excluded.label, position = excluded.position;

insert into public.assessment_stage_associations (id, label)
values
  ('people', 'People'),
  ('tools', 'Tools'),
  ('processes_automations', 'Processes & Automations')
on conflict (id) do update set label = excluded.label;
