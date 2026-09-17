#!/usr/bin/env node
/**
 * ============================================================================
 * FEL DRONE · BRAND GENERATOR v12 — "C2 STADIUM-D" · the F IS the negative space
 * ============================================================================
 * V12 direction (approved final, human-selected): ONE outline. A hard-edged D
 * plate — straight left wall, rounded right shoulder, 45° sheared tail — whose
 * interior carries the F: the stem is the plate's own left wall (28u), the two
 * bars are the plate's interior bands, and the mid bar ends in an exact
 * semicircular rotor pod. The D is never drawn beside the F and the F is never
 * placed inside a letter: both read from the SAME geometry and the SAME
 * negative space. Read as aviation, the sheared tail is a rotor arm and the
 * free-ended mid boom is a boom with its motor housing; read as identity, it is
 * a corporate F + D monogram. One connected ink mass.
 *
 * GRID — 160×160 mark canvas, 2u half-step (every coordinate and radius even).
 *   Ink box x 12..148 / y 4..144, optical centre (80, 74):
 *   - Outer plate .... x 12..148, y 4..144, right shoulder r30, 45° sheared
 *                      tail from (40,116) to (12,116)
 *   - D counter ...... x 40..118, y 32..116, corner r12 — the plate's wall is a
 *                      uniform 30u on the right; the left wall 28u is the F stem
 *   - F bars ......... top bar x 40..118 y 32..60; stem x 12..40 (28u-wide:
 *                      the same stroke weight as the wordmark, within 1.3u)
 *   - Rotor boom ..... mid bar x 40..92 y 60..88, ending in an exact r14
 *                      semicircle at (78,74) — tangent-continuous, no tangency
 *
 * MICRO (16–32 px): identical to the master drawing. C2 has no sub-pixel taper
 *   and no micro detail, so there is nothing to simplify — the small-size asset
 *   is the same geometry and the raster keeps the F step and the D aperture.
 *
 * WORDMARK — "FEL DRONE" set in Lexend 700 (approved typeface), cap 110.
 *   The exported SVG assets carry REAL Lexend outlines (extracted from Lexend
 *   700, fontsource v5.3.0, latin), so every asset stays a self-contained
 *   vector: no font dependency, no distortion, no synthetic bold, no tracking
 *   hacks. The website typesets the same wordmark live in Lexend 700 at the
 *   same cap height and the same 50u word space (src/components/Logo.tsx).
 * ============================================================================
 */
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");

/* ------------------------------ ink & accent ------------------------------ */
const INK = { navy: "#0e1f30", paper: "#fbfaf8", black: "#000000", white: "#ffffff" };
const ACCENT = "#b4722c";

/* mark canvas — 160 × 160, unit 2u */
const MARK_W = 160;
const MARK_H = 160;

const fmt = (n) => (Number.isInteger(n) ? String(n) : n.toFixed(2));

/* --------------------- MARK — one outline, F + D + rotor ------------------- */
/**
 * "C2 STADIUM-D" — the approved symbol. One non-overlapping outer outline plus
 * one nested counter; both the F and the D are read from the same shape.
 *
 *   OUTER   M12 4 H118 A30 30 → (148,34) V114, A30 30 → (118,144) H40 L12 116 Z
 *   COUNTER M40 32 H106 A12 12 → (118,44) V104, A12 12 → (106,116) H40 Z
 *   BOOM    M40 60 H78 A14 14 → (78,88) H40 Z      (exact semicircle, tangent)
 *
 * Everything is a 2u multiple; radii 30 / 12 / 14 are the three radii the mark
 * uses, and no disc is ever overlaid (an overlaid disc would cancel to white
 * under the even-odd aperture).
 */
const OUTER = "M12 4H118A30 30 0 0 1 148 34V114A30 30 0 0 1 118 144H40L12 116Z";
const COUNTER = "M40 32H106A12 12 0 0 1 118 44V104A12 12 0 0 1 106 116H40Z";
const BOOM = "M40 60H78A14 14 0 0 1 78 88H40Z";
const MARK_D = OUTER + COUNTER + BOOM;

