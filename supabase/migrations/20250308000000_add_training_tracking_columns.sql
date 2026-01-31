-- Adds tracking columns required by the student training flow.
-- If your primary keys are not UUIDs, adjust the column types accordingly.

alter table if exists training_answers
  add column if not exists attempt_id uuid,
  add column if not exists selected_option text;

alter table if exists training_attempts
  add column if not exists student_id uuid,
  add column if not exists training_id uuid,
  add column if not exists started_at timestamptz,
  add column if not exists finished_at timestamptz,
  add column if not exists status text,
  add column if not exists total_questions integer,
  add column if not exists answered_questions integer,
  add column if not exists terms_accepted_at timestamptz,
  add column if not exists metadata jsonb;

alter table if exists training_records
  add column if not exists student_id uuid,
  add column if not exists training_id uuid,
  add column if not exists user_id uuid,
  add column if not exists attempt_id uuid,
  add column if not exists completed_at timestamptz,
  add column if not exists status text,
  add column if not exists total_questions integer,
  add column if not exists answered_questions integer,
  add column if not exists terms_accepted_at timestamptz,
  add column if not exists metadata jsonb;

alter table if exists sys_audit_log
  add column if not exists user_id uuid,
  add column if not exists action text,
  add column if not exists entity_type text,
  add column if not exists entity_id uuid,
  add column if not exists description text,
  add column if not exists metadata jsonb,
  add column if not exists created_at timestamptz default now();
