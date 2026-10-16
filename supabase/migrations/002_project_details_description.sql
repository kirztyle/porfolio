-- Deskripsi per sub-project (tampil di atas bullet pada tab).
alter table public.project_details
  add column if not exists description text,
  add column if not exists description_en text;
