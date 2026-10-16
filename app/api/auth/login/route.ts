import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD belum diset di .env" },
      { status: 500 }
    );
  }

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Password salah" }, { status: 401 });
  }

  await createSession();
  return NextResponse.json({ ok: true });
}
