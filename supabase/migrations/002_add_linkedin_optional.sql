alter table public.submissions alter column instagram drop not null;
alter table public.submissions add column if not exists linkedin text;

drop policy if exists "Public can submit a lead" on public.submissions;
create policy "Public can submit a lead"
  on public.submissions
  for insert
  to anon
  with check (char_length(name) between 2 and 100
    and char_length(phone) between 7 and 20
    and (instagram is null or char_length(instagram) between 2 and 30)
    and (linkedin is null or char_length(linkedin) between 3 and 200)
    and char_length(email) between 5 and 160);