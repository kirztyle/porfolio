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
    `INSERT INTO projects (title, description, tags, link, image_url, sort_order) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [b.title || "", b.description || "", b.tags || "", b.link || "", b.image_url || "", b.sort_order ?? 0]
  );
  return NextResponse.json(rows[0]);
}
