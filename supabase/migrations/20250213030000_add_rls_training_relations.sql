alter table public.training_locations enable row level security;
alter table public.training_professional_categories enable row level security;
alter table public.training_sectors enable row level security;

create policy "Allow authenticated inserts on training_locations"
  on public.training_locations
  for insert
  to authenticated
  with check (auth.role() = 'authenticated');

create policy "Allow authenticated inserts on training_professional_categories"
  on public.training_professional_categories
  for insert
  to authenticated
  with check (auth.role() = 'authenticated');

create policy "Allow authenticated inserts on training_sectors"
  on public.training_sectors
  for insert
  to authenticated
  with check (auth.role() = 'authenticated');

create policy "Allow authenticated selects on training_locations"
  on public.training_locations
  for select
  to authenticated
  using (auth.role() = 'authenticated');

create policy "Allow authenticated selects on training_professional_categories"
  on public.training_professional_categories
  for select
  to authenticated
  using (auth.role() = 'authenticated');

create policy "Allow authenticated selects on training_sectors"
  on public.training_sectors
  for select
  to authenticated
  using (auth.role() = 'authenticated');
