import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { parseImages } from "@/lib/validate";

export const dynamic = "force-dynamic";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const b = await req.json();
  const images = parseImages(b.images);
  if (images === null) {
    return NextResponse.json({ error: "images harus berupa array string" }, { status: 400 });
  }
  // project_id sengaja tidak bisa diubah lewat PUT.
  const { data, error } = await createAdminClient()
    .from("project_details")
    .update({
      title: b.title || "",
      title_en: b.title_en || "",
      description: b.description || "",
      description_en: b.description_en || "",
      bullets: b.bullets || "",
      bullets_en: b.bullets_en || "",
      sort_order: b.sort_order ?? 0,
      ...(images ? { images } : {}),
    })
    .eq("id", id)
    .select()
    .maybeSingle();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "Data tidak ditemukan" }, { status: 404 });
  }
  return NextResponse.json(data);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const { error } = await createAdminClient().from("project_details").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
