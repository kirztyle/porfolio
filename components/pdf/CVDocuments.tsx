import { Fragment, type ReactElement } from "react";
import { Document, Page, Text, View, StyleSheet, Link, Font } from "@react-pdf/renderer";
import { pick, type Lang } from "@/lib/I18n";
import { formatMonthYear } from "@/lib/duration";
import type {
  Profile,
  Experience,
  Skill,
  Education,
  Project,
  Certificate,
} from "@/lib/data";

// Hyphenation bawaan react-pdf berbasis bahasa Inggris dan memotong kata Indonesia
// di tempat yang salah ("meng-gunakan", "mengk-lasifikasikan"). Matikan saja.
Font.registerHyphenationCallback((word) => [word]);

const styles = StyleSheet.create({
  page: {
    padding: "40 44",
    fontSize: 10.5,
    fontFamily: "Helvetica",
    color: "#1a1a1a",
    lineHeight: 1.45,
  },
  header: { textAlign: "center", marginBottom: 4 },
  name: { fontSize: 20, fontFamily: "Helvetica-Bold", letterSpacing: 0.3 },
  tagline: { fontSize: 12, marginTop: 3, color: "#333" },
  contactRow: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginTop: 6,
  },
  contactText: { fontSize: 10 },
  contactSep: { fontSize: 10, marginHorizontal: 4, color: "#888" },
  sectionHead: {
    marginTop: 9,
    paddingTop: 9,
    marginBottom: 4,
    borderTopWidth: 1.2,
    borderTopColor: "#1a1a1a",
  },
  sectionTitle: { fontSize: 11, fontFamily: "Helvetica-Bold", letterSpacing: 0.6 },
  sectionBody: { fontSize: 10.5, color: "#333", marginBottom: 3 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  bold: { fontFamily: "Helvetica-Bold", color: "#1a1a1a" },
  italic: { fontFamily: "Helvetica-Oblique", marginBottom: 2, color: "#333" },
  bulletRow: { flexDirection: "row", marginLeft: 4, marginTop: 1 },
  bulletDot: { width: 10 },
  bulletText: { flex: 1 },
});

export const WEBSITE_URL = "https://rafiipro.vercel.app";

export const LABELS = {
  summary: { id: "RINGKASAN PROFESIONAL", en: "PROFESSIONAL SUMMARY" },
  skills: { id: "KEAHLIAN", en: "SKILLS" },
  experience: { id: "PENGALAMAN PROFESIONAL", en: "PROFESSIONAL EXPERIENCE" },
  projects: { id: "PROYEK", en: "PROJECTS" },
  education: { id: "PENDIDIKAN", en: "EDUCATION" },
  certifications: { id: "SERTIFIKASI", en: "CERTIFICATIONS" },
  present: { id: "Sekarang", en: "Present" },
  contact: { id: "KONTAK", en: "CONTACT" },
} as const;

export function L(key: keyof typeof LABELS, lang: Lang) {
  return LABELS[key][lang];
}

