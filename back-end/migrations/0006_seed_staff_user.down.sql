DELETE FROM organization_memberships
WHERE user_id IN (SELECT id FROM users WHERE email = 'staff@gymbook.local');

DELETE FROM users WHERE email = 'staff@gymbook.local';
