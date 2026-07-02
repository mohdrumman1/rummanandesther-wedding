UPDATE guests
SET name = CASE id
  WHEN 'gst_b830ea351b43c54750eb45907ac799da' THEN 'Suraj Philip'
  WHEN 'gst_598e93d3a73d351da3e3deed092aac8c' THEN 'Sunita Philip'
  WHEN 'gst_fdaffe2681b877b9f48dd2d71d6a9485' THEN 'Matthew Philip'
  WHEN 'gst_fec0e7a32a1d8bfd9499f18bf70bfe8d' THEN 'James Philip'
  WHEN 'gst_415e9356f2e3dec91efa1a17f7439b4e' THEN 'Saira Philip'
  WHEN 'gst_648f75d79acc171795980aa37aa728f5' THEN 'Ammachi'
  WHEN 'gst_4bbd00535f859791bfd3c8da3ad7cea5' THEN 'Joemon Philip'
  WHEN 'gst_2abfa35b5d3070a0a301155ca9bd1e0a' THEN 'Janine Philip'
  WHEN 'gst_ad13ca19c3cfa6837d4755630d2b71a2' THEN 'Jonathan Philip'
  WHEN 'gst_4ef0add9b5d5d0ab4c671689dc4caf6f' THEN 'Sam Philip'
END,
updated_at = CURRENT_TIMESTAMP
WHERE id IN (
  'gst_b830ea351b43c54750eb45907ac799da',
  'gst_598e93d3a73d351da3e3deed092aac8c',
  'gst_fdaffe2681b877b9f48dd2d71d6a9485',
  'gst_fec0e7a32a1d8bfd9499f18bf70bfe8d',
  'gst_415e9356f2e3dec91efa1a17f7439b4e',
  'gst_648f75d79acc171795980aa37aa728f5',
  'gst_4bbd00535f859791bfd3c8da3ad7cea5',
  'gst_2abfa35b5d3070a0a301155ca9bd1e0a',
  'gst_ad13ca19c3cfa6837d4755630d2b71a2',
  'gst_4ef0add9b5d5d0ab4c671689dc4caf6f'
);

UPDATE guest_groups
SET household_name = CASE id
  WHEN 'grp_929b5137ea4d22057dac63ee40d63404' THEN 'Philip Family'
  WHEN 'grp_d6b5b130bde1263664f7ddea0fe0dae4' THEN 'Joemon & Family'
  WHEN 'grp_97030ad79c1d545e8a1c8c4599dc2b7b' THEN 'Abbey Hyde & Sam Philip'
END,
updated_at = CURRENT_TIMESTAMP
WHERE id IN (
  'grp_929b5137ea4d22057dac63ee40d63404',
  'grp_d6b5b130bde1263664f7ddea0fe0dae4',
  'grp_97030ad79c1d545e8a1c8c4599dc2b7b'
);
