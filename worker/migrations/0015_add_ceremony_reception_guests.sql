INSERT INTO guest_groups (id, household_name, access_code, plus_one_limit, notes)
VALUES
  ('grp_0e93907595022ef33c636b0f148de97a', 'William Finn & Brynlea Finn', '82G5YQDR9E63BXNFBN', 0, ''),
  ('grp_644486831c8c852af169eb3d105b5561', 'Daniel Tanious', 'PQRWKK9DZETGW5YKJC', 0, ''),
  ('grp_0be8b809415f5eb183ee17457ea60667', 'Aaron Atty', 'NFDGVJYPVAFHVFQHBH', 0, ''),
  ('grp_04061381898676e4e4f5f124eecda2ed', 'Eric Joseph', 'JE3W3KAKX7LPCQ3T4S', 0, ''),
  ('grp_1faa5513f1e635402adcf3d6c031622f', 'Sharan Kishore', '3PLLFYVDRNDBQD3NCQ', 0, ''),
  ('grp_7c82a725afd0b155dfee693d49c96729', 'Rhys Carrier & Jess Seed', 'W3WN6H4UTBWBG6R3LM', 0, ''),
  ('grp_21175198be9c296aea3f0b59ff2647ed', 'Josh Carrier', '88HY7KDCY5Y363MHMC', 0, ''),
  ('grp_03b224a81a3fc83769447a02117be083', 'Rhys Fuller & Emily-Rose Carter', 'R4YS2T8Z8SQ98RYGMR', 0, ''),
  ('grp_70126bf265948aa53c5dc0221194dcc5', 'Harri McFie', 'PP8LFDTN7DQL3VSUBW', 0, ''),
  ('grp_ff1ace1ee92329934c39cd193e9457f8', 'Lachlan Sands & Susannah Sands', '3UHQJJ7HWPPS58NCV3', 0, '');

INSERT INTO guests (
  id,
  group_id,
  name,
  is_primary,
  is_partner,
  children_allowed,
  max_children,
  sangeet_invited,
  ceremony_invited,
  reception_invited,
  sort_order
)
VALUES
  ('gst_f6a5dec6a4c3d8c3451e17a2f0de3fad', 'grp_0e93907595022ef33c636b0f148de97a', 'William Finn', 1, 0, 0, 0, 0, 1, 1, 0),
  ('gst_23ac13ddb43c7c85fdb00ae6a55d07ff', 'grp_0e93907595022ef33c636b0f148de97a', 'Brynlea Finn', 0, 1, 0, 0, 0, 1, 1, 1),
  ('gst_c371700b58a5d5b71b2536d271b0d4ed', 'grp_644486831c8c852af169eb3d105b5561', 'Daniel Tanious', 1, 0, 0, 0, 0, 1, 1, 0),
  ('gst_38a28b1853e24f28f8fd73a89cf80c3f', 'grp_0be8b809415f5eb183ee17457ea60667', 'Aaron Atty', 1, 0, 0, 0, 0, 1, 1, 0),
  ('gst_819c08380df565b361ef8c8ac4b72849', 'grp_04061381898676e4e4f5f124eecda2ed', 'Eric Joseph', 1, 0, 0, 0, 0, 1, 1, 0),
  ('gst_479e8ca35ff1b9339506ef6ca03b870c', 'grp_1faa5513f1e635402adcf3d6c031622f', 'Sharan Kishore', 1, 0, 0, 0, 0, 1, 1, 0),
  ('gst_b74d6e78fa487b603c381c0e1a33d004', 'grp_7c82a725afd0b155dfee693d49c96729', 'Rhys Carrier', 1, 0, 0, 0, 0, 1, 1, 0),
  ('gst_3e3e5d7c2d63421ba42053e9441f222a', 'grp_7c82a725afd0b155dfee693d49c96729', 'Jess Seed', 0, 1, 0, 0, 0, 1, 1, 1),
  ('gst_a2739f83c2f50b4febe527a2aab24f2a', 'grp_21175198be9c296aea3f0b59ff2647ed', 'Josh Carrier', 1, 0, 0, 0, 0, 1, 1, 0),
  ('gst_38db290d24f3305e825114399f61328d', 'grp_03b224a81a3fc83769447a02117be083', 'Rhys Fuller', 1, 0, 0, 0, 0, 1, 1, 0),
  ('gst_6eaa2758e748568fe3d40a8b10b04245', 'grp_03b224a81a3fc83769447a02117be083', 'Emily-Rose Carter', 0, 1, 0, 0, 0, 1, 1, 1),
  ('gst_178f1a09c4a67db6bcfa5c3025db238c', 'grp_70126bf265948aa53c5dc0221194dcc5', 'Harri McFie', 1, 0, 0, 0, 0, 1, 1, 0),
  ('gst_2d6b825b8722af51a0ff7d31860e12be', 'grp_ff1ace1ee92329934c39cd193e9457f8', 'Lachlan Sands', 1, 0, 1, 1, 0, 1, 1, 0),
  ('gst_3442208ee3cfa1cece582414f3b324c1', 'grp_ff1ace1ee92329934c39cd193e9457f8', 'Susannah Sands', 0, 1, 0, 0, 0, 1, 1, 1);
