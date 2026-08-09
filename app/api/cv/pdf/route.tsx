import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { getPortfolioData } from "@/lib/data";
import { CVDocument } from "@/components/pdf/CVDocuments";
import type { Lang } from "@/lib/I18n";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lang: Lang = searchParams.get("lang") === "en" ? "en" : "id";

  const { profile, experiences, skills, education, projects, certificates } =
    await getPortfolioData();

  const buffer = await renderToBuffer(
    <CVDocument
      profile={profile}
      experiences={experiences}
      skills={skills}
      education={education}
      projects={projects}
      certificates={certificates}
      lang={lang}
    />
  );

  const safeName = (profile?.name || "CV").trim().replace(/\s+/g, "_");
  const filename = `${safeName}_CV_${lang.toUpperCase()}.pdf`;

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}