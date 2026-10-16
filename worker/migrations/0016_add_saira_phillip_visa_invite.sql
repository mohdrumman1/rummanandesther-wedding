INSERT INTO guest_groups (
  id,
  household_name,
  access_code,
  plus_one_limit,
  most_likely_not_coming,
  notes
)
VALUES (
  'grp_52983d795af6adb37c12de82f902b4bd',
  'Saira Phillip',
  '4ESGBJQ55E879LWTEL',
  0,
  1,
  'This invite is just for her visa approval. Saira is already included in the Philip Family headcount.'
);

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
VALUES (
  'gst_0c1c0bb78ddbe6f256e3e4fd1faf9d9c',
  'grp_52983d795af6adb37c12de82f902b4bd',
  'Saira Phillip',
  1,
  0,
  0,
  0,
  1,
  1,
  1,
  0
);
