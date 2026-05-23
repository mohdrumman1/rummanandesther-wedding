CREATE TABLE IF NOT EXISTS guest_groups (
  id TEXT PRIMARY KEY,
  household_name TEXT NOT NULL,
  access_code TEXT NOT NULL UNIQUE,
  plus_one_limit INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS guests (
  id TEXT PRIMARY KEY,
  group_id TEXT NOT NULL,
  name TEXT NOT NULL,
  is_primary INTEGER NOT NULL DEFAULT 1,
  is_partner INTEGER NOT NULL DEFAULT 0,
  is_additional INTEGER NOT NULL DEFAULT 0,
  primary_guest_id TEXT,
  children_allowed INTEGER NOT NULL DEFAULT 0,
  max_children INTEGER NOT NULL DEFAULT 0,
  children_count INTEGER NOT NULL DEFAULT 0,
  sangeet_attending INTEGER,
  ceremony_attending INTEGER,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (group_id) REFERENCES guest_groups(id) ON DELETE CASCADE,
  FOREIGN KEY (primary_guest_id) REFERENCES guests(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_guests_group_id ON guests(group_id);

CREATE TABLE IF NOT EXISTS rsvp_notes (
  group_id TEXT PRIMARY KEY,
  dietary_requirements TEXT,
  message TEXT,
  submitted_at TEXT,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (group_id) REFERENCES guest_groups(id) ON DELETE CASCADE
);
