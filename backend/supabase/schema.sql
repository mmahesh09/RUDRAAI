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

-- ── Client Portal Schema ────────────────────────────────────────────────────

-- Link existing tables to auth users
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Project lifecycle (one project per engagement)
CREATE TABLE IF NOT EXISTS projects (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID        REFERENCES auth.users(id) ON DELETE CASCADE,
  booking_id       UUID        REFERENCES bookings(id) ON DELETE SET NULL,
  title            TEXT        NOT NULL,
  status           TEXT        NOT NULL DEFAULT 'audit'
                   CHECK (status IN ('audit','proposal','signed','in_dev','deployed','support')),
  budget_approved  NUMERIC,
  timeline_start   DATE,
  timeline_end     DATE,
  notes            TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Deliverables (files, workflows, docs) per project
CREATE TABLE IF NOT EXISTS deliverables (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id    UUID        NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name          TEXT        NOT NULL,
  type          TEXT        CHECK (type IN ('workflow','documentation','training','recording','other')),
  file_url      TEXT,
  status        TEXT        NOT NULL DEFAULT 'planned'
                CHECK (status IN ('planned','in_progress','completed','deployed')),
  due_date      DATE,
  completed_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ROI metrics per project
CREATE TABLE IF NOT EXISTS automation_metrics (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id       UUID        NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  metric_name      TEXT        NOT NULL,
  baseline_value   NUMERIC,
  current_value    NUMERIC,
  unit             TEXT,
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Activity feed (status changes, notes, client questions)
CREATE TABLE IF NOT EXISTS project_updates (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id   UUID        NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  author_role  TEXT        NOT NULL CHECK (author_role IN ('admin','client')),
  content      TEXT        NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS: clients see only their own project data
ALTER TABLE projects          ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliverables      ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_updates   ENABLE ROW LEVEL SECURITY;

CREATE POLICY "client_own_projects" ON projects
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "client_own_deliverables" ON deliverables
  FOR ALL USING (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));

CREATE POLICY "client_own_metrics" ON automation_metrics
  FOR ALL USING (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));

CREATE POLICY "client_own_updates" ON project_updates
  FOR ALL USING (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));
