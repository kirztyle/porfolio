import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

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
  const { data, error } = await createAdminClient()
    .from("experiences")
    .update({
    company: b.company || "",
    role: b.role || "",
    role_en: b.role_en || "",
    location: b.location || "",
    period_start: b.period_start || "",
    period_end: b.period_end || "",
    description: b.description || "",
    description_en: b.description_en || "",
    sort_order: b.sort_order ?? 0,
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
  const { error } = await createAdminClient().from("experiences").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
