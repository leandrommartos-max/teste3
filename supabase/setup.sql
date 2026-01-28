-- Supabase setup for SRC

-- 1) Core lookup tables (used by Register flow)
create table if not exists public.funcao (
  id bigserial primary key,
  funcao text not null
);

create table if not exists public.setor (
  id bigserial primary key,
  setor text not null
);

alter table public.funcao enable row level security;
alter table public.setor enable row level security;

drop policy if exists "public read funcao" on public.funcao;
create policy "public read funcao"
  on public.funcao
  for select
  to anon, authenticated
  using (true);

drop policy if exists "public read setor" on public.setor;
create policy "public read setor"
  on public.setor
  for select
  to anon, authenticated
  using (true);

-- 2) Profiles
create table if not exists public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text,
  nome_completo text,
  cpf text,
  procedencia text,
  funcao text,
  setor text,
  categoria text,
  instituicao text,
  funcao_curso text,
  vinculo text,
  matricula text,
  nome_empresa text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles read own" on public.profiles;
create policy "profiles read own"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "profiles upsert own" on public.profiles;
create policy "profiles upsert own"
  on public.profiles
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "profiles update own" on public.profiles;
create policy "profiles update own"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 3) User roles
create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references auth.users (id) on delete cascade,
  papel text not null,
  created_at timestamptz not null default now(),
  unique (usuario_id, papel)
);

alter table public.user_roles enable row level security;

drop policy if exists "user_roles read own" on public.user_roles;
create policy "user_roles read own"
  on public.user_roles
  for select
  to authenticated
  using (auth.uid() = usuario_id);

-- 4) Trainings (capacitacoes)
create table if not exists public.capacitacoes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  reference_manager text,
  duration_minutes integer,
  instructor_name text,
  version text,
  cover_image_path text,
  video_link text,
  institution text,
  sector text,
  professional_category text,
  role_function text,
  employment_bond text,
  completion_deadline date,
  requirement_level text,
  audience_message text,
  reference_pdf_path text,
  quiz_questions jsonb,
  term_model text,
  term_text text,
  status text,
  created_at timestamptz not null default now()
);

alter table public.capacitacoes enable row level security;

drop policy if exists "capacitacoes read" on public.capacitacoes;
create policy "capacitacoes read"
  on public.capacitacoes
  for select
  to authenticated
  using (true);

drop policy if exists "capacitacoes write" on public.capacitacoes;
create policy "capacitacoes write"
  on public.capacitacoes
  for insert
  to authenticated
  with check (true);

drop policy if exists "capacitacoes update" on public.capacitacoes;
create policy "capacitacoes update"
  on public.capacitacoes
  for update
  to authenticated
  using (true)
  with check (true);

-- 5) Storage bucket for training assets
insert into storage.buckets (id, name, public)
values ('capacitacoes-assets', 'capacitacoes-assets', false)
on conflict (id) do nothing;

drop policy if exists "capacitacoes-assets read" on storage.objects;
create policy "capacitacoes-assets read"
  on storage.objects
  for select
  to authenticated
  using (bucket_id = 'capacitacoes-assets');

drop policy if exists "capacitacoes-assets upload" on storage.objects;
create policy "capacitacoes-assets upload"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'capacitacoes-assets');

drop policy if exists "capacitacoes-assets update" on storage.objects;
create policy "capacitacoes-assets update"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'capacitacoes-assets')
  with check (bucket_id = 'capacitacoes-assets');

drop policy if exists "capacitacoes-assets delete" on storage.objects;
create policy "capacitacoes-assets delete"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'capacitacoes-assets');
