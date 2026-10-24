// Logo perusahaan diambil dari URL eksternal, dicocokkan dari nama perusahaan.
// Host baru wajib didaftarkan di images.remotePatterns (next.config.ts).
const COMPANY_LOGOS: { match: string; src: string }[] = [
  { match: "panin", src: "https://www.pdsb.co.id/img/Panin_Dubai_Syariah_Bank.png" },
  { match: "husky", src: "https://www.hcml.co.id/wp-content/uploads/2020/08/SKK-HCML-Warna.png" },
  { match: "pertamina", src: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Logo_PHE_Update.png" },
  {
    match: "lintas",
    src: "https://static.wixstatic.com/media/b1fac1_18808ca7b95c40f3913e2efe3bcea487~mv2.png",
  },
];

export function companyLogo(company: string | null | undefined): string | null {
  const name = company?.toLowerCase() ?? "";
  return COMPANY_LOGOS.find((l) => name.includes(l.match))?.src ?? null;
}
