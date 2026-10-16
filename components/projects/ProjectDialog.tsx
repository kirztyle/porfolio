"use client";

import { useEffect, useRef, useState } from "react";
import { dictionary, pick, t, type Lang } from "@/lib/I18n";
import type { Project, ProjectDetail } from "@/lib/data";
import ImageCarousel from "./ImageCarousel";
import TabList, { panelId, tabId } from "./TabList";

function splitLines(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
}

/**
 * Modal native <dialog>: showModal() memberi focus trap & Esc. Selalu dirender (tertutup)
 * agar ref stabil; isi hanya dirender saat ada project terpilih.
 */
export default function ProjectDialog({
  project,
  lang,
  onClose,
}: {
  project: Project | null;
  lang: Lang;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    if (project && !dlg.open) dlg.showModal();
    else if (!project && dlg.open) dlg.close();
  }, [project]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={project ? `project-dialog-title-${project.id}` : undefined}
      onClose={onClose}
      onClick={(e) => {
        // Klik pada backdrop => target adalah <dialog> itu sendiri (konten dibungkus div).
        if (e.target === e.currentTarget) e.currentTarget.close();
      }}
      className="project-dialog m-auto max-h-[calc(100dvh-1rem)] w-[calc(100%-1rem)] max-w-4xl overflow-hidden rounded-2xl bg-white p-0 text-slate-900 shadow-2xl ring-1 ring-slate-200 backdrop:bg-slate-950/60 open:flex open:flex-col dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-800 sm:max-h-[90vh]"
    >
      {project && (
        <div className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain p-5 sm:p-8">
          <ProjectHero key={project.id} project={project} lang={lang} onClose={() => ref.current?.close()} />
        </div>
      )}
    </dialog>
  );
}

function ProjectHero({
  project,
  lang,
  onClose,
}: {
  project: Project;
  lang: Lang;
  onClose: () => void;
}) {
  const [detailId, setDetailId] = useState<string | number>(project.details[0]?.id ?? 0);
  const title = pick(project.title, project.title_en, lang);
  const description = pick(project.description, project.description_en, lang);
  const tags = (project.tags ?? "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
  const detail = project.details.find((d) => d.id === detailId) ?? project.details[0];
  const prefix = `detail-${project.id}`;

  return (
    <article>
      <button
        type="button"
        onClick={onClose}
        aria-label={t(dictionary.projects.close, lang)}
        className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
      >
        <span aria-hidden="true" className="text-lg leading-none">
          ✕
        </span>
      </button>

      <h3
        id={`project-dialog-title-${project.id}`}
        className="pr-10 text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl"
      >
        {title}
      </h3>
      {description && (
        <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{description}</p>
      )}
      {tags.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <li
              key={tag}
              className="rounded-md bg-slate-100 px-2.5 py-1 font-display text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700"
            >
              {tag}
            </li>
          ))}
        </ul>
      )}
      {project.link && (
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
        >
          {t(dictionary.projects.viewProject, lang)}
          <span aria-hidden="true">→</span>
        </a>
      )}

      {detail && (
        <div className="mt-8">
          <TabList
            idPrefix={prefix}
            label={t(dictionary.projects.detailLabel, lang)}
            activeId={detail.id}
            onSelect={setDetailId}
            items={project.details.map((d) => ({ id: d.id, label: pick(d.title, d.title_en, lang) }))}
          />
          <div
            role="tabpanel"
            id={panelId(prefix, detail.id)}
            aria-labelledby={tabId(prefix, detail.id)}
            tabIndex={0}
            className="mt-5 rounded-md"
          >
            <DetailPanel key={detail.id} detail={detail} lang={lang} />
          </div>
        </div>
      )}
    </article>
  );
}

function DetailPanel({ detail, lang }: { detail: ProjectDetail; lang: Lang }) {
  const title = pick(detail.title, detail.title_en, lang);
  const paragraphs = splitLines(pick(detail.description, detail.description_en, lang));
  const bullets = splitLines(pick(detail.bullets, detail.bullets_en, lang));

  return (
    <div className="space-y-5">
      {detail.images.length > 0 && <ImageCarousel images={detail.images} alt={title} lang={lang} />}
      {paragraphs.length > 0 && (
        <div className="space-y-3">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {p}
            </p>
          ))}
        </div>
      )}
      {bullets.length > 0 && (
        <ul className="space-y-2">
          {bullets.map((line, i) => (
            <li key={i} className="flex gap-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500 dark:bg-blue-400" />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
