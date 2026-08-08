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
    photo_url = null,
    description = "",
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
      `UPDATE profile SET name=$1, title=$2, photo_url=$3, description=$4, status=$5,
       email=$6, phone=$7, linkedin=$8, instagram=$9, location=$10, updated_at=now()
       WHERE id=$11`,
      [name, title, photo_url, description, status, email, phone, linkedin, instagram, location, existing.id]
    );
  } else {
    await query(
      `INSERT INTO profile (name, title, photo_url, description, status, email, phone, linkedin, instagram, location)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [name, title, photo_url, description, status, email, phone, linkedin, instagram, location]
    );
  }

  const updated = await getProfile();
  return NextResponse.json(updated);
}
