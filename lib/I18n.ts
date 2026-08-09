export type Lang = "id" | "en";

type Entry = { id: string; en: string };

export const dictionary = {
  nav: {
    experience: { id: "Pengalaman", en: "Experience" },
    projects: { id: "Proyek", en: "Projects" },
    skills: { id: "Keahlian", en: "Expertise" },
    contact: { id: "Kontak", en: "Contact" },
  },
  hero: {
    badge: {
      id: "Tersedia untuk Konsultasi & Posisi Full-time",
      en: "Available for Consulting & Full-time Roles",
    },
    ctaContact: { id: "Hubungi Saya", en: "Get in Touch" },
    ctaProjects: { id: "Lihat Proyek", en: "View Projects" },
  },
  experience: {
    heading: { id: "Pengalaman Profesional", en: "Professional Experience" },
    subtitle: {
      id: "Rekam jejak menghadirkan solusi enterprise di bidang perbankan, HR, dan analitik data.",
      en: "A track record of delivering enterprise solutions across banking, HR, and data analytics.",
    },
    present: { id: "Sekarang", en: "Present" },
    empty: { id: "Belum ada data pengalaman kerja.", en: "No work experience yet." },
  },
  skills: {
    heading: { id: "Keahlian Utama", en: "Core Expertise" },
    subtitle: {
      id: "Menjembatani kebutuhan bisnis dengan solusi IT yang scalable.",
      en: "Bridging the gap between business requirements and scalable IT solutions.",
    },
    empty: { id: "Belum ada data skill.", en: "No skills listed yet." },
  },
  projects: {
    heading: { id: "Proyek Pilihan", en: "Selected Projects" },
    subtitle: {
      id: "Inisiatif utama yang mendorong efisiensi operasional dan pengambilan keputusan berbasis data.",
      en: "Key initiatives driving operational efficiency and data-driven decision making.",
    },
    empty: { id: "Belum ada data project.", en: "No projects yet." },
  },
  background: {
    heading: { id: "Latar Belakang & Sertifikasi", en: "Background & Credentials" },
    education: { id: "Pendidikan", en: "Education" },
    certifications: { id: "Sertifikasi", en: "Certifications" },
    emptyEducation: { id: "Belum ada data pendidikan.", en: "No education data yet." },
    emptyCertificates: { id: "Belum ada data sertifikat.", en: "No certificates yet." },
  },
  contact: {
    heading: { id: "Mari Terhubung", en: "Let's Connect" },
    subtitle: {
      id: "Tertarik berkolaborasi atau mendiskusikan solusi data enterprise? Jangan ragu untuk menghubungi.",
      en: "Interested in collaborating or discussing enterprise data solutions? Feel free to reach out.",
    },
    linkedinValue: { id: "Terhubung dengan saya", en: "Connect with me" },
    rights: { id: "Seluruh hak cipta dilindungi.", en: "All rights reserved." },
  },
} as const;

export function t(entry: Entry, lang: Lang) {
  return entry[lang];
}

/**
 * Pilih versi konten sesuai bahasa aktif. Kalau versi EN kosong/belum diisi
 * lewat admin, otomatis fallback ke versi Indonesia (jadi tidak akan pernah blank).
 */
export function pick(
  idText: string | null | undefined,
  enText: string | null | undefined,
  lang: Lang
): string {
  if (lang === "en" && enText && enText.trim()) return enText;
  return idText || "";
}