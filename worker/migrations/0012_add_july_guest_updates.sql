UPDATE guest_groups
SET household_name = 'Thomas & Cheryl',
    plus_one_limit = 3,
    updated_at = CURRENT_TIMESTAMP
WHERE access_code = 'G3FFQGERZZULEFL89F';

INSERT INTO guest_groups (id, household_name, access_code, plus_one_limit, notes)
VALUES
  ('grp_08b1a5a188f240f8a74b5a06523d83cf', 'Lucy Watt & Joe Loeschnauer', '72EE6QJ4UMLWBRR3L2', 0, ''),
  ('grp_cdd4ea7827774e5fbfdbb54d7536aeba', 'Amelia Tulip', 'EMJRBVC5Q5MDA2KLZ3', 0, ''),
  ('grp_4eeaa99cbba34658951ca3f81bb2d887', 'Aysha & Nawaz', 'QXVF7F3J4CQ678AQCA', 0, '');

INSERT INTO guests (id, group_id, name, is_primary, is_partner, sort_order)
VALUES
  ('gst_ffdc4cd1dcad41c6ada931d1b0f2f11a', 'grp_08b1a5a188f240f8a74b5a06523d83cf', 'Lucy Watt', 1, 0, 0),
  ('gst_a0a6241658814c9e899f9fa63b7d4e25', 'grp_08b1a5a188f240f8a74b5a06523d83cf', 'Joe Loeschnauer', 0, 1, 1),
  ('gst_0306570b874a466fa7111cf1f72672db', 'grp_cdd4ea7827774e5fbfdbb54d7536aeba', 'Amelia Tulip', 1, 0, 0),
  ('gst_6703021f119f485aa50530fe65fee420', 'grp_4eeaa99cbba34658951ca3f81bb2d887', 'Aysha', 1, 0, 0),
  ('gst_8323e9735ce4472b8a026ffce175504d', 'grp_4eeaa99cbba34658951ca3f81bb2d887', 'Nawaz', 0, 1, 1);
