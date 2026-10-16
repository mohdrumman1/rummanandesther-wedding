-- Batch 4 additions from Esther's dad's list, items 22-26 (father's brother's children)
-- Deferred from migration 0018 batch 2; each a/b/c line is its own invite.
-- New groups flagged most_likely_not_coming = 1 per existing convention.
-- Item 25 correction confirmed: Rony George pairs with Rebecca Mary Job (not Rachael Thankam Job).

-- 22a: Merin Peter and Thomas Binu
INSERT INTO guest_groups (id, household_name, access_code, plus_one_limit, most_likely_not_coming, notes)
VALUES ('grp_7599de199228b7d1506f2e3a9448e8c5', 'Merin Peter and Thomas Binu', 'VEB45GCTA42ZTUSF5L', 0, 1, NULL);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES
  ('gst_33c4e71eaf8a9b3acc88c2368f60f622', 'grp_7599de199228b7d1506f2e3a9448e8c5', 'Merin Peter', 1, 0, 0, NULL, 0),
  ('gst_6ef0c8878e1b9b6ecf420b877f2c11b3', 'grp_7599de199228b7d1506f2e3a9448e8c5', 'Thomas Binu', 0, 1, 0, NULL, 1);

-- 22b: Shilpa Binu Thomas and Tom Kurien
INSERT INTO guest_groups (id, household_name, access_code, plus_one_limit, most_likely_not_coming, notes)
VALUES ('grp_0e32ce2467f132162d1e45254e7da57e', 'Shilpa Binu Thomas and Tom Kurien', '3FTGKFRZ3VEDQFCP6Z', 0, 1, NULL);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES
  ('gst_fd16083b143623a23ff0602b774de394', 'grp_0e32ce2467f132162d1e45254e7da57e', 'Shilpa Binu Thomas', 1, 0, 0, NULL, 0),
  ('gst_7102b37e92da2ecd0539c869cd5f6fd5', 'grp_0e32ce2467f132162d1e45254e7da57e', 'Tom Kurien', 0, 1, 0, NULL, 1);

-- 22c: Soumya Binu Thomas and Lino Thomas
INSERT INTO guest_groups (id, household_name, access_code, plus_one_limit, most_likely_not_coming, notes)
VALUES ('grp_fcf1617309ecbde0000cc09d608217dd', 'Soumya Binu Thomas and Lino Thomas', '9X8QZ9F2JYEFG2GGBS', 0, 1, NULL);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES
  ('gst_1c470e95be2af3e2c954a02e6040ff20', 'grp_fcf1617309ecbde0000cc09d608217dd', 'Soumya Binu Thomas', 1, 0, 0, NULL, 0),
  ('gst_047d8bcfe40d3be4401c15389653de39', 'grp_fcf1617309ecbde0000cc09d608217dd', 'Lino Thomas', 0, 1, 0, NULL, 1);

-- 23a: Preethy Elizabeth and Githin Benoy George
INSERT INTO guest_groups (id, household_name, access_code, plus_one_limit, most_likely_not_coming, notes)
VALUES ('grp_8b06ff642ffbe37eae141a03be1c5429', 'Preethy Elizabeth and Githin Benoy George', 'LH5TBVSJTTDGVMZ9R9', 0, 1, NULL);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES
  ('gst_fba8bf345ff146fc102987a44a2a16e2', 'grp_8b06ff642ffbe37eae141a03be1c5429', 'Preethy Elizabeth', 1, 0, 0, NULL, 0),
  ('gst_0e6f35ef3d810ad9c100fe22cd9ebc99', 'grp_8b06ff642ffbe37eae141a03be1c5429', 'Githin Benoy George', 0, 1, 0, NULL, 1);

-- 23b: Sathijith B George
INSERT INTO guest_groups (id, household_name, access_code, plus_one_limit, most_likely_not_coming, notes)
VALUES ('grp_34b53a4b402399549c974e8f72f1f3f0', 'Sathijith B George', 'FNA6H5UR6C6HUQ8493', 0, 1, NULL);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_8b69d0f14256b6f2f0c7e6ee3a23a7c5', 'grp_34b53a4b402399549c974e8f72f1f3f0', 'Sathijith B George', 1, 0, 0, NULL, 0);

