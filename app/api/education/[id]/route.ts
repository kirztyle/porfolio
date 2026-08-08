import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const b = await req.json();
  const rows = await query(
    `UPDATE education SET school=$1, degree=$2, location=$3, period_start=$4, period_end=$5, meta=$6, sort_order=$7
     WHERE id=$8 RETURNING *`,
    [b.school || "", b.degree || "", b.location || "", b.period_start || "", b.period_end || "", b.meta || "", b.sort_order ?? 0, params.id]
  );
  return NextResponse.json(rows[0]);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await query(`DELETE FROM education WHERE id=$1`, [params.id]);
  return NextResponse.json({ ok: true });
}
