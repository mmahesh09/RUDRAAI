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

-- Chat sessions — one row per conversation thread
CREATE TABLE IF NOT EXISTS chat_sessions (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ NOT NULL    DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL    DEFAULT now(),
  metadata    JSONB
);

-- Chat messages — each turn stored individually
CREATE TABLE IF NOT EXISTS chat_messages (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ NOT NULL    DEFAULT now(),
  session_id  UUID        NOT NULL    REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role        TEXT        NOT NULL    CHECK (role IN ('user', 'assistant')),
  content     TEXT        NOT NULL,
  provider    TEXT
);

CREATE INDEX IF NOT EXISTS chat_messages_session_idx ON chat_messages(session_id, created_at);

-- Enable Row Level Security (service_role key bypasses these policies)
ALTER TABLE contacts                ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings                ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers  ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions           ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages           ENABLE ROW LEVEL SECURITY;
