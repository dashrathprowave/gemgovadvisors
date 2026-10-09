-- Chatbot lead capture table (used by POST /api/user/register).
-- Not in schema.sql on the old machine — created here so the
-- widget's name+phone lead gate can store visitors.
CREATE TABLE IF NOT EXISTS users (
    id         SERIAL PRIMARY KEY,
    tenant_id  VARCHAR(64)  NOT NULL DEFAULT 'default',
    name       VARCHAR(200) NOT NULL,
    phone      VARCHAR(20)  NOT NULL UNIQUE,
    session_id VARCHAR(128) NOT NULL DEFAULT 'anon',
    last_seen  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_users_tenant ON users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_users_last_seen ON users(last_seen);
