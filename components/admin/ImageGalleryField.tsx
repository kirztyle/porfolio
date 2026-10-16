"use client";

import { useState } from "react";
import Image from "next/image";

/** Galeri multi-gambar: upload beberapa file (via /api/upload), preview, hapus, urut naik/turun. */
export default function ImageGalleryField({
  value,
  onChange,
}: {
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;
    setUploading(true);
    setError(null);
    const urls: string[] = [];
    try {
      // Berurutan: nama file di /api/upload berbasis Date.now().
      for (const file of files) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setError(`${file.name}: ${data.error || "Upload gagal"}`);
          break;
        }
        urls.push(data.url);
      }
    } finally {
      if (urls.length > 0) onChange([...value, ...urls]);
      setUploading(false);
    }
  }

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }

  const mini =
    "rounded-sm border border-hairline px-2 py-0.5 font-display text-[10px] text-muted transition-colors hover:border-teal hover:text-teal disabled:opacity-30";

  return (
    <div className="mt-1.5">
      {value.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {value.map((url, i) => (
            <li key={`${url}-${i}`} className="rounded-sm border border-hairline bg-bg p-1.5">
              <div className="relative aspect-video overflow-hidden rounded-sm bg-panel2">
                <Image
                  src={url}
                  alt={`Gambar ${i + 1}`}
                  fill
                  sizes="200px"
                  className="object-contain"
                />
                <span className="absolute left-1 top-1 rounded-sm bg-bg/80 px-1.5 font-display text-[10px] text-muted">
                  {i + 1}
                </span>
              </div>
              <div className="mt-1.5 flex items-center justify-between gap-1">
                <div className="flex gap-1">
                  <button type="button" aria-label="Naik" disabled={i === 0} onClick={() => move(i, -1)} className={mini}>
                    ←
                  </button>
                  <button
                    type="button"
                    aria-label="Turun"
                    disabled={i === value.length - 1}
                    onClick={() => move(i, 1)}
                    className={mini}
                  >
                    →
                  </button>
                </div>
                <button
                  type="button"
                  aria-label="Hapus gambar"
                  onClick={() => onChange(value.filter((_, k) => k !== i))}
                  className="rounded-sm border border-hairline px-2 py-0.5 font-display text-[10px] text-red transition-colors hover:border-red"
                >
                  Hapus
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <label className="mt-3 inline-block cursor-pointer rounded-sm border border-hairline px-3 py-2 font-display text-[11px] tracking-wide text-muted transition-colors hover:border-teal hover:text-teal">
        {uploading ? "MENGUNGGAH..." : value.length > 0 ? "+ TAMBAH GAMBAR" : "PILIH GAMBAR (BISA BANYAK)"}
        <input
          type="file"
          multiple
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="hidden"
          onChange={handleFiles}
          disabled={uploading}
        />
      </label>
      {error && <p className="mt-1 font-body text-[11px] text-red">{error}</p>}
    </div>
  );
}
