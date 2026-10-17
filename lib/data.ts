import { createClient } from "@supabase/supabase-js";

export type Profile = {
  id: number;
  name: string;
  title: string;
  title_en: string | null;
  photo_url: string | null;
  description: string;
  description_en: string | null;
  status: string | null; // teks bebas di DB; nilai umum: open | limited | closed
  email: string | null;
  phone: string | null;
  linkedin: string | null;
  instagram: string | null;
  location: string | null;
};

export type Experience = {
  id: number;
  company: string;
  role: string;
  role_en: string | null;
  location: string | null;
  period_start: string | null;
  period_end: string | null;
  description: string | null;
  description_en: string | null;
  sort_order: number;
};

export type Skill = {
  id: number;
  category: string;
  items: string;
  sort_order: number;
};

export type Education = {
  id: number;
  school: string;
  degree: string | null;
  location: string | null;
  period_start: string | null;
  period_end: string | null;
  meta: string | null;
  sort_order: number;
};

export type Project = {
  id: number;
  title: string;
  title_en: string | null;
  description: string | null;
  description_en: string | null;
  tags: string | null;
  link: string | null;
  image_url: string | null;
  images: string[];
  details: ProjectDetail[];
  experience_id?: number | null; // kolom baru (migrasi 003); undefined jika belum ada
  sort_order: number;
};

export type ProjectDetail = {
  id: number;
  project_id: number;
  title: string;
  title_en: string | null;
  description?: string | null; // kolom baru (migrasi 002); undefined jika belum ada
  description_en?: string | null;
  bullets: string | null;
  bullets_en: string | null;
  images: string[];
  sort_order: number;
};

export type Certificate = {
  id: number;
  title: string;
  category: string | null;
  sort_order: number;
};

/**
 * Client publik (publishable key, tanpa cookies/sesi). Data portfolio
 * bersifat publik (RLS select publik). Tidak ada cache: setiap request
 * membaca data terbaru, jadi hasil simpan dari admin langsung tampil.
 */
function publicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Env NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY belum diset.",
    );
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function listRows<T>(table: string): Promise<T[]> {
  const { data, error } = await publicClient()
    .from(table)
    .select("*")
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true });
  if (error) throw new Error(`Gagal mengambil tabel "${table}": ${error.message}`);
  return (data ?? []) as T[];
}

export async function getProfile(): Promise<Profile | null> {
  const { data, error } = await publicClient()
    .from("profile")
    .select("*")
    .order("id", { ascending: true })
    .limit(1);
  if (error) throw new Error(`Gagal mengambil tabel "profile": ${error.message}`);
  return ((data ?? [])[0] as Profile | undefined) ?? null;
}

export const getExperiences = () => listRows<Experience>("experiences");
export const getSkills = () => listRows<Skill>("skills");
export const getEducation = () => listRows<Education>("education");

/** jsonb bisa null / bukan array: paksa jadi string[] tanpa item kosong. */
export function normalizeImages(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.filter((x): x is string => typeof x === "string" && x.trim() !== "");
}

type RawDetail = Omit<ProjectDetail, "images"> & { images: unknown };
type RawProject = Omit<Project, "images" | "details"> & {
  images: unknown;
  project_details: RawDetail[] | null;
};

export async function getProjects(): Promise<Project[]> {
  const { data, error } = await publicClient()
    .from("projects")
    .select("*, project_details(*)")
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true });
  if (error) throw new Error(`Gagal mengambil tabel "projects": ${error.message}`);
  return ((data ?? []) as RawProject[]).map(({ project_details, ...p }) => {
    const images = normalizeImages(p.images);
    const details = [...(project_details ?? [])]
      .sort((a, b) => a.sort_order - b.sort_order || a.id - b.id)
      .map((d) => ({ ...d, images: normalizeImages(d.images) }));
    return {
      ...p,
      images: images.length === 0 && p.image_url ? [p.image_url] : images,
      details,
    };
  });
}
export const getCertificates = () => listRows<Certificate>("certificates");

export async function getPortfolioData() {
  const [profile, experiences, skills, education, projects, certificates] =
    await Promise.all([
      getProfile(),
      getExperiences(),
      getSkills(),
      getEducation(),
      getProjects(),
      getCertificates(),
    ]);
  return { profile, experiences, skills, education, projects, certificates };
}
