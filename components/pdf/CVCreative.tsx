import type { ReactNode } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
  Image,
  Font,
  Svg,
  Path,
  Rect,
  Defs,
  LinearGradient,
  Stop,
} from "@react-pdf/renderer";
import { pick, type Lang } from "@/lib/I18n";
import { formatMonthYear, formatDuration } from "@/lib/duration";
import { L, WEBSITE_URL, splitRole } from "@/components/pdf/CVDocuments";
import type { Profile, Experience, Skill, Education, Project, Certificate } from "@/lib/data";

// Lihat CVDocuments: hyphenation bawaan memotong kata Indonesia di tempat yang salah.
Font.registerHyphenationCallback((word) => [word]);

const SIDEBAR_W = 190;
const C = {
  ink: "#0f172a",
  body: "#334155",
  muted: "#64748b",
  line: "#e2e8f0",
  card: "#f1f5f9",
  blue: "#2563eb",
  teal: "#06b6d4",
  green: "#10b981",
  side: "#0f172a",
  sideText: "#cbd5e1",
  sideMuted: "#94a3b8",
  sideAccent: "#38bdf8",
};

const s = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9.5,
    color: C.body,
    lineHeight: 1.45,
    paddingTop: 36,
    paddingBottom: 36,
  },
  sideBg: { position: "absolute", top: 0, bottom: 0, left: 0, width: SIDEBAR_W, backgroundColor: C.side },
  row: { flexDirection: "row" },
  side: { width: SIDEBAR_W, paddingHorizontal: 20, color: C.sideText },
  main: { flex: 1, paddingLeft: 26, paddingRight: 32 },

  photoWrap: { alignItems: "center", marginBottom: 18 },
  photoRing: { width: 104, height: 104, borderRadius: 52, padding: 3, backgroundColor: C.sideAccent },
  photo: { width: 98, height: 98, borderRadius: 49, objectFit: "cover" },
  initials: {
    width: 98,
    height: 98,
    borderRadius: 49,
    backgroundColor: "#1e293b",
    color: "#ffffff",
    fontSize: 30,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    paddingTop: 30,
  },

  sideTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: C.sideAccent,
    letterSpacing: 1.2,
    marginTop: 14,
    marginBottom: 7,
    paddingBottom: 4,
    borderBottomWidth: 0.8,
    borderBottomColor: "#334155",
  },
  contactItem: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
  contactIcon: { width: 14, marginRight: 6 },
  contactText: { fontSize: 8.5, color: C.sideText, textDecoration: "none", flex: 1 },
  skillCat: { fontSize: 8.5, fontFamily: "Helvetica-Bold", color: "#ffffff", marginTop: 5 },
  skillRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 1 },
  skillItems: { fontSize: 8.2, color: C.sideText },
  sideItemTitle: { fontSize: 8.5, fontFamily: "Helvetica-Bold", color: "#ffffff" },
  sideItemSub: { fontSize: 8.2, color: C.sideText },
  sideItemMeta: { fontSize: 7.8, color: C.sideMuted, marginTop: 1 },
  certItem: { flexDirection: "row", marginBottom: 3 },
  certDot: { width: 8, fontSize: 8.2, color: C.sideAccent },

  name: { fontSize: 26, fontFamily: "Helvetica-Bold", color: C.ink, letterSpacing: 0.5, lineHeight: 1.1 },
  tagline: { fontSize: 11.5, fontFamily: "Helvetica-Bold", color: C.blue, marginTop: 4 },
  summary: { fontSize: 9.5, color: C.body, marginTop: 3 },

  mainHead: { flexDirection: "row", alignItems: "center", marginTop: 18, marginBottom: 9 },
  mainTitle: { fontSize: 11, fontFamily: "Helvetica-Bold", color: C.ink, letterSpacing: 1.2, marginLeft: 8 },
  mainRule: { flex: 1, height: 0.8, backgroundColor: C.line, marginLeft: 8 },

  timeline: { borderLeftWidth: 1.5, borderLeftColor: C.line, marginLeft: 4, paddingLeft: 14 },
  job: { marginBottom: 12, position: "relative" },
  jobDot: {
    position: "absolute",
    left: -20.5,
    top: 2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: C.blue,
    borderWidth: 2,
    borderColor: "#dbeafe",
  },
  jobTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  jobRole: { fontSize: 10.5, fontFamily: "Helvetica-Bold", color: C.ink },
  jobDept: { fontSize: 9, fontFamily: "Helvetica-Bold", color: C.muted },
  jobCompany: { fontSize: 9.2, color: C.blue, fontFamily: "Helvetica-Bold", marginTop: 1 },
  badge: {
    fontSize: 7.8,
    fontFamily: "Helvetica-Bold",
    color: C.blue,
    backgroundColor: "#dbeafe",
    borderRadius: 8,
    paddingVertical: 2,
    paddingHorizontal: 7,
    marginLeft: 8,
  },
  duration: { fontSize: 7.5, color: C.muted, textAlign: "right", marginTop: 2 },
  bulletRow: { flexDirection: "row", marginTop: 2 },
  bulletDot: { width: 9, color: C.teal, fontFamily: "Helvetica-Bold" },
  bulletText: { flex: 1 },

  project: {
    backgroundColor: C.card,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: C.teal,
    padding: 9,
    marginBottom: 7,
  },
  projectTitle: { fontSize: 10, fontFamily: "Helvetica-Bold", color: C.ink },
  projectDesc: { fontSize: 8.8, marginTop: 2 },
  tags: { flexDirection: "row", flexWrap: "wrap", marginTop: 5 },
  tag: {
    fontSize: 7.5,
    color: "#0e7490",
    backgroundColor: "#cffafe",
    borderRadius: 6,
    paddingVertical: 1.5,
    paddingHorizontal: 6,
    marginRight: 4,
    marginBottom: 3,
  },
});

