import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { parseImages, parseOptionalId } from "@/lib/validate";

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
  const experienceId = parseOptionalId(b.experience_id);
  if (Number.isNaN(experienceId)) {
    return NextResponse.json({ error: "experience_id tidak valid" }, { status: 400 });
  }
  const { data, error } = await createAdminClient()
    .from("projects")
    .update({
    title: b.title || "",
    title_en: b.title_en || "",
    description: b.description || "",
    description_en: b.description_en || "",
    tags: b.tags || "",
    link: b.link || "",
    sort_order: b.sort_order ?? 0,
    // experience_id tidak dikirim -> kolom tidak diubah (aman sebelum migrasi 003)
    ...(experienceId !== undefined ? { experience_id: experienceId } : {}),
    // images tidak dikirim -> kolom tidak diubah; jika dikirim, image_url ikut sinkron
    ...(images ? { images, image_url: images[0] || "" } : { image_url: b.image_url || "" }),
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
  const { error } = await createAdminClient().from("projects").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
