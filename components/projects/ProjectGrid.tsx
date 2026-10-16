"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { dictionary, pick, t, type Lang } from "@/lib/I18n";
import type { Project } from "@/lib/data";
import ProjectDialog from "./ProjectDialog";

function splitTags(tags: string | null): string[] {
  return (tags ?? "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

/** Grid kartu project. Klik kartu -> modal detail (hero + tab sub-project). */
export default function ProjectGrid({ projects, lang }: { projects: Project[]; lang: Lang }) {
  const [selected, setSelected] = useState<Project | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  // Kunci scroll body selama modal terbuka.
  useEffect(() => {
    if (!selected) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [selected]);

  function handleClose() {
    setSelected(null);
    triggerRef.current?.focus();
  }

  return (
    <>
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {projects.map((p) => {
          const title = pick(p.title, p.title_en, lang);
          const description = pick(p.description, p.description_en, lang);
          const tags = splitTags(p.tags);
          const thumb = p.images[0];

          return (
            <div
              key={p.id}
              className="group relative flex flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200 transition-all focus-within:ring-blue-500 hover:shadow-md hover:ring-slate-300 dark:bg-slate-800 dark:ring-slate-700 dark:hover:ring-slate-600"
            >
              <button
                type="button"
                onClick={(e) => {
                  triggerRef.current = e.currentTarget;
                  setSelected(p);
                }}
                aria-haspopup="dialog"
                className="flex flex-1 cursor-pointer flex-col p-6 text-left focus:outline-none"
              >
                {thumb && (
                  <span className="relative -mx-6 -mt-6 mb-4 block h-48 shrink-0 self-stretch overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <Image
                      src={thumb}
                      alt={title}
                      fill
                      sizes="(min-width: 640px) 448px, 100vw"
                      className="object-contain p-2"
                    />
                  </span>
                )}
                <span className="block text-lg font-semibold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                  {title}
                </span>
                {description && (
                  <span className="mt-3 block flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {description}
                  </span>
                )}
                {tags.length > 0 && (
                  <span className="mt-6 flex flex-wrap gap-3 border-t border-slate-100 pt-4 dark:border-slate-700">
                    {tags.map((tag) => (
                      <span key={tag} className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        {tag}
                      </span>
                    ))}
                  </span>
                )}
                <span className="mt-4 font-display text-xs font-semibold tracking-wide text-blue-600 dark:text-blue-400">
                  {t(dictionary.projects.viewDetails, lang)} <span aria-hidden="true">→</span>
                </span>
              </button>
              {p.link && (
                <a
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mx-6 mb-5 -mt-1 w-fit text-xs font-medium text-slate-500 underline-offset-2 hover:text-blue-600 hover:underline dark:text-slate-400 dark:hover:text-blue-400"
                >
                  {t(dictionary.projects.viewProject, lang)} <span aria-hidden="true">↗</span>
                </a>
              )}
            </div>
          );
        })}
      </div>
      <ProjectDialog project={selected} lang={lang} onClose={handleClose} />
    </>
  );
}
