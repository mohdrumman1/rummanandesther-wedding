-- Batch 2 fixes/additions from Esther's dad, cross-checked 2026-08-25
-- Covers: item 18 gap (missed in migration 0017), item 43 (Sheela and Jaideep Narayan),
-- items 27-33 (visa-urgent friends batch). Items 22-26 explicitly deferred by dad.
-- Items 34-42 held pending scope confirmation.

-- Item 18: Dr Suby Elizabeth Oommen and Dr Renju Titus Thomas (was "Renju & Subi")
UPDATE guest_groups SET household_name = 'Dr Suby Elizabeth Oommen and Dr Renju Titus Thomas', most_likely_not_coming = 1 WHERE id = 'grp_39a5994dd6796b268d80edfa6e335188';
UPDATE guests SET name = 'Dr Renju Titus Thomas' WHERE id = 'gst_e56259e8827c2cbf105ed514290ea0e0';
UPDATE guests SET name = 'Dr Suby Elizabeth Oommen' WHERE id = 'gst_ba468abc85985210b3c4e238bcc03e61';

-- Item 43: Sheela and Jaideep Narayan (was "Jaideep & Wife")
UPDATE guest_groups SET household_name = 'Sheela and Jaideep Narayan', most_likely_not_coming = 1 WHERE id = 'grp_a40cb2c5f9bef42a9007a2b2efe6b087';
UPDATE guests SET name = 'Jaideep Narayan' WHERE id = 'gst_93e37c5125fed9e83513d36c940eeda9';
-- 'Sheela' guest row unchanged (matches dad's list literally)

-- Item 27: Dr Leizel and Dr Rajan John -- already fixed in migration 0017, no action needed

-- Item 28: Dr Shafeela and Dr Saleem Lathif (was "Dr Saleem & Shaffeela")
UPDATE guest_groups SET household_name = 'Dr Shafeela and Dr Saleem Lathif', most_likely_not_coming = 1 WHERE id = 'grp_c2ae855392d9ba1656ca8b41fea99726';
UPDATE guests SET name = 'Dr Saleem Lathif' WHERE id = 'gst_ed1770e234f844efeca2c8cb6ae20ab9';
UPDATE guests SET name = 'Dr Shafeela' WHERE id = 'gst_16c64ba2404f64cec0c842dc41cb1fd2';

-- Item 29: Nifri and Dr Yusuf Kumble (was "Dr Yusuf & Nifri")
UPDATE guest_groups SET household_name = 'Nifri and Dr Yusuf Kumble', most_likely_not_coming = 1 WHERE id = 'grp_720df60253e16f26dc6388e1e93b252e';
UPDATE guests SET name = 'Dr Yusuf Kumble' WHERE id = 'gst_775634e6a33ce6eb6ecb712d9abd3ee4';
-- 'Nifri' guest row unchanged (matches dad's list literally)

-- Item 30: Mareena and Dr Hansaraj KC (was "Dr Hansan & Mareena")
UPDATE guest_groups SET household_name = 'Mareena and Dr Hansaraj KC', most_likely_not_coming = 1 WHERE id = 'grp_b443743e1bc13703a2b759b72f4d003f';
UPDATE guests SET name = 'Dr Hansaraj KC' WHERE id = 'gst_82d51ccd6cbec57a90df73254ebd46f0';
-- 'Mareena' guest row unchanged (matches dad's list literally)

-- Item 31: Lalita and Dr Narayanan V (was "Dr Narayanan & Lalee")
UPDATE guest_groups SET household_name = 'Lalita and Dr Narayanan V', most_likely_not_coming = 1 WHERE id = 'grp_c37defd22b87a794c60e23b717693871';
UPDATE guests SET name = 'Dr Narayanan V' WHERE id = 'gst_6fc96e9206fe7f86a9e84068bbde3eee';
UPDATE guests SET name = 'Lalita' WHERE id = 'gst_30f8ee1ea1efa1c360099e5d699fb6df';

-- Item 32: Dr Archana and Dr Rakesh PV (was "Dr Rakesh & Archana")
UPDATE guest_groups SET household_name = 'Dr Archana and Dr Rakesh PV', most_likely_not_coming = 1 WHERE id = 'grp_051fd700e7f114c5bacb131eb8bb17cb';
UPDATE guests SET name = 'Dr Rakesh PV' WHERE id = 'gst_7180a4a5a5a62015f9bdae2e76cf41d9';
UPDATE guests SET name = 'Dr Archana' WHERE id = 'gst_4248fc1ccdaf9070089448a1b70b3da3';

-- Item 33: Srividya and Dr Surendran K Nair (no existing match, new household)
INSERT INTO guest_groups (id, household_name, access_code, plus_one_limit, most_likely_not_coming, notes)
VALUES ('grp_078a04445b8ecec6f4a7c0c4cdcc493a', 'Srividya and Dr Surendran K Nair', '7WT1PJ2Z3IRCFSUHI2', 0, 1, NULL);
INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES
  ('gst_86fb4fc32558e08ed917d39e872c25bb', 'grp_078a04445b8ecec6f4a7c0c4cdcc493a', 'Srividya', 1, 0, 0, NULL, 0),
  ('gst_521f88d0291b7fa48cc14821ad6fc83d', 'grp_078a04445b8ecec6f4a7c0c4cdcc493a', 'Dr Surendran K Nair', 0, 1, 0, NULL, 1);
