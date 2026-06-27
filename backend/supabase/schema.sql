-- ── RudraAI — Supabase Schema ─────────────────────────────────────────────────
-- Run this in the Supabase SQL editor once to set up all tables.
-- The backend uses the service_role key which bypasses RLS.

-- Contact form submissions
CREATE TABLE IF NOT EXISTS contacts (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ NOT NULL    DEFAULT now(),
  name        TEXT        NOT NULL,
  email       TEXT        NOT NULL,
  company     TEXT,
  budget      TEXT,
  message     TEXT        NOT NULL,
  status      TEXT        NOT NULL    DEFAULT 'new'
);

-- Booking / automation audit requests
CREATE TABLE IF NOT EXISTS bookings (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ NOT NULL    DEFAULT now(),
  name        TEXT        NOT NULL,
  email       TEXT        NOT NULL,
  company     TEXT,
  role        TEXT,
  time_slot   TEXT        NOT NULL,
  goal        TEXT        NOT NULL,
  zoom_link   TEXT,
  status      TEXT        NOT NULL    DEFAULT 'new'
);

-- Newsletter / email list subscribers
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ NOT NULL    DEFAULT now(),
  email       TEXT        NOT NULL    UNIQUE
);

-- Enable Row Level Security (service_role key bypasses these policies)
ALTER TABLE contacts                ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings                ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers  ENABLE ROW LEVEL SECURITY;
