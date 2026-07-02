UPDATE guests
SET sangeet_attending = 0,
    ceremony_attending = 0,
    updated_at = CURRENT_TIMESTAMP
WHERE group_id IN (
  'grp_6700932cb4fb8bd0761cdf8aa22fe59f',
  'grp_c5a14739ae6d762c7f1ab7fbff42ad33',
  'grp_55c60b2e15cddad10c53bfd5b60609a5',
  'grp_ecdfe3186915a122189bc51d49ab4da1',
  'grp_eeab80af605ef6e0ec9d3c078d6d1a9d',
  'grp_a6dc7b3ccdc34704bcedf6de7a44e51f',
  'grp_8eff87e244aa132463e27cbbb6f78dcc',
  'grp_81db71677fd2c0333795b44901a27f56',
  'grp_69d882b1743870478de43d389cd63de3',
  'grp_3e4e0e78f32c7e48244de8352086762a'
);
