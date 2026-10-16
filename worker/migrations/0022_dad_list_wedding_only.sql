-- Batch: restrict all dad's-list additions (migrations 0017-0021) to wedding (ceremony) only.
-- These households were inserted without explicit event flags and inherited the schema default
-- (sangeet_invited=1, reception_invited=1, ceremony_invited=1). Confirmed with Esther's dad
-- these guests should only be invited to the wedding ceremony, not sangeet or reception.

UPDATE guests
SET sangeet_invited = 0, reception_invited = 0
WHERE group_id IN (
  'grp_09acefe720e3c72dba52d3e89ef85d3d', 'grp_b807a24949a938f45ed0ca49bda59971', 'grp_48627bc52a2ace7eab6c567d38570c23', 'grp_140751b788f13590c626332f58b2ca9a', 'grp_973f99eeb8c1090edb63eb403ad488ea', 'grp_063822e2db846c0eeaaf7a5d5a32727d', 'grp_6e632e92e43f1625e33de6d4005167b3', 'grp_95c619b29792e736a6e498528692d050',
  'grp_16e8528a7f1b4f0ef1e8376558f35278', 'grp_34cbef6e0368b1e474ee319bdf069b5c', 'grp_0f29fc674d1838399aa6eaf9c8caf2c7', 'grp_443109de16c23722991d5130481a1e03', 'grp_229ac51e5bf3a6ffd0bfd1719c456f3b', 'grp_3d1e0eac0b8aa3407d4871b9f6954b76', 'grp_82cb196c5f58e71bd1fc0e994306145b', 'grp_9461d4d69e13c00b09b31679dde3ce14',
  'grp_1356680e5a2810b272ac818fbc0c4b25', 'grp_f7ba4e7b992bc97112743a6e3cbaa6e2', 'grp_0c1b461183eb2436b4dc5b98a8fee60e', 'grp_f26e036f2c4b9dcde61777361ab29dc8', 'grp_de55846f59285c560898dc664ea8b059', 'grp_907a9d2739a1ff6e93449b7ef0dfcdd0', 'grp_a1cd12ab60dda2df82bcf9e9b832939c', 'grp_c830675c7e634b3af1a145a6f8879723',
  'grp_0708dcd43374d7fe80193c7f85e22ea3', 'grp_e6eb0ee606a5d5a6ad065e0de491ed09', 'grp_19aad0efcc98ddc62d2951790f8ec938', 'grp_1096e46ebbee340e11158b4afaab0dec', 'grp_6fcc10dd80cd31c5eb02f932a3d2da1f', 'grp_f60f018036ad929d75164cb6d504e79b', 'grp_362cd95030adfe102c861c66c2dee790', 'grp_3cf9146b2c7d7ba6cfb9ddc10779f805',
  'grp_330b6ad33b6882fe6204d6c5209c4cbc', 'grp_4ff43a1c127c30289c6ac96b4d17fa07', 'grp_60cf23f37aa51cef4ff680ffe36cc24c', 'grp_16dc0d04893e2e31d8c389066210ab4e', 'grp_078a04445b8ecec6f4a7c0c4cdcc493a', 'grp_e20edfa4022bc43a7f142c7f68d92322', 'grp_df49e6deccf4c6cbde72881265b8f55f', 'grp_17181aca4122e930c9528c55b4ef99bd',
  'grp_7599de199228b7d1506f2e3a9448e8c5', 'grp_0e32ce2467f132162d1e45254e7da57e', 'grp_fcf1617309ecbde0000cc09d608217dd', 'grp_8b06ff642ffbe37eae141a03be1c5429', 'grp_34b53a4b402399549c974e8f72f1f3f0', 'grp_e39f4988533611f1a771ddf314eb2e72', 'grp_4d12c38ae684187b5018cc1d40e2a648', 'grp_e93ca72212ee50730931b0ce40299eaa',
  'grp_78152424fbf88e82551070ed42aad30f', 'grp_f957aac2ad0660af55da6c414d72efe1', 'grp_34956c6e95acf35467e4e849206fa18a', 'grp_eabbb1c6064b2f391c248f956861024b', 'grp_f9d54894dab7a3fd49129b3b263dec3f', 'grp_f712285f0e5893c4a8ca20a2ad26d144', 'grp_affd66bb9b9186f4973881e9777cab17', 'grp_6dda523cf0ddbfe87aad0fcb0a40f429',
  'grp_0a8300d55394a8c142f34efd3f2db6ab'
);
