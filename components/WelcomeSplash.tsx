"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Mail, MessageCircle } from "lucide-react";
import type { Lang } from "@/lib/I18n";

// Dibaca juga oleh script inline di app/layout.tsx supaya splash tidak berkedip
// untuk pengunjung yang sudah pernah masuk.
export const WELCOME_STORAGE_KEY = "portfolio-welcomed";

const copy = {
  id: {
    hello: "Halo, terima kasih sudah mampir.",
    lang: "Bahasa",
    theme: "Tampilan",
    light: "Terang",
    dark: "Gelap",
    enter: "Masuk",
    hint: "atau tekan Enter · bisa diubah lagi dari menu atas",
  },
  en: {
    hello: "Hi, thanks for stopping by.",
    lang: "Language",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    enter: "Enter",
    hint: "or press Enter · you can change this later in the menu",
  },
};

type Socials = {
  email?: string | null;
  phone?: string | null;
  linkedin?: string | null;
  instagram?: string | null;
};

type Props = {
  name: string;
  photoUrl?: string | null;
  socials?: Socials;
  lang: Lang;
  onLangChange: (lang: Lang) => void;
};

export default function WelcomeSplash({ name, photoUrl, socials = {}, lang, onLangChange }: Props) {
  const { resolvedTheme, setTheme } = useTheme();
  const [open, setOpen] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const t = copy[lang];
  // Tema baru diketahui di browser; di server tidak ada pilihan yang ditandai aktif
  // supaya tidak terjadi hydration mismatch (tanda aktif "Terang" nyangkut di mode gelap).
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const theme = mounted ? (resolvedTheme ?? "light") : "";

  useEffect(() => {
    let welcomed = false;
    try {
      welcomed = localStorage.getItem(WELCOME_STORAGE_KEY) === "1";
    } catch {}
    if (welcomed) {
      // Pengunjung lama: sudah disembunyikan lewat CSS sebelum paint, cukup unmount.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpen(false);
      return;
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const enter = useCallback(() => {
    setLeaving(true);
    try {
      localStorage.setItem(WELCOME_STORAGE_KEY, "1");
    } catch {}
    document.body.style.overflow = "";
    setTimeout(() => setOpen(false), 300);
  }, []);

  useEffect(() => {
    if (!open || leaving) return;
    const onKey = (e: KeyboardEvent) => {
      // Enter di tombol pilihan / link sosial tetap menjalankan elemen itu, bukan langsung masuk
      if (e.key === "Enter" && !(e.target instanceof Element && e.target.closest("a, button"))) enter();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, leaving, enter]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-title"
      className={`welcome-splash fixed inset-0 z-[100] flex items-center justify-center bg-white px-6 transition-opacity duration-300 dark:bg-slate-950 ${
        leaving ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3">
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt=""
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <span
              aria-hidden="true"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300"
            >
              {name.charAt(0)}
            </span>
          )}
          <span className="text-sm font-medium text-slate-900 dark:text-white">{name}</span>
        </div>

        <h2
          id="welcome-title"
          className="mt-8 font-serif text-3xl leading-tight text-slate-900 dark:text-white"
        >
          {t.hello}
        </h2>

        <div className="mt-10 border-b border-slate-200 dark:border-slate-800">
          <Choice
            label={t.lang}
            value={lang}
            onChange={(v) => onLangChange(v as Lang)}
            options={[
              { value: "id", label: "Indonesia" },
              { value: "en", label: "English" },
            ]}
          />
          <Choice
            label={t.theme}
            value={theme}
            onChange={setTheme}
            options={[
              { value: "light", label: t.light },
              { value: "dark", label: t.dark },
            ]}
          />
        </div>

        <button
          type="button"
          onClick={enter}
          className="mt-8 w-full rounded-md bg-slate-900 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
        >
          {t.enter} →
        </button>
        <p className="mt-3 text-center text-xs text-slate-400 dark:text-slate-500">{t.hint}</p>

        <SocialLinks socials={socials} />
      </div>
    </div>
  );
}

function Choice({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="flex items-baseline justify-between border-t border-slate-200 py-3 dark:border-slate-800">
      <span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>
      <div className="flex gap-4 text-sm">
        {options.map((o) => {
          const active = value === o.value;
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(o.value)}
              className={
                active
                  ? "text-slate-900 underline decoration-blue-600 decoration-2 underline-offset-4 dark:text-white"
                  : "text-slate-400 transition-colors hover:text-slate-700 dark:hover:text-slate-200"
              }
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// URL dibentuk sama seperti section Kontak di PortfolioView.
function SocialLinks({ socials }: { socials: Socials }) {
  const { email, phone, linkedin, instagram } = socials;
  const links = [
    email && { label: "Email", href: `mailto:${email}`, icon: <Mail className="h-4 w-4" /> },
    phone && {
      label: "WhatsApp",
      href: `https://wa.me/${phone.replace(/[^0-9]/g, "")}`,
      icon: <MessageCircle className="h-4 w-4" />,
    },
    linkedin && {
      label: "LinkedIn",
      href: `https://www.linkedin.com/in/${linkedin.replace(/\s+/g, "")}`,
      icon: <LinkedinIcon />,
    },
    instagram && {
      label: "Instagram",
      href: `https://instagram.com/${instagram.replace("@", "")}`,
      icon: <InstagramIcon />,
    },
  ].filter((l): l is { label: string; href: string; icon: React.ReactElement } => Boolean(l));

  if (links.length === 0) return null;

  return (
    <ul className="mt-10 flex justify-center gap-2 border-t border-slate-200 pt-6 dark:border-slate-800">
      {links.map((l) => (
        <li key={l.label}>
          <a
            href={l.href}
            target={l.href.startsWith("mailto:") ? undefined : "_blank"}
            rel="noopener noreferrer"
            aria-label={l.label}
            title={l.label}
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            {l.icon}
          </a>
        </li>
      ))}
    </ul>
  );
}

function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-4 w-4">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  );
}
