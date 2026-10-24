"use client";

import { useEffect, useRef } from "react";
import { dictionary, t, type Lang } from "@/lib/I18n";

type Variant = "ats" | "creative";

/**
 * Popup pilihan versi CV (ATS / Creative). Memakai <dialog> native seperti ProjectDialog
 * supaya dapat focus trap, tombol Esc, dan klik backdrop untuk menutup.
 */
export default function CVDownloadDialog({
  open,
  lang,
  onClose,
}: {
  open: boolean;
  lang: Lang;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    if (open && !dlg.open) dlg.showModal();
    else if (!open && dlg.open) dlg.close();
  }, [open]);

  const options: { variant: Variant; title: string; desc: string; preview: React.ReactNode }[] = [
    {
      variant: "ats",
      title: t(dictionary.cv.atsTitle, lang),
      desc: t(dictionary.cv.atsDesc, lang),
      preview: <AtsPreview />,
    },
    {
      variant: "creative",
      title: t(dictionary.cv.creativeTitle, lang),
      desc: t(dictionary.cv.creativeDesc, lang),
      preview: <CreativePreview />,
    },
  ];

  return (
    <dialog
      ref={ref}
      aria-labelledby="cv-dialog-title"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) e.currentTarget.close();
      }}
      className="project-dialog m-auto max-h-[calc(100dvh-1rem)] w-[calc(100%-1rem)] max-w-3xl overflow-hidden rounded-2xl bg-white p-0 text-slate-900 shadow-2xl ring-1 ring-slate-200 backdrop:bg-slate-950/60 open:flex open:flex-col dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-800"
    >
      <div className="relative isolate min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {/* Hero */}
        <div className="relative overflow-hidden px-6 pb-6 pt-8 sm:px-8">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
            <div className="blob -left-20 -top-24 h-64 w-64 bg-blue-500" />
            <div className="blob -right-16 -top-10 h-56 w-56 bg-emerald-400" />
          </div>
          <button
            type="button"
            onClick={() => ref.current?.close()}
            aria-label={t(dictionary.projects.close, lang)}
            className="absolute right-4 top-4 rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
          <h2 id="cv-dialog-title" className="text-2xl font-bold tracking-tight sm:text-3xl">
            <span className="text-gradient">{t(dictionary.cv.heading, lang)}</span>
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{t(dictionary.cv.subtitle, lang)}</p>
          <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {t(dictionary.cv.language, lang)}: {lang === "en" ? "English" : "Bahasa Indonesia"}
          </p>
        </div>

        {/* Pilihan versi */}
        <div className="grid grid-cols-1 gap-4 px-6 pb-8 sm:grid-cols-2 sm:px-8">
          {options.map((o) => (
            <a
              key={o.variant}
              href={`/api/cv/pdf?lang=${lang}&variant=${o.variant}`}
              download
              onClick={() => ref.current?.close()}
              className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-xl shadow-slate-400/40 ring-1 ring-slate-200 transition-all hover:-translate-y-1 hover:shadow-2xl hover:ring-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-slate-800 dark:shadow-black/50 dark:ring-slate-700 dark:hover:ring-blue-500"
            >
              <div className="flex h-44 items-center justify-center bg-slate-100 dark:bg-slate-900/60">
                {o.preview}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white">{o.title}</h3>
                  {o.variant === "ats" && (
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-900/20 dark:text-emerald-400 dark:ring-emerald-500/30">
                      {t(dictionary.cv.recommended, lang)}
                    </span>
                  )}
                </div>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{o.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {t(dictionary.cv.download, lang)}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </dialog>
  );
}

/* Ilustrasi mini halaman CV, murni dekoratif */

function AtsPreview() {
  return (
    <div aria-hidden="true" className="h-36 w-28 rounded-sm bg-white p-2.5 shadow-md ring-1 ring-slate-200 transition-transform group-hover:scale-105">
      <div className="mx-auto h-1.5 w-14 rounded bg-slate-800" />
      <div className="mx-auto mt-1 h-1 w-10 rounded bg-slate-400" />
      {[0, 1, 2].map((i) => (
        <div key={i} className="mt-2 border-t border-slate-800 pt-1">
          <div className="h-1 w-8 rounded bg-slate-700" />
          <div className="mt-1 h-0.5 w-full rounded bg-slate-300" />
          <div className="mt-0.5 h-0.5 w-11/12 rounded bg-slate-300" />
          <div className="mt-0.5 h-0.5 w-4/5 rounded bg-slate-300" />
        </div>
      ))}
    </div>
  );
}

function CreativePreview() {
  return (
    <div aria-hidden="true" className="flex h-36 w-28 overflow-hidden rounded-sm bg-white shadow-md ring-1 ring-slate-200 transition-transform group-hover:scale-105">
      <div className="flex w-9 flex-col items-center bg-slate-900 px-1 pt-2">
        <div className="h-5 w-5 rounded-full bg-gradient-to-br from-blue-500 to-emerald-400" />
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="mt-1.5 h-0.5 w-6 rounded bg-slate-500" />
        ))}
        <div className="mt-2 flex flex-wrap justify-center gap-0.5">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-1 w-2.5 rounded-sm bg-blue-400/70" />
          ))}
        </div>
      </div>
      <div className="flex-1 p-1.5">
        <div className="h-1.5 w-12 rounded bg-slate-800" />
        <div className="mt-0.5 h-1 w-9 rounded bg-gradient-to-r from-blue-500 to-emerald-400" />
        {[0, 1, 2].map((i) => (
          <div key={i} className="mt-2 flex gap-1">
            <div className="mt-0.5 h-1 w-1 shrink-0 rounded-full bg-blue-500" />
            <div className="flex-1">
              <div className="h-0.5 w-10 rounded bg-slate-600" />
              <div className="mt-0.5 h-0.5 w-full rounded bg-slate-300" />
              <div className="mt-0.5 h-0.5 w-4/5 rounded bg-slate-300" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
