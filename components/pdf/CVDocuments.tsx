import { Document, Page, Text, View, StyleSheet, Link } from "@react-pdf/renderer";
import { formatDuration } from "@/lib/duration";
import { pick, type Lang } from "@/lib/I18n";
import type {
  Profile,
  Experience,
  Skill,
  Education,
  Project,
  Certificate,
} from "@/lib/data";

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
  hr: { borderBottomWidth: 1.2, borderBottomColor: "#1a1a1a", marginVertical: 9 },
  sectionTitle: { fontSize: 11, fontFamily: "Helvetica-Bold", letterSpacing: 0.6, marginBottom: 4 },
  sectionBody: { fontSize: 10.5, color: "#333", marginBottom: 3 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  bold: { fontFamily: "Helvetica-Bold", color: "#1a1a1a" },
  italic: { fontFamily: "Helvetica-Oblique", marginBottom: 2, color: "#333" },
  bullet: { marginLeft: 8, marginTop: 1 },
});

const LABELS = {
  summary: { id: "RINGKASAN PROFESIONAL", en: "PROFESSIONAL SUMMARY" },
  skills: { id: "KEAHLIAN", en: "SKILLS" },
  experience: { id: "PENGALAMAN PROFESIONAL", en: "PROFESSIONAL EXPERIENCE" },
  projects: { id: "PROYEK", en: "PROJECTS" },
  education: { id: "PENDIDIKAN", en: "EDUCATION" },
  certifications: { id: "SERTIFIKASI", en: "CERTIFICATIONS" },
  present: { id: "Sekarang", en: "Present" },
} as const;

function L(key: keyof typeof LABELS, lang: Lang) {
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
  const sections: { key: string; node: JSX.Element }[] = [];

  if (summary) {
    sections.push({
      key: "summary",
      node: (
        <>
          <Text style={styles.sectionTitle}>{L("summary", lang)}</Text>
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
          <Text style={styles.sectionTitle}>{L("skills", lang)}</Text>
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
          <Text style={styles.sectionTitle}>{L("experience", lang)}</Text>
          {experiences.map((exp) => {
            const role = pick(exp.role, exp.role_en, lang);
            const [roleTitle, roleSubtitle] = splitRole(role);   
            function splitRole(text: string): [string, string | null] {
            const match = text.match(/^(.*?)\s*[–-]\s*(.*)$/);
            if (match) return [match[1].trim(), match[2].trim()];
            return [text, null];
            }
            const desc = pick(exp.description, exp.description_en, lang);
            const duration = formatDuration(exp.period_start, exp.period_end, lang);
            const period = `${exp.period_start || ""} – ${exp.period_end || presentLabel}${
              duration ? ` (${duration})` : ""
            }`;

            return (
                <View key={exp.id} style={{ marginBottom: 8 }}>
                    <View style={styles.row}>
                    <View style={{ flex: 1, marginRight: 8 }}>
                        <Text style={styles.bold}>{roleTitle}</Text>
                        {roleSubtitle ? <Text style={styles.bold}>{roleSubtitle}</Text> : null}
                    </View>
                    <Text style={[styles.bold, { textAlign: "right" }]}></Text>
                    </View>
                <Text style={styles.italic}>
                  {exp.company}
                  {exp.location ? `, ${exp.location}` : ""}
                </Text>
                {desc &&
                  desc
                    .split("\n")
                    .filter(Boolean)
                    .map((line, i) => (
                      <Text key={i} style={styles.bullet}>
                        • {line}
                      </Text>
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
          <Text style={styles.sectionTitle}>{L("projects", lang)}</Text>
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
          <Text style={styles.sectionTitle}>{L("education", lang)}</Text>
          {education.map((ed) => (
            <Text key={ed.id} style={styles.sectionBody}>
              <Text style={styles.bold}>{ed.degree || ed.school}</Text>
              {ed.degree ? ` — ${ed.school}` : ""}
              {[ed.period_start, ed.period_end].filter(Boolean).length > 0
                ? ` (${[ed.period_start, ed.period_end].filter(Boolean).join(" – ")})`
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
          <Text style={styles.sectionTitle}>{L("certifications", lang)}</Text>
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

          <View style={styles.contactRow}>
            {profile?.location && <Text style={styles.contactText}>{profile.location}</Text>}

            {profile?.location && profile?.email && <Text style={styles.contactSep}>|</Text>}
            {profile?.email && (
              <Link src={`mailto:${profile.email}`} style={styles.contactText}>
                <Text>{profile.email}</Text>
              </Link>
            )}

            {profile?.email && profile?.phone && <Text style={styles.contactSep}>|</Text>}
            {profile?.phone && waUrl && (
              <Link src={waUrl} style={styles.contactText}>
                <Text>{profile.phone}</Text>
              </Link>
            )}

            {profile?.phone && linkedinUrl && <Text style={styles.contactSep}>|</Text>}
            {linkedinUrl && (
              <Link src={linkedinUrl} style={styles.contactText}>
                <Text>{linkedinDisplay}</Text>
              </Link>
            )}
          </View>
        </View>

        <View style={styles.hr} />

        {sections.map((sec, i) => (
          <View key={sec.key}>
            {sec.node}
            {i < sections.length - 1 && <View style={styles.hr} />}
          </View>
        ))}
      </Page>
    </Document>
  );
}