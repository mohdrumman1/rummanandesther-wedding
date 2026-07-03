ALTER TABLE guests ADD COLUMN reception_attending INTEGER;
ALTER TABLE guests ADD COLUMN ceremony_children_count INTEGER NOT NULL DEFAULT 0;
ALTER TABLE guests ADD COLUMN reception_children_count INTEGER NOT NULL DEFAULT 0;

-- Existing combined answers applied to both events. Guests can change either answer later.
UPDATE guests SET reception_attending = ceremony_attending;
UPDATE guests
SET ceremony_children_count = children_count,
    reception_children_count = children_count;
