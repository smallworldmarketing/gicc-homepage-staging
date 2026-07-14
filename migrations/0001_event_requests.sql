CREATE TABLE IF NOT EXISTS event_requests (
  id TEXT PRIMARY KEY,
  reference TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'declined', 'cancelled')),
  request_type TEXT NOT NULL,
  event_details TEXT NOT NULL,
  requested_date TEXT NOT NULL,
  start_time TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  location_preference TEXT NOT NULL,
  alternate_date TEXT,
  recurrence TEXT,
  attendees TEXT NOT NULL,
  expected_participants INTEGER NOT NULL,
  fees_charged INTEGER NOT NULL DEFAULT 0,
  fee_amount_cad REAL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  request_date TEXT NOT NULL,
  qualifications TEXT NOT NULL,
  certification_path TEXT,
  certification_filename TEXT,
  liability_acknowledged INTEGER NOT NULL,
  terms_accepted INTEGER NOT NULL,
  accuracy_confirmed INTEGER NOT NULL,
  signature TEXT NOT NULL,
  terms_version TEXT NOT NULL,
  attribution_json TEXT,
  ip_hash TEXT NOT NULL,
  country TEXT,
  region TEXT,
  city TEXT,
  timezone TEXT,
  asn INTEGER,
  user_agent TEXT,
  notification_status TEXT NOT NULL DEFAULT 'pending' CHECK (notification_status IN ('pending', 'sent', 'failed', 'skipped')),
  notification_error TEXT,
  submitted_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  reviewed_at TEXT,
  reviewed_by TEXT,
  internal_notes TEXT
);

CREATE INDEX IF NOT EXISTS event_requests_status_date_idx
  ON event_requests (status, requested_date, start_time);

CREATE INDEX IF NOT EXISTS event_requests_submitted_at_idx
  ON event_requests (submitted_at DESC);

CREATE TABLE IF NOT EXISTS event_request_rate_limits (
  ip_hash TEXT NOT NULL,
  window_start INTEGER NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (ip_hash, window_start)
);
