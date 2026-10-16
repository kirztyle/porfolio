/**
 * Validasi `images` dari body request.
 * undefined -> tidak dikirim (jangan ubah kolom); null -> tidak valid.
 */
export function parseImages(v: unknown): string[] | null | undefined {
  if (v === undefined) return undefined;
  if (!Array.isArray(v) || !v.every((x) => typeof x === "string")) return null;
  return (v as string[]).map((x) => x.trim()).filter(Boolean);
}