-- 24a: Christa Mathew
INSERT INTO guest_groups (id, household_name, access_code, plus_one_limit, most_likely_not_coming, notes)
VALUES ('grp_e39f4988533611f1a771ddf314eb2e72', 'Christa Mathew', 'ARP942K25BXHA6H75N', 0, 1, NULL);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_3291bf4c7eb65f727ad628a01f8e2e1c', 'grp_e39f4988533611f1a771ddf314eb2e72', 'Christa Mathew', 1, 0, 0, NULL, 0);

-- 24b: Jaimie Mathew
INSERT INTO guest_groups (id, household_name, access_code, plus_one_limit, most_likely_not_coming, notes)
VALUES ('grp_4d12c38ae684187b5018cc1d40e2a648', 'Jaimie Mathew', 'RGSSWEU9KV88JZC2N8', 0, 1, NULL);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_66fa7267cfa5d1e7cb653d8d60cac3cb', 'grp_4d12c38ae684187b5018cc1d40e2a648', 'Jaimie Mathew', 1, 0, 0, NULL, 0);

-- 25a: Rebecca Mary Job and Rony George
INSERT INTO guest_groups (id, household_name, access_code, plus_one_limit, most_likely_not_coming, notes)
VALUES ('grp_e93ca72212ee50730931b0ce40299eaa', 'Rebecca Mary Job and Rony George', 'PAE7MZT4GPHFF988XV', 0, 1, NULL);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES
  ('gst_7bd24639d9d1fafe78f2240fde763b77', 'grp_e93ca72212ee50730931b0ce40299eaa', 'Rebecca Mary Job', 1, 0, 0, NULL, 0),
  ('gst_e4480b77682e5e774efa4d45b8f287ed', 'grp_e93ca72212ee50730931b0ce40299eaa', 'Rony George', 0, 1, 0, NULL, 1);

-- 25b: Rachael Thankam Job
INSERT INTO guest_groups (id, household_name, access_code, plus_one_limit, most_likely_not_coming, notes)
VALUES ('grp_78152424fbf88e82551070ed42aad30f', 'Rachael Thankam Job', 'EUPTCP4SX4E28XTT2H', 0, 1, NULL);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_d9c2a99a483f9526ec7ee2bc51abe137', 'grp_78152424fbf88e82551070ed42aad30f', 'Rachael Thankam Job', 1, 0, 0, NULL, 0);

-- 26a: Dhanya Sarah George and Satish Yehoshua
INSERT INTO guest_groups (id, household_name, access_code, plus_one_limit, most_likely_not_coming, notes)
VALUES ('grp_f957aac2ad0660af55da6c414d72efe1', 'Dhanya Sarah George and Satish Yehoshua', '3J7TU98J7BDT6G5THC', 0, 1, NULL);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES
  ('gst_4ded1016d7c5550500ceacd34c6dcc31', 'grp_f957aac2ad0660af55da6c414d72efe1', 'Dhanya Sarah George', 1, 0, 0, NULL, 0),
  ('gst_365a501bd6baee3f9fa6cdefac9843b4', 'grp_f957aac2ad0660af55da6c414d72efe1', 'Satish Yehoshua', 0, 1, 0, NULL, 1);

-- 26b: Ashish George
INSERT INTO guest_groups (id, household_name, access_code, plus_one_limit, most_likely_not_coming, notes)
VALUES ('grp_34956c6e95acf35467e4e849206fa18a', 'Ashish George', 'AM8CB35BDFYFKTWWXE', 0, 1, NULL);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_bdb572cf48639810f463d09b6de96aa6', 'grp_34956c6e95acf35467e4e849206fa18a', 'Ashish George', 1, 0, 0, NULL, 0);
