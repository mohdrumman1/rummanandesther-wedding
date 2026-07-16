UPDATE guest_groups
SET plus_one_limit = 1,
    updated_at = CURRENT_TIMESTAMP
WHERE access_code = 'G3FFQGERZZULEFL89F';
