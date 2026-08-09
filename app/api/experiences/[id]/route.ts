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
    `UPDATE experiences SET company=$1, role=$2, role_en=$3, location=$4, period_start=$5, period_end=$6, description=$7, description_en=$8, sort_order=$9
     WHERE id=$10 RETURNING *`,
    [b.company || "", b.role || "", b.role_en || "", b.location || "", b.period_start || "", b.period_end || "", b.description || "", b.description_en || "", b.sort_order ?? 0, params.id]
  );
  return NextResponse.json(rows[0]);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await query(`DELETE FROM experiences WHERE id=$1`, [params.id]);
  return NextResponse.json({ ok: true });
}
