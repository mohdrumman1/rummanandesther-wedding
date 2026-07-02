UPDATE guests
SET sort_order = sort_order + 1,
    updated_at = CURRENT_TIMESTAMP
WHERE group_id = (
  SELECT id FROM guest_groups WHERE access_code = 'UVTPSR7HL748EPG9EF'
);

UPDATE guests
SET group_id = (
      SELECT id FROM guest_groups WHERE access_code = 'UVTPSR7HL748EPG9EF'
    ),
    sort_order = 0,
    updated_at = CURRENT_TIMESTAMP
WHERE group_id = (
  SELECT id FROM guest_groups WHERE access_code = 'SXJ2CYXZTUQHNUSH7J'
);

UPDATE guest_groups
SET household_name = 'Lalithamamma, Robin & Reni',
    updated_at = CURRENT_TIMESTAMP
WHERE access_code = 'UVTPSR7HL748EPG9EF';

DELETE FROM guest_groups
WHERE access_code = 'SXJ2CYXZTUQHNUSH7J';
