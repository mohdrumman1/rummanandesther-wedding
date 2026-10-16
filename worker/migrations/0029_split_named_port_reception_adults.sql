-- The source list names both adults for these households. Give each named adult
-- an individual RSVP card while retaining the household's child allocation on
-- the primary guest. Entries such as "and wife" deliberately stay as a single
-- two-adult allocation because no second name was supplied.
INSERT INTO guests (
  id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id,
  children_allowed, max_children, adult_count, children_count,
  ceremony_children_count, reception_children_count, port_macquarie_reception_children_count,
  sangeet_attending, ceremony_attending, reception_attending, port_macquarie_reception_attending,
  sangeet_invited, ceremony_invited, reception_invited, port_macquarie_reception_invited, sort_order
)
SELECT
  id || '_second', group_id, trim(substr(name, instr(name, ' and ') + 5)),
  0, 1, 0, id,
  0, 0, 1, 0,
  0, 0, 0,
  NULL, NULL, NULL, NULL,
  sangeet_invited, ceremony_invited, reception_invited, port_macquarie_reception_invited, sort_order + 1
FROM guests
WHERE port_macquarie_reception_invited = 1
  AND adult_count = 2
  AND name LIKE '% and %'
  AND lower(name) NOT LIKE '% and wife%';

UPDATE guests
SET
  name = trim(substr(name, 1, instr(name, ' and ') - 1)),
  adult_count = 1
WHERE port_macquarie_reception_invited = 1
  AND adult_count = 2
  AND name LIKE '% and %'
  AND lower(name) NOT LIKE '% and wife%';
