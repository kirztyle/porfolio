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
    `UPDATE projects SET title=$1, description=$2, tags=$3, link=$4, sort_order=$5 WHERE id=$6 RETURNING *`,
    [b.title || "", b.description || "", b.tags || "", b.link || "", b.sort_order ?? 0, params.id]
  );
  return NextResponse.json(rows[0]);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await query(`DELETE FROM projects WHERE id=$1`, [params.id]);
  return NextResponse.json({ ok: true });
}
