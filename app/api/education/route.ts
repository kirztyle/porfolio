import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { getEducation } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getEducation());
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const b = await req.json();
  const { data, error } = await createAdminClient()
    .from("education")
    .insert({
    school: b.school || "",
    degree: b.degree || "",
    location: b.location || "",
    period_start: b.period_start || "",
    period_end: b.period_end || "",
    meta: b.meta || "",
    sort_order: b.sort_order ?? 0,
  })
    .select()
    .single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}
