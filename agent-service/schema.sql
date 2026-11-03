CREATE TABLE IF NOT EXISTS quotas (
  key TEXT PRIMARY KEY,
  count INTEGER NOT NULL,
  expires INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS quotas_expiry ON quotas(expires);
