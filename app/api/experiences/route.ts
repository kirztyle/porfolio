import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { query } from "@/lib/db";
import { getExperiences } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getExperiences());
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const b = await req.json();
  const rows = await query(
    `INSERT INTO experiences (company, role, role_en, location, period_start, period_end, description, description_en, sort_order)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
    [b.company || "", b.role || "", b.role_en || "", b.location || "", b.period_start || "", b.period_end || "", b.description || "", b.description_en || "", b.sort_order ?? 0]
  );
  return NextResponse.json(rows[0]);
}
