-- Service inquiry form submissions
-- Run in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS service_inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  platform TEXT NOT NULL,
  service_tier TEXT NOT NULL,
  description TEXT,
  ip_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE service_inquiries ENABLE ROW LEVEL SECURITY;

-- No public access — only service role can read/write
-- Sean can view via Supabase Dashboard
