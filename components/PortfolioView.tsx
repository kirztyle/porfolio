"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import { dictionary, pick, t, type Lang } from "@/lib/I18n";
import { formatDuration } from "@/lib/duration";
import type {
  Profile,
  Experience,
  Skill,
  Education,
  Project,
  Certificate,
} from "@/lib/data";

const LANG_STORAGE_KEY = "portfolio-lang";

export default function PortfolioView({
  profile,
  experiences,
  skills,
  education,
  projects,
  certificates,
}: {
  profile: Profile | null;
  experiences: Experience[];
  skills: Skill[];
  education: Education[];
  projects: Project[];
  certificates: Certificate[];
}) {
  const [lang, setLang] = useState<Lang>("id");

  useEffect(() => {
    const saved = window.localStorage.getItem(LANG_STORAGE_KEY);
    if (saved === "id" || saved === "en") setLang(saved);
  }, []);

  function changeLang(next: Lang) {
    setLang(next);
    window.localStorage.setItem(LANG_STORAGE_KEY, next);
  }

  const name = profile?.name || "Muhammad Rafii";
  const title = pick(profile?.title, profile?.title_en, lang) || "IT Developer & Data Analyst";
  const description =
    pick(profile?.description, profile?.description_en, lang) ||
    (lang === "en"
      ? "Description not set yet. Open /admin to complete the profile."
      : "Deskripsi belum diatur. Buka /admin untuk melengkapi profil.");

  return (
    <main className="min-h-screen bg-white text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-200">
      {/* Top bar / Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <a href="/" className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            {name.split(' e')[0]}<span className="text-blue-600 dark:text-blue-500">.</span>
          </a>

          <div className="flex items-center gap-6">
            <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-400 sm:flex">
              <a href="#experience" className="transition-colors hover:text-slate-900 dark:hover:text-white">
                {t(dictionary.nav.experience, lang)}
              </a>
              <a href="#projects" className="transition-colors hover:text-slate-900 dark:hover:text-white">
                {t(dictionary.nav.projects, lang)}
              </a>
              <a href="#skills" className="transition-colors hover:text-slate-900 dark:hover:text-white">
                {t(dictionary.nav.skills, lang)}
              </a>
              <a href="#contact" className="transition-colors hover:text-slate-900 dark:hover:text-white">
                {t(dictionary.nav.contact, lang)}
              </a>
            </nav>
            <LanguageToggle lang={lang} onChange={changeLang} />
             <a href={`/api/cv/pdf?lang=${lang}`}
              download
              className="flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              CV
            </a>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-5xl px-6 pb-12 pt-12 md:pt-16">
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-[240px_1fr]">
          <div className="relative mx-auto md:mx-0">
            <div className="h-56 w-56 overflow-hidden rounded-2xl bg-slate-100 shadow-xl ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
              {profile?.photo_url ? (
                <Image
                  src={profile.photo_url}
                  alt={name}
                  width={224}
                  height={224}
                  className="h-full w-full object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-slate-400">
                  <svg className="h-24 w-24" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-900/20 dark:text-emerald-400 dark:ring-emerald-500/30">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              {t(dictionary.hero.badge, lang)}
            </div>

            <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              {name}
            </h1>
            <p className="mt-3 text-xl font-medium text-slate-600 dark:text-slate-300">
              {title}
            </p>

            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-400">
              {description}
            </p>

            <div className="mt-6 flex flex-wrap gap-4">
              <a
                href="#contact"
                className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
              >
                {t(dictionary.hero.ctaContact, lang)}
              </a>
              <a
                href="#projects"
                className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 transition-colors hover:bg-slate-50 dark:bg-slate-800 dark:text-white dark:ring-slate-700 dark:hover:bg-slate-700"
              >
                {t(dictionary.hero.ctaProjects, lang)}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Experience */}
      <section id="experience" className="mx-auto max-w-5xl px-6 py-12">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          {t(dictionary.experience.heading, lang)}
        </h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          {t(dictionary.experience.subtitle, lang)}
        </p>

        <div className="mt-8 space-y-8">
          {experiences.length === 0 && <EmptyState label={t(dictionary.experience.empty, lang)} />}
          {experiences.map((exp) => {
            const role = pick(exp.role, exp.role_en, lang);
            const expDescription = pick(exp.description, exp.description_en, lang);
            const duration = formatDuration(exp.period_start, exp.period_end, lang);
            const presentLabel = t(dictionary.experience.present, lang);

            return (
              <div key={exp.id} className="grid grid-cols-1 gap-4 sm:grid-cols-[180px_1fr] sm:gap-8">
                <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {exp.period_start} {exp.period_end ? `— ${exp.period_end}` : `— ${presentLabel}`}
                  {duration && (
                    <span className="mt-0.5 block text-xs text-slate-400 dark:text-slate-500">
                      {duration}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {role}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-300">
                    {exp.company}
                    {exp.location && (
                      <span className="text-slate-400"> · {exp.location}</span>
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
            );
          })}
        </div>
      </section>

      {/* Skills / Expertise */}
      <section id="skills" className="bg-slate-50 dark:bg-slate-900/50 py-12">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            {t(dictionary.skills.heading, lang)}
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            {t(dictionary.skills.subtitle, lang)}
          </p>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {skills.length === 0 && <EmptyState label={t(dictionary.skills.empty, lang)} />}
            {skills.map((s) => (
              <div
                key={s.id}
                className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700"
              >
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-900 dark:text-white">
                  {s.category}
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {s.items
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean)
                    .map((item) => (
                      <span
                        key={item}
                        className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:ring-slate-600"
                      >
                        {item}
                      </span>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="mx-auto max-w-5xl px-6 py-12">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          {t(dictionary.projects.heading, lang)}
        </h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          {t(dictionary.projects.subtitle, lang)}
        </p>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {projects.length === 0 && <EmptyState label={t(dictionary.projects.empty, lang)} />}
          {projects.map((p) => {
            const projTitle = pick(p.title, p.title_en, lang);
            const projDescription = pick(p.description, p.description_en, lang);

            return (
              <a
                key={p.id}
                href={p.link || "#"}
                target={p.link ? "_blank" : undefined}
                rel={p.link ? "noopener noreferrer" : undefined}
                className={`group relative flex flex-col rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-all hover:shadow-md hover:ring-slate-300 dark:bg-slate-800 dark:ring-slate-700 dark:hover:ring-slate-600 ${
                  !p.link && "cursor-default hover:shadow-sm hover:ring-slate-200"
                }`}
              >
                {p.image_url && (
                  <div className="relative -mx-6 -mt-6 mb-4 h-48 overflow-hidden rounded-t-xl bg-slate-100 dark:bg-slate-800">
                    <Image src={p.image_url} alt={projTitle} fill className="object-contain p-2" />
                  </div>
                )}
                <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400 transition-colors">
                  {projTitle}
                </h3>
                {projDescription && (
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {projDescription}
                  </p>
                )}
                {p.tags && (
                  <div className="mt-6 flex flex-wrap gap-3 border-t border-slate-100 pt-4 dark:border-slate-700">
                    {p.tags
                      .split(",")
                      .map((tag) => tag.trim())
                      .filter(Boolean)
                      .map((tag) => (
                        <span
                          key={tag}
                          className="text-xs font-medium text-slate-500 dark:text-slate-400"
                        >
                          {tag}
                        </span>
                      ))}
                  </div>
                )}
              </a>
            );
          })}
        </div>
      </section>

      {/* Education & Certificates */}
      <section id="education" className="bg-slate-50 dark:bg-slate-900/50 py-12">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            {t(dictionary.background.heading, lang)}
          </h2>

          <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {t(dictionary.background.education, lang)}
              </h3>
              <div className="mt-6 space-y-6">
                {education.length === 0 && (
                  <EmptyState label={t(dictionary.background.emptyEducation, lang)} />
                )}
                {education.map((ed) => (
                  <div key={ed.id}>
                    <h4 className="text-base font-semibold text-slate-900 dark:text-white">
                      {ed.school}
                    </h4>
                    {ed.degree && (
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                        {ed.degree}
                      </p>
                    )}
                    <p className="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                      {[ed.period_start, ed.period_end].filter(Boolean).join(" — ")}
                      {ed.meta && ` · ${ed.meta}`}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {t(dictionary.background.certifications, lang)}
              </h3>
              <ul className="mt-6 space-y-4">
                {certificates.length === 0 && (
                  <EmptyState label={t(dictionary.background.emptyCertificates, lang)} />
                )}
                {certificates.map((c) => (
                  <li
                    key={c.id}
                    className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4 dark:border-slate-700 last:border-0"
                  >
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {c.title}
                    </span>
                    {c.category && (
                      <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                        {c.category}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Footer */}
      <footer id="contact" className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            {t(dictionary.contact.heading, lang)}
          </h2>
          <p className="mt-2 max-w-xl text-slate-600 dark:text-slate-400">
            {t(dictionary.contact.subtitle, lang)}
          </p>

          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
            {profile?.email && (
              <ContactLink label="Email" value={profile.email} href={`mailto:${profile.email}`} />
            )}
            {profile?.phone && (
              <ContactLink
                label="WhatsApp"
                value={profile.phone}
                href={`https://wa.me/${profile.phone.replace(/[^0-9]/g, "")}`}
              />
            )}
            {profile?.linkedin && (
              <ContactLink
                label="LinkedIn"
                value={t(dictionary.contact.linkedinValue, lang)}
                href={`https://www.linkedin.com/in/${profile.linkedin.replace(/\s+/g, "")}`}
              />
            )}
            {profile?.instagram && (
              <ContactLink
                label="Instagram"
                value={profile.instagram}
                href={`https://instagram.com/${profile.instagram.replace("@", "")}`}
              />
            )}
          </div>

          <div className="mt-12 border-t border-slate-200 pt-6 dark:border-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              &copy; {new Date().getFullYear()} {name}. {t(dictionary.contact.rights, lang)}
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}

function LanguageToggle({ lang, onChange }: { lang: Lang; onChange: (lang: Lang) => void }) {
  return (
    <div className="flex items-center rounded-full border border-slate-200 p-0.5 text-xs font-semibold dark:border-slate-700">
      <button
        onClick={() => onChange("id")}
        className={`rounded-full px-2.5 py-1 transition-colors ${
          lang === "id"
            ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
            : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        }`}
      >
        ID
      </button>
      <button
        onClick={() => onChange("en")}
        className={`rounded-full px-2.5 py-1 transition-colors ${
          lang === "en"
            ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
            : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        }`}
      >
        EN
      </button>
    </div>
  );
}

function ContactLink({ label, value, href }: { label: string; value: string; href: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="group block">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="mt-2 truncate text-sm font-medium text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
        {value}
      </p>
    </a>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="col-span-full flex items-center justify-center rounded-lg border border-dashed border-slate-300 p-8 dark:border-slate-700">
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  );
}