-- +migrate Up
CREATE TABLE IF NOT EXISTS body_metrics (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  height_cm NUMERIC(6,2),  -- es. 180.50
  weight_kg NUMERIC(6,2),  -- es. 72.30
  body_fat_percentage NUMERIC(5,2),
  measured_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_body_metrics_user_id ON body_metrics (user_id);
CREATE INDEX idx_body_metrics_measured_at ON body_metrics (measured_at);
