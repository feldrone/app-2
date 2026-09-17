# FEL DRONE — Media Slots — V10 / V11

> Business website — truthful media inventory. No invented assets, no stock "cheese", drone-only.
>
> **V11 note — alternative text.** The photographs and their crop URLs still come
> from `src/lib/images.ts` (one place, `docs/IMAGES.md`). Their **alt text is now
> translated**: each dictionary carries `media.*` (FR `content.fr.ts`, EN
> `content.en.ts`, AR `content.ar.ts`) and the components render the dictionary
> value, so screen-reader copy follows the interface language. When a slot is
> replaced, update the alt text in all three dictionaries (and keep the French
> line in `src/lib/images.ts` as the reference/fallback).

## Rule
- Every aviation visual must show real professional UAVs, operators or workshops — never manned aircraft, cockpits, airports, military hardware.
- Unknown or unverified media is marked **"Média à fournir"** — never faked.
- Demonstration placeholders must carry **"Exemple de démonstration — non issu d'une mission client"**

## Slots

### Hero
- **Current:** Pexels 28467369 — télépilote en tenue opérationnelle face à parc éolien
- **Slot:** `heroImage` in `src/lib/images.ts`
- **Status:** Verified drone photography
- **Alt:** Télépilote contrôlant un drone professionnel — FEL DRONE

### Expertise / Control
- **Current:** Pexels 8981852 — mains tenant radiocommande
- **Slot:** `controlImage`
- **Status:** Verified
- **Note:** La station de contrôle avant chaque mission

### Safety / Pre-flight
- **Current:** Pexels 34585109 — drone et radiocommande au sol, contrôle pré-vol
- **Slot:** `safetyImage`
- **Status:** Verified
- **Caption:** Contrôle pré-vol au sol : le geste le plus important est celui qui précède le décollage.

### Services (7 poles)
| Service | Image key | Pexels ID | Alt | Status |
|---------|-----------|-----------|-----|--------|
| Topographie & photogrammétrie | `topographie` | 1087180 | Vue aérienne topographique — relevé photogrammétrique, exemple de démonstration | À compléter — exemple de démonstration |
| Suivi & inspection de chantier | `inspection` | 6165166 | Drone en vol chantier urbain | Verified |
| Maintenance & diagnostic drone | `maintenance` | 32208773 | Technicien réparant drone à l'établi | Verified |
| Thermographie | `thermographie` | 442150 | Inspection thermographique par drone — exemple de démonstration | Média à fournir — exemple de démonstration |
| Agriculture | `agriculture` | 34182367 | Drone agricole — imagerie NDVI, exemple de démonstration | Exemple de démonstration |
| Vente | `vente` | 9182739 | Drone et radiocommande en lumière rasante | Verified |
| Location | `location` | 37288723 | Drone en configuration décollage champ | Verified |

### Demonstration (V10)
- **Slots:** Orthophoto, MNT, NDVI, Rapport
- **Each:** `Média à fournir` placeholder, bordered dashed, with disclaimer
- **Disclaimer required:** "Exemple de démonstration — non issu d'une mission client"
- **Status:** All marked À compléter — no client mission claimed

### Equipment
- **Slots:** Atelier photos, fiches techniques vérifiées, certificats
- **Status:** Média à fournir — À compléter
- **Rule:** Never invent drone models, sensors, flight times, accuracy, payloads, certifications

### Projects
- **Current:** "Premières réalisations à venir"
- **Rule:** No client names, no results, no testimonials without verifiable base
- **Media:** À compléter — will be fed only with real, authorized missions

### Brand
- **Mark:** V10 FLIGHT ARC — FD + flight arc — generated via `scripts/brand-gen.mjs`
- **Files:** `public/brand/fel-drone-*.svg`, `public/favicon.svg`
- **Check:** `npm run brand:check` gates build

## Inventory Update Process
1. Replace URL builder in `src/lib/images.ts` only (single source)
2. Update alt text truthfully
3. Keep drone-only rule — verify on Pexels page that image shows real UAV/operator/workshop
4. If local hosting later, change `pexels()` helper to local path, keep same `Img` type
5. Never use manned aviation, toy drones, renders, sci-fi

## Licensing
- All current photos hotlinked from Pexels CDN under Pexels License (free commercial, no attribution required)
- See `docs/IMAGES.md` for full V8 inventory, licensing notes
- V10 adds 3 new slots (topographie, thermographie, agriculture) — same license
