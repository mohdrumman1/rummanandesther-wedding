INSERT INTO guest_groups (id, household_name, access_code, plus_one_limit, notes)
VALUES
  ('grp_' || lower(hex(randomblob(16))), 'Donna & Alen', 'REDV67JNMBXSDH5WRM', 0, ''),
  ('grp_' || lower(hex(randomblob(16))), 'Ronin & Greeshma', 'BFNVDCM47Y8BRNVSLC', 0, '');

INSERT INTO guests (id, group_id, name, is_primary, is_partner, sort_order)
VALUES
  ('gst_' || lower(hex(randomblob(16))), (SELECT id FROM guest_groups WHERE access_code = 'REDV67JNMBXSDH5WRM'), 'Donna', 1, 0, 0),
  ('gst_' || lower(hex(randomblob(16))), (SELECT id FROM guest_groups WHERE access_code = 'REDV67JNMBXSDH5WRM'), 'Alen', 0, 1, 1),
  ('gst_' || lower(hex(randomblob(16))), (SELECT id FROM guest_groups WHERE access_code = 'BFNVDCM47Y8BRNVSLC'), 'Ronin', 1, 0, 0),
  ('gst_' || lower(hex(randomblob(16))), (SELECT id FROM guest_groups WHERE access_code = 'BFNVDCM47Y8BRNVSLC'), 'Greeshma', 0, 1, 1);
