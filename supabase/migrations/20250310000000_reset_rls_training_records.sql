alter table public.training_records enable row level security;

do $$
declare
  policy_rec record;
begin
  for policy_rec in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'training_records'
  loop
    execute format('drop policy if exists %I on public.training_records', policy_rec.policyname);
  end loop;
end $$;

create policy "Allow authenticated inserts on training_records"
  on public.training_records
  for insert
  to authenticated
  with check (usuario_id = auth.uid());

create policy "Allow authenticated selects on training_records"
  on public.training_records
  for select
  to authenticated
  using (usuario_id = auth.uid());
