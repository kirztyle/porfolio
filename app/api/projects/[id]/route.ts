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
    `UPDATE projects SET title=$1, title_en=$2, description=$3, description_en=$4, tags=$5, link=$6, image_url=$7, sort_order=$8
     WHERE id=$9 RETURNING *`,
    [b.title || "", b.title_en || "", b.description || "", b.description_en || "", b.tags || "", b.link || "", b.image_url || "", b.sort_order ?? 0, params.id]
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
