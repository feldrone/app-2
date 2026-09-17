#!/usr/bin/env node
/**
 * FEL DRONE — application board renderer (identity v8 "ROTOR F").
 *
 * Regenerates docs/brand-board-v8.png: a vector composite that embeds the
 * SAME files the brand generator emits (public/brand/*.svg, public/favicon.svg)
 * by reading them at build time — the board can never drift from the identity.
 * Pipeline: every asset is rasterized by resvg (exact winding semantics,
 * same engine QA uses), then composed into a master SVG with <image> hrefs
 * and rasterized again. No fonts are required on the host beyond resvg's
 * fallback set; labels are drawn with sans-serif.
 *
 * Usage:  node scripts/brand-board.mjs   # → docs/brand-board-v8.png
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Resvg } from "@resvg/resvg-js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => fs.readFileSync(path.join(ROOT, p), "utf8");

const NAVY = "#0e1f30", PAPER = "#fbfaf8", BLACK = "#000000", SLATE = "#243b52",
  BG = "#eef0f2", PANEL = "#ffffff", GOLD = "#b4722c", LABEL = "#41546b", FOOT = "#63758c";

/** render a brand SVG file to a PNG buffer at a target pixel box */
const asset = (rel, w, h) => {
  const fit = h ? undefined : { mode: "width", value: w };
  const r = new Resvg(read(rel), { fitTo: h ? { mode: "width", value: w } : fit, background: "rgba(0,0,0,0)" });
  return Buffer.from(r.render().asPng()).toString("base64");
};
const img = (rel, x, y, w, h, b64) =>
  `<image href="data:image/png;base64,${b64 ?? asset(rel, w)}" x="${fmt(x)}" y="${fmt(y)}" width="${fmt(w)}" height="${fmt(h)}"/>`;
const fmt = (n) => Math.round(n * 100) / 100;
const rect = (x, y, w, h, fill, r = 10) => `<rect x="${fmt(x)}" y="${fmt(y)}" width="${fmt(w)}" height="${fmt(h)}" rx="${r}" fill="${fill}"/>`;
const label = (x, y, t) =>
  `<text x="${x}" y="${y}" font-family="sans-serif" font-size="15" font-weight="700" letter-spacing="1.6" fill="${LABEL}">${t}</text>`;
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

const W = 1520, M = 40, PW = W - 2 * M;
const parts = [];
let y = 0;

parts.push(rect(0, 0, W, 240, PAPER, 0));
parts.push(`<text x="${M}" y="92" font-family="sans-serif" font-size="40" font-weight="700" fill="${NAVY}">${esc("FEL DRONE — identity system v8 \u201cROTOR F\u201d")}</text>`);
parts.push(
  `<text x="${M}" y="132" font-family="sans-serif" font-size="17" fill="${LABEL}">${esc("the F letterform IS the airframe: stem 32u spar, arms terminating at their hub centers · rotors are the counters of the letter")}</text>`,
);
parts.push(
  `<text x="${M}" y="158" font-family="sans-serif" font-size="14" fill="${LABEL}">${esc("band 12u · aperture 8u — no tangency, no sliver · one weight family: mark M 32u, type 24u")}</text>`,
);
parts.push(
  `<text x="${M}" y="182" font-family="sans-serif" font-size="14" fill="${LABEL}">${esc("client-authorized integration 2026-09-14 — re-engineered, never traced · grid 4u, module 32u · one geometry source: scripts/brand-gen.mjs · brand:check gates CI AND the Vercel build")}</text>`,
);

y = 272;
parts.push(label(M, y, "PRIMARY — HORIZONTAL LOCKUP (MASTER TIER)"));
const p1y = y + 20, p1h = 340;
parts.push(rect(M, p1y, PW, p1h, PANEL));
parts.push(img("public/brand/fel-drone-lockup.svg", M + (PW - 1240) / 2, p1y + (p1h - 226) / 2, 1240, 226));

y = p1y + p1h + 56; // 668
parts.push(label(M, y, "INVERTED (NAVY GROUND)"));
parts.push(label(800, y, "STACKED (MOBILE · SIGNAGE · AVATAR PLATE)"));
const p2y = y + 20, p2h = 280;
parts.push(rect(M, p2y, 700, p2h, NAVY, 10));
parts.push(img("public/brand/fel-drone-lockup-inverse.svg", M + 40, p2y + (p2h - 113) / 2, 620, 113));
parts.push(rect(800, p2y, 680, p2h, PANEL));
parts.push(img("public/brand/fel-drone-stacked.svg", 800 + (680 - 255) / 2, p2y + 24, 255, 105));
parts.push(label(800, p2y + p2h - 26, "word baseline anchored · 16u margins hold at any print size"));

