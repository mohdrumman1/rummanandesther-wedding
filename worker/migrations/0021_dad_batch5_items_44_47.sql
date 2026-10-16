-- Batch 5 additions from Esther's dad's list, items 44-47 (children of Mary Latha/Cherian,
-- Usha/Philip, Asha/Alex Biju, Ashwathi/Sreenivasan lines).
-- Header lines (44-47 themselves) are not new invites -- those parents already exist as
-- their own households (see migration 0007: "Cherian & Latha", "Harry & Usha", "Biju & Asha",
-- "Sreeni & Aswathy"). Only the lettered a/b children are new invites here.
-- New groups flagged most_likely_not_coming = 1 per existing convention.

-- 44a: Babitha Annie Cherian and Varun
INSERT INTO guest_groups (id, household_name, access_code, plus_one_limit, most_likely_not_coming, notes)
VALUES ('grp_eabbb1c6064b2f391c248f956861024b', 'Babitha Annie Cherian and Varun', 'Z2V7ATKYB54XZREC7U', 0, 1, NULL);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES
  ('gst_706b96590b5a53c10f024de1d6e06217', 'grp_eabbb1c6064b2f391c248f956861024b', 'Babitha Annie Cherian', 1, 0, 0, NULL, 0),
  ('gst_b54a98b62ef2757f379e0980f34117e1', 'grp_eabbb1c6064b2f391c248f956861024b', 'Varun', 0, 1, 0, NULL, 1);

-- 44b: Bibith Cherian
INSERT INTO guest_groups (id, household_name, access_code, plus_one_limit, most_likely_not_coming, notes)
VALUES ('grp_f9d54894dab7a3fd49129b3b263dec3f', 'Bibith Cherian', 'UBRNYHAD648KURD2ZZ', 0, 1, NULL);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_af71742dcc13575517e300b2207aa59d', 'grp_f9d54894dab7a3fd49129b3b263dec3f', 'Bibith Cherian', 1, 0, 0, NULL, 0);

-- 45a: Daniel Philip
INSERT INTO guest_groups (id, household_name, access_code, plus_one_limit, most_likely_not_coming, notes)
VALUES ('grp_f712285f0e5893c4a8ca20a2ad26d144', 'Daniel Philip', 'X3AZYYMPKE88BCGPS9', 0, 1, NULL);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_8b23a3d35812670a9931337934c076a8', 'grp_f712285f0e5893c4a8ca20a2ad26d144', 'Daniel Philip', 1, 0, 0, NULL, 0);

-- 45b: Jiya and Dean Philip
INSERT INTO guest_groups (id, household_name, access_code, plus_one_limit, most_likely_not_coming, notes)
VALUES ('grp_affd66bb9b9186f4973881e9777cab17', 'Jiya and Dean Philip', 'FST8CGMMQA5EBEXCB7', 0, 1, NULL);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES
  ('gst_0ff04f2bc5301ac3f2db6dc5b56d2fa3', 'grp_affd66bb9b9186f4973881e9777cab17', 'Jiya', 1, 0, 0, NULL, 0),
  ('gst_66b2c82f8da761755660c8972d68d6c3', 'grp_affd66bb9b9186f4973881e9777cab17', 'Dean Philip', 0, 1, 0, NULL, 1);

-- 46a: Nidhi and Abith Alex
INSERT INTO guest_groups (id, household_name, access_code, plus_one_limit, most_likely_not_coming, notes)
VALUES ('grp_6dda523cf0ddbfe87aad0fcb0a40f429', 'Nidhi and Abith Alex', 'RGPF8LLMMBNRBXNG9R', 0, 1, NULL);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES
  ('gst_f0077691bfe927cc4c507dc6332aa96d', 'grp_6dda523cf0ddbfe87aad0fcb0a40f429', 'Nidhi', 1, 0, 0, NULL, 0),
  ('gst_e004248149f50395ffa9e3bf08660876', 'grp_6dda523cf0ddbfe87aad0fcb0a40f429', 'Abith Alex', 0, 1, 0, NULL, 1);

-- 47a: Ashwin Alex
INSERT INTO guest_groups (id, household_name, access_code, plus_one_limit, most_likely_not_coming, notes)
VALUES ('grp_0a8300d55394a8c142f34efd3f2db6ab', 'Ashwin Alex', 'S5EZRUR3QNM5LVYTEP', 0, 1, NULL);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_42ae481f8ebe0ddfc8f41e039671cba6', 'grp_0a8300d55394a8c142f34efd3f2db6ab', 'Ashwin Alex', 1, 0, 0, NULL, 0);
