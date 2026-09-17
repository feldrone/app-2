# NOTICE — third-party 3D asset

## `public/3d/fel-drone-uav.glb` (+ `public/3d/fel-drone-uav-LICENSE.txt`)

This work is based on **"Fpv Racing Drone Quadcopter"**
(https://sketchfab.com/3d-models/fpv-racing-drone-quadcopter-fa8b1ca2695e4022a9b4c70401f04b05)
by **eagleanurag** (https://sketchfab.com/eagleanurag), licensed under
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
- Modifications: optimized for web delivery with glTF-Transform (texture resize to
  ≤1024px, weld, dedup, prune, mesh simplification, KHR_mesh_quantization).
  Materials and the authored propeller animation ("Take 001") are preserved.
