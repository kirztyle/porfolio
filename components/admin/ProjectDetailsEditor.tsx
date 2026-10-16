"use client";

import ResourceEditor, { type Item } from "./ResourceEditor";

/** Daftar sub-project (tab di hero project): tambah / edit / hapus / urutkan. */
export default function ProjectDetailsEditor({
  projectId,
  initial,
  onChange,
}: {
  projectId: number;
  initial: Item[];
  onChange: (items: Item[]) => void;
}) {
  return (
    <div>
      <p className="font-display text-[10px] tracking-[0.15em] text-teal">SUB-PROJECT</p>
      <p className="mb-3 mt-1 font-body text-[11px] text-dim">
        Setiap sub-project tampil sebagai tab di popup detail project. Tersimpan langsung (tidak perlu
        menekan SIMPAN project).
      </p>
      <ResourceEditor
        endpoint="/api/project-details"
        initialItems={initial}
        onItemsChange={onChange}
        itemTitle={(i) => String(i.title ?? "")}
        itemSubtitle={(i) => `${Array.isArray(i.images) ? i.images.length : 0} gambar`}
        emptyItem={{ project_id: projectId, title: "", title_en: "", description: "", description_en: "", bullets: "", bullets_en: "", images: [] }}
        fields={[
          { key: "title", label: "Judul Sub-project (ID)", type: "text" },
          { key: "title_en", label: "Sub-project Title (EN)", type: "text", hint: "Opsional, fallback ke versi ID kalau kosong" },
          { key: "description", label: "Deskripsi (ID)", type: "textarea", hint: "Paragraf dipisah baris kosong." },
          { key: "description_en", label: "Description (EN)", type: "textarea", hint: "Opsional. Fallback ke versi ID kalau kosong." },
          { key: "bullets", label: "Poin-poin (ID)", type: "textarea", hint: "Satu bullet per baris." },
          { key: "bullets_en", label: "Bullets (EN)", type: "textarea", hint: "Opsional. One bullet per line, fallback ke versi ID kalau kosong." },
          { key: "images", label: "Gambar Sub-project", type: "gallery", hint: "Urutan gambar = urutan tampil di carousel." },
        ]}
      />
    </div>
  );
}
