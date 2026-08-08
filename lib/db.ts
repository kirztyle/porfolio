import { Pool, PoolClient } from "pg";

const globalForDb = globalThis as unknown as { pool: Pool | undefined };

export const pool =
  globalForDb.pool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 3,                    // Kurangi max connections (dari 10 ke 3)
    idleTimeoutMillis: 10000,  // Tutup koneksi idle setelah 10 detik
    connectionTimeoutMillis: 15000, // Naikkan timeout dari 5 detik ke 15 detik
    statement_timeout: 30000,  // Timeout untuk query yang terlalu lama
    query_timeout: 30000,
    keepAlive: true,           // Jaga koneksi tetap hidup
    allowExitOnIdle: true,     // Boleh exit jika semua koneksi idle
  });

if (process.env.NODE_ENV !== "production") globalForDb.pool = pool;

export async function query<T = any>(
  text: string,
  params?: any[]
): Promise<T[]> {
  let client: PoolClient | null = null;
  try {
    client = await pool.connect();
    const res = await client.query(text, params);
    return res.rows as T[];
  } catch (error: any) {
    console.error("Database query error:", error.message);
    throw new Error(`Database error: ${error.message}`);
  } finally {
    if (client) client.release(); // WAJIB release koneksi
  }
}