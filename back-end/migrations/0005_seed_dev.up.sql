INSERT INTO organizations (name, slug, settings)
VALUES ('Demo Studio', 'demo-studio', '{"cancellation_hours": 24}')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO activities (organization_id, name, description, credits_per_session)
SELECT o.id, 'Yoga Flow', 'Lezione di yoga rilassante', 2
FROM organizations o WHERE o.slug = 'demo-studio'
  AND NOT EXISTS (
    SELECT 1 FROM activities a WHERE a.organization_id = o.id AND a.name = 'Yoga Flow'
  );

INSERT INTO credit_packages (organization_id, name, credits, price_cents)
SELECT o.id, 'Pacchetto Base', 10, 2500
FROM organizations o WHERE o.slug = 'demo-studio';

INSERT INTO credit_packages (organization_id, name, credits, price_cents)
SELECT o.id, 'Pacchetto Premium', 25, 5500
FROM organizations o WHERE o.slug = 'demo-studio';

INSERT INTO sessions (organization_id, activity_id, start_at, end_at, capacity, credits_required, instructor_name)
SELECT o.id, a.id, now() + interval '1 day', now() + interval '1 day 1 hour', 12, 2, 'Giulia Bianchi'
FROM organizations o
JOIN activities a ON a.organization_id = o.id AND a.name = 'Yoga Flow'
WHERE o.slug = 'demo-studio'
  AND NOT EXISTS (SELECT 1 FROM sessions s WHERE s.activity_id = a.id AND s.start_at > now());

INSERT INTO sessions (organization_id, activity_id, start_at, end_at, capacity, credits_required, instructor_name)
SELECT o.id, a.id, now() + interval '2 days', now() + interval '2 days 1 hour', 10, 3, 'Marco Rossi'
FROM organizations o
JOIN activities a ON a.organization_id = o.id AND a.name = 'Yoga Flow'
WHERE o.slug = 'demo-studio'
  AND NOT EXISTS (
    SELECT 1 FROM sessions s
    WHERE s.activity_id = a.id AND s.instructor_name = 'Marco Rossi' AND s.start_at > now()
  );
