CREATE TABLE IF NOT EXISTS media (
  id TEXT PRIMARY KEY,
  device_id TEXT NOT NULL,
  uploader_name TEXT,
  key TEXT NOT NULL,
  thumb_key TEXT,
  filename TEXT,
  content_type TEXT NOT NULL,
  size INTEGER NOT NULL DEFAULT 0,
  upload_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'complete')),
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_media_device ON media (device_id);
CREATE INDEX IF NOT EXISTS idx_media_status_created ON media (status, created_at);
