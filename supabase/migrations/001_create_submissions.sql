create extension if not exists pgcrypto;

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  instagram text,
  linkedin text,
  email text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists submissions_created_at_idx on public.submissions (created_at desc);
create index if not exists submissions_email_idx on public.submissions (email);
create index if not exists submissions_phone_idx on public.submissions (phone);

alter table public.submissions enable row level security;

grant insert on table public.submissions to anon;

create policy "Public can submit a lead"
  on public.submissions
  for insert
  to anon
  with check (char_length(name) between 2 and 100
    and char_length(phone) between 7 and 20
    and char_length(email) between 5 and 160);
