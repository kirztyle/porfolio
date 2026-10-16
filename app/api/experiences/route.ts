import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { getExperiences } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getExperiences());
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const b = await req.json();
  const { data, error } = await createAdminClient()
    .from("experiences")
    .insert({
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
    .select()
    .single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}