y = p2y + p2h + 56; // 948
const tileW = (PW - 3 * 16) / 4, tileX = (i) => M + i * (tileW + 16), tileH = 240;
parts.push(label(tileX(0), y, "SYMBOL — INK (PAPER GROUND)"));
parts.push(label(tileX(1), y, "SYMBOL — ACCENT (HUB JEWEL)"));
parts.push(label(tileX(2), y, "MONO BLACK (PRINT · DECAL)"));
parts.push(label(tileX(3), y, "MONO WHITE (VEHICLE · BODY)"));
const p3y = y + 20;
parts.push(rect(tileX(0), p3y, tileW, tileH, PANEL));
parts.push(rect(tileX(1), p3y, tileW, tileH, PAPER));
parts.push(rect(tileX(2), p3y, tileW, tileH, PANEL));
parts.push(rect(tileX(3), p3y, tileW, tileH, SLATE));
parts.push(img("public/brand/fel-drone-mark.svg", tileX(0) + (tileW - 150) / 2, p3y + 45, 150, 150));
parts.push(img("public/brand/fel-drone-mark-accent.svg", tileX(1) + (tileW - 150) / 2, p3y + 45, 150, 150));
parts.push(img("public/brand/fel-drone-mark-mono.svg", tileX(2) + (tileW - 150) / 2, p3y + 45, 150, 150));
const whiteMark = (() => {
  const r = new Resvg(read("public/brand/fel-drone-mark-mono.svg").replace(/#000000/g, "#ffffff"), { fitTo: { mode: "width", value: 150 } });
  return Buffer.from(r.render().asPng()).toString("base64");
})();
parts.push(img("", tileX(3) + (tileW - 150) / 2, p3y + 45, 150, 150, whiteMark));

y = p3y + tileH + 56; // 1244
parts.push(label(M, y, "MICRO TIER — VOIDs DELETED (SOLID ROTORS) · FAVICON CHIP + STANDALONE 64→16"));
const barY = y + 20, barH = 200;
parts.push(rect(M, barY, PW, barH, PANEL));
let cx = M + 44;
for (const size of [64, 48, 32, 24, 16]) {
  const cy = barY + (barH - size) / 2 - 12;
  parts.push(img("public/favicon.svg", cx, cy, size, size));
  parts.push(`<text x="${cx}" y="${barY + barH - 34}" font-family="sans-serif" font-size="15" fill="${LABEL}">${size}px</text>`);
  cx += 110;
}
const microWhite = (() => {
  const r = new Resvg(read("public/brand/fel-drone-mark-micro.svg").replace(/#000000/g, "#ffffff"), { fitTo: { mode: "width", value: 128 } });
  return Buffer.from(r.render().asPng()).toString("base64");
})();
cx = M + 5 * 110 + 20;
for (const size of [64, 48, 32, 24, 16]) {
  parts.push(
    `<g transform="translate(${cx} ${barY + (barH - size - 24) / 2})">` +
    rect(-12, -12, size + 24, size + 24, NAVY, 14) +
    `<image href="data:image/png;base64,${microWhite}" x="0" y="0" width="${size}" height="${size}"/></g>`,
  );
  cx += size + 60;
}
parts.push(`<text x="${M + 5 * 110 + 20}" y="${barY + barH - 22}" font-family="sans-serif" font-size="15" fill="${LABEL}">standalone MICRO on navy — solid rotors, nothing to pinch</text>`);

y = barY + barH + 56; // 1500
parts.push(label(M, y, "WORDMARK — “FEL DRONE”, TWO WORDS · ENGINEERED STADIUM TYPE · 48u WORD-SPACE"));
const p4y = y + 20, p4h = 190;
parts.push(rect(M, p4y, PW - 400, p4h, PANEL));
parts.push(img("public/brand/fel-drone-wordmark.svg", M + (PW - 400 - 1000) / 2, p4y + (p4h - 151) / 2, 1000, 151));
parts.push(rect(PW - 340, p4y, 340 + M, p4h, PANEL));
parts.push(img("public/brand/fel-drone-geo.svg", PW - 330, p4y + 20, 150, 150));
parts.push(`<text x="${PW - 160}" y="${p4y + 78}" font-family="sans-serif" font-size="14" fill="${LABEL}">${esc("construction sheet:")}</text><text x="${PW - 160}" y="${p4y + 98}" font-family="sans-serif" font-size="14" fill="${LABEL}">${esc("4u grid · M 32 · rotor")}<tspan font-weight="700">⌀</tspan>${esc("64/48")}</text><text x="${PW - 160}" y="${p4y + 118}" font-family="sans-serif" font-size="14" fill="${LABEL}">${esc("band 12u · aperture 8u")}</text>`);

y = p4y + p4h + 40; // 1730
parts.push(`<text x="${M}" y="${y}" font-family="sans-serif" font-size="13" fill="${FOOT}">${esc("scripts/brand-board.mjs ← scripts/brand-gen.mjs output · identity v8 · 2026-09 · reference board preserved at docs/brand-board.png")}</text>`);
parts.push(`<text x="${W - M}" y="${y}" text-anchor="end" font-family="sans-serif" font-size="13" fill="${FOOT}">${esc("SARL FEL DRONE — El Tarf, Algérie")}</text>`);

const H = y + 60;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
${rect(0, 0, W, H, BG, 0)}
${parts.join("\n")}
</svg>`;
const out = new Resvg(svg, { background: BG }).render().asPng();
fs.writeFileSync(path.join(ROOT, "docs/brand-board-v8.png"), out);
console.log(`docs/brand-board-v8.png — ${W}×${H}, ${out.length} bytes`);
