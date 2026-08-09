"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProfileForm from "./ProfileForm";
import ResourceEditor from "./ResourceEditor";
import type {
  Profile,
  Experience,
  Skill,
  Education,
  Project,
  Certificate,
} from "@/lib/data";

const TABS = [
  { key: "profile", label: "Profil" },
  { key: "experience", label: "Pengalaman" },
  { key: "skills", label: "Skills" },
  { key: "education", label: "Pendidikan" },
  { key: "projects", label: "Projects" },
  { key: "certificates", label: "Sertifikat" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function AdminDashboard({
  profile,
  experiences,
  skills,
  education,
  projects,
  certificates,
}: {
  profile: Profile | null;
  experiences: Experience[];
  skills: Skill[];
  education: Education[];
  projects: Project[];
  certificates: Certificate[];
}) {
  const [tab, setTab] = useState<TabKey>("profile");
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-bg">
      <header className="sticky top-0 z-20 border-b border-hairline bg-bg/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div>
            <p className="font-display text-[10px] tracking-[0.25em] text-teal">
              ADMIN_PANEL
            </p>
            <h1 className="font-display text-lg font-semibold text-primary">
              Kelola Portfolio
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              className="font-display text-[11px] tracking-wide text-muted hover:text-teal transition-colors"
            >
              LIHAT SITUS →
            </a>
            <button
              onClick={handleLogout}
              className="rounded-sm border border-hairline px-3 py-1.5 font-display text-[11px] tracking-wide text-muted hover:border-red hover:text-red transition-colors"
            >
              KELUAR
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="flex flex-wrap gap-2 border-b border-hairline pb-4">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`rounded-sm px-3 py-2 font-display text-xs tracking-wide transition-colors ${
                tab === t.key
                  ? "bg-teal text-bg"
                  : "border border-hairline text-muted hover:text-primary"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {tab === "profile" && <ProfileForm initial={profile} />}

          {tab === "experience" && (
            <ResourceEditor
              endpoint="/api/experiences"
              initialItems={experiences}
              itemTitle={(i) => `${i.role} — ${i.company}`}
              itemSubtitle={(i) => [i.period_start, i.period_end].filter(Boolean).join(" — ")}
              emptyItem={{ company: "", role: "", location: "", period_start: "", period_end: "", description: "" }}
              fields={[
                { key: "role", label: "Jabatan", type: "text" },
                { key: "company", label: "Perusahaan", type: "text" },
                { key: "location", label: "Lokasi", type: "text" },
                { key: "period_start", label: "Mulai", type: "text", placeholder: "cth. Aug 2025" },
                { key: "period_end", label: "Selesai", type: "text", placeholder: "cth. Present" },
                {
                  key: "description",
                  label: "Deskripsi Tugas (bullet)",
                  type: "textarea",
                  hint: "Satu poin per baris — setiap baris akan tampil sebagai bullet.",
                },
              ]}
            />
          )}

          {tab === "skills" && (
            <ResourceEditor
              endpoint="/api/skills"
              initialItems={skills}
              itemTitle={(i) => String(i.category ?? "")}
              itemSubtitle={(i) => String(i.items ?? "")}
              emptyItem={{ category: "", items: "" }}
              fields={[
                { key: "category", label: "Kategori", type: "text", placeholder: "cth. Programming & Development" },
                {
                  key: "items",
                  label: "Daftar Skill",
                  type: "textarea",
                  hint: "Pisahkan dengan koma, cth: React, Vue.js, Next.js",
                },
              ]}
            />
          )}

          {tab === "education" && (
            <ResourceEditor
              endpoint="/api/education"
              initialItems={education}
              itemTitle={(i) => String(i.school ?? "")}
              itemSubtitle={(i) => String(i.degree ?? "")}
              emptyItem={{ school: "", degree: "", location: "", period_start: "", period_end: "", meta: "" }}
              fields={[
                { key: "school", label: "Institusi", type: "text" },
                { key: "degree", label: "Jurusan / Gelar", type: "text" },
                { key: "location", label: "Lokasi", type: "text" },
                { key: "period_start", label: "Mulai", type: "text" },
                { key: "period_end", label: "Selesai", type: "text" },
                { key: "meta", label: "Info Tambahan (cth. GPA)", type: "text" },
              ]}
            />
          )}

          {tab === "projects" && (
            <ResourceEditor
              endpoint="/api/projects"
              initialItems={projects}
              itemTitle={(i) => String(i.title ?? "")}
              itemSubtitle={(i) => String(i.tags ?? "")}
              emptyItem={{ title: "", description: "", tags: "", link: "", image_url: "" }}
              fields={[
                { key: "image_url", label: "Gambar Project", type: "image" },
                { key: "title", label: "Judul Project", type: "text" },
                { key: "description", label: "Deskripsi", type: "textarea" },
                { key: "tags", label: "Tags", type: "text", hint: "Pisahkan dengan koma" },
                { key: "link", label: "Link (opsional)", type: "text", placeholder: "https://..." },
              ]}
            />
          )}

          {tab === "certificates" && (
            <ResourceEditor
              endpoint="/api/certificates"
              initialItems={certificates}
              itemTitle={(i) => String(i.title ?? "")}
              itemSubtitle={(i) => String(i.category ?? "")}
              emptyItem={{ title: "", category: "" }}
              fields={[
                { key: "title", label: "Nama Sertifikat", type: "text" },
                { key: "category", label: "Kategori", type: "text" },
              ]}
            />
          )}
        </div>
      </div>
    </div>
  );
}
