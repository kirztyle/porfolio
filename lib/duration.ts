const MONTH_MAP: Record<string, number> = {
  jan: 0, januari: 0, january: 0,
  feb: 1, februari: 1, february: 1,
  mar: 2, maret: 2, march: 2,
  apr: 3, april: 3,
  mei: 4, may: 4,
  jun: 5, juni: 5, june: 5,
  jul: 6, juli: 6, july: 6,
  agu: 7, agt: 7, agustus: 7, aug: 7, august: 7,
  sep: 8, sept: 8, september: 8,
  okt: 9, oktober: 9, oct: 9, october: 9,
  nov: 10, november: 10,
  des: 11, desember: 11, dec: 11, december: 11,
};

const ONGOING_KEYWORDS = ["present", "sekarang", "now", "current", "ongoing", ""];

function parseMonthYear(text?: string | null): Date | null {
  if (!text) return null;
  const trimmed = text.trim();
  if (!trimmed) return null;

  const iso = trimmed.match(/^(\d{4})-(\d{1,2})$/);
  if (iso) return new Date(Number(iso[1]), Number(iso[2]) - 1, 1);

  const slash = trimmed.match(/^(\d{1,2})\/(\d{4})$/);
  if (slash) return new Date(Number(slash[2]), Number(slash[1]) - 1, 1);

  const word = trimmed.match(/^([A-Za-zÀ-ÿ.]+)\s+(\d{4})$/);
  if (word) {
    const key = word[1].toLowerCase().replace(/\.$/, "");
    const month = MONTH_MAP[key];
    if (month !== undefined) return new Date(Number(word[2]), month, 1);
  }

  const yearOnly = trimmed.match(/^(\d{4})$/);
  if (yearOnly) return new Date(Number(yearOnly[1]), 0, 1);

  return null;
}

/**
 * Menghitung durasi dari period_start ke period_end dalam format "X tahun Y bulan".
 * Kalau period_end kosong / "Present" / "Sekarang", dihitung sampai bulan berjalan (dinamis).
 * Return null kalau period_start tidak bisa di-parse.
 */
export function formatDuration(
  periodStart?: string | null,
  periodEnd?: string | null
): string | null {
  const start = parseMonthYear(periodStart);
  if (!start) return null;

  const isOngoing = ONGOING_KEYWORDS.includes((periodEnd || "").trim().toLowerCase());
  const end = isOngoing ? new Date() : parseMonthYear(periodEnd);
  if (!end) return null;

  let months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  months = Math.max(months + 1, 1);

  const years = Math.floor(months / 12);
  const remMonths = months % 12;

  const parts: string[] = [];
  if (years > 0) parts.push(`${years} tahun`);
  if (remMonths > 0 || years === 0) parts.push(`${remMonths} bulan`);

  return parts.join(" ");
}