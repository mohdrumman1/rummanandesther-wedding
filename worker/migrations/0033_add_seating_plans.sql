-- Admin seating plan: one JSON document (tables, positions, guest assignments).
CREATE TABLE IF NOT EXISTS seating_plans (
  id TEXT PRIMARY KEY,
  data TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
