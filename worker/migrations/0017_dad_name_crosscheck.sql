-- Fixes to existing households/guests, cross-checked against Esther's dad's list

-- 1. Shyla and Alexander Cherian
UPDATE guest_groups SET household_name = 'Shyla and Alexander Cherian' WHERE id = 'grp_728ad9d4adfa2827a5f3a913b05e2111';
UPDATE guests SET name = 'Alexander Cherian' WHERE id = 'gst_cbf9925d5fb54192c7f090701c862558';

-- 2. Sujai Benjamin (was Sujay Benjamin)
UPDATE guest_groups SET household_name = 'Sujai Benjamin' WHERE id = 'grp_399820861d60a322f206bc004ff71ccf';
UPDATE guests SET name = 'Sujai Benjamin' WHERE id = 'gst_10bc3b3d987e8031e95e5c163689be8c';

-- 3. Jaina and Manoj Koshy (was Manoj & Family)
UPDATE guest_groups SET household_name = 'Jaina and Manoj Koshy' WHERE id = 'grp_0d3fc718465be18c87378648e3fb5141';
UPDATE guests SET name = 'Manoj Koshy' WHERE id = 'gst_5b87f02011416e61825bcb11673e0906';

-- 4. Jeena and Thomas Koshy (was Koshy: Jeena, Saji)
UPDATE guest_groups SET household_name = 'Jeena and Thomas Koshy' WHERE id = 'grp_a2c341d31c78c0729fd5e54341840fd9';
UPDATE guests SET name = 'Thomas Koshy' WHERE id = 'gst_96aebcbaa14459f8e43aa80ec54d5800';

