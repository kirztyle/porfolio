/**
 * Validasi `images` dari body request.
 * undefined -> tidak dikirim (jangan ubah kolom); null -> tidak valid.
 */
export function parseImages(v: unknown): string[] | null | undefined {
  if (v === undefined) return undefined;
  if (!Array.isArray(v) || !v.every((x) => typeof x === "string")) return null;
  return (v as string[]).map((x) => x.trim()).filter(Boolean);
}

/**
 * Validasi foreign key opsional (mis. `experience_id`).
 * undefined -> tidak dikirim (jangan ubah kolom); "" / null -> kosongkan relasi;
 * NaN -> tidak valid. Hasil tidak valid dikembalikan sebagai NaN.
 */
export function parseOptionalId(v: unknown): number | null | undefined {
  if (v === undefined) return undefined;
  if (v === null || v === "") return null;
  const n = Number(v);
  return Number.isInteger(n) && n > 0 ? n : NaN;
}
