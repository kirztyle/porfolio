import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCertificates } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getCertificates());
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const b = await req.json();
  const { data, error } = await createAdminClient()
    .from("certificates")
    .insert({
    title: b.title || "",
    category: b.category || "",
    sort_order: b.sort_order ?? 0,
  })
    .select()
    .single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}
