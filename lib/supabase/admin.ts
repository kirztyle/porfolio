import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Client Supabase dengan secret key (bypass RLS). SERVER-ONLY.
 * Pakai HANYA di route handler admin yang sudah memanggil isAuthenticated().
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL atau SUPABASE_SECRET_KEY belum diset di environment.",
    );
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
