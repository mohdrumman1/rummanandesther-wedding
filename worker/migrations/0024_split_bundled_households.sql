-- Esther's dad flagged items 10a (Rony Varghese Jacob) and 21 (Meera Varghese) as
-- "invitation not found" -- both were bundled into shared households (migration 0017)
-- with no invite of their own. Splitting into separate households/access codes so each
-- doc item (9, 10, 10a, 19, 21) has its own invite, matching dad's numbering.
-- Neither guest has started an RSVP yet, so this is safe.

-- Item 9: Cooky Varghese -> own household (out of grp_7ef1bd6c0941ce7b982ea35818b4b092)
INSERT INTO guest_groups (id, household_name, access_code, plus_one_limit, most_likely_not_coming, notes)
VALUES ('grp_b8451a6a792da0f51de7236780ed98f5', 'Cooky Varghese', 'RPCU6YU48PWUQYFKDT', 0, 1, NULL);

UPDATE guests
SET group_id = 'grp_b8451a6a792da0f51de7236780ed98f5', is_primary = 1, is_partner = 0, primary_guest_id = NULL, sort_order = 0
WHERE id = 'gst_c401f28ecb0a26e685b8b7697d9435c6';

-- Item 10a: Rony Varghese Jacob -> own household
INSERT INTO guest_groups (id, household_name, access_code, plus_one_limit, most_likely_not_coming, notes)
VALUES ('grp_586651508760839f625f1b237a925d3e', 'Rony Varghese Jacob', 'HE3X6DNWKXLTB77HEA', 0, 1, NULL);

UPDATE guests
SET group_id = 'grp_586651508760839f625f1b237a925d3e', is_primary = 1, is_partner = 0, primary_guest_id = NULL, sort_order = 0
WHERE id = 'gst_1e5048f3d7618b4955585196a2cbe895';

-- Item 10: rename remaining group to just the couple (Susan and Bino K Jacob Varghese)
UPDATE guest_groups SET household_name = 'Susan and Bino K Jacob Varghese' WHERE id = 'grp_7ef1bd6c0941ce7b982ea35818b4b092';

-- Item 21: Meera Varghese -> own household (out of grp_b4144d9519061ae4a0acc71530589cec)
INSERT INTO guest_groups (id, household_name, access_code, plus_one_limit, most_likely_not_coming, notes)
VALUES ('grp_1e2720a377830eabd138da10da6e1d90', 'Meera Varghese', 'N2EGN39862XRPGM5Q6', 0, 1, NULL);

UPDATE guests
SET group_id = 'grp_1e2720a377830eabd138da10da6e1d90', is_primary = 1, is_partner = 0, primary_guest_id = NULL, sort_order = 0
WHERE id = 'gst_5d5a33985fc4de732a45af20eaddc92f';

-- Item 19: rename remaining group to just Somi Varghese
UPDATE guest_groups SET household_name = 'Somi Varghese' WHERE id = 'grp_b4144d9519061ae4a0acc71530589cec';
