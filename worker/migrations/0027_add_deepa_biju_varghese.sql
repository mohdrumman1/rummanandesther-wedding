INSERT INTO guest_groups (id, household_name, access_code, plus_one_limit, notes)
VALUES
  ('grp_4affe531c584d2286b3607b1d1d2f595', 'Deepa & Dr Biju Varghese', 'N4HMK5R16BCQE1MV5Z', 0, '');

INSERT INTO guests (
  id,
  group_id,
  name,
  is_primary,
  is_partner,
  children_allowed,
  max_children,
  sangeet_invited,
  ceremony_invited,
  reception_invited,
  sort_order
)
VALUES
  ('gst_cd6bb4e2d682aa7a64d5bb3bc814963f', 'grp_4affe531c584d2286b3607b1d1d2f595', 'Deepa', 1, 0, 0, 0, 0, 1, 1, 0),
  ('gst_100a43f8e0715879e40a4a15ae5b2202', 'grp_4affe531c584d2286b3607b1d1d2f595', 'Dr Biju Varghese', 0, 1, 0, 0, 0, 1, 1, 1);
