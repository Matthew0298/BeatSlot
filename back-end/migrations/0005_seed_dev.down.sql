DELETE FROM credit_packages WHERE organization_id IN (SELECT id FROM organizations WHERE slug = 'demo-studio');
DELETE FROM activities WHERE organization_id IN (SELECT id FROM organizations WHERE slug = 'demo-studio');
DELETE FROM organizations WHERE slug = 'demo-studio';
