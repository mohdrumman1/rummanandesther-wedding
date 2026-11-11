-- Add Dr Sinija and Peter Rodrigues to the private Port Macquarie reception.
-- Two adults, each with their own RSVP card, matching the 0029 split-household shape.
INSERT INTO guest_groups (id, household_name, access_code, plus_one_limit, notes) VALUES
  ('grp_pm_58', 'Dr Sinija and Peter Rodrigues', 'PMRW3EUSR4NBXBWJR6', 0, 'Private Port Macquarie reception: 2 adults');

INSERT INTO guests (
  id, group_id, name, is_primary, is_partner, is_additional, primary_guest_id,
  children_allowed, max_children, adult_count, children_count,
  ceremony_children_count, reception_children_count, port_macquarie_reception_children_count,
  sangeet_invited, ceremony_invited, reception_invited, port_macquarie_reception_invited, sort_order
) VALUES
  ('gst_pm_58', 'grp_pm_58', 'Dr Sinija', 1, 0, 0, NULL, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0),
  ('gst_pm_58_second', 'grp_pm_58', 'Peter Rodrigues', 0, 1, 0, 'gst_pm_58', 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1);
