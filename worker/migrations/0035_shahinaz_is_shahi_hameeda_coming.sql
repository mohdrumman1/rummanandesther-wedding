-- Shahinaz is Shahi from Dr Azeem & Shahi, not a new guest: remove the household 0034 added for her.
DELETE FROM guests WHERE group_id = 'grp_shahinaz';
DELETE FROM guest_groups WHERE id = 'grp_shahinaz';

-- Hameeda (taking Shoab's place) is coming to the ceremony and reception.
UPDATE guests
SET ceremony_attending = 1, reception_attending = 1
WHERE id = 'gst_hameeda';
