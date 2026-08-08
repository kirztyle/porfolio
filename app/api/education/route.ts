import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { query } from "@/lib/db";
import { getEducation } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getEducation());
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const b = await req.json();
  const rows = await query(
    `INSERT INTO education (school, degree, location, period_start, period_end, meta, sort_order)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [b.school || "", b.degree || "", b.location || "", b.period_start || "", b.period_end || "", b.meta || "", b.sort_order ?? 0]
  );
  return NextResponse.json(rows[0]);
}
