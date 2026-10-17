-- Relasi project -> pengalaman kerja (opsional). Dipakai untuk link "Proyek terkait"
-- di section Experience. Hapus pengalaman => project tetap ada, relasinya dikosongkan.
alter table public.projects
  add column if not exists experience_id integer
    references public.experiences(id) on delete set null;

create index if not exists projects_experience_id_idx
  on public.projects(experience_id);

-- Isi awal sesuai data saat ini (hanya untuk project yang belum di-set).
-- Panin Dubai Syariah Bank (1): EWS, CIF Data Integration, Analytics Dashboard.
update public.projects set experience_id = 1 where id in (1, 2, 3) and experience_id is null;
-- Husky CNOOC Madura (2): Knowledge Management System, HR Analytics & Automation.
update public.projects set experience_id = 2 where id in (4, 5) and experience_id is null;
