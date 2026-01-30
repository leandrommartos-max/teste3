alter table public.trainings
  add column if not exists cover_image_path text,
  add column if not exists reference_pdf_path text;
