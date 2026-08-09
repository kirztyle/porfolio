import { query } from "./db";

export type Profile = {
  id: number;
  name: string;
  title: string;
  title_en: string | null;
  photo_url: string | null;
  description: string;
  description_en: string | null;
  status: "open" | "limited" | "closed";
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
  sort_order: number;
};

export type Certificate = {
  id: number;
  title: string;
  category: string | null;
  sort_order: number;
};

export async function getProfile(): Promise<Profile | null> {
  const rows = await query<Profile>("SELECT * FROM profile ORDER BY id LIMIT 1");
  return rows[0] ?? null;
}

export async function getExperiences() {
  return query<Experience>("SELECT * FROM experiences ORDER BY sort_order ASC, id ASC");
}

export async function getSkills() {
  return query<Skill>("SELECT * FROM skills ORDER BY sort_order ASC, id ASC");
}

export async function getEducation() {
  return query<Education>("SELECT * FROM education ORDER BY sort_order ASC, id ASC");
}

export async function getProjects() {
  return query<Project>("SELECT * FROM projects ORDER BY sort_order ASC, id ASC");
}

export async function getCertificates() {
  return query<Certificate>("SELECT * FROM certificates ORDER BY sort_order ASC, id ASC");
}

export async function getPortfolioData() {
  const [profile, experiences, skills, education, projects, certificates] = await Promise.all([
    getProfile(),
    getExperiences(),
    getSkills(),
    getEducation(),
    getProjects(),
    getCertificates(),
  ]);
  return { profile, experiences, skills, education, projects, certificates };
}
