import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { query } from "@/lib/db";
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

  const existing = await getProfile();

  if (existing) {
    await query(
      `UPDATE profile SET name=$1, title=$2, title_en=$3, photo_url=$4, description=$5, description_en=$6,
       status=$7, email=$8, phone=$9, linkedin=$10, instagram=$11, location=$12, updated_at=now()
       WHERE id=$13`,
      [name, title, title_en, photo_url, description, description_en, status, email, phone, linkedin, instagram, location, existing.id]
    );
  } else {
    await query(
      `INSERT INTO profile (name, title, title_en, photo_url, description, description_en, status, email, phone, linkedin, instagram, location)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
      [name, title, title_en, photo_url, description, description_en, status, email, phone, linkedin, instagram, location]
    );
  }

  const updated = await getProfile();
  return NextResponse.json(updated);
}