/**
 * MICRO (16–32 px): the SAME drawing. C2's smallest detail is the r12 counter
 * corner (1.2 px at 16 px, still present in the raster) and the r14 pod — there
 * is no taper or hairline to simplify, so the micro asset is the master.
 */
const MICRO_D = MARK_D;

/* ------------------------------ wordmark — Lexend 700, cap 110 ------------ */
/**
 * Real Lexend 700 outlines at cap 110 (Lexend: upm 1000, cap 700). Extracted
 * once from the font and frozen here, so `npm run brand:gen` is deterministic
 * and needs no font tooling. NOTE: these paths are the typeface itself — never
 * re-cut, never condensed, never stretched. `Lexend cap 110` keeps the mark's
 * 28u stroke and the wordmark's 26.7u stem within 1.3u of each other.
 */
const LEX_FEL = "M13.83 0V-110H40.54V0ZM26.24 -42.11V-64.43H83.13V-42.11ZM26.24 -86.43V-110H89.57V-86.43ZM110.94 0V-110H187.63V-87.21H136.87V-22.79H189.2V0ZM123.51 -45.1V-66.79H180.56V-45.1ZM212.3 0V-110H239.01V-23.57H288.04V0Z";
const LEX_DRONE = "M13.83 0V-110H59.87Q71.97 -110 82.03 -105.99Q92.09 -101.99 99.39 -94.6Q106.7 -87.21 110.63 -77.16Q114.56 -67.1 114.56 -55Q114.56 -42.9 110.63 -32.76Q106.7 -22.63 99.39 -15.32Q92.09 -8.01 82.03 -4.01Q71.97 0 59.87 0ZM40.54 -18.23 36.93 -23.57H59.09Q65.69 -23.57 70.87 -25.85Q76.06 -28.13 79.75 -32.21Q83.44 -36.3 85.49 -42.11Q87.53 -47.93 87.53 -55Q87.53 -62.07 85.49 -67.89Q83.44 -73.7 79.75 -77.79Q76.06 -81.87 70.87 -84.15Q65.69 -86.43 59.09 -86.43H36.46L40.54 -91.46ZM135.14 0V-110H184.64Q195.17 -110 203.74 -105.44Q212.3 -100.89 217.17 -92.95Q222.04 -85.01 222.04 -74.96Q222.04 -64.59 217.17 -56.34Q212.3 -48.09 203.81 -43.37Q195.33 -38.66 184.64 -38.66H160.6V0ZM196.11 0 168.14 -49.66 195.49 -53.59 226.6 0ZM160.6 -59.09H182.29Q186.37 -59.09 189.44 -60.89Q192.5 -62.7 194.15 -66Q195.8 -69.3 195.8 -73.54Q195.8 -77.79 193.91 -81.01Q192.03 -84.23 188.49 -85.96Q184.96 -87.69 179.93 -87.69H160.6ZM295.59 1.57Q283.01 1.57 272.64 -2.67Q262.27 -6.91 254.57 -14.61Q246.87 -22.31 242.63 -32.69Q238.39 -43.06 238.39 -55.47Q238.39 -67.89 242.63 -78.26Q246.87 -88.63 254.57 -96.33Q262.27 -104.03 272.64 -108.27Q283.01 -112.51 295.43 -112.51Q307.84 -112.51 318.21 -108.27Q328.59 -104.03 336.29 -96.33Q343.99 -88.63 348.15 -78.26Q352.31 -67.89 352.31 -55.47Q352.31 -43.21 348.15 -32.76Q343.99 -22.31 336.29 -14.61Q328.59 -6.91 318.21 -2.67Q307.84 1.57 295.59 1.57ZM295.43 -23.57Q301.87 -23.57 307.29 -25.93Q312.71 -28.29 316.72 -32.61Q320.73 -36.93 322.93 -42.74Q325.13 -48.56 325.13 -55.47Q325.13 -62.39 322.93 -68.2Q320.73 -74.01 316.72 -78.34Q312.71 -82.66 307.29 -85.01Q301.87 -87.37 295.43 -87.37Q288.99 -87.37 283.56 -85.01Q278.14 -82.66 274.06 -78.34Q269.97 -74.01 267.85 -68.2Q265.73 -62.39 265.73 -55.47Q265.73 -48.56 267.85 -42.66Q269.97 -36.77 274.06 -32.53Q278.14 -28.29 283.56 -25.93Q288.99 -23.57 295.43 -23.57ZM373.06 0V-110H396.94L454.61 -31.43L449.43 -32.21Q448.64 -37.4 448.17 -42.11Q447.7 -46.83 447.31 -51.39Q446.91 -55.94 446.68 -60.66Q446.44 -65.37 446.36 -70.87Q446.29 -76.37 446.29 -82.81V-110H472.21V0H448.01L387.83 -81.09L395.84 -79.99Q396.63 -72.44 397.18 -67.18Q397.73 -61.91 398.12 -57.83Q398.51 -53.74 398.67 -50.44Q398.83 -47.14 398.91 -43.92Q398.99 -40.7 398.99 -36.77V0ZM499.87 0V-110H576.56V-87.21H525.8V-22.79H578.13V0ZM512.44 -45.1V-66.79H569.49V-45.1Z";
const CAP = 110;
const FEL_W = 294;      // Lexend 700 advances at cap 110: F 97.12 + E 101.36 + L 95.70
const WORD_SPACE = 50;  // Lexend space advance at cap 110 (50.29), rounded to the grid
const DRONE_W = 587;    // D 121.31 + R 110.31 + O 127.60 + N 126.81 + E 101.36
const WORD_W = FEL_W + WORD_SPACE + DRONE_W; // 931
const LEX_STEM = 170 * (CAP / 700);          // 26.71u — the wordmark's ink weight

