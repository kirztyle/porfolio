"use client";

import { useState } from "react";
import Image from "next/image";
import { dictionary, pick, t, type Lang } from "@/lib/I18n";
import { formatDuration } from "@/lib/duration";
import { companyLogo } from "@/lib/companyLogos";
import type { Experience, Project } from "@/lib/data";

export default function ExperienceList({
  experiences,
  projects,
  lang,
}: {
  experiences: Experience[];
  projects: Project[];
  lang: Lang;
}) {
  // Item pertama terbuka secara default, sisanya ter-wrap.
  const [openIds, setOpenIds] = useState<Set<number>>(
    () => new Set(experiences.length ? [experiences[0].id] : []),
  );

  function toggle(id: number) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="mt-8 space-y-4">
      {experiences.map((exp) => {
        const role = pick(exp.role, exp.role_en, lang);
        const expDescription = pick(exp.description, exp.description_en, lang);
        const duration = formatDuration(exp.period_start, exp.period_end, lang);
        const presentLabel = t(dictionary.experience.present, lang);
        const relatedProjects = projects.filter((p) => p.experience_id === exp.id);
        const logo = companyLogo(exp.company);
        const isOpen = openIds.has(exp.id);
        const panelId = `experience-panel-${exp.id}`;

        return (
          <div
            key={exp.id}
            className="overflow-hidden rounded-2xl shadow-xl shadow-slate-400/40 ring-1 ring-slate-200 dark:ring-slate-700/70 dark:shadow-black/50"
          >
            {/* Header: warna solid */}
            <div className="flex items-center gap-4 bg-white px-5 py-4 dark:bg-slate-800 sm:px-6">
              <div className="min-w-0 flex-1">
                <button
                  type="button"
                  onClick={() => toggle(exp.id)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="block w-full text-left"
                >
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white sm:text-lg">
                    {role}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-300">
                    {exp.company}
                    {exp.location && <span className="text-slate-400"> · {exp.location}</span>}
                  </p>
                </button>

                {logo && (
                  <div className="mt-3 h-10 w-32 sm:hidden">
                    <Image
                      src={logo}
                      alt=""
                      width={128}
                      height={40}
                      className="h-full w-full object-contain object-left"
                    />
                  </div>
                )}

                {relatedProjects.length > 0 && (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {t(dictionary.experience.relatedProjects, lang)}
                    </span>
                    {relatedProjects.map((p) => (
                      <a
                        key={p.id}
                        href={`#project-${p.id}`}
                        className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20 transition-colors hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:ring-blue-500/30 dark:hover:bg-blue-900/40"
                      >
                        {pick(p.title, p.title_en, lang)}
                        <span aria-hidden="true">↓</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Logo + chevron: kolom kanan, di tengah vertikal header */}
              <button
                type="button"
                onClick={() => toggle(exp.id)}
                tabIndex={-1}
                aria-hidden="true"
                className="flex shrink-0 items-center gap-4 self-stretch"
              >
                {logo && (
                  <span className="hidden h-12 w-32 items-center justify-center sm:flex md:w-40">
                    <Image
                      src={logo}
                      alt={exp.company}
                      width={160}
                      height={48}
                      className="h-full w-full object-contain"
                    />
                  </span>
                )}
                <svg
                  className={`h-5 w-5 shrink-0 text-slate-500 transition-transform duration-300 dark:text-slate-400 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            {/* Detail: glassy */}
            <div
              id={panelId}
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div className="border-t border-white/40 bg-white/40 px-5 py-4 backdrop-blur-md dark:border-white/10 dark:bg-white/5 sm:px-6">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    {exp.period_start} {exp.period_end ? `— ${exp.period_end}` : `— ${presentLabel}`}
                    {duration && (
                      <span className="text-xs text-slate-400 dark:text-slate-500"> · {duration}</span>
                    )}
                  </p>
                  {expDescription && (
                    <ul className="mt-3 space-y-2">
                      {expDescription
                        .split("\n")
                        .filter(Boolean)
                        .map((line, j) => (
                          <li
                            key={j}
                            className="flex gap-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400"
                          >
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300 dark:bg-slate-600" />
                            <span>{line}</span>
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
