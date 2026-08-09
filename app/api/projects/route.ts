import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { query } from "@/lib/db";
import { getProjects } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getProjects());
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const b = await req.json();
  const rows = await query(
    `INSERT INTO projects (title, title_en, description, description_en, tags, link, image_url, sort_order)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [b.title || "", b.title_en || "", b.description || "", b.description_en || "", b.tags || "", b.link || "", b.image_url || "", b.sort_order ?? 0]
  );
  return NextResponse.json(rows[0]);
}