/* Both words as <path> elements; the wordmark is always filled nonzero. */
const wordPaths = (x0) =>
  `<path transform="translate(${fmt(x0)} 0)" d="${LEX_FEL}"/>` +
  `<path transform="translate(${fmt(x0 + FEL_W + WORD_SPACE)} 0)" d="${LEX_DRONE}"/>`;
const wordPath = (x0) => LEX_FEL + LEX_DRONE; // combined "d" for consumers that want one path

/* ------------------------------ lockups ------------------------------------ */
/**
 * The lockup is measured from the MARK'S INK, not from its box: the mark's ink
 * runs x12..148 / y4..144 inside the 160 box, so the plate's optical centre
 * (80, 74) is what aligns with the wordmark's cap centre. Numbers:
 *   · mark box at (16, 16) → ink x28..164 in lockup space
 *   · optical (ink) gap mark→F = 60u → F origin x210 (F left side bearing 13.8u)
 *   · cap centre = mark ink centre → baseline = 16 + 74 + 55 = 145
 *   · box height 176 = 16 + 160 box, leaving 20u above / 16u below the ink
 */
const EDGE = 16;
const LOCKUP_H = 176;
const wordX = 210;
const W_TOTAL = wordX + WORD_W + EDGE;   // 1157
const SITE_W_TOTAL = wordX + WORD_W + EDGE;
const markInkCentre = EDGE + 74;         // 90 — plate optical centre in lockup space
const baseline = markInkCentre + CAP / 2; // 145

const STACK_W = 964;
const STACK_H = 326;
const stackMarkX = 402;                  // 964 box − 160 mark box, centred
const stackWordX = EDGE;
const stackBaseline = STACK_H - EDGE; // 310 — 16u bottom padding under the cap

/* The wordmark is a normal nonzero fill: its glyphs overlap freely, and it is placed
   inside the mark's even-odd group, so it MUST carry its own rule or the overlaps
   would cancel to white (the exported-asset defect found in the approval sheet). */
const atBaseline = (yBase, d) => `<g transform="translate(0 ${fmt(yBase)})" fill-rule="nonzero">${d}</g>`;
/* The C2 mark is ONE outline plus a nested counter that must SUBTRACT: under
   the default nonzero rule both subpaths wind the same way, so the aperture
   would fill solid. Even-odd is the rule the approved drawing is authored for
   (the wordmark stays nonzero — its counters are wound the other way). */
const mark = (ink, extra = "", tx = 0, ty = 0) =>
  `<g fill="${ink}" fill-rule="evenodd">` +
  (tx || ty ? `<g transform="translate(${fmt(tx)} ${fmt(ty)})"><path d="${MARK_D}"/></g>` : `<path d="${MARK_D}"/>`) +
  `${extra}</g>`;

