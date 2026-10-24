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
    relatedProjects: { id: "Proyek terkait", en: "Related projects" },
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
    detailLabel: { id: "Rincian project", en: "Project details" },
    viewProject: { id: "Lihat project", en: "View project" },
    prev: { id: "Gambar sebelumnya", en: "Previous image" },
    next: { id: "Gambar berikutnya", en: "Next image" },
    goTo: { id: "Ke gambar", en: "Go to image" },
    viewDetails: { id: "Lihat detail", en: "View details" },
    close: { id: "Tutup", en: "Close" },
  },
  background: {
    heading: { id: "Latar Belakang & Sertifikasi", en: "Background & Credentials" },
    education: { id: "Pendidikan", en: "Education" },
    certifications: { id: "Sertifikasi", en: "Certifications" },
    emptyEducation: { id: "Belum ada data pendidikan.", en: "No education data yet." },
    emptyCertificates: { id: "Belum ada data sertifikat.", en: "No certificates yet." },
  },
  cv: {
    heading: { id: "Unduh CV", en: "Download CV" },
    subtitle: {
      id: "Tersedia dalam dua versi, pilih yang paling sesuai.",
      en: "Available in two versions, pick the one that fits best.",
    },
    atsTitle: { id: "Versi ATS", en: "ATS Version" },
    atsDesc: {
      id: "Format ringkas satu kolom yang mudah dipindai cepat dan bisa langsung diunggah ke sistem rekrutmen (ATS).",
      en: "A concise single-column format that's quick to scan and ready to upload into an applicant tracking system.",
    },
    creativeTitle: { id: "Versi Creative", en: "Creative Version" },
    creativeDesc: {
      id: "Tampilan visual dengan foto, timeline pengalaman, dan kartu proyek yang nyaman dibaca.",
      en: "A visual layout with photo, experience timeline, and project cards that's easy to read.",
    },
    recommended: { id: "Ramah ATS", en: "ATS-friendly" },
    download: { id: "Unduh PDF", en: "Download PDF" },
    language: { id: "Bahasa CV", en: "CV language" },
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
