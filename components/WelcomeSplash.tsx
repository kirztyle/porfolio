"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
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

type Props = {
  name: string;
  photoUrl?: string | null;
  lang: Lang;
  onLangChange: (lang: Lang) => void;
};

export default function WelcomeSplash({ name, photoUrl, lang, onLangChange }: Props) {
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
      // Enter di tombol pilihan tetap mengubah pilihan, bukan langsung masuk
      if (e.key === "Enter" && !(e.target instanceof HTMLButtonElement)) enter();
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
