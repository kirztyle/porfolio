import Image from "next/image";
import { getPortfolioData } from "@/lib/data";
import { formatDuration } from "@/lib/duration";
import { ThemeToggle } from "@/components/theme-toggle";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { profile, experiences, skills, education, projects, certificates } =
    await getPortfolioData();

  const name = profile?.name || "Muhammad Rafii";
  const title = profile?.title || "IT Developer & Data Analyst";
  const description =
    profile?.description ||
    "Deskripsi belum diatur. Buka /admin untuk melengkapi profil.";

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
              <a href="#experience" className="transition-colors hover:text-slate-900 dark:hover:text-white">Experience</a>
              <a href="#projects" className="transition-colors hover:text-slate-900 dark:hover:text-white">Projects</a>
              <a href="#skills" className="transition-colors hover:text-slate-900 dark:hover:text-white">Expertise</a>
              <a href="#contact" className="transition-colors hover:text-slate-900 dark:hover:text-white">Contact</a>
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section - Padding disesuaikan agar lebih compact */}
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
              Available for Consulting & Full-time Roles
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
                Get in Touch
              </a>
              <a
                href="#projects"
                className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 transition-colors hover:bg-slate-50 dark:bg-slate-800 dark:text-white dark:ring-slate-700 dark:hover:bg-slate-700"
              >
                View Projects
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Experience - py-20 diubah jadi py-12 */}
      <section id="experience" className="mx-auto max-w-5xl px-6 py-12">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Professional Experience
        </h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          A track record of delivering enterprise solutions across banking, HR, and data analytics.
        </p>

        <div className="mt-8 space-y-8">
          {experiences.length === 0 && <EmptyState label="Belum ada data pengalaman kerja." />}
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="grid grid-cols-1 gap-4 sm:grid-cols-[180px_1fr] sm:gap-8"
            >
              <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {exp.period_start} {exp.period_end ? `— ${exp.period_end}` : "— Present"}
                {(() => {
                  const duration = formatDuration(exp.period_start, exp.period_end);
                  return duration ? (
                    <span className="mt-0.5 block text-xs text-slate-400 dark:text-slate-500">
                      {duration}
                    </span>
                  ) : null;
                })()}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {exp.role}
                </h3>
                <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-300">
                  {exp.company}
                  {exp.location && (
                    <span className="text-slate-400"> · {exp.location}</span>
                  )}
                </p>
                {exp.description && (
                  <ul className="mt-3 space-y-2">
                    {exp.description
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
          ))}
        </div>
      </section>

      {/* Skills / Expertise - py-20 diubah jadi py-12 */}
      <section id="skills" className="bg-slate-50 dark:bg-slate-900/50 py-12">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Core Expertise
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Bridging the gap between business requirements and scalable IT solutions.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {skills.length === 0 && <EmptyState label="Belum ada data skill." />}
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

      {/* Projects - py-20 diubah jadi py-12 */}
      <section id="projects" className="mx-auto max-w-5xl px-6 py-12">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Selected Projects
        </h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Key initiatives driving operational efficiency and data-driven decision making.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {projects.length === 0 && <EmptyState label="Belum ada data project." />}
          {projects.map((p) => (
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
                <div className="relative -mx-6 -mt-6 mb-4 h-40 overflow-hidden rounded-t-xl bg-slate-100 dark:bg-slate-700">
                  <Image src={p.image_url} alt={p.title} fill className="object-cover" />
                </div>
              )}
              <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400 transition-colors">
                {p.title}
              </h3>
              {p.description && (
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {p.description}
                </p>
              )}
              {p.tags && (
                <div className="mt-6 flex flex-wrap gap-3 border-t border-slate-100 pt-4 dark:border-slate-700">
                  {p.tags
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean)
                    .map((t) => (
                      <span
                        key={t}
                        className="text-xs font-medium text-slate-500 dark:text-slate-400"
                      >
                        {t}
                      </span>
                    ))}
                </div>
              )}
            </a>
          ))}
        </div>
      </section>

      {/* Education & Certificates - py-20 diubah jadi py-12 */}
      <section id="education" className="bg-slate-50 dark:bg-slate-900/50 py-12">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Background & Credentials
          </h2>

          <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Education
              </h3>
              <div className="mt-6 space-y-6">
                {education.length === 0 && <EmptyState label="Belum ada data pendidikan." />}
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
                Certifications
              </h3>
              <ul className="mt-6 space-y-4">
                {certificates.length === 0 && <EmptyState label="Belum ada data sertifikat." />}
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

      {/* Contact Footer - py-16 diubah jadi py-10 */}
      <footer id="contact" className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            {"Let's Connect"}
          </h2>
          <p className="mt-2 max-w-xl text-slate-600 dark:text-slate-400">
            Interested in collaborating or discussing enterprise data solutions? Feel free to reach out.
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
                value="Connect with me"
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
              &copy; {new Date().getFullYear()} {name}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
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