-- Ensure one onboarding submission per email (case-insensitive)
create unique index if not exists what_brought_you_here_email_key
  on public.what_brought_you_here (lower(email));