export function CVDocument({
  profile,
  experiences,
  skills,
  education,
  projects,
  certificates,
  lang,
}: {
  profile: Profile | null;
  experiences: Experience[];
  skills: Skill[];
  education: Education[];
  projects: Project[];
  certificates: Certificate[];
  lang: Lang;
}) {
  const name = profile?.name || "";
  const title = pick(profile?.title, profile?.title_en, lang);
  const summary = pick(profile?.description, profile?.description_en, lang);
  const presentLabel = L("present", lang);

  const linkedinUrl = profile?.linkedin
    ? `https://www.linkedin.com/in/${profile.linkedin.replace(/\s+/g, "")}`
    : null;
  const linkedinDisplay = profile?.linkedin
    ? `linkedin.com/in/${profile.linkedin.replace(/\s+/g, "")}`
    : null;
  const waUrl = profile?.phone ? `https://wa.me/${profile.phone.replace(/[^0-9]/g, "")}` : null;

  // Susun section secara berurutan, hanya yang ada isinya, supaya garis
  // pemisah tidak pernah muncul dobel atau nyangkut di section terakhir.
  const sections: { key: string; node: ReactElement }[] = [];

  if (summary) {
    sections.push({
      key: "summary",
      node: (
        <>
          <SectionTitle>{L("summary", lang)}</SectionTitle>
          <Text style={styles.sectionBody}>{summary}</Text>
        </>
      ),
    });
  }

  if (skills.length > 0) {
    sections.push({
      key: "skills",
      node: (
        <>
          <SectionTitle>{L("skills", lang)}</SectionTitle>
          {skills.map((s) => (
            <Text key={s.id} style={styles.sectionBody}>
              <Text style={styles.bold}>{s.category}: </Text>
              {s.items}
            </Text>
          ))}
        </>
      ),
    });
  }

  if (experiences.length > 0) {
    sections.push({
      key: "experience",
      node: (
        <>
          <SectionTitle>{L("experience", lang)}</SectionTitle>
          {experiences.map((exp) => {
            const role = pick(exp.role, exp.role_en, lang);
            const [roleTitle, roleSubtitle] = splitRole(role);
            const desc = pick(exp.description, exp.description_en, lang);
            const period = `${formatMonthYear(exp.period_start, lang)} – ${
              exp.period_end ? formatMonthYear(exp.period_end, lang) : presentLabel
            }`;

            return (
              <View key={exp.id} style={{ marginBottom: 8 }}>
                {/* Judul + perusahaan tidak boleh terpisah dari bullet pertamanya */}
                <View wrap={false} minPresenceAhead={30}>
                  <View style={styles.row}>
                    <View style={{ flex: 1, marginRight: 8 }}>
                      <Text style={styles.bold}>{roleTitle}</Text>
                      {roleSubtitle ? <Text style={styles.bold}>{roleSubtitle}</Text> : null}
                    </View>
                    <Text style={[styles.bold, { textAlign: "right" }]}>{period}</Text>
                  </View>
                  <Text style={styles.italic}>
                    {exp.company}
                    {exp.location ? `, ${exp.location}` : ""}
                  </Text>
                </View>
                {desc &&
                  desc
                    .split("\n")
                    .filter(Boolean)
                    .map((line, i) => (
                      <View key={i} style={styles.bulletRow} wrap={false}>
                        <Text style={styles.bulletDot}>•</Text>
                        <Text style={styles.bulletText}>{line}</Text>
                      </View>
                    ))}
              </View>
            );
          })}
        </>
      ),
    });
  }

  if (projects.length > 0) {
    sections.push({
      key: "projects",
      node: (
        <>
          <SectionTitle>{L("projects", lang)}</SectionTitle>
          {projects.map((p) => {
            const pTitle = pick(p.title, p.title_en, lang);
            const pDesc = pick(p.description, p.description_en, lang);
            return (
              <Text key={p.id} style={styles.sectionBody}>
                <Text style={styles.bold}>{pTitle}</Text>
                {pDesc ? ` — ${pDesc}` : ""}
                {p.tags ? ` (${p.tags})` : ""}
              </Text>
            );
          })}
        </>
      ),
    });
  }

  if (education.length > 0) {
    sections.push({
      key: "education",
      node: (
        <>
          <SectionTitle>{L("education", lang)}</SectionTitle>
          {education.map((ed) => (
            <Text key={ed.id} style={styles.sectionBody}>
              <Text style={styles.bold}>{ed.degree || ed.school}</Text>
              {ed.degree ? ` — ${ed.school}` : ""}
              {[ed.period_start, ed.period_end].filter(Boolean).length > 0
                ? ` (${[ed.period_start, ed.period_end]
                    .filter(Boolean)
                    .map((p) => formatMonthYear(p, lang))
                    .join(" – ")})`
                : ""}
              {ed.meta ? ` · ${ed.meta}` : ""}
            </Text>
          ))}
        </>
      ),
    });
  }

  if (certificates.length > 0) {
    sections.push({
      key: "certificates",
      node: (
        <>
          <SectionTitle>{L("certifications", lang)}</SectionTitle>
          <Text style={styles.sectionBody}>{certificates.map((c) => c.title).join(" · ")}</Text>
        </>
      ),
    });
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{name.toUpperCase()}</Text>
          {title ? <Text style={styles.tagline}>{title}</Text> : null}

          {/* Kontak dibagi dua baris supaya tidak ada pemisah "|" yang menggantung */}
          <ContactRow
            first
            items={[
              profile?.location ? <Text key="location" style={styles.contactText}>{profile.location}</Text> : null,
              profile?.email ? (
                <Link key="email" src={`mailto:${profile.email}`} style={styles.contactText}>
                  <Text>{profile.email}</Text>
                </Link>
              ) : null,
              profile?.phone && waUrl ? (
                <Link key="phone" src={waUrl} style={styles.contactText}>
                  <Text>{profile.phone}</Text>
                </Link>
              ) : null,
            ]}
          />
          <ContactRow
            items={[
              linkedinUrl ? (
                <Link key="linkedin" src={linkedinUrl} style={styles.contactText}>
                  <Text>{linkedinDisplay}</Text>
                </Link>
              ) : null,
              <Link key="website" src={WEBSITE_URL} style={styles.contactText}>
                <Text>{WEBSITE_URL.replace(/^https?:\/\//, "")}</Text>
              </Link>,
            ]}
          />
        </View>

        {sections.map((sec) => (
          <View key={sec.key}>
            {sec.node}
          </View>
        ))}
      </Page>
    </Document>
  );
}

// Garis pemisah + judul section dalam satu blok yang tidak boleh terpecah,
// dan harus ada sisa ruang untuk isinya, supaya tidak tertinggal sendirian di bawah halaman.
function SectionTitle({ children }: { children: string }) {
  return (
    <View style={styles.sectionHead} wrap={false} minPresenceAhead={40}>
      <Text style={styles.sectionTitle}>{children}</Text>
    </View>
  );
}

function ContactRow({ items, first }: { items: (ReactElement | null)[]; first?: boolean }) {
  const present = items.filter((item): item is ReactElement => item !== null);
  if (present.length === 0) return null;
  return (
    <View style={[styles.contactRow, { marginTop: first ? 6 : 2 }]}>
      {present.map((item, i) => (
        <Fragment key={item.key ?? i}>
          {i > 0 && <Text style={styles.contactSep}>|</Text>}
          {item}
        </Fragment>
      ))}
    </View>
  );
}

// "Early Warning Monitoring Officer – QA Financing Risk Department" -> [jabatan, departemen].
// Butuh spasi di kedua sisi tanda hubung supaya "Back-end Developer" tidak ikut terpecah.
export function splitRole(text: string): [string, string | null] {
  const match = text.match(/^(.*?)\s+[–-]\s+(.*)$/);
  if (match) return [match[1].trim(), match[2].trim()];
  return [text, null];
}
