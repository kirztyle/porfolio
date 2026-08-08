import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

// Inisialisasi Supabase khusus untuk backend (memakai service_role)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Tipe file harus JPG, PNG, WEBP, atau GIF" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Ukuran file maksimal 5MB" }, { status: 400 });
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Buat nama file unik agar tidak menimpa file lama (menghindari cache browser)
    const ext = file.name.split(".").pop() || "png";
    const filename = `profile-${Date.now()}.${ext}`;
    const filePath = `profiles/${filename}`;

    // Upload ke Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("portfolio-assets") // Pastikan nama bucket sama dengan Step 1
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      return NextResponse.json({ error: "Gagal upload ke cloud" }, { status: 500 });
    }

    // Ambil URL Publik dari foto yang baru saja di-upload
    const { data: urlData } = supabase.storage
      .from("portfolio-assets")
      .getPublicUrl(filePath);

    // Kembalikan URL Cloud (URL ini yang akan disimpan ke database)
    return NextResponse.json({ url: urlData.publicUrl });
    
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}