# NOTICE — third-party 3D asset

## `public/3d/fel-drone-uav.glb` (+ `public/3d/fel-drone-uav-LICENSE.txt`)

This work is based on **"animated drone with camera (FREE)"**
(https://sketchfab.com/3d-models/none-a8e2c50f69264e75bb6277779fb5028b)
by **ulunkwulunk** (https://sketchfab.com/ulunkwulunk), licensed under
**Creative Commons Attribution 4.0 International (CC-BY-4.0)**
(http://creativecommons.org/licenses/by/4.0/).

- Provenance: the model is a Sketchfab CC-BY-4.0 download; the copy was
  retrieved from the public repository `Kronbii/portfolio-website`, whose
  `public/models/CREDITS.md` records the per-file author, license and source
  URL (Sketchfab authorship "confirmed from the API"). The model itself
  remains CC-BY-4.0 with attribution required — see
  `public/3d/fel-drone-uav-LICENSE.txt`.
- Attribution in the product: a visible credit line is rendered in the site
  footer (`src/components/Footer.tsx`, dictionary key `footer.credit3d` in
  `src/data/content.fr.ts` / `content.en.ts` / `content.ar.ts`), linking to
  the source model page. Do not remove it.
- Modifications for web delivery (glTF-Transform 4.5): geometry, UVs and the
  texture set are unmodified; KHR_materials_pbrSpecularGlossiness was
  converted to metallic-roughness; buffers quantized (KHR_mesh_quantization)
  and compressed (EXT_meshopt_compression). Textures remain WebP at their
  processed resolution. Authored animation clips exist in the file but are
  intentionally not auto-played (presentation is a static product shot with
  hover/parallax/entrance motion).
- Trademark note: the model depicts the general form of a consumer camera
  drone. No manufacturer logo, trademark or proprietary branding is rendered
  by the site, and the site does not claim any manufacturer affiliation.
