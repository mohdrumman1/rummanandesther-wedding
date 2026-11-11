-- Seating plan clean-up (confirmed by Rumman):
-- 1. Shoab is no longer coming to any event (his wife Lida is unchanged).
UPDATE guests
SET sangeet_attending = 0, ceremony_attending = 0, reception_attending = 0
WHERE id = 'gst_7808c225ebbeb86e539267f94cae9fc0';

-- 2. Ekta is the 23-year-old child of Mareena and Dr Hansaraj KC, counted as an adult guest.
UPDATE guests
SET name = 'Ekta', is_additional = 0, adult_count = 1
WHERE id = 'gst_8b0caf97fec1e07a518f0c41fa55f7f8';

-- 3. Shahinaz is a new guest: invited to the ceremony and reception, no reply yet.
INSERT INTO guest_groups (id, household_name, access_code, plus_one_limit, notes) VALUES
  ('grp_shahinaz', 'Shahinaz', 'SHZ4K7QW2MPXN8D5TA', 0, 'Added from the seating plan');

INSERT INTO guests (
  id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id,
  children_allowed, max_children, adult_count, children_count,
  sangeet_invited, ceremony_invited, reception_invited, port_macquarie_reception_invited, sort_order
) VALUES
  ('gst_shahinaz', 'grp_shahinaz', 'Shahinaz', 1, 0, 0, NULL, 0, 0, 1, 0, 0, 1, 1, 0, 0);

-- 4. Hameeda takes Shoab's place in the Lida & Shoab household: invited to the ceremony and reception, no reply yet.
INSERT INTO guests (
  id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id,
  children_allowed, max_children, adult_count, children_count,
  sangeet_invited, ceremony_invited, reception_invited, port_macquarie_reception_invited, sort_order
) VALUES
  ('gst_hameeda', 'grp_245ef399132c0d106a0fda4f46d1ffd4', 'Hameeda', 0, 0, 0, 'gst_f99544b4ddd049a3b2579736ede15ce0', 0, 0, 1, 0, 0, 1, 1, 0, 2);