type Props = {
  profile: Profile | null;
  experiences: Experience[];
  skills: Skill[];
  education: Education[];
  projects: Project[];
  certificates: Certificate[];
  lang: Lang;
};

export function CreativeCVDocument({ profile, experiences, skills, education, projects, certificates, lang }: Props) {
  const name = profile?.name || "";
  const title = pick(profile?.title, profile?.title_en, lang);
  const summary = pick(profile?.description, profile?.description_en, lang);
  const presentLabel = L("present", lang);
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  const linkedin = profile?.linkedin?.replace(/\s+/g, "");
  const contacts: { icon: ReactNode; text: string; href?: string }[] = [
    profile?.email && { icon: <IconMail />, text: profile.email, href: `mailto:${profile.email}` },
    profile?.phone && {
      icon: <IconPhone />,
      text: profile.phone,
      href: `https://wa.me/${profile.phone.replace(/[^0-9]/g, "")}`,
    },
    linkedin && {
      icon: <IconLink />,
      text: `linkedin.com/in/${linkedin}`,
      href: `https://www.linkedin.com/in/${linkedin}`,
    },
    { icon: <IconGlobe />, text: WEBSITE_URL.replace(/^https?:\/\//, ""), href: WEBSITE_URL },
    profile?.location && { icon: <IconPin />, text: profile.location },
  ].filter(Boolean) as { icon: ReactNode; text: string; href?: string }[];

  return (
    <Document title={`${name} - CV`} author={name}>
      <Page size="A4" style={s.page}>
        {/* Latar sidebar diulang di setiap halaman */}
        <View style={s.sideBg} fixed />

        <View style={s.row}>
          {/* ---------- Sidebar ---------- */}
          <View style={s.side}>
            <View style={s.photoWrap}>
              <View style={s.photoRing}>
                {profile?.photo_url ? (
                  // eslint-disable-next-line jsx-a11y/alt-text -- Image react-pdf tidak punya prop alt
                  <Image src={profile.photo_url} style={s.photo} />
                ) : (
                  <Text style={s.initials}>{initials}</Text>
                )}
              </View>
            </View>

            <Text style={s.sideTitle}>{L("contact", lang)}</Text>
            {contacts.map((c) => (
              <View key={c.text} style={s.contactItem}>
                <View style={s.contactIcon}>{c.icon}</View>
                {c.href ? (
                  <Link src={c.href} style={s.contactText}>
                    {c.text}
                  </Link>
                ) : (
                  <Text style={s.contactText}>{c.text}</Text>
                )}
              </View>
            ))}

            {skills.length > 0 && (
              <>
                <Text style={s.sideTitle} minPresenceAhead={30}>
                  {L("skills", lang)}
                </Text>
                {skills.map((sk) => (
                  <View key={sk.id} wrap={false}>
                    <Text style={s.skillCat}>{sk.category}</Text>
                    {/* Tiap item elemen terpisah: baris hanya putus di antara item, pemisah tidak menggantung */}
                    <View style={s.skillRow}>
                      {sk.items
                        .split(",")
                        .map((x) => x.trim())
                        .filter(Boolean)
                        .map((item, i, all) => (
                          <Text key={item} style={s.skillItems}>
                            {item}
                            {i < all.length - 1 ? <Text style={{ color: C.sideAccent }}>{"  ·  "}</Text> : null}
                          </Text>
                        ))}
                    </View>
                  </View>
                ))}
              </>
            )}

            {education.length > 0 && (
              <>
                <Text style={s.sideTitle} minPresenceAhead={40}>
                  {L("education", lang)}
                </Text>
                {education.map((ed) => (
                  <View key={ed.id} style={{ marginBottom: 7 }} wrap={false}>
                    <Text style={s.sideItemTitle}>{ed.degree || ed.school}</Text>
                    {ed.degree ? <Text style={s.sideItemSub}>{ed.school}</Text> : null}
                    <Text style={s.sideItemMeta}>
                      {[ed.period_start, ed.period_end]
                        .filter(Boolean)
                        .map((p) => formatMonthYear(p, lang))
                        .join(" – ")}
                      {ed.meta ? `  ·  ${ed.meta}` : ""}
                    </Text>
                  </View>
                ))}
              </>
            )}

            {certificates.length > 0 && (
              <>
                <Text style={s.sideTitle} minPresenceAhead={30}>
                  {L("certifications", lang)}
                </Text>
                {certificates.map((c) => (
                  <View key={c.id} style={s.certItem} wrap={false}>
                    <Text style={s.certDot}>›</Text>
                    <Text style={[s.sideItemSub, { flex: 1 }]}>{c.title}</Text>
                  </View>
                ))}
              </>
            )}
          </View>

          {/* ---------- Kolom utama ---------- */}
          <View style={s.main}>
            <Text style={s.name}>{name.toUpperCase()}</Text>
            {title ? <Text style={s.tagline}>{title}</Text> : null}
            <GradientBar />

            {summary ? (
              <>
                <MainTitle>{L("summary", lang)}</MainTitle>
                {summary
                  .split(/\n\s*\n/)
                  .filter((p) => p.trim())
                  .map((para, i) => (
                    <Text key={i} style={s.summary}>
                      {para.trim()}
                    </Text>
                  ))}
              </>
            ) : null}

            {experiences.length > 0 && (
              <>
                <MainTitle>{L("experience", lang)}</MainTitle>
                <View style={s.timeline}>
                  {experiences.map((exp) => {
                    const [roleTitle, dept] = splitRole(pick(exp.role, exp.role_en, lang));
                    const desc = pick(exp.description, exp.description_en, lang);
                    const period = `${formatMonthYear(exp.period_start, lang)} – ${
                      exp.period_end ? formatMonthYear(exp.period_end, lang) : presentLabel
                    }`;
                    const duration = formatDuration(exp.period_start, exp.period_end, lang);
                    return (
                      <View key={exp.id} style={s.job}>
                        <View wrap={false} minPresenceAhead={30}>
                          <View style={s.jobDot} />
                          <View style={s.jobTop}>
                            <View style={{ flex: 1 }}>
                              <Text style={s.jobRole}>{roleTitle}</Text>
                              {dept ? <Text style={s.jobDept}>{dept}</Text> : null}
                            </View>
                            <View style={{ alignItems: "flex-end" }}>
                              <Text style={s.badge}>{period}</Text>
                              {duration ? <Text style={s.duration}>{duration}</Text> : null}
                            </View>
                          </View>
                          <Text style={s.jobCompany}>
                            {exp.company}
                            {exp.location ? <Text style={{ color: C.muted, fontFamily: "Helvetica" }}>{`  ·  ${exp.location}`}</Text> : null}
                          </Text>
                        </View>
                        {desc
                          ?.split("\n")
                          .filter((l) => l.trim())
                          .map((line, i) => (
                            <View key={i} style={s.bulletRow} wrap={false}>
                              <Text style={s.bulletDot}>›</Text>
                              <Text style={s.bulletText}>{line.trim()}</Text>
                            </View>
                          ))}
                      </View>
                    );
                  })}
                </View>
              </>
            )}

            {projects.length > 0 && (
              <>
                {projects.map((p, idx) => {
                  const pDesc = pick(p.description, p.description_en, lang);
                  const tags = (p.tags ?? "")
                    .split(",")
                    .map((x) => x.trim())
                    .filter(Boolean);
                  const card = (
                    <View style={s.project} wrap={false}>
                      <Text style={s.projectTitle}>{pick(p.title, p.title_en, lang)}</Text>
                      {pDesc
                        ? pDesc
                            .split(/\n\s*\n/)
                            .filter((x) => x.trim())
                            .map((para, i) => (
                              <Text key={i} style={s.projectDesc}>
                                {para.trim()}
                              </Text>
                            ))
                        : null}
                      {tags.length > 0 && (
                        <View style={s.tags}>
                          {tags.map((tg) => (
                            <Text key={tg} style={s.tag}>
                              {tg}
                            </Text>
                          ))}
                        </View>
                      )}
                    </View>
                  );
                  // Judul section menempel ke kartu pertama supaya tidak tertinggal di bawah halaman
                  return idx === 0 ? (
                    <View key={p.id} wrap={false}>
                      <MainTitle>{L("projects", lang)}</MainTitle>
                      {card}
                    </View>
                  ) : (
                    <View key={p.id}>{card}</View>
                  );
                })}
              </>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
}

function MainTitle({ children }: { children: string }) {
  return (
    <View style={s.mainHead} wrap={false} minPresenceAhead={40}>
      <Svg width={14} height={14} viewBox="0 0 14 14">
        <Defs>
          <LinearGradient id="mt" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={C.blue} />
            <Stop offset="1" stopColor={C.green} />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="14" height="14" rx="3" fill="url(#mt)" />
      </Svg>
      <Text style={s.mainTitle}>{children}</Text>
      <View style={s.mainRule} />
    </View>
  );
}

function GradientBar() {
  return (
    <Svg width={64} height={4} viewBox="0 0 64 4" style={{ marginTop: 8 }}>
      <Defs>
        <LinearGradient id="gb" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor={C.blue} />
          <Stop offset="0.5" stopColor={C.teal} />
          <Stop offset="1" stopColor={C.green} />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width="64" height="4" rx="2" fill="url(#gb)" />
    </Svg>
  );
}

/* Ikon kontak (stroke 24x24), digambar sebagai SVG karena Helvetica tidak punya glyph ikon */

function Icon({ d }: { d: string }) {
  return (
    <Svg width={11} height={11} viewBox="0 0 24 24">
      <Path d={d} stroke={C.sideAccent} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

const IconMail = () => <Icon d="M4 6h16v12H4z M4 7l8 6 8-6" />;
const IconPhone = () => (
  <Icon d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
);
const IconLink = () => (
  <Icon d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1 M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
);
const IconGlobe = () => <Icon d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M3 12h18 M12 3c3 3.5 3 14.5 0 18 M12 3c-3 3.5-3 14.5 0 18" />;
const IconPin = () => <Icon d="M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12z M12 9.5a1.5 1.5 0 1 0 0-.01" />;
