-- Galeri gambar untuk hero project (array URL). image_url lama tetap dipakai sebagai fallback.
alter table public.projects
  add column if not exists images jsonb not null default '[]'::jsonb;

-- Sub-project: satu baris = satu tab di hero project.
create table if not exists public.project_details (
  id integer generated always as identity primary key,
  project_id integer not null references public.projects(id) on delete cascade,
  title text not null,
  title_en text,
  bullets text,      -- satu bullet per baris
  bullets_en text,   -- satu bullet per baris
  images jsonb not null default '[]'::jsonb,
  sort_order integer not null default 0
);

create index if not exists project_details_project_id_idx
  on public.project_details(project_id);

alter table public.project_details enable row level security;

drop policy if exists "Public read" on public.project_details;
create policy "Public read" on public.project_details for select using (true);
