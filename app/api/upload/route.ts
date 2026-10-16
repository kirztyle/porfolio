import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const maxDuration = 30; // Tambah timeout jadi 30 detik untuk Vercel

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 });
  if (!ALLOWED_TYPES.includes(file.type)) return NextResponse.json({ error: "Tipe file tidak didukung" }, { status: 400 });
  if (file.size > MAX_SIZE) return NextResponse.json({ error: "Ukuran file maksimal 5MB" }, { status: 400 });

  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Environment variables NEXT_PUBLIC_SUPABASE_URL atau SUPABASE_SECRET_KEY belum di-set!" },
        { status: 500 }
      );
    }

    const supabase = createAdminClient();

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = file.name.split(".").pop() || "png";
    const filename = `profile-${Date.now()}.${ext}`;
    const filePath = `profiles/${filename}`;

    const { error: uploadError } = await supabase.storage
      .from("portfolio") // Nama bucket harus SAMA PERSIS dengan yang di Supabase
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      return NextResponse.json(
        { error: "Gagal upload ke Supabase", details: uploadError.message },
        { status: 500 }
      );
    }

    const { data: urlData } = supabase.storage
      .from("portfolio")
      .getPublicUrl(filePath);

    return NextResponse.json({ url: urlData.publicUrl });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Terjadi kesalahan server",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
