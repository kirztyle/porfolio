/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pool } from 'pg';

const globalForDb = globalThis as unknown as { pool: Pool | undefined };

export const pool = globalForDb.pool ?? new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { 
    rejectUnauthorized: false 
  },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 15000, // Timeout 15 detik
});

if (process.env.NODE_ENV !== 'production') globalForDb.pool = pool;

export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
  const client = await pool.connect();
  try {
    const res = await client.query(text, params);
    return res.rows as T[];
  } finally {
    client.release();
  }
}