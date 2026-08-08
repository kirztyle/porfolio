import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

// SESUAIKAN DI SINI: Pakai SUPABASE_URL dan SUPABASE_SECRET_KEY
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY! 
);

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
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = file.name.split(".").pop() || "png";
    const filename = `profile-${Date.now()}.${ext}`;
    const filePath = `profiles/${filename}`;

    // Upload ke bucket 'portfolio-assets' (sesuaikan jika nama bucket kamu beda)
    const { error: uploadError } = await supabase.storage
      .from("portfolio-assets") 
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true, // Menimpa file jika nama sama
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      return NextResponse.json({ error: "Gagal upload ke cloud" }, { status: 500 });
    }

    const { data: urlData } = supabase.storage
      .from("portfolio-assets")
      .getPublicUrl(filePath);

    return NextResponse.json({ url: urlData.publicUrl });
    
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}