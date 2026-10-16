-- Esther's dad flagged: can't find "Dr Susan Usha Mathew" etc for items 22-26, and most of 44-47 missing.
--
-- Root cause 1: items 22-26 are couple/person headers whose lettered children were added in
-- migration 0020, but the headers themselves were never inserted as invites at all.
-- Root cause 2: items 44-46 headers DO exist, but only under old nicknames from migration 0007
-- ("Cherian & Latha", "Harry & Usha", "Biju & Asha") that don't match dad's current list text,
-- so a name search for them turns up nothing. Item 47's header ("Sreeni & Aswathy") is missing
-- from the live database entirely (present in migration 0007's source but not found in a live
-- lookup), so it's re-added here as a new invite.
-- All new/renamed entries kept wedding-ceremony-only per the earlier "wedding only" instruction
-- covering the whole dad's-list batch.

-- 22: Dr Susan Usha Mathew and Dr Binu Thomas
INSERT INTO guest_groups (id, household_name, access_code, plus_one_limit, most_likely_not_coming, notes)
VALUES ('grp_2dbb9aef000cf4223dcc4ef5a34bf5a2', 'Dr Susan Usha Mathew and Dr Binu Thomas', '5ZZTMFNTZ98PMJ6TF8', 0, 1, NULL);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order, sangeet_invited, reception_invited)
VALUES
  ('gst_47f210d1829493329e00bfae1355bed6', 'grp_2dbb9aef000cf4223dcc4ef5a34bf5a2', 'Dr Susan Usha Mathew', 1, 0, 0, NULL, 0, 0, 0),
  ('gst_65c485d6ab7d7511e66504c34603870f', 'grp_2dbb9aef000cf4223dcc4ef5a34bf5a2', 'Dr Binu Thomas', 0, 1, 0, NULL, 1, 0, 0);

-- 23: Dr Valsa and Dr Benoy
INSERT INTO guest_groups (id, household_name, access_code, plus_one_limit, most_likely_not_coming, notes)
VALUES ('grp_c0542ccb138bac041d454531a80bd20b', 'Dr Valsa and Dr Benoy', '2AJ8R4KKVQ3YPVQBEM', 0, 1, NULL);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order, sangeet_invited, reception_invited)
VALUES
  ('gst_4f53f05761125ba8ba2153ea4a59fbe9', 'grp_c0542ccb138bac041d454531a80bd20b', 'Dr Valsa', 1, 0, 0, NULL, 0, 0, 0),
  ('gst_f5f6fa9ddb932f48982dced35caff040', 'grp_c0542ccb138bac041d454531a80bd20b', 'Dr Benoy', 0, 1, 0, NULL, 1, 0, 0);

-- 24: Baby and Dr Mathew MM
INSERT INTO guest_groups (id, household_name, access_code, plus_one_limit, most_likely_not_coming, notes)
VALUES ('grp_9881332f2ef6ce5da7ee8007943b2cf3', 'Baby and Dr Mathew MM', 'GYP9KDW9URNGN4YASQ', 0, 1, NULL);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order, sangeet_invited, reception_invited)
VALUES
  ('gst_b71a51de53bcb2850141a49bc6a5d77b', 'grp_9881332f2ef6ce5da7ee8007943b2cf3', 'Baby', 1, 0, 0, NULL, 0, 0, 0),
  ('gst_46a4bc44a026f6a1f7c41ca7be891eae', 'grp_9881332f2ef6ce5da7ee8007943b2cf3', 'Dr Mathew MM', 0, 1, 0, NULL, 1, 0, 0);

-- 25: Anne Job (solo)
INSERT INTO guest_groups (id, household_name, access_code, plus_one_limit, most_likely_not_coming, notes)
VALUES ('grp_6e613bf893bea6ea4ec41b43887d7949', 'Anne Job', 'J5YRV4VXD6VDZWQMM8', 0, 1, NULL);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order, sangeet_invited, reception_invited)
VALUES ('gst_98d7668961a20a6ce13d8cf6736bbf25', 'grp_6e613bf893bea6ea4ec41b43887d7949', 'Anne Job', 1, 0, 0, NULL, 0, 0, 0);

-- 26: Anitha and George E George
INSERT INTO guest_groups (id, household_name, access_code, plus_one_limit, most_likely_not_coming, notes)
VALUES ('grp_7e662e3e5c2c24c9be6d2355836ac24f', 'Anitha and George E George', 'N9GFCSSXPEA9XKHR7X', 0, 1, NULL);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order, sangeet_invited, reception_invited)
VALUES
  ('gst_4a43fef042ace60ddb8a9951b26b2199', 'grp_7e662e3e5c2c24c9be6d2355836ac24f', 'Anitha', 1, 0, 0, NULL, 0, 0, 0),
  ('gst_9dd88c3b60a1decbfa90873855010344', 'grp_7e662e3e5c2c24c9be6d2355836ac24f', 'George E George', 0, 1, 0, NULL, 1, 0, 0);

-- 47: Ashwathi and Sreenivasan Ravindran (header missing entirely from the live database)
INSERT INTO guest_groups (id, household_name, access_code, plus_one_limit, most_likely_not_coming, notes)
VALUES ('grp_58ae8e361e32099db163eceee8e73439', 'Ashwathi and Sreenivasan Ravindran', 'PJE28ZM2VUQU3DQ6T7', 0, 1, NULL);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order, sangeet_invited, reception_invited)
VALUES
  ('gst_d3872fce14bca4735bb2c2c0a35fdec6', 'grp_58ae8e361e32099db163eceee8e73439', 'Ashwathi', 1, 0, 0, NULL, 0, 0, 0),
  ('gst_808bb2202cd438d8d897767bfbbabada', 'grp_58ae8e361e32099db163eceee8e73439', 'Sreenivasan Ravindran', 0, 1, 0, NULL, 1, 0, 0);

-- 44 header: rename old nickname "Cherian & Latha" to match dad's current list
UPDATE guest_groups SET household_name = 'Mary Latha and Cherian M Koshy' WHERE id = 'grp_5d16cb9e5d57cfdc2eac1f5cf351ec01';
UPDATE guests SET name = 'Cherian M Koshy' WHERE id = 'gst_bcb824636a9b6195e792f02dd8056f15';
UPDATE guests SET name = 'Mary Latha' WHERE id = 'gst_60da32ed3cd5c7c89cd99fb9f0036908';

-- 45 header: rename old nickname "Harry & Usha" to match dad's current list
UPDATE guest_groups SET household_name = 'Usha and Philip T Samuel' WHERE id = 'grp_9297595ed53bfd126ade78a71d37c8f2';
UPDATE guests SET name = 'Philip T Samuel' WHERE id = 'gst_51d773d518b8cbd6bf9df8d0c1ee175e';
-- 'Usha' guest row unchanged (matches dad's list literally)

-- 46 header: rename old nickname "Biju & Asha" to match dad's current list
UPDATE guest_groups SET household_name = 'Asha and Alex Biju Mathew' WHERE id = 'grp_2beedb49e83077094f5db957983b94e7';
UPDATE guests SET name = 'Alex Biju Mathew' WHERE id = 'gst_77f52099c80424dcaf76adda11e10903';
-- 'Asha' guest row unchanged (matches dad's list literally)
