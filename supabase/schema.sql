-- Mnemox Supabase Schema
-- Clerk JWKS integration: user IDs are strings (not UUIDs)
-- All tables have RLS enabled

-- Helper function: extract Clerk user ID from JWT sub claim
CREATE OR REPLACE FUNCTION requesting_user_id()
RETURNS TEXT AS $$
  SELECT nullif(current_setting('request.jwt.claims', true)::json->>'sub', '')
$$ LANGUAGE sql STABLE;

-- ============================================================
-- Users (synced from Clerk via webhook)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id            TEXT PRIMARY KEY,              -- Clerk user ID (e.g. user_xxx)
  email         TEXT NOT NULL,
  name          TEXT,
  image_url     TEXT,
  plan          TEXT NOT NULL DEFAULT 'free',  -- free | pro | enterprise
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_select_own" ON users
  FOR SELECT USING (id = requesting_user_id());

CREATE POLICY "users_update_own" ON users
  FOR UPDATE USING (id = requesting_user_id());

-- Service role can do everything (webhook inserts)
CREATE POLICY "users_service_all" ON users
  FOR ALL USING (current_setting('role') = 'service_role');

-- ============================================================
-- API Keys
-- ============================================================
CREATE TABLE IF NOT EXISTS api_keys (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name          TEXT NOT NULL DEFAULT 'Default',
  key_hash      TEXT NOT NULL,                 -- SHA-256 of mk_live_xxx
  key_prefix    TEXT NOT NULL,                 -- first 8 chars for display (mk_live_xxxx...)
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_used_at  TIMESTAMPTZ
);

ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "api_keys_select_own" ON api_keys
  FOR SELECT USING (user_id = requesting_user_id());

CREATE POLICY "api_keys_insert_own" ON api_keys
  FOR INSERT WITH CHECK (user_id = requesting_user_id());

CREATE POLICY "api_keys_update_own" ON api_keys
  FOR UPDATE USING (user_id = requesting_user_id());

CREATE POLICY "api_keys_delete_own" ON api_keys
  FOR DELETE USING (user_id = requesting_user_id());

CREATE POLICY "api_keys_service_all" ON api_keys
  FOR ALL USING (current_setting('role') = 'service_role');

-- ============================================================
-- Subscriptions (synced from PayPal webhook)
-- ============================================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan            TEXT NOT NULL DEFAULT 'free',   -- free | pro | enterprise
  status          TEXT NOT NULL DEFAULT 'active', -- active | cancelled | past_due
  paypal_subscription_id TEXT UNIQUE,             -- PayPal subscription ID (idempotency key)
  paypal_plan_id  TEXT,                           -- PayPal plan ID (P-xxx)
  paypal_payer_email TEXT,                        -- PayPal payer email
  paypal_payer_id TEXT,                           -- PayPal payer ID
  current_period_start TIMESTAMPTZ,
  current_period_end   TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "subscriptions_select_own" ON subscriptions
  FOR SELECT USING (user_id = requesting_user_id());

CREATE POLICY "subscriptions_service_all" ON subscriptions
  FOR ALL USING (current_setting('role') = 'service_role');

-- ============================================================
-- Usage Logs
-- ============================================================
CREATE TABLE IF NOT EXISTS usage_logs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  endpoint      TEXT NOT NULL,                  -- e.g. idea_check, api/check
  tokens_used   INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "usage_logs_select_own" ON usage_logs
  FOR SELECT USING (user_id = requesting_user_id());

CREATE POLICY "usage_logs_insert_own" ON usage_logs
  FOR INSERT WITH CHECK (user_id = requesting_user_id());

CREATE POLICY "usage_logs_service_all" ON usage_logs
  FOR ALL USING (current_setting('role') = 'service_role');

-- ============================================================
-- Indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_key_hash ON api_keys(key_hash);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_user_id ON usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_created_at ON usage_logs(created_at);
