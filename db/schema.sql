-- Portfolio database schema
-- Run this once against your PostgreSQL database:
--   psql "$DATABASE_URL" -f db/schema.sql

CREATE TABLE IF NOT EXISTS profile (
  id            SERIAL PRIMARY KEY,
  name          TEXT NOT NULL DEFAULT '',
  title         TEXT NOT NULL DEFAULT '',
  photo_url     TEXT,
  description   TEXT NOT NULL DEFAULT '',
  status        TEXT NOT NULL DEFAULT 'open', -- open | limited | closed  (dipakai untuk badge status di hero)
  email         TEXT,
  phone         TEXT,
  linkedin      TEXT,
  instagram     TEXT,
  location      TEXT,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS experiences (
  id            SERIAL PRIMARY KEY,
  company       TEXT NOT NULL,
  role          TEXT NOT NULL,
  location      TEXT,
  period_start  TEXT,
  period_end    TEXT, -- 'Present' jika masih berjalan
  description   TEXT, -- satu baris per bullet, dipisah newline
  sort_order    INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS skills (
  id            SERIAL PRIMARY KEY,
  category      TEXT NOT NULL,
  items         TEXT NOT NULL, -- dipisah koma
  sort_order    INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS education (
  id            SERIAL PRIMARY KEY,
  school        TEXT NOT NULL,
  degree        TEXT,
  location      TEXT,
  period_start  TEXT,
  period_end    TEXT,
  meta          TEXT, -- ex: GPA
  sort_order    INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS projects (
  id            SERIAL PRIMARY KEY,
  title         TEXT NOT NULL,
  description   TEXT,
  tags          TEXT, -- dipisah koma
  link          TEXT,
  sort_order    INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS certificates (
  id            SERIAL PRIMARY KEY,
  title         TEXT NOT NULL,
  category      TEXT,
  sort_order    INTEGER NOT NULL DEFAULT 0
);