/* ------------------------------ favicon chip ------------------------------- */
// The micro drawing is fitted into the chip's 48u inner box (inset 8) by width.
const FAV = { box: 64, r: 12, inset: 8 };
const microScale = 44 / MARK_W; // 44u of the 48u inner box — optical breathing room
const microH = MARK_H * microScale;
const microX = FAV.inset + (48 - MARK_W * microScale) / 2;
const microY = FAV.inset + (48 - microH) / 2;

const fav = (a, b) =>
  `<rect x="0" y="0" width="64" height="64" rx="${FAV.r}" fill="${a}"/>` +
  `<g transform="translate(${fmt(microX)} ${fmt(microY)}) scale(${fmt(microScale)})" fill="${b}" fill-rule="evenodd"><path d="${MICRO_D}"/></g>`;

const geoSvg =
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${MARK_W} ${MARK_H}"><style>:root{--ink:${INK.navy}}svg{background:${INK.paper}}</style>` +
  `<g fill="none" stroke="${ACCENT}" stroke-width=".35" stroke-dasharray="1.6 2.4" opacity=".5">` +
  Array.from({ length: MARK_H / 4 + 1 }, (_, i) => `<path d="M${i * 4} 0V${MARK_H}"/>`).join("") +
  Array.from({ length: MARK_W / 4 + 1 }, (_, i) => `<path d="M0 ${i * 4}H${MARK_W}"/>`).join("") +
  `</g>` +
  `<g fill="none" stroke="${ACCENT}" stroke-width=".6" opacity=".8">` +
  `<path d="M12 0V${MARK_H}M40 0V${MARK_H}M0 4H${MARK_W}M0 32H${MARK_W}M0 60H${MARK_W}M0 88H${MARK_W}M0 116H${MARK_W}M0 144H${MARK_W}M118 0V${MARK_H}M148 0V${MARK_H}"/>` +
  `<circle cx="118" cy="34" r="30"/><circle cx="118" cy="114" r="30"/>` +
  `<circle cx="118" cy="44" r="12"/><circle cx="118" cy="104" r="12"/>` +
  `<circle cx="78" cy="74" r="14"/>` +
  `</g>` +
  mark(INK.navy) +
  `<text x="4" y="${MARK_H - 4}" font-family="Arial" font-size="7" font-weight="700" letter-spacing=".1em" fill="${ACCENT}" opacity=".85">FEL DRONE GEOMETRY v12 · C2 STADIUM-D · 2u GRID · MARK 160×160</text>` +
  `</svg>`;

const FILES = {
  "public/brand/fel-drone-mark.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${MARK_W} ${MARK_H}"><style>:root{--ink:${INK.navy}}svg{background:${INK.paper}}</style>${mark("var(--ink)")}</svg>`,
  "public/brand/fel-drone-mark-mono.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${MARK_W} ${MARK_H}">${mark(INK.black)}</svg>`,
  "public/brand/fel-drone-mark-accent.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${MARK_W} ${MARK_H}">${mark(INK.black)}</svg>`,
  "public/brand/fel-drone-lockup.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W_TOTAL} ${LOCKUP_H}">${mark(INK.black, atBaseline(baseline, wordPaths(wordX)), EDGE, EDGE)}</svg>`,
  "public/brand/fel-drone-lockup-inverse.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W_TOTAL} ${LOCKUP_H}"><rect width="${W_TOTAL}" height="${LOCKUP_H}" fill="${INK.navy}"/>${mark(INK.white, atBaseline(baseline, wordPaths(wordX)), EDGE, EDGE)}</svg>`,
  "public/brand/fel-drone-lockup-accent.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W_TOTAL} ${LOCKUP_H}">${mark(INK.black, atBaseline(baseline, wordPaths(wordX)), EDGE, EDGE)}</svg>`,
  "public/brand/fel-drone-stacked.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${STACK_W} ${STACK_H}">${mark(INK.black, atBaseline(stackBaseline, wordPaths(stackWordX)), stackMarkX, EDGE)}</svg>`,
  "public/brand/fel-drone-stacked-inverse.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${STACK_W} ${STACK_H}"><rect width="${STACK_W}" height="${STACK_H}" fill="${INK.navy}"/>${mark(INK.white, atBaseline(stackBaseline, wordPaths(stackWordX)), stackMarkX, EDGE)}</svg>`,
  "public/brand/fel-drone-wordmark.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WORD_W} ${CAP}"><g fill="${INK.black}" fill-rule="nonzero"><g transform="translate(0 ${CAP})">${wordPaths(0)}</g></g></svg>`,
  "public/brand/fel-drone-favicon.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">` + fav(INK.navy, INK.paper) + `</svg>`,
  "public/favicon.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">` + fav(INK.navy, INK.paper) + `</svg>`,
  "public/brand/fel-drone-favicon-mono.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">` + fav(INK.white, INK.black) + `</svg>`,
  "public/brand/fel-drone-favicon-inverse.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">` + fav(INK.black, INK.white) + `</svg>`,
  "public/brand/fel-drone-favicon-32.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">` + fav(INK.navy, INK.paper) + `</svg>`,
  "public/brand/fel-drone-favicon-32-mono.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">` + fav(INK.white, INK.black) + `</svg>`,
  "public/brand/fel-drone-mark-micro.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${MARK_W} ${MARK_H}"><path fill="${INK.black}" fill-rule="evenodd" d="${MICRO_D}"/></svg>`,
  "public/brand/fel-drone-geo.svg": geoSvg,
};

const BRAND_TS = `/** GENERATED by scripts/brand-gen.mjs — do NOT hand-edit.
 *  V12 "C2 STADIUM-D" — the approved final symbol. ONE outline: the F and the D
 *  share the same geometry and the same negative space.
 *  Mark (160×160, 2u half-step, ink x12..148 / y4..144, optical centre 80,74):
 *  the D plate — straight left wall, r30 right shoulder, 45° sheared tail — with
 *  a nested counter x40..118 / y32..116 (r12 corners, uniform 30u right wall).
 *  The F is that plate's own structure: the 28u stem is the left wall, the top
 *  band is the upper bar, and the mid bar ends in an exact r14 semicircle
 *  (the rotor pod). MICRO: the same drawing — nothing to simplify at 16 px.
 *  Wordmark: FEL DRONE in Lexend 700 outlines, cap ${CAP}, ${WORD_SPACE}u word space
 *  (natural Lexend advances: FEL ${FEL_W}, DRONE ${DRONE_W}, total ${WORD_W}).
 */export const BRAND = {
  mark: ${JSON.stringify(MARK_D)},
  micro: ${JSON.stringify(MICRO_D)},
  word: ${JSON.stringify(wordPath(0))},
  lockup: { w: ${SITE_W_TOTAL}, h: ${LOCKUP_H}, markX: ${EDGE}, markY: ${EDGE}, wordX: ${wordX}, baseline: ${baseline} },
  stacked: { w: ${STACK_W}, h: ${STACK_H}, markX: ${stackMarkX}, markY: ${EDGE}, wordX: ${stackWordX}, baseline: ${stackBaseline} },
  /** Typesetting of the site wordmark — Lexend 700, cap ${CAP}, ${WORD_SPACE}u word space */
  type: { size: ${(CAP / 0.7).toFixed(2)}, capRatio: 0.7, cap: ${CAP}, fel: ${FEL_W}, drone: ${DRONE_W}, wordSpace: ${WORD_SPACE}, width: ${WORD_W}, felX: ${wordX}, droneX: ${wordX + FEL_W + WORD_SPACE}, stackFelX: ${stackWordX}, stackDroneX: ${stackWordX + FEL_W + WORD_SPACE} },
  favicon: { box: ${FAV.box}, r: ${FAV.r}, inset: ${FAV.inset}, microScale: ${fmt(microScale)} },
  cap: ${CAP},
  colors: { light: "${INK.navy}", dark: "${INK.paper}", monoBlack: "${INK.black}", monoWhite: "${INK.white}", accent: "${ACCENT}" },
  box: { w: ${MARK_W}, h: ${MARK_H} },
} as const;

export type BrandLockup = {
  w: number; h: number; wordX: number; baseline: number; markX: number; markY: number;
};
`;

