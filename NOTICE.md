# NOTICE — third-party 3D asset

## `public/3d/fel-drone-uav.glb` (+ `public/3d/fel-drone-uav-LICENSE.txt`)

This work is based on **"Quadcopter DJI Matrice 300 RTK"**
(https://sketchfab.com/3d-models/quadcopter-dji-matrice-300-rtk-6677d02d66df4b73aad0d8e7bb9e3d9c)
by **19vitali99** (https://sketchfab.com/19vitali99), licensed under
**Creative Commons Attribution 4.0 International (CC-BY-4.0)**
(http://creativecommons.org/licenses/by/4.0/).

- Provenance: retrieved from the public repository `njanne19/euas-docs` (MIT-licensed
  repository redistributing the model with its Sketchfab license file); the model
  itself remains CC-BY-4.0 with attribution required — see
  `public/3d/fel-drone-uav-LICENSE.txt` for the original license text.
- Attribution in the product: a visible credit line is rendered in the site footer
  (`src/components/Footer.tsx`, dictionary key `footer.credit3d` in
  `src/data/content.fr.ts` / `content.en.ts` / `content.ar.ts`), linking to the
  source model page. Do not remove it.
- Modifications for web delivery (glTF-Transform 4.5): the merged transport-case
  geometry was removed; flat CAD materials were re-authored as an industrial PBR
  set (two-tone grey shell, graphite arms, black polymer, gold status-lamp accent,
  glass optics); meshes welded, simplified (meshoptimizer) and quantized
  (KHR_mesh_quantization); vertex buffers compressed (EXT_meshopt_compression).
  The model ships without animation; propeller nodes are separable but their
  pivots are baked at the model origin, so propellers are intentionally static.
- Trademark note: the model depicts the general form of a commercial UAV platform.
  No manufacturer logo, trademark or proprietary branding is rendered by the site,
  and the site does not claim any manufacturer affiliation.
