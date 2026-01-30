create policy "Allow authenticated uploads to training-documents"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'training-documents'
    and auth.role() = 'authenticated'
  );

create policy "Allow authenticated selects from training-documents"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'training-documents'
    and auth.role() = 'authenticated'
  );
