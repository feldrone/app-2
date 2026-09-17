# FEL DRONE — Identity system

**v12 "C2 STADIUM-D"** (human-approved final) — **ONE outline**. A hard-edged
**D plate** — straight left wall, r30 right shoulder, 45° sheared tail — whose own
structure is the **F**. The stem is the plate's left wall (28u), the top band is
the F's upper bar, and the mid band ends in an exact r14 semicircle: the **rotor
pod**. The F and the D share the same geometry and the same negative space — the
D is never drawn beside the F and the F is never placed inside a letter. Read as
aviation, the sheared tail is a rotor arm and the free-ended mid boom is a boom
with its motor housing; read as identity, it is a corporate **F + D** monogram
that survives every size and every substrate. Under it, **FEL DRONE** set in
**Lexend 700**.

One geometry source — `scripts/brand-gen.mjs` — emits every brand file and the
React lockup data; nothing downstream is hand-drawn. `npm run brand:check`
gates CI and the Vercel build command: if a committed asset drifts from the
generator, the build fails.

> History: **v8 "ROTOR F"** remains as recovery point `f5b29cc`, **v10 "FLIGHT
> ARC"** is the original production identity (commit `5283f627`) and **v11
> "QUAD FD"** is the identity v12 replaced — the v12 symbol is the approved
> reference re-cut, not a new direction. `docs/brand-board-v8.png` is the v8
> board and is kept as a record. None of them is modified by v12 work; the
> **wordmark and its metrics are frozen** (see below).

---

## The symbol — construction v12 "C2 STADIUM-D" (canvas 160×160, 2u half-step)

Ink box **x 12..148 / y 4..144**, optical centre **(80, 74)**. Every coordinate
and radius is an even number (strict 2u grid). One non-overlapping outer outline
plus one nested counter — no stacked subpaths, no overlaid discs.

| Part | Geometry | Reads as |
|------|----------|----------|
| Outer plate | `M12 4H118A30 30 0 0 1 148 34V114A30 30 0 0 1 118 144H40L12 116Z` — straight left wall, r30 right shoulder, 45° sheared tail | D body / airframe plate |
| D counter | `M40 32H106A12 12 0 0 1 118 44V104A12 12 0 0 1 106 116H40Z` — x 40..118, y 32..116, r12 corners | D aperture (the negative space that makes the D) |
| Stem | x 12..40 (28u) — the plate's left wall | F stem / fuselage |
| Top band | y 32..60 across the plate | F upper bar |
| Mid band + rotor pod | y 60..88, ending in an exact **r14 semicircle** at (78, 74) | F mid bar / boom with motor housing |
| Tail | 45° shear from (40, 116) to (12, 116) | rotor arm / tail fin |

**One material language.** The stem is **28u**; Lexend 700 at cap 110 draws a
**26.7u** stroke, so symbol and wordmark agree within **1.3u** — the lockup reads
as one object rather than a mark parked next to a logotype.

**Optical corrections (deliberate, not arithmetic).**
- The stem, top wall and bottom wall are **28u**; the right D wall is **30u** —
  kept as approved (it is *not* normalised to 28u).
- The rotor pod is an **exact semicircle** tangent to the mid band's edges: no
  shoulder, no step, no accidental tangency.
- The mid bar is a **free-ended peninsula** inside the aperture, so the F keeps a
  visible step and the D keeps a continuous counter.
- The tail is **sheared**, not square, so the mass never sits on a heavy bar.

**Negative space.** The aperture is the D; the bands and the free-ended boom
inside it are the F. Removing the aviation reading entirely still leaves an
unmistakable F inside an unmistakable D.

**Monochrome.** One flat ink; no strokes, no gradients, no 3D, no shadows. The
drawing is complete in solid `#0e1f30`, in pure black (equipment marking) and
reversed in `#fbfaf8` (vehicles, dark UI).

## Tiers

| Tier | Size | Drawing |
|------|------|---------|
| MASTER | ≥ 40 px | Full emblem + wordmark (header, footer, documents) |
| COMPACT | 24–40 px | Emblem alone |
| MICRO | 16–32 px | **The same drawing.** C2 has no sub-pixel taper and no hairline detail (smallest feature: the r12 counter corner, 1.2 px at 16 px), so the micro asset is the master geometry — the F step and the D aperture both survive the true 16 px raster |

`public/favicon.svg` and `public/brand/fel-drone-favicon*.svg` are the MICRO
drawing on a 64u chip (radius 12, inset 8) — ink on navy for the default, and
mono/inverse builds for print and vehicles.

## Wordmark — "FEL DRONE" in Lexend 700

Two builds of the same wordmark, one identity — both **Lexend 700**, cap **110u**:

1. **Site (production UI)** — typeset live in **Lexend 700**, loaded self-hosted
   from `@fontsource/lexend` (latin subset, imported once in `src/main.tsx`) and
   exposed as `--font-wordmark`. Metrics come from `src/brand/brandmark.ts → type`:
   the measured Lexend advance for a 110u cap (size 157.14, Lexend cap ratio 0.700).

   | Token | Value |
   |-------|-------|
   | cap height | 110u |
   | size | 157.14u (Lexend cap ratio 0.700) |
   | "FEL" advance | 294u |
   | "DRONE" advance | 587u |
   | word space | 50u — Lexend's own space at this size (the name is never fused) |
   | total | 931u |

   Each word is set as its own `<text>` with `textLength` fixed to those
   advances (`lengthAdjust="spacing"`): only inter-glyph spacing can ever adjust,
   and because the values *are* the natural Lexend advances nothing is stretched
   — the guard exists so the two words can never collide or fuse. No CSS
   transform, no condensing, no synthetic bold, no glyph scaling.

2. **Assets (exported SVGs)** — the **real Lexend 700 outlines**, extracted from
   the released font (fontsource v5.3.0, latin) at cap 110 and frozen in the
   generator. Self-contained: usable in print and in any tool without webfonts,
   with no distortion and no font dependency at build time.

**Why Lexend 700** — geometric, technical, wide, thick-stroked, with squared
terminals and compact counters; cap ratio 0.700 matches the previous system's
baseline maths, and at cap 110 its 26.7u stroke sits within 1.3u of the mark's
28u stem. The rest of the site's typography is untouched: it stays on the frozen
IBM Plex superfamily (`docs/I18N.md`), and Lexend is used **only** for the
wordmark.

## Lockups

| Lockup | Canvas | Law |
|--------|--------|-----|
| HORIZONTAL | 1157×176 | mark 160u at inset 16, **60u optical (ink) gap** mark→F, baseline 145 aligns the plate's optical centre (y 90) with the cap centre |
| STACKED (mobile) | 964×326 | mark centred (x 402), 40u air below the mark ink, baseline 310 |

`src/components/Logo.tsx` renders both from `BRAND` data — the mark path and the
typeset wordmark — so the header and footer are always the same drawing. The
lockup `<svg>` carries `direction: ltr` on purpose: the brand mark is Latin and
must not reorder inside the Arabic RTL layout.

## Colour

Ink **`#0e1f30`** (the site's deepest aviation navy — the logo colour on light
backgrounds), paper `#fbfaf8`, inverse `#fbfaf8` on navy grounds, mono black /
white for print and vehicle use, accent `#b4722c` reserved for the geometry
overlay only. No new brand colour was introduced in v11.

## Typography

- **UI / display:** IBM Plex Sans (400–700) + IBM Plex Sans Arabic — one
  superfamily, see `docs/I18N.md`.
- **Wordmark:** the same family at weight 700 — the brand's own voice. The body
  typography is not changed by the wordmark decision.

## Files

`public/brand/`: `fel-drone-{mark, mark-mono, mark-accent, lockup,
lockup-inverse, lockup-accent, stacked, stacked-inverse, wordmark, favicon,
favicon-mono, favicon-inverse, favicon-32, favicon-32-mono, mark-micro,
geo}.svg` + `public/favicon.svg` — all generated, all with a do-not-edit banner.

Regenerate after any geometry change:

```bash
npm run brand:gen    # writes every asset + src/brand/brandmark.ts
npm run brand:check  # fails if the committed files are out of sync
```

## Usage rules v11

1. Never redraw, never outline, never add effects, shadows or gradients. Scale the file.
2. Clear space = 16u on all sides. Do not crop the rotor blades.
3. Do not mirror the lockup, in any language, ever.
4. Below 40 px use the COMPACT/MICRO drawing instead of shrinking the blades.
5. Wordmark is "FEL DRONE" — two words. Never "FELDRONE".
6. Do not substitute another typeface for the wordmark and do not fake it with
   transforms: change `BRAND.type` in the generator instead.
7. Mono builds for vehicles, plates and embroidery; inverse for navy grounds.
8. The site renders the logo in `#0e1f30` on light grounds and `#fbfaf8` on
   navy — never a decorative colour.
