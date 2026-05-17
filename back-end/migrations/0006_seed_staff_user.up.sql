-- Dev staff: staff@gymbook.local / password: staff123
INSERT INTO users (username, email, password_hash, nome, cognome, role)
SELECT 'staff', 'staff@gymbook.local',
  '$2a$12$WR3jGzKiUzP0KiU10KH9b.TWXDu/3R6zzI1XuUsXz.qnhnhZY43z6',
  'Staff', 'Demo', 'staff'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'staff@gymbook.local');

INSERT INTO organization_memberships (organization_id, user_id, role, credits_balance)
SELECT o.id, u.id, 'staff', 0
FROM organizations o
CROSS JOIN users u
WHERE o.slug = 'demo-studio' AND u.email = 'staff@gymbook.local'
  AND NOT EXISTS (
    SELECT 1 FROM organization_memberships om
    WHERE om.organization_id = o.id AND om.user_id = u.id
  );
