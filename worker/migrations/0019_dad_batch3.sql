-- Batch 3 fixes/additions from Esther's dad, cross-checked 2026-08-29
-- Covers items 34-42 (friends list). Dad confirmed per-item identity via WhatsApp:
-- 34 Vinitha/Anil is NOT the existing "Vinitha & Vipin" (Suja's cousin, unrelated) -> new insert
-- 36 Prema/Mohan is NOT the existing "Prema Nambiar" (dad's neighbour, unrelated) -> new insert
-- 39 Anne/Alex IS the existing "Dr Alex & Minnie" -> merge, use dad's names
-- 41 Annina/Roy IS the existing "Dr Roy & Aneena" -> merge, use dad's names
-- 42 Jenny/Jojy/Kochamma IS the existing "Dr Joji, Jenny & Kochemma" -> merge, use dad's spellings

-- Item 35: Sini Sara and Dr Mohammed Shaffi (was "Dr Shaffi & Sini")
UPDATE guest_groups SET household_name = 'Sini Sara and Dr Mohammed Shaffi', most_likely_not_coming = 1 WHERE id = 'grp_7aa26409d887e5be898531c1657a2c8a';
UPDATE guests SET name = 'Dr Mohammed Shaffi' WHERE id = 'gst_c42ffef2f1cba58ba05e158778ee514f';
UPDATE guests SET name = 'Sini Sara' WHERE id = 'gst_30b0723f63bd3b3276357c1fd1d069ae';

-- Item 38: Anju and Dr Joy Antony (was "Dr Joy & Anju")
UPDATE guest_groups SET household_name = 'Anju and Dr Joy Antony', most_likely_not_coming = 1 WHERE id = 'grp_03fee5ebc49ece1a1d64e8e2d54191df';
UPDATE guests SET name = 'Dr Joy Antony' WHERE id = 'gst_6cb7afc3e635fb95a5bef2c13745ccfc';
-- 'Anju' guest row unchanged (matches dad's list literally)

-- Item 39: Anne and Dr Alex Thomas (was "Dr Alex & Minnie" -- dad confirmed same couple)
UPDATE guest_groups SET household_name = 'Anne and Dr Alex Thomas', most_likely_not_coming = 1 WHERE id = 'grp_c9dbcd936dd8a12052410ad1a4bf18ce';
UPDATE guests SET name = 'Dr Alex Thomas' WHERE id = 'gst_34b51efca98029f5eab63b27b6192733';
UPDATE guests SET name = 'Anne' WHERE id = 'gst_609f2add2b641dc73831b08ba94d5fde';

-- Item 40: Dr Sharon and Dr Thomas Mathai (was "Dr Thomas Mathai & Sharon")
UPDATE guest_groups SET household_name = 'Dr Sharon and Dr Thomas Mathai', most_likely_not_coming = 1 WHERE id = 'grp_24604bb61debb0b0c8cd926afa2c2f9a';
-- 'Dr Thomas Mathai' guest row unchanged (matches dad's list literally)
UPDATE guests SET name = 'Dr Sharon' WHERE id = 'gst_844016049c4ee64ebbd94632f635b73e';

-- Item 41: Annina and Dr Roy Thomas (was "Dr Roy & Aneena" -- dad confirmed same couple)
UPDATE guest_groups SET household_name = 'Annina and Dr Roy Thomas', most_likely_not_coming = 1 WHERE id = 'grp_46bd4dcecf50c6b0ee7c21c6ac1bbb38';
UPDATE guests SET name = 'Dr Roy Thomas' WHERE id = 'gst_bb1032176519744db37a3563d0f5a641';
UPDATE guests SET name = 'Annina' WHERE id = 'gst_639293bb10a738e02ce92253dbd70229';

-- Item 42: Jenny and Jojy Thomas, with Kochamma (was "Dr Joji, Jenny & Kochemma" -- dad confirmed same people, use his spellings)
UPDATE guest_groups SET household_name = 'Jenny and Jojy Thomas', most_likely_not_coming = 1 WHERE id = 'grp_dd5ea867bb96a3a751c7b67bdae8d992';
UPDATE guests SET name = 'Jojy Thomas' WHERE id = 'gst_7a6e411bc404a04a6ed9869643c330fb';
-- 'Jenny' guest row unchanged (matches dad's spelling literally)
UPDATE guests SET name = 'Kochamma' WHERE id = 'gst_a35fc7c8392ffb3278d9af7ed4fd9e72';

-- Item 34: Vinitha and Dr Anil Nambisan Paramadathil (new household, distinct from existing "Vinitha & Vipin")
INSERT INTO guest_groups (id, household_name, access_code, plus_one_limit, most_likely_not_coming, notes)
VALUES ('grp_e20edfa4022bc43a7f142c7f68d92322', 'Vinitha and Dr Anil Nambisan Paramadathil', '21VWDMHZ48SLC0N6SF', 0, 1, NULL);
INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES
  ('gst_2f80d16be89d1f3cf6a1ca5ccd540bec', 'grp_e20edfa4022bc43a7f142c7f68d92322', 'Vinitha', 1, 0, 0, NULL, 0),
  ('gst_83839bee8a96f82cf42dced3375d8b7d', 'grp_e20edfa4022bc43a7f142c7f68d92322', 'Dr Anil Nambisan Paramadathil', 0, 1, 0, NULL, 1);

-- Item 36: Prema and Dr Mohan Vattekkad (new household, distinct from existing "Prema Nambiar")
INSERT INTO guest_groups (id, household_name, access_code, plus_one_limit, most_likely_not_coming, notes)
VALUES ('grp_df49e6deccf4c6cbde72881265b8f55f', 'Prema and Dr Mohan Vattekkad', 'ZZN6U4R9GJCA8CFIUC', 0, 1, NULL);
INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES
  ('gst_226b27ef0155a5f76c4427e8db41bc16', 'grp_df49e6deccf4c6cbde72881265b8f55f', 'Prema', 1, 0, 0, NULL, 0),
  ('gst_661e09e827a5b8d7feddcdbe725881f4', 'grp_df49e6deccf4c6cbde72881265b8f55f', 'Dr Mohan Vattekkad', 0, 1, 0, NULL, 1);

-- Item 37: Ravinder and Dr Premjeet Dogra (no existing match, new household)
INSERT INTO guest_groups (id, household_name, access_code, plus_one_limit, most_likely_not_coming, notes)
VALUES ('grp_17181aca4122e930c9528c55b4ef99bd', 'Ravinder and Dr Premjeet Dogra', '5UMM6264ZUVRWI033C', 0, 1, NULL);
INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES
  ('gst_5dd25a4162fdf825522ebfbac6bd037d', 'grp_17181aca4122e930c9528c55b4ef99bd', 'Ravinder', 1, 0, 0, NULL, 0),
  ('gst_6b833579c90ad7a254c7a8800ae36daa', 'grp_17181aca4122e930c9528c55b4ef99bd', 'Dr Premjeet Dogra', 0, 1, 0, NULL, 1);

-- Item 42a: Susan Abraham -- HELD, pending dad's confirmation it isn't another existing "Susan..." household
