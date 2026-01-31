alter table public.training_records enable row level security;

drop policy if exists "Allow authenticated inserts on training_records" on public.training_records;
create policy "Allow authenticated inserts on training_records"
  on public.training_records
  for insert
  to authenticated
  with check (usuario_id = auth.uid());

drop policy if exists "Allow authenticated selects on training_records" on public.training_records;
create policy "Allow authenticated selects on training_records"
  on public.training_records
  for select
  to authenticated
  using (usuario_id = auth.uid());
