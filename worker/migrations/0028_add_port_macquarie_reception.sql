-- This event is deliberately absent from the public site. It is exposed only by
-- the personal RSVP links issued to the households below.
ALTER TABLE guests ADD COLUMN port_macquarie_reception_invited INTEGER NOT NULL DEFAULT 0;
ALTER TABLE guests ADD COLUMN port_macquarie_reception_attending INTEGER;
ALTER TABLE guests ADD COLUMN port_macquarie_reception_children_count INTEGER NOT NULL DEFAULT 0;

INSERT INTO guest_groups (id, household_name, access_code, plus_one_limit, notes) VALUES
  ('grp_pm_01', 'Dr Mohan Vattekad and Prema Mohan', 'PMR6J4V8K2Q7W9X3AB', 0, 'Private Port Macquarie reception: 2 adults'),
  ('grp_pm_02', 'Manuvikraman Mohan and wife', 'PMR7L5Y9N3R8T2C4DE', 0, 'Private Port Macquarie reception: 2 adults, 1 child'),
  ('grp_pm_03', 'Hari Mohan and Dr Aishwarya', 'PMR8M6Z2P4S9U3D5FG', 0, 'Private Port Macquarie reception: 2 adults'),
  ('grp_pm_04', 'Dr Prem Dogra and Ravinder', 'PMR9N7A3Q5T2V4E6HJ', 0, 'Private Port Macquarie reception: 2 adults'),
  ('grp_pm_05', 'Dr Naveen Kollanur', 'PMR2P8B4R6U3W5F7KL', 0, 'Private Port Macquarie reception: 1 adult, 2 children'),
  ('grp_pm_06', 'Dr Azeem and Shehnaaz', 'PMR3Q9C5S7V4X6G8MN', 0, 'Private Port Macquarie reception: 2 adults'),
  ('grp_pm_07', 'Dr Benhur and Dr Shwetha', 'PMR4R2D6T8W5Y7H9PQ', 0, 'Private Port Macquarie reception: 2 adults, 2 children'),
  ('grp_pm_08', 'Nabil Shaffi', 'PMR5S3E7U9X6Z8J2RT', 0, 'Private Port Macquarie reception: 1 adult'),
  ('grp_pm_10', 'Nikhil Shaffi', 'PMR6T4F8V2Y7A9K3UV', 0, 'Private Port Macquarie reception: 1 adult'),
  ('grp_pm_11', 'Sajini and Philip Mani Unni', 'PMR7U5G9W3Z8B2L4WX', 0, 'Private Port Macquarie reception: 4 adults'),
  ('grp_pm_12', 'Dr Phani Prakhya and Dr Navya', 'PMR8V6H2X4A9C3M5YZ', 0, 'Private Port Macquarie reception: 2 adults, 2 children'),
  ('grp_pm_13', 'Jithu and Asha', 'PMR9W7J3Y5B2D4N6AC', 0, 'Private Port Macquarie reception: 2 adults'),
  ('grp_pm_14', 'Dr Winny Varikkat and Paul Joseph', 'PMR2X8K4Z6C3E5P7BD', 0, 'Private Port Macquarie reception: 2 adults'),
  ('grp_pm_15', 'Jeffrey Joseph and wife', 'PMR3Y9L5A7D4F6Q8CE', 0, 'Private Port Macquarie reception: 2 adults'),
  ('grp_pm_16', 'Dr Sareena and Dr John Zachariah', 'PMR4Z2M6B8E5G7R9DF', 0, 'Private Port Macquarie reception: 2 adults'),
  ('grp_pm_17', 'Dilshad and Raisa', 'PMR5A3N7C9F6H8S2EG', 0, 'Private Port Macquarie reception: 2 adults'),
  ('grp_pm_18', 'Cibin Ilyas and Shana', 'PMR6B4P8D2G7J9T3FH', 0, 'Private Port Macquarie reception: 2 adults'),
  ('grp_pm_19', 'Suveesh Venugopal and Neethu', 'PMR7C5Q9E3H8K2U4GJ', 0, 'Private Port Macquarie reception: 2 adults, 2 children'),
  ('grp_pm_20', 'Sain Karikkal and Jasmin', 'PMR8D6R2F4J9L3V5HK', 0, 'Private Port Macquarie reception: 2 adults, 3 children'),
  ('grp_pm_21', 'Jamu Jose and Jisha', 'PMR9E7S3G5K2M4W6JL', 0, 'Private Port Macquarie reception: 2 adults, 2 children'),
  ('grp_pm_22', 'Tony Jose and Sonia', 'PMR2F8T4H6L3N5X7KM', 0, 'Private Port Macquarie reception: 2 adults, 2 children'),
  ('grp_pm_33', 'Clint Mathew and Jinty', 'W6GQ2K9HX4M7T3P8RD', 0, 'Private Port Macquarie reception: 2 adults, 4 children'),
  ('grp_pm_34', 'Shijo Joseph and Jasmine', 'C8Y4N6V2L9Q5B7X3KA', 0, 'Private Port Macquarie reception: 2 adults, 3 children'),
  ('grp_pm_35', 'Mahesh and Divya', 'F7R3W8J5M2H9D4U6ZE', 0, 'Private Port Macquarie reception: 2 adults, 1 child'),
  ('grp_pm_36', 'Benny Mathew and Anila', 'T5K9P3X7C4V8L2N6QH', 0, 'Private Port Macquarie reception: 2 adults, 2 children'),
  ('grp_pm_37', 'Bittu Baby and Jaya', 'Z2M7G4R9W6J3Y8F5PC', 0, 'Private Port Macquarie reception: 2 adults, 2 children'),
  ('grp_pm_38', 'Janeesh Joseph and Sonia', 'H9Q5D2K8V7X4B6T3MR', 0, 'Private Port Macquarie reception: 2 adults, 2 children'),
  ('grp_pm_39', 'Vinod and Sherry', 'L4W8N3F7C9P2G6Y5XK', 0, 'Private Port Macquarie reception: 2 adults, 2 children'),
  ('grp_pm_40', 'Sefin and Jismi', 'R6T3H9M5Q2Z7V4D8NB', 0, 'Private Port Macquarie reception: 2 adults, 3 children'),
  ('grp_pm_41', 'Biju Jose and Anice', 'P8C4Y6K2W9G3L7X5HF', 0, 'Private Port Macquarie reception: 2 adults, 1 child'),
  ('grp_pm_42', 'Lijo Jose and Jane', 'V3N7R5D9J2T8Q4M6ZK', 0, 'Private Port Macquarie reception: 2 adults, 3 children'),
  ('grp_pm_43', 'Shoby and Sini', 'G5X2L8P4C7W9H3Y6NR', 0, 'Private Port Macquarie reception: 2 adults, 2 children'),
  ('grp_pm_44', 'Majo Franco and Lijo', 'K7M3V9F5R2D8X4Q6TP', 0, 'Private Port Macquarie reception: 2 adults, 2 children'),
  ('grp_pm_45', 'Amal Tom and Anju', 'Y9H4N6C2L8G5W3P7XR', 0, 'Private Port Macquarie reception: 2 adults, 2 children'),
  ('grp_pm_46', 'Roshan Punnose and wife', 'D6Q8T3M7V4K9F2Z5HC', 0, 'Private Port Macquarie reception: 2 adults, 3 children'),
  ('grp_pm_47', 'Rony Augustin and Tessy', 'X4P7G9R3C6Y2L8W5NB', 0, 'Private Port Macquarie reception: 2 adults, 1 child'),
  ('grp_pm_48', 'Prajith and wife', 'M2Z5H8Q4T7D3V9K6FC', 0, 'Private Port Macquarie reception: 2 adults, 1 child'),
  ('grp_pm_49', 'Abin and Janisha', 'C7W3N6X9P2J8G4R5YL', 0, 'Private Port Macquarie reception: 2 adults, 3 children'),
  ('grp_pm_50', 'Anto John and Jeena', 'Q5L8F2T6M9H3V7D4ZP', 0, 'Private Port Macquarie reception: 2 adults, 2 children'),
  ('grp_pm_51', 'Justin Augustine and Jinsha', 'N8R4C7Y2K6P9W3G5XH', 0, 'Private Port Macquarie reception: 2 adults, 2 children'),
  ('grp_pm_52', 'Vishant Vasumohan and Anitha', 'T3D6M8Q5F2Z9L4V7KC', 0, 'Private Port Macquarie reception: 2 adults, 2 children'),
  ('grp_pm_53', 'Dr John Zachariah and Dr Sarina', 'W7X3H6P9R4G2N8C5YL', 0, 'Private Port Macquarie reception: 2 adults'),
  ('grp_pm_54', 'Dr Jaideep Narayan and Sheela', 'F4K7T2V8M5Q3D9Z6HP', 0, 'Private Port Macquarie reception: 2 adults'),
  ('grp_pm_55', 'Anoop Puthoor and Keerthana', 'J9C5L7X3W2R8G4P6NH', 0, 'Private Port Macquarie reception: 2 adults, 2 children'),
  ('grp_pm_56', 'Father George', 'Z6P2H9M4T7K3V8D5QF', 0, 'Private Port Macquarie reception: 1 adult'),
  ('grp_pm_57', 'Dr Ali Zameel and Dr Aysha Thasneem', 'R3Y7C5N8L2F9W4G6XH', 0, 'Private Port Macquarie reception: 2 adults, 2 children');

INSERT INTO guests (id, group_id, name, is_primary, children_allowed, max_children, sangeet_invited, ceremony_invited, reception_invited, port_macquarie_reception_invited, sort_order)
SELECT 'gst_pm_' || substr(id, 8), id, household_name, 1,
  CASE WHEN notes GLOB '*child*' THEN 1 ELSE 0 END,
  CASE WHEN notes LIKE '%3 children%' THEN 3 WHEN notes LIKE '%2 children%' THEN 2 WHEN notes LIKE '%1 child%' THEN 1 ELSE 0 END,
  0, 0, 0, 1, 0
FROM guest_groups WHERE id LIKE 'grp_pm_%';
