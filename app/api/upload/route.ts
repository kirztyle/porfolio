import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";

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
    const { createClient } = await import("@supabase/supabase-js");

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

    if (!supabaseUrl || !supabaseSecretKey) {
      return NextResponse.json(
        { error: "Environment variables SUPABASE_URL atau SUPABASE_SECRET_KEY belum di-set di Vercel!" },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseSecretKey);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = file.name.split(".").pop() || "png";
    const filename = `profile-${Date.now()}.${ext}`;
    const filePath = `profiles/${filename}`;

    const { error: uploadError } = await supabase.storage
      .from("portfolio-assets") // Pastikan nama bucket ini SAMA PERSIS dengan yang di Supabase
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      // KITA TAMBAHKAN DETAIL ERROR DI SINI
      return NextResponse.json({ 
        error: "Gagal upload ke Supabase", 
        details: uploadError.message 
      }, { status: 500 });
    }

    const { data: urlData } = supabase.storage
      .from("portfolio-assets")
      .getPublicUrl(filePath);

    return NextResponse.json({ url: urlData.publicUrl });

  } catch (error: any) {
    // KITA TAMBAHKAN DETAIL ERROR DI SINI
    return NextResponse.json({ 
      error: "Terjadi kesalahan server", 
      details: error.message 
    }, { status: 500 });
  }
}