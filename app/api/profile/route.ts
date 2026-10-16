import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { getProfile } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  const profile = await getProfile();
  return NextResponse.json(profile);
}

export async function PUT(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    name = "",
    title = "",
    title_en = null,
    photo_url = null,
    description = "",
    description_en = null,
    status = "open",
    email = null,
    phone = null,
    linkedin = null,
    instagram = null,
    location = null,
  } = body;

  const values = {
    name,
    title,
    title_en,
    photo_url,
    description,
    description_en,
    status,
    email,
    phone,
    linkedin,
    instagram,
    location,
  };

  const supabase = createAdminClient();
  const existing = await getProfile();

  const result = existing
    ? await supabase
        .from("profile")
        .update({ ...values, updated_at: new Date().toISOString() })
        .eq("id", existing.id)
        .select()
        .maybeSingle()
    : await supabase.from("profile").insert(values).select().maybeSingle();

  if (result.error) {
    return NextResponse.json({ error: result.error.message }, { status: 500 });
  }
  return NextResponse.json(result.data);
}