let checked = 0, written = 0;
for (const [rel, body] of Object.entries(FILES)) {
  const doc = `<!-- FEL DRONE — GENERATED by scripts/brand-gen.mjs — do NOT hand-edit brand SVGs.\n     Run \`npm run brand:gen\` after changing geometry. -->\n` + body + `\n`;
  const file = path.join(root, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  checked++;
  if (fs.existsSync(file) && fs.readFileSync(file, "utf8") === doc) continue;
  fs.writeFileSync(file, doc);
  written++;
}
fs.writeFileSync(path.join(root, "src/brand/brandmark.ts"), BRAND_TS);
console.log(`brand files checked: ${checked}, updated: ${written}, brandmark.ts regenerated`);

/* --------------------------------- checks --------------------------------- */
const problems = [];

// 1. Path syntax — only the drawing commands this system uses
const invalid = MARK_D.match(/[^MHLVAZ,\s\w.-]/g);
if (invalid) problems.push(`MARK_D contains invalid path chars: ${invalid.join("")}`);

// 2. Grid law — 2u half-step throughout (every coordinate and radius is even)
for (const m of MARK_D.matchAll(/[MHVL](-?\d+(?:\.\d+)?)(?:\s+(-?\d+(?:\.\d+)?))?/g)) {
  for (const n of [m[1], m[2]].filter((x) => x !== undefined)) {
    if (Number(n) % 2 !== 0) problems.push(`grid: ${n} is off the 2u half-step`);
  }
}
for (const m of MARK_D.matchAll(/A(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)/g)) {
  for (const n of [m[1], m[2]]) {
    if (Number(n) % 2 !== 0) problems.push(`grid: radius ${n} is off the 2u half-step`);
  }
}

// 3. The approved C2 drawing is frozen — outline, counter, boom, and nothing else
if (!MARK_D.startsWith(OUTER)) problems.push("symbol: the approved C2 outer outline must come first");
if (!MARK_D.includes(COUNTER)) problems.push("symbol: the D counter must be the approved C2 counter");
if (!MARK_D.includes(BOOM)) problems.push("symbol: the mid bar must end in the approved r14 rotor pod");
if ((MARK_D.match(/A30 30 0 0 1/g) ?? []).length !== 2)
  problems.push("symbol: the plate's right shoulder must be two A30 30 arcs (r30)");
if ((MARK_D.match(/A12 12 0 0 1/g) ?? []).length !== 2)
  problems.push("symbol: the counter corners must be two A12 12 arcs (r12)");
if ((MARK_D.match(/A14 14 0 0 1/g) ?? []).length !== 1)
  problems.push("symbol: the rotor pod must be exactly one r14 semicircle");
if (/A26 26|A24 24|A16 16|A18 18/.test(MARK_D))
  problems.push("symbol: superseded pod discs (POD-F A26/A24, hub A16/A18) must not return");
if (/[QCST]/.test(MARK_D)) problems.push("symbol: curves and diagonals must be arcs and lines only");

// 4. Structural law — one connected mass, stem, walls, sheared tail
const STEM_W = 40 - 12;
if (STEM_W !== 28) problems.push(`symbol: the stem must be 28u wide (is ${STEM_W}u)`);
if (Math.abs(STEM_W - LEX_STEM) > 2)
  problems.push(`symbol: stem ${STEM_W}u and wordmark ink weight ${LEX_STEM.toFixed(2)}u must stay within 2u`);
if (!OUTER.includes("H40L12 116Z")) problems.push("symbol: the tail must be the approved 45° shear");
if (32 - 4 !== 28 || 144 - 116 !== 28) problems.push("symbol: top and bottom plate walls must be 28u");
if (148 - 118 !== 30)
  problems.push("symbol: the approved 30u right D wall must NOT be normalised to 28u");
if (116 - 32 !== 84) problems.push("symbol: the D counter must stay 84u tall");
if (!(60 < 88 && 32 < 60)) problems.push("symbol: the three F bands must stay distinct");
if (78 - 14 !== 64 || 88 - 60 !== 28)
  problems.push("symbol: the rotor pod must sit tangent inside the mid band");

// 5. MICRO is the same drawing (C2 has no sub-pixel detail to simplify)
if (MICRO_D !== MARK_D) problems.push("MICRO must be the same approved C2 drawing");

// 6. Wordmark law — Lexend 700 outlines, cap 110, natural advances, no distortion
if (!LEX_FEL.startsWith("M") || !LEX_DRONE.startsWith("M"))
  problems.push("wordmark: Lexend outlines are missing");
if (/scale\(|matrix\(|skewX/.test(wordPaths(0)))
  problems.push("wordmark: glyphs must never be scaled or skewed (no synthetic distortion)");
if (CAP !== 110) problems.push(`wordmark cap must be 110 (is ${CAP})`);
if (FEL_W + WORD_SPACE + DRONE_W !== WORD_W) problems.push("wordmark advances must sum to the wordmark width");
if (WORD_SPACE < 40 || WORD_SPACE > 60) problems.push("the word-space FEL|DRONE must stay a natural Lexend space");
if (Math.abs((CAP / 0.7) * 0.7 - CAP) > 0.05) problems.push("site wordmark must render a 110u cap height (Lexend cap ratio 0.700)");
if (W_TOTAL !== 1157) problems.push(`lockup width changed: ${W_TOTAL} (expected 1157)`);
if (STACK_W !== 964 || STACK_H !== 326) problems.push(`stacked asset lockup changed: ${STACK_W}×${STACK_H}`);
if (SITE_W_TOTAL !== 1157) problems.push(`site lockup width changed: ${SITE_W_TOTAL} (expected 1157)`);
if (Math.abs(baseline - (EDGE + 74 + CAP / 2)) > 0.001)
  problems.push("lockup baseline must align the plate's optical centre with the cap centre");

// 7. The mark is an even-odd aperture (one outline + nested counter)
if (!mark("x").includes('fill-rule="evenodd"'))
  problems.push("mark: the symbol must be filled even-odd or the D aperture fills solid");
if (!fav("a", "b").includes('fill-rule="evenodd"'))
  problems.push("favicon: the micro mark must be filled even-odd");
if (!FILES["public/brand/fel-drone-mark-micro.svg"].includes('fill-rule="evenodd"'))
  problems.push("mark-micro: the micro mark must be filled even-odd");
if (!wordPaths(0).includes("M") || wordPaths(0).includes("fill-rule"))
  problems.push("wordmark: wordmark paths must stay free of fill-rule overrides");
// The Lexend outlines are drawn y-up (baseline 0, ink at negative y): every export
// must translate the baseline into its own coordinate space or it renders blank.
if (!FILES["public/brand/fel-drone-wordmark.svg"].includes(`translate(0 ${CAP})`))
  problems.push("wordmark asset: the baseline must be placed at y=CAP or the glyphs fall outside the viewBox");
for (const [rel, body] of Object.entries(FILES)) {
  if (!/lockup|stacked/.test(rel)) continue;
  // the lockup wraps the mark in one even-odd group; the wordmark sits inside it and
  // MUST restate its own non-zero rule, or overlapping Lexend strokes cancel to white.
  if (!/<g fill="#[0-9a-f]{6}" fill-rule="evenodd">/.test(body))
    problems.push(`${rel}: the mark group must stay even-odd (nested counter)`);
  if (!/<g transform="translate\(0 \d+(?:\.\d+)?\)" fill-rule="nonzero">/.test(body))
    problems.push(`${rel}: the exported wordmark group must carry fill-rule="nonzero" (even-odd would cancel overlapping strokes)`);
}

// 8. Editorial guard kept from V10
if (fs.readFileSync(path.join(root, "src/components/LegalNotice.tsx"), "utf8").includes("FELDRONE"))
  problems.push("Legal notice: the one-word FELDRONE spelling must not return");

if (problems.length) {
  console.error("brand geometry check FAILED:", problems);
  process.exit(1);
}
if (process.argv.includes("--check") && written > 0) {
  console.error("brand files are OUT OF SYNC with scripts/brand-gen.mjs — run `npm run brand:gen`.");
  process.exit(1);
}
