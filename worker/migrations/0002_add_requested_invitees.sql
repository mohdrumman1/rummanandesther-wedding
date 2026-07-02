INSERT OR IGNORE INTO guest_groups (id, household_name, access_code, plus_one_limit, notes)
VALUES
  ('grp_2dead9995fbb406b82f04a5bcae03bcd', 'Suresh Kunji Mohammed & Zafeena', '2DEAD9995FBB406B82', 0, ''),
  ('grp_aacd45db38194807b29b538f8c5498d6', 'Royce, Darshana, Elizer & Izaiah', 'AACD45DB38194807B2', 0, '');

INSERT OR IGNORE INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, children_allowed, max_children, sort_order)
VALUES
  ('gst_746a939992b1402dafbb38aeee976b52', 'grp_2dead9995fbb406b82f04a5bcae03bcd', 'Suresh Kunji Mohammed', 1, 0, 0, NULL, 0, 0, 0),
  ('gst_0987444a23d64089beec1d9ff4fdfe20', 'grp_2dead9995fbb406b82f04a5bcae03bcd', 'Zafeena', 0, 1, 0, NULL, 0, 0, 1),
  ('gst_b7ab778123c2497797f7358db706a2f8', 'grp_aacd45db38194807b29b538f8c5498d6', 'Royce', 1, 0, 0, NULL, 0, 0, 0),
  ('gst_53a1b17516fa481396b86bf0cbb1cfc8', 'grp_aacd45db38194807b29b538f8c5498d6', 'Darshana', 0, 1, 0, NULL, 0, 0, 1),
  ('gst_a581aa8f89274978a04f10a1a25f9b7c', 'grp_aacd45db38194807b29b538f8c5498d6', 'Elizer', 0, 0, 0, NULL, 0, 0, 2),
  ('gst_eebf98ab6cfc4226801910113e351d50', 'grp_aacd45db38194807b29b538f8c5498d6', 'Izaiah', 0, 0, 0, NULL, 0, 0, 3);
