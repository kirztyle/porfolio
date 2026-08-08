import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { query } from "@/lib/db";
import { getCertificates } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getCertificates());
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const b = await req.json();
  const rows = await query(
    `INSERT INTO certificates (title, category, sort_order) VALUES ($1,$2,$3) RETURNING *`,
    [b.title || "", b.category || "", b.sort_order ?? 0]
  );
  return NextResponse.json(rows[0]);
}
