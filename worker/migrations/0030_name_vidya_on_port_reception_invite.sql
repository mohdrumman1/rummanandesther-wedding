-- Replace the unnamed spouse with Vidya and give both named adults their own RSVP card.
UPDATE guest_groups
SET household_name = 'Manuvikraman Mohan and Vidya'
WHERE id = 'grp_pm_02';

UPDATE guests
SET name = 'Manuvikraman Mohan', adult_count = 1
WHERE group_id = 'grp_pm_02'
  AND name = 'Manuvikraman Mohan and wife';

INSERT INTO guests (
  id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id,
  children_allowed, max_children, adult_count, children_count,
  ceremony_children_count, reception_children_count, port_macquarie_reception_children_count,
  sangeet_attending, ceremony_attending, reception_attending, port_macquarie_reception_attending,
  sangeet_invited, ceremony_invited, reception_invited, port_macquarie_reception_invited, sort_order
)
SELECT
  'gst_pm_02_vidya', group_id, 'Vidya', 0, 1, 0, id,
  0, 0, 1, 0,
  0, 0, 0,
  NULL, NULL, NULL, NULL,
  sangeet_invited, ceremony_invited, reception_invited, port_macquarie_reception_invited, sort_order + 1
FROM guests
WHERE group_id = 'grp_pm_02'
  AND name = 'Manuvikraman Mohan';
