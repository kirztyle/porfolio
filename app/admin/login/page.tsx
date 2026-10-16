"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gagal login");
        setLoading(false);
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-sm border border-hairline bg-panel p-8"
      >
        <p className="font-display text-[10px] tracking-[0.25em] text-teal">
          ADMIN_ACCESS
        </p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-primary">
          Masuk ke Panel
        </h1>
        <p className="mt-2 font-body text-sm text-muted">
          Masukkan password admin untuk mengelola data portfolio.
        </p>

        <label className="mt-6 block font-display text-[10px] tracking-[0.15em] text-dim">
          PASSWORD
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoFocus
          className="mt-2 w-full rounded-sm border border-hairline bg-panel2 px-3 py-2.5 font-body text-sm text-primary outline-none focus:border-teal"
          placeholder="••••••••"
        />

        {error && (
          <p className="mt-3 font-body text-sm text-red">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-sm bg-teal py-2.5 font-display text-xs font-semibold tracking-[0.1em] text-bg transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "MEMPROSES..." : "MASUK"}
        </button>
      </form>
    </main>
  );
}
