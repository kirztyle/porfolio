"use client";

import { useState } from "react";
import Image from "next/image";
import type { Profile } from "@/lib/data";

export default function ProfileForm({ initial }: { initial: Profile | null }) {
  const [form, setForm] = useState({
    name: initial?.name || "",
    title: initial?.title || "",
    title_en: initial?.title_en || "",
    photo_url: initial?.photo_url || "",
    description: initial?.description || "",
    description_en: initial?.description_en || "",
    status: initial?.status || "open",
    email: initial?.email || "",
    phone: initial?.phone || "",
    linkedin: initial?.linkedin || "",
    instagram: initial?.instagram || "",
    location: initial?.location || "",
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setMessage("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Upload gagal");
        return;
      }
      set("photo_url", data.url);
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        setMessage("Gagal menyimpan profil");
        return;
      }
      setMessage("Profil tersimpan ✅");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-[220px_1fr]">
      {/* Photo */}
      <div>
        <label className="block font-display text-[10px] tracking-[0.15em] text-dim">
          FOTO PROFIL
        </label>
        <div className="mt-2 h-[200px] w-[200px] overflow-hidden rounded-sm border border-hairline bg-panel2">
          {form.photo_url ? (
            <Image
              src={form.photo_url}
              alt="Preview"
              width={200}
              height={200}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center font-display text-xs text-dim">
              NO_PHOTO
            </div>
          )}
        </div>
        <label className="mt-3 inline-block cursor-pointer rounded-sm border border-hairline px-3 py-2 font-display text-[11px] tracking-wide text-muted hover:border-teal hover:text-teal transition-colors">
          {uploading ? "MENGUNGGAH..." : "GANTI FOTO"}
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="hidden"
            onChange={handlePhotoChange}
            disabled={uploading}
          />
        </label>
        <p className="mt-1 font-body text-[11px] text-dim">JPG/PNG/WEBP, maks 5MB</p>
      </div>

      {/* Fields */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Nama">
            <input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              className="input"
              placeholder="Nama lengkap"
            />
          </Field>
          <Field label="Status Ketersediaan">
            <select
              value={form.status}
              onChange={(e) => set("status", e.target.value)}
              className="input"
            >
              <option value="open">Open to work</option>
              <option value="limited">Limited availability</option>
              <option value="closed">Not available</option>
            </select>
          </Field>
        </div>

        {/* --- Versi Indonesia --- */}
        <div className="rounded-sm border border-hairline p-4">
          <p className="mb-3 font-display text-[10px] tracking-[0.15em] text-teal">
            VERSI INDONESIA
          </p>
          <div className="space-y-4">
            <Field label="Jabatan / Tagline">
              <input
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                className="input"
                placeholder="cth. IT Developer — Risk Analytics"
              />
            </Field>
            <Field label="Deskripsi Diri">
              <textarea
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                rows={5}
                className="input"
                placeholder="Ceritakan tentang dirimu, pengalaman, dan keahlian utama"
              />
            </Field>
          </div>
        </div>

        {/* --- Versi Inggris --- */}
        <div className="rounded-sm border border-hairline p-4">
          <p className="mb-3 font-display text-[10px] tracking-[0.15em] text-amber">
            ENGLISH VERSION (opsional)
          </p>
          <div className="space-y-4">
            <Field label="Title / Tagline (EN)">
              <input
                value={form.title_en}
                onChange={(e) => set("title_en", e.target.value)}
                className="input"
                placeholder="e.g. IT Developer — Risk Analytics"
              />
            </Field>
            <Field label="About Me (EN)">
              <textarea
                value={form.description_en}
                onChange={(e) => set("description_en", e.target.value)}
                rows={5}
                className="input"
                placeholder="Tell about yourself, experience, and core skills"
              />
            </Field>
          </div>
          <p className="mt-2 font-body text-[11px] text-dim">
            Kalau dikosongkan, halaman publik akan otomatis pakai versi Indonesia saat mode EN dipilih.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Lokasi">
            <input
              value={form.location}
              onChange={(e) => set("location", e.target.value)}
              className="input"
              placeholder="Jakarta, Indonesia"
            />
          </Field>
          <Field label="Email">
            <input
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              className="input"
              placeholder="nama@email.com"
            />
          </Field>
          <Field label="WhatsApp / Telepon">
            <input
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              className="input"
              placeholder="+62 8xx xxxx xxxx"
            />
          </Field>
          <Field label="LinkedIn (username)">
            <input
              value={form.linkedin}
              onChange={(e) => set("linkedin", e.target.value)}
              className="input"
              placeholder="Nama LinkedIn"
            />
          </Field>
          <Field label="Instagram (username)">
            <input
              value={form.instagram}
              onChange={(e) => set("instagram", e.target.value)}
              className="input"
              placeholder="@username"
            />
          </Field>
        </div>

        <div className="flex items-center gap-4 pt-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-sm bg-teal px-5 py-2.5 font-display text-xs font-semibold tracking-wide text-bg hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "MENYIMPAN..." : "SIMPAN PROFIL"}
          </button>
          {message && <span className="font-body text-sm text-muted">{message}</span>}
        </div>
      </div>

      <style jsx global>{`
        .input {
          margin-top: 0.375rem;
          width: 100%;
          border-radius: 0.125rem;
          border: 1px solid var(--hairline);
          background: var(--bg);
          padding: 0.5rem 0.75rem;
          font-family: var(--font-body);
          font-size: 0.875rem;
          color: var(--text-primary);
          outline: none;
        }
        .input:focus {
          border-color: var(--accent-teal);
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block font-display text-[10px] tracking-[0.15em] text-dim">
        {label.toUpperCase()}
      </label>
      {children}
    </div>
  );
}