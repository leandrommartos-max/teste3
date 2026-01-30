alter table public.trainings enable row level security;

create policy "Allow authenticated inserts on trainings"
  on public.trainings
  for insert
  to authenticated
  with check (auth.role() = 'authenticated');

create policy "Allow authenticated selects on trainings"
  on public.trainings
  for select
  to authenticated
  using (auth.role() = 'authenticated');
