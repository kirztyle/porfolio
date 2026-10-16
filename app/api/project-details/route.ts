import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { parseImages } from "@/lib/validate";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const b = await req.json();
  const projectId = Number(b.project_id);
  if (!Number.isInteger(projectId) || projectId <= 0) {
    return NextResponse.json({ error: "project_id tidak valid" }, { status: 400 });
  }
  const images = parseImages(b.images);
  if (images === null) {
    return NextResponse.json({ error: "images harus berupa array string" }, { status: 400 });
  }
  const { data, error } = await createAdminClient()
    .from("project_details")
    .insert({
      project_id: projectId,
      title: b.title || "",
      title_en: b.title_en || "",
      description: b.description || "",
      description_en: b.description_en || "",
      bullets: b.bullets || "",
      bullets_en: b.bullets_en || "",
      images: images ?? [],
      sort_order: b.sort_order ?? 0,
    })
    .select()
    .single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}
