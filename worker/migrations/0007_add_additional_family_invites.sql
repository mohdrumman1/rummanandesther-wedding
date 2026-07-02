INSERT INTO guest_groups (id, household_name, access_code, plus_one_limit, notes)
VALUES
  ('grp_' || lower(hex(randomblob(16))), 'Cherian & Latha', 'YM2Z5SH5KEG5WZNMFA', 0, ''),
  ('grp_' || lower(hex(randomblob(16))), 'Harry & Usha', '48W8S29C3KYQCQ6PDL', 0, ''),
  ('grp_' || lower(hex(randomblob(16))), 'Biju & Asha', '8WPDR75TUTDC3WDWHX', 0, ''),
  ('grp_' || lower(hex(randomblob(16))), 'Sreeni & Aswathy', 'RZMCFLPWYCGAN7WLDD', 0, '');

INSERT INTO guests (id, group_id, name, is_primary, is_partner, sort_order)
VALUES
  ('gst_' || lower(hex(randomblob(16))), (SELECT id FROM guest_groups WHERE access_code = 'YM2Z5SH5KEG5WZNMFA'), 'Cherian', 1, 0, 0),
  ('gst_' || lower(hex(randomblob(16))), (SELECT id FROM guest_groups WHERE access_code = 'YM2Z5SH5KEG5WZNMFA'), 'Latha', 0, 1, 1),
  ('gst_' || lower(hex(randomblob(16))), (SELECT id FROM guest_groups WHERE access_code = '48W8S29C3KYQCQ6PDL'), 'Harry', 1, 0, 0),
  ('gst_' || lower(hex(randomblob(16))), (SELECT id FROM guest_groups WHERE access_code = '48W8S29C3KYQCQ6PDL'), 'Usha', 0, 1, 1),
  ('gst_' || lower(hex(randomblob(16))), (SELECT id FROM guest_groups WHERE access_code = '8WPDR75TUTDC3WDWHX'), 'Biju', 1, 0, 0),
  ('gst_' || lower(hex(randomblob(16))), (SELECT id FROM guest_groups WHERE access_code = '8WPDR75TUTDC3WDWHX'), 'Asha', 0, 1, 1),
  ('gst_' || lower(hex(randomblob(16))), (SELECT id FROM guest_groups WHERE access_code = 'RZMCFLPWYCGAN7WLDD'), 'Sreeni', 1, 0, 0),
  ('gst_' || lower(hex(randomblob(16))), (SELECT id FROM guest_groups WHERE access_code = 'RZMCFLPWYCGAN7WLDD'), 'Aswathy', 0, 1, 1);
