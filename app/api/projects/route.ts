import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { getProjects } from "@/lib/data";
import { parseImages, parseOptionalId } from "@/lib/validate";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getProjects());
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
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
    .insert({
    title: b.title || "",
    title_en: b.title_en || "",
    description: b.description || "",
    description_en: b.description_en || "",
    tags: b.tags || "",
    link: b.link || "",
    // image_url lama = gambar pertama galeri (tetap sinkron untuk kompatibilitas)
    image_url: images ? images[0] || "" : b.image_url || "",
    images: images ?? [],
    sort_order: b.sort_order ?? 0,
    // Hanya dikirim jika diisi, agar tetap jalan sebelum migrasi 003 dijalankan.
    ...(experienceId !== undefined ? { experience_id: experienceId } : {}),
  })
    .select()
    .single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}