-- 5. Cooky Varghese / Susan and Bino K Jacob Varghese / Rony Varghese Jacob (was Binochayan & Family, kept bundled)
UPDATE guest_groups SET household_name = 'Cooky Varghese; Susan and Bino K Jacob Varghese', most_likely_not_coming = 1 WHERE id = 'grp_7ef1bd6c0941ce7b982ea35818b4b092';
UPDATE guests SET name = 'Bino K Jacob Varghese' WHERE id = 'gst_9b3b64eb44fd7049f89420c8086c6c52';
UPDATE guests SET name = 'Cooky Varghese' WHERE id = 'gst_c401f28ecb0a26e685b8b7697d9435c6';
UPDATE guests SET name = 'Rony Varghese Jacob' WHERE id = 'gst_1e5048f3d7618b4955585196a2cbe895';
-- 'Susan' guest row unchanged (matches dad's list literally)

-- 6. Dr Leizel and Dr Rajan John (was Dr Rajan & Leizel)
UPDATE guest_groups SET household_name = 'Dr Leizel and Dr Rajan John', most_likely_not_coming = 1 WHERE id = 'grp_7a82431187df373a4cc62ac88e01d80c';
UPDATE guests SET name = 'Dr Rajan John' WHERE id = 'gst_9b9f889ebccbef550e001c5294ff4637';
UPDATE guests SET name = 'Dr Leizel' WHERE id = 'gst_3b00131e97497272436ba82171d22c07';

-- 7. Asha and George Thomas (was George Thomas: George, Asha)
UPDATE guest_groups SET household_name = 'Asha and George Thomas' WHERE id = 'grp_80cad5e2bb2e5a6f56e21424ca708b9a';
UPDATE guests SET name = 'George Thomas' WHERE id = 'gst_2811de33125690867a66cd977f66d536';
-- 'Asha' guest row unchanged (matches dad's list literally)

-- 8. Saira and Samuel Jacob Kuruvilla (was Kuruvilla: Saira, Sam) + add kids Rachel Elizabeth Samuel, Michael Jacob Samuel
UPDATE guest_groups SET household_name = 'Saira and Samuel Jacob Kuruvilla' WHERE id = 'grp_3cb7919dd6993bb3cebe52071220db34';
UPDATE guests SET name = 'Samuel Jacob Kuruvilla' WHERE id = 'gst_4c6e654d5e31d96d8c014b333cefeec0';
-- 'Saira' guest row unchanged (matches dad's list literally)
INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES
  ('gst_0eab4c2b62a4d3b314f39b5120a407e5', 'grp_3cb7919dd6993bb3cebe52071220db34', 'Rachel Elizabeth Samuel', 0, 0, 1, 'gst_9968cf785455e47c4a18c543109d1d17', 2),
  ('gst_98184ab8bc52310b724fc87e0d7c7212', 'grp_3cb7919dd6993bb3cebe52071220db34', 'Michael Jacob Samuel', 0, 0, 1, 'gst_9968cf785455e47c4a18c543109d1d17', 3);

-- 9. Somi Varghese & Meera Varghese (was Somi & Family: Somi, Meera)
UPDATE guest_groups SET household_name = 'Somi Varghese & Meera Varghese' WHERE id = 'grp_b4144d9519061ae4a0acc71530589cec';
UPDATE guests SET name = 'Somi Varghese' WHERE id = 'gst_9af052b821b6a58ee31779bed7d709f2';
UPDATE guests SET name = 'Meera Varghese' WHERE id = 'gst_5d5a33985fc4de732a45af20eaddc92f';

-- 10. Susan and Shaji M John Thomas (was Shaji M John Thomas: Shaji Chayan, Susanmama)
UPDATE guest_groups SET household_name = 'Susan and Shaji M John Thomas' WHERE id = 'grp_3e4e0e78f32c7e48244de8352086762a';
UPDATE guests SET name = 'Shaji M John Thomas' WHERE id = 'gst_c49e8b1c7488d915e1b8cbded40b4911';
UPDATE guests SET name = 'Susan' WHERE id = 'gst_420020fa6a9b5b5bbb1acf59a9ddcb19';

-- 11. Asha and Sujit K Jacob (was Sujit & Family: Sujit, Asha)
UPDATE guest_groups SET household_name = 'Asha and Sujit K Jacob' WHERE id = 'grp_e28c51816ca5b1fbbcd4c434258af732';
UPDATE guests SET name = 'Sujit K Jacob' WHERE id = 'gst_9aa1fb5539d747f42e59cea90a677785';
-- 'Asha' guest row unchanged (matches dad's list literally)

-- 12. Mini Vijay (was Mini Vijay: Mini)
UPDATE guests SET name = 'Mini Vijay' WHERE id = 'gst_16735a1d3a54fb3f0cab69c83a193d48';
-- New households/guests from Esther's dad's list, cross-checked 2026-08-21
-- All new groups flagged most_likely_not_coming = 1 per instruction

INSERT INTO guest_groups (id, household_name, access_code, plus_one_limit, most_likely_not_coming, notes)
VALUES ('grp_09acefe720e3c72dba52d3e89ef85d3d', 'Sheela and George Philip', '1XCT8Z2AT5B2G2BPIP', 0, 1, NULL);

INSERT INTO guest_groups (id, household_name, access_code, plus_one_limit, most_likely_not_coming, notes)
VALUES ('grp_b807a24949a938f45ed0ca49bda59971', 'Sruthi and Pradyut', 'YWGU9J9B24XFU05WUY', 0, 1, NULL);

INSERT INTO guest_groups (id, household_name, access_code, plus_one_limit, most_likely_not_coming, notes)
VALUES ('grp_48627bc52a2ace7eab6c567d38570c23', 'Shilpa and Priju', '2H0X87DFZOPYTOHL1E', 0, 1, NULL);

INSERT INTO guest_groups (id, household_name, access_code, plus_one_limit, most_likely_not_coming, notes)
VALUES ('grp_140751b788f13590c626332f58b2ca9a', 'Sheena and Steeve Thomas John', 'ZKBINTDDBF8HIPN2OA', 0, 1, NULL);

INSERT INTO guest_groups (id, household_name, access_code, plus_one_limit, most_likely_not_coming, notes)
VALUES ('grp_973f99eeb8c1090edb63eb403ad488ea', 'Richy Mariya Baby and Stan Thomas John', 'KXHUS7Z86J9LKJEDQD', 0, 1, NULL);

INSERT INTO guest_groups (id, household_name, access_code, plus_one_limit, most_likely_not_coming, notes)
VALUES ('grp_063822e2db846c0eeaaf7a5d5a32727d', 'Chetna and Prashant', 'YVU7E6JGQTT4UHPLWO', 0, 1, NULL);

INSERT INTO guest_groups (id, household_name, access_code, plus_one_limit, most_likely_not_coming, notes)
VALUES ('grp_6e632e92e43f1625e33de6d4005167b3', 'Bhavana and Jim', 'V6NGUKQBC2EFKY8JVJ', 0, 1, NULL);

INSERT INTO guest_groups (id, household_name, access_code, plus_one_limit, most_likely_not_coming, notes)
VALUES ('grp_95c619b29792e736a6e498528692d050', 'Beena and Ajay Kurian', '68ZY8G9P0NMYPAK3FX', 0, 1, NULL);

INSERT INTO guest_groups (id, household_name, access_code, plus_one_limit, most_likely_not_coming, notes)
VALUES ('grp_16e8528a7f1b4f0ef1e8376558f35278', 'Kenny Kurian', 'Q3HFITCTZNRHD90KJ0', 0, 1, NULL);

INSERT INTO guest_groups (id, household_name, access_code, plus_one_limit, most_likely_not_coming, notes)
VALUES ('grp_34cbef6e0368b1e474ee319bdf069b5c', 'Ruben Kurian', 'GNMM51O3WHTDNZ1I88', 0, 1, NULL);

INSERT INTO guest_groups (id, household_name, access_code, plus_one_limit, most_likely_not_coming, notes)
VALUES ('grp_0f29fc674d1838399aa6eaf9c8caf2c7', 'Cheryl Vijay and Manu Mathew', 'EI5MI05MO1E7SAE2F1', 0, 1, NULL);

INSERT INTO guest_groups (id, household_name, access_code, plus_one_limit, most_likely_not_coming, notes)
VALUES ('grp_443109de16c23722991d5130481a1e03', 'Nikki Vijay and Sebin Sunny', 'CYKHEDWY70Y5I9RRRZ', 0, 1, NULL);

INSERT INTO guest_groups (id, household_name, access_code, plus_one_limit, most_likely_not_coming, notes)
VALUES ('grp_229ac51e5bf3a6ffd0bfd1719c456f3b', 'Rose Stella and Kevin Benjamin', 'H2Y1J8EG7AN2WD3IGQ', 0, 1, NULL);

INSERT INTO guest_groups (id, household_name, access_code, plus_one_limit, most_likely_not_coming, notes)
VALUES ('grp_3d1e0eac0b8aa3407d4871b9f6954b76', 'Ruth Benjamin', 'ZKG6C95F4LDVJFSIQE', 0, 1, NULL);

INSERT INTO guest_groups (id, household_name, access_code, plus_one_limit, most_likely_not_coming, notes)
VALUES ('grp_82cb196c5f58e71bd1fc0e994306145b', 'Winnie Manoj', '2EA20KZLHUDTH5L8YQ', 0, 1, NULL);

INSERT INTO guest_groups (id, household_name, access_code, plus_one_limit, most_likely_not_coming, notes)
VALUES ('grp_9461d4d69e13c00b09b31679dde3ce14', 'Reba Thomas and Akash Anil', 'GMYFZD78UISRX7EOPG', 0, 1, NULL);

INSERT INTO guest_groups (id, household_name, access_code, plus_one_limit, most_likely_not_coming, notes)
VALUES ('grp_1356680e5a2810b272ac818fbc0c4b25', 'Rhea Thomas', 'SLZAY4K6GARYQFVLLW', 0, 1, NULL);

INSERT INTO guest_groups (id, household_name, access_code, plus_one_limit, most_likely_not_coming, notes)
VALUES ('grp_f7ba4e7b992bc97112743a6e3cbaa6e2', 'Beena and Biju Ivan Punnen', 'ZNEI213CGI5TTGOLKC', 0, 1, NULL);

INSERT INTO guest_groups (id, household_name, access_code, plus_one_limit, most_likely_not_coming, notes)
VALUES ('grp_0c1b461183eb2436b4dc5b98a8fee60e', 'Miria Punnen', '688CQMNSF1FD5ZIGER', 0, 1, NULL);

INSERT INTO guest_groups (id, household_name, access_code, plus_one_limit, most_likely_not_coming, notes)
VALUES ('grp_f26e036f2c4b9dcde61777361ab29dc8', 'Ivan Punnen', '932QZB8Z2UZDKXNYDZ', 0, 1, NULL);

INSERT INTO guest_groups (id, household_name, access_code, plus_one_limit, most_likely_not_coming, notes)
VALUES ('grp_de55846f59285c560898dc664ea8b059', 'Susan Punnen', '2BKSV8K8OXPU211WOB', 0, 1, NULL);

INSERT INTO guest_groups (id, household_name, access_code, plus_one_limit, most_likely_not_coming, notes)
VALUES ('grp_907a9d2739a1ff6e93449b7ef0dfcdd0', 'Renu Mary and Biju P Samuel', '8YV68VQMZOHK6DF8FO', 0, 1, NULL);

INSERT INTO guest_groups (id, household_name, access_code, plus_one_limit, most_likely_not_coming, notes)
VALUES ('grp_a1cd12ab60dda2df82bcf9e9b832939c', 'Hannah Susan Samuel', 'J2FZ72X8FRPVOL11JS', 0, 1, NULL);

INSERT INTO guest_groups (id, household_name, access_code, plus_one_limit, most_likely_not_coming, notes)
VALUES ('grp_c830675c7e634b3af1a145a6f8879723', 'Sarah Mary Samuel', '6J3FVSTIFY507E1WUI', 0, 1, NULL);

INSERT INTO guest_groups (id, household_name, access_code, plus_one_limit, most_likely_not_coming, notes)
VALUES ('grp_0708dcd43374d7fe80193c7f85e22ea3', 'Arushi Agarwal and Nikhil Abraham Jacob', 'RMQXB2419N0BX4Q9XZ', 0, 1, NULL);

INSERT INTO guest_groups (id, household_name, access_code, plus_one_limit, most_likely_not_coming, notes)
VALUES ('grp_e6eb0ee606a5d5a6ad065e0de491ed09', 'Nitin Cherian Jacob', 'JT0YBLSYWH1DJI0XW2', 0, 1, NULL);

INSERT INTO guest_groups (id, household_name, access_code, plus_one_limit, most_likely_not_coming, notes)
VALUES ('grp_19aad0efcc98ddc62d2951790f8ec938', 'Sunitha and Varghese TK', '7J6OI8P1APUKVSKYJU', 0, 1, NULL);

INSERT INTO guest_groups (id, household_name, access_code, plus_one_limit, most_likely_not_coming, notes)
VALUES ('grp_1096e46ebbee340e11158b4afaab0dec', 'Simran Varghese', '9RJQ959IHTWMYQWEP5', 0, 1, NULL);

INSERT INTO guest_groups (id, household_name, access_code, plus_one_limit, most_likely_not_coming, notes)
VALUES ('grp_6fcc10dd80cd31c5eb02f932a3d2da1f', 'Yohan Varghese', 'KOCR7BRB3VDXPKYDMF', 0, 1, NULL);

INSERT INTO guest_groups (id, household_name, access_code, plus_one_limit, most_likely_not_coming, notes)
VALUES ('grp_f60f018036ad929d75164cb6d504e79b', 'Maemy and Dr PG Thomas', '30OONJQHCWN43M49AA', 0, 1, NULL);

INSERT INTO guest_groups (id, household_name, access_code, plus_one_limit, most_likely_not_coming, notes)
VALUES ('grp_362cd95030adfe102c861c66c2dee790', 'Manisha Mammen and Thomas P George', 'MDBBUE35WZL11EAJ2G', 0, 1, NULL);

INSERT INTO guest_groups (id, household_name, access_code, plus_one_limit, most_likely_not_coming, notes)
VALUES ('grp_3cf9146b2c7d7ba6cfb9ddc10779f805', 'Reni Annie and Biju Varghese', 'RPEEWAB0YHQVTFELOL', 0, 1, NULL);

INSERT INTO guest_groups (id, household_name, access_code, plus_one_limit, most_likely_not_coming, notes)
VALUES ('grp_330b6ad33b6882fe6204d6c5209c4cbc', 'Alan Easo Varghese', 'V5IXJL6SFYKM0P4812', 0, 1, NULL);

INSERT INTO guest_groups (id, household_name, access_code, plus_one_limit, most_likely_not_coming, notes)
VALUES ('grp_4ff43a1c127c30289c6ac96b4d17fa07', 'Helen Sarah Varghese', 'UKKUIHBJHLJJBWCF5C', 0, 1, NULL);

INSERT INTO guest_groups (id, household_name, access_code, plus_one_limit, most_likely_not_coming, notes)
VALUES ('grp_60cf23f37aa51cef4ff680ffe36cc24c', 'Joshua Thomas Titus', 'YKQVJC9J1VBBLE1TED', 0, 1, NULL);

INSERT INTO guest_groups (id, household_name, access_code, plus_one_limit, most_likely_not_coming, notes)
VALUES ('grp_16dc0d04893e2e31d8c389066210ab4e', 'Johan Oommen Titus', 'VCL2CE6JN3B4X60JPG', 0, 1, NULL);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_2fcad4a5272b76a17e7e5cea16b4cec6', 'grp_09acefe720e3c72dba52d3e89ef85d3d', 'Sheela', 1, 0, 0, NULL, 0);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_d3b98c47bb09eab281a1412fb69cc8fd', 'grp_09acefe720e3c72dba52d3e89ef85d3d', 'George Philip', 0, 1, 0, NULL, 1);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_3b63b047e83b7a7c6b4c854d72cf17cd', 'grp_b807a24949a938f45ed0ca49bda59971', 'Sruthi', 1, 0, 0, NULL, 0);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_d1b7adaceebded6982ec79be56ccebaf', 'grp_b807a24949a938f45ed0ca49bda59971', 'Pradyut', 0, 1, 0, NULL, 1);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_5754578d657c8f7124605335963ca706', 'grp_b807a24949a938f45ed0ca49bda59971', 'Rhea', 0, 0, 1, 'gst_3b63b047e83b7a7c6b4c854d72cf17cd', 2);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_f8140085649eec06c1324e07bbe8aa5c', 'grp_48627bc52a2ace7eab6c567d38570c23', 'Shilpa', 1, 0, 0, NULL, 0);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_05e081115e10ba2d4fc2d67deb50041c', 'grp_48627bc52a2ace7eab6c567d38570c23', 'Priju', 0, 1, 0, NULL, 1);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_6980fb76c3276f4fb49d8446b85c3123', 'grp_48627bc52a2ace7eab6c567d38570c23', 'Viaan', 0, 0, 1, 'gst_f8140085649eec06c1324e07bbe8aa5c', 2);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_14e54f7d76ed4e6170a4addce3b01985', 'grp_48627bc52a2ace7eab6c567d38570c23', 'Ivana', 0, 0, 1, 'gst_f8140085649eec06c1324e07bbe8aa5c', 3);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_cb31da141539563c1f3341df3f091e46', 'grp_140751b788f13590c626332f58b2ca9a', 'Sheena', 1, 0, 0, NULL, 0);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_f50772fc2e9fc9be01a41b8233bedc51', 'grp_140751b788f13590c626332f58b2ca9a', 'Steeve Thomas John', 0, 1, 0, NULL, 1);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_0e480790804bf3d218cfcf28581aa4b2', 'grp_140751b788f13590c626332f58b2ca9a', 'Jared', 0, 0, 1, 'gst_cb31da141539563c1f3341df3f091e46', 2);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_82e4043c378ae7dda217b520f1263eb0', 'grp_973f99eeb8c1090edb63eb403ad488ea', 'Richy Mariya Baby', 1, 0, 0, NULL, 0);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_fb86669bb7edb995532241c082e5dd24', 'grp_973f99eeb8c1090edb63eb403ad488ea', 'Stan Thomas John', 0, 1, 0, NULL, 1);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_413b08d84ccc274ae4c4f42c36ea455d', 'grp_973f99eeb8c1090edb63eb403ad488ea', 'Yaakov', 0, 0, 1, 'gst_82e4043c378ae7dda217b520f1263eb0', 2);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_efde1c8e7c9589ff8bd574208190ac2e', 'grp_063822e2db846c0eeaaf7a5d5a32727d', 'Chetna', 1, 0, 0, NULL, 0);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_55a689b1517cb9d60ae1b1dc479e92e2', 'grp_063822e2db846c0eeaaf7a5d5a32727d', 'Prashant', 0, 1, 0, NULL, 1);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_05ff6972c61949651721de2df2982c59', 'grp_063822e2db846c0eeaaf7a5d5a32727d', 'Jaden', 0, 0, 1, 'gst_efde1c8e7c9589ff8bd574208190ac2e', 2);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_be4eaa155bde65fa60e1fff2dedbf4d3', 'grp_063822e2db846c0eeaaf7a5d5a32727d', 'Joe', 0, 0, 1, 'gst_efde1c8e7c9589ff8bd574208190ac2e', 3);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_0128ced8651f11baae72933c5158ae3f', 'grp_063822e2db846c0eeaaf7a5d5a32727d', 'Keziah', 0, 0, 1, 'gst_efde1c8e7c9589ff8bd574208190ac2e', 4);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_3bb7be17a3ea816c1029f1854e66f3c0', 'grp_063822e2db846c0eeaaf7a5d5a32727d', 'Jason', 0, 0, 1, 'gst_efde1c8e7c9589ff8bd574208190ac2e', 5);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_4d08e2a2ff4aaacf29b8fe0bd7de89c1', 'grp_6e632e92e43f1625e33de6d4005167b3', 'Bhavana', 1, 0, 0, NULL, 0);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_4d7bdcb10327bc120f08c6a807102419', 'grp_6e632e92e43f1625e33de6d4005167b3', 'Jim', 0, 1, 0, NULL, 1);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_1b2ee383e90477c2b8156d028d27b975', 'grp_6e632e92e43f1625e33de6d4005167b3', 'Sofia', 0, 0, 1, 'gst_4d08e2a2ff4aaacf29b8fe0bd7de89c1', 2);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_4cff0ebcbd43022565fddf845b8240c6', 'grp_6e632e92e43f1625e33de6d4005167b3', 'Jonathan', 0, 0, 1, 'gst_4d08e2a2ff4aaacf29b8fe0bd7de89c1', 3);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_10ec38963c8dc8c1d43cab9c8f8c4e44', 'grp_95c619b29792e736a6e498528692d050', 'Beena', 1, 0, 0, NULL, 0);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_2a5c04251e291f2a9a504747dcbbb48a', 'grp_95c619b29792e736a6e498528692d050', 'Ajay Kurian', 0, 1, 0, NULL, 1);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_1ea6eb899791ac2bf332219b41f460d1', 'grp_16e8528a7f1b4f0ef1e8376558f35278', 'Kenny Kurian', 1, 0, 0, NULL, 0);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_d62b23b2232df402b059a9bef7fb70e8', 'grp_34cbef6e0368b1e474ee319bdf069b5c', 'Ruben Kurian', 1, 0, 0, NULL, 0);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_37df337f015d00f78b24945fae226951', 'grp_0f29fc674d1838399aa6eaf9c8caf2c7', 'Cheryl Vijay', 1, 0, 0, NULL, 0);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_085c54b57a1c150aa2d517c41def3a86', 'grp_0f29fc674d1838399aa6eaf9c8caf2c7', 'Manu Mathew', 0, 1, 0, NULL, 1);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_da46ff28cc098ec68b6c693494a95863', 'grp_0f29fc674d1838399aa6eaf9c8caf2c7', 'Ivan Manu', 0, 0, 1, 'gst_37df337f015d00f78b24945fae226951', 2);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_f950f1bb40522eb82a0a7e118c06bc55', 'grp_443109de16c23722991d5130481a1e03', 'Nikki Vijay', 1, 0, 0, NULL, 0);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_1e0a9d665c0579322896a0d5aebb330c', 'grp_443109de16c23722991d5130481a1e03', 'Sebin Sunny', 0, 1, 0, NULL, 1);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_766c13c88a7bc57991c9675fbd845cef', 'grp_229ac51e5bf3a6ffd0bfd1719c456f3b', 'Rose Stella', 1, 0, 0, NULL, 0);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_1c32c64a2d00dfb4e322138b07e7384b', 'grp_229ac51e5bf3a6ffd0bfd1719c456f3b', 'Kevin Benjamin', 0, 1, 0, NULL, 1);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_52ed11cafb0393a01de37544f75c569e', 'grp_229ac51e5bf3a6ffd0bfd1719c456f3b', 'Ricky', 0, 0, 1, 'gst_766c13c88a7bc57991c9675fbd845cef', 2);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_e63fbcad8650dcca8c7f2b38eb13f17c', 'grp_3d1e0eac0b8aa3407d4871b9f6954b76', 'Ruth Benjamin', 1, 0, 0, NULL, 0);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_7d48b676a571378eab39ce3105ba2316', 'grp_82cb196c5f58e71bd1fc0e994306145b', 'Winnie Manoj', 1, 0, 0, NULL, 0);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_7b76ac4d0870e53ab436bf8b5d1cae1e', 'grp_82cb196c5f58e71bd1fc0e994306145b', 'Zach', 0, 0, 1, 'gst_7d48b676a571378eab39ce3105ba2316', 1);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_7346dd7facc16f327628be8d4e67ce93', 'grp_9461d4d69e13c00b09b31679dde3ce14', 'Reba Thomas', 1, 0, 0, NULL, 0);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_8ae0841c8a8637063b7aeac862bf2071', 'grp_9461d4d69e13c00b09b31679dde3ce14', 'Akash Anil', 0, 1, 0, NULL, 1);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_d357a2b4c2c1a62f0521355ba7874c1c', 'grp_9461d4d69e13c00b09b31679dde3ce14', 'Axel', 0, 0, 1, 'gst_7346dd7facc16f327628be8d4e67ce93', 2);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_0ebad7f6480c378f71d2b95a27733f51', 'grp_1356680e5a2810b272ac818fbc0c4b25', 'Rhea Thomas', 1, 0, 0, NULL, 0);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_bb529a0b377fcb164b757285306ed855', 'grp_f7ba4e7b992bc97112743a6e3cbaa6e2', 'Beena', 1, 0, 0, NULL, 0);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_3642fd67efbe30a17b2bf794e4947389', 'grp_f7ba4e7b992bc97112743a6e3cbaa6e2', 'Biju Ivan Punnen', 0, 1, 0, NULL, 1);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_356fc0b86b0e078c685b0476a5c497de', 'grp_0c1b461183eb2436b4dc5b98a8fee60e', 'Miria Punnen', 1, 0, 0, NULL, 0);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_dc4df5a0c982eb7e789ca1a1c4641cbb', 'grp_f26e036f2c4b9dcde61777361ab29dc8', 'Ivan Punnen', 1, 0, 0, NULL, 0);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_6d9693372dceddc5940ecf2d085955a0', 'grp_de55846f59285c560898dc664ea8b059', 'Susan Punnen', 1, 0, 0, NULL, 0);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_08c0525612d0e451ab957c7334e81dea', 'grp_907a9d2739a1ff6e93449b7ef0dfcdd0', 'Renu Mary', 1, 0, 0, NULL, 0);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_27125235928852c90602e8e568ceb3e7', 'grp_907a9d2739a1ff6e93449b7ef0dfcdd0', 'Biju P Samuel', 0, 1, 0, NULL, 1);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_6c3e310ff4c0db7ae079c5e6af76641b', 'grp_a1cd12ab60dda2df82bcf9e9b832939c', 'Hannah Susan Samuel', 1, 0, 0, NULL, 0);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_cc483fe49e9b15e5b04781040afe7904', 'grp_c830675c7e634b3af1a145a6f8879723', 'Sarah Mary Samuel', 1, 0, 0, NULL, 0);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_12ce03f9cd5c387dcc3ad367af7b4917', 'grp_0708dcd43374d7fe80193c7f85e22ea3', 'Arushi Agarwal', 1, 0, 0, NULL, 0);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_41f0415b1254352ba4a76e1a86ee056d', 'grp_0708dcd43374d7fe80193c7f85e22ea3', 'Nikhil Abraham Jacob', 0, 1, 0, NULL, 1);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_7904288a34a88d277d2ef36ef2b289fd', 'grp_e6eb0ee606a5d5a6ad065e0de491ed09', 'Nitin Cherian Jacob', 1, 0, 0, NULL, 0);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_e3e371b1af4eca79ae51f6860c941f19', 'grp_19aad0efcc98ddc62d2951790f8ec938', 'Sunitha', 1, 0, 0, NULL, 0);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_fff89e6177a6aec8326e000ddb45850d', 'grp_19aad0efcc98ddc62d2951790f8ec938', 'Varghese TK', 0, 1, 0, NULL, 1);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_f278628c9f4fa8225aa126677fa66a92', 'grp_1096e46ebbee340e11158b4afaab0dec', 'Simran Varghese', 1, 0, 0, NULL, 0);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_bf2c50a9e9379f28c82b7806fc2388f8', 'grp_6fcc10dd80cd31c5eb02f932a3d2da1f', 'Yohan Varghese', 1, 0, 0, NULL, 0);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_7354c89d3649ab646f49e1bbdb66d421', 'grp_f60f018036ad929d75164cb6d504e79b', 'Maemy', 1, 0, 0, NULL, 0);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_d864d0b742e6b1a16230bc7ad8116bce', 'grp_f60f018036ad929d75164cb6d504e79b', 'Dr PG Thomas', 0, 1, 0, NULL, 1);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_37dee00edc8674e37c75de39bc19aace', 'grp_362cd95030adfe102c861c66c2dee790', 'Manisha Mammen', 1, 0, 0, NULL, 0);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_37261c13aef4deacab3304d0f5233cff', 'grp_362cd95030adfe102c861c66c2dee790', 'Thomas P George', 0, 1, 0, NULL, 1);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_8391df920cd068c56b33b5803e1af2a1', 'grp_3cf9146b2c7d7ba6cfb9ddc10779f805', 'Reni Annie', 1, 0, 0, NULL, 0);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_7bd4f0b59b691ef589bf178c6cd1dbcf', 'grp_3cf9146b2c7d7ba6cfb9ddc10779f805', 'Biju Varghese', 0, 1, 0, NULL, 1);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_0b39a66c6b6d00f47f5830ae1254c342', 'grp_330b6ad33b6882fe6204d6c5209c4cbc', 'Alan Easo Varghese', 1, 0, 0, NULL, 0);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_3261c1cfbfc86fe7e0336927d756ec55', 'grp_4ff43a1c127c30289c6ac96b4d17fa07', 'Helen Sarah Varghese', 1, 0, 0, NULL, 0);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_a79bce1dc99a97169785ed3deddef32d', 'grp_60cf23f37aa51cef4ff680ffe36cc24c', 'Joshua Thomas Titus', 1, 0, 0, NULL, 0);

INSERT INTO guests (id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id, sort_order)
VALUES ('gst_1a7fbbb21e877e96916b24e1a30ced0b', 'grp_16dc0d04893e2e31d8c389066210ab4e', 'Johan Oommen Titus', 1, 0, 0, NULL, 0);
