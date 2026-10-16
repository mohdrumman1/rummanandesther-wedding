-- Batch: extend wedding-only restriction (0022) to the remaining dad's-list households that
-- were pre-existing groups renamed via UPDATE in migrations 0017-0019 (not new INSERTs, so they
-- were missed by 0022's insert-only target list). Same instruction: wedding ceremony only, no
-- sangeet or reception, confirmed with Esther's dad for the full list (items 1-47).

UPDATE guests
SET sangeet_invited = 0, reception_invited = 0
WHERE group_id IN (
  'grp_03fee5ebc49ece1a1d64e8e2d54191df', 'grp_051fd700e7f114c5bacb131eb8bb17cb', 'grp_0d3fc718465be18c87378648e3fb5141', 'grp_24604bb61debb0b0c8cd926afa2c2f9a', 'grp_399820861d60a322f206bc004ff71ccf', 'grp_39a5994dd6796b268d80edfa6e335188', 'grp_3cb7919dd6993bb3cebe52071220db34', 'grp_3e4e0e78f32c7e48244de8352086762a',
  'grp_46bd4dcecf50c6b0ee7c21c6ac1bbb38', 'grp_720df60253e16f26dc6388e1e93b252e', 'grp_728ad9d4adfa2827a5f3a913b05e2111', 'grp_7a82431187df373a4cc62ac88e01d80c', 'grp_7aa26409d887e5be898531c1657a2c8a', 'grp_7ef1bd6c0941ce7b982ea35818b4b092', 'grp_80cad5e2bb2e5a6f56e21424ca708b9a', 'grp_a2c341d31c78c0729fd5e54341840fd9',
  'grp_a40cb2c5f9bef42a9007a2b2efe6b087', 'grp_b4144d9519061ae4a0acc71530589cec', 'grp_b443743e1bc13703a2b759b72f4d003f', 'grp_c2ae855392d9ba1656ca8b41fea99726', 'grp_c37defd22b87a794c60e23b717693871', 'grp_c9dbcd936dd8a12052410ad1a4bf18ce', 'grp_dd5ea867bb96a3a751c7b67bdae8d992', 'grp_e28c51816ca5b1fbbcd4c434258af732'
);
