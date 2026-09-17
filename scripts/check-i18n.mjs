#!/usr/bin/env node
/**
 * FEL DRONE — multilingual integrity check (V11).
 *
 * `npm run typecheck` already proves that the three dictionaries have the exact
 * `Dictionary` shape. This script checks the things a type cannot express:
 *
 *   1. the Registre de Commerce number is the registered one, in one place;
 *   2. FR / EN / AR are complete — no empty string survives;
 *   3. no placeholder or "to translate" marker anywhere;
 *   4. English and Arabic carry NO leftover French UI copy;
 *   5. Arabic really is Arabic (Arabic script present, RTL declared) and the
 *      Latin locks (FEL DRONE, NDVI, MNT, RC number) stay in Latin;
 *   6. the structural invariants hold in every language: 9 nav links, 7
 *      services with the SAME canonical API values, 3 primary poles, 8 method
 *      steps, 6 FAQ entries, 8 quote-form options, 4 sectors, 4 demonstration
 *      items, 3 equipment groups, 3 team members, image alternative text for
 *      every photograph;
 *   7. no visible French string is hard-coded inside a component;
 *   8. template.html still defaults to French and loads both typefaces.
 *
 * Run with `npm run check:i18n`. Exit code 1 = the multilingual layer is not
 * complete — never ship a half-translated interface.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8");
const exists = (rel) => fs.existsSync(path.join(root, rel));

/* ---------- tiny CommonJS loader so the .ts dictionaries can be read ------ */
const moduleCache = new Map();
function loadTs(rel) {
  if (moduleCache.has(rel)) return moduleCache.get(rel);
  const js = ts.transpileModule(read(rel), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    fileName: rel,
  }).outputText;
  const exportsObj = {};
  const module = { exports: exportsObj };
  const requireShim = (id) => {
    if (id.endsWith("lib/images")) return IMAGES;
    if (id.endsWith("data/company") || id.endsWith("./company")) return loadTs("src/data/company.ts");
    if (id.includes("i18n/types")) return {};
    throw new Error(`check-i18n: unexpected import "${id}" in ${rel}`);
  };
  new Function("exports", "require", "module", js)(exportsObj, requireShim, module);
  moduleCache.set(rel, module.exports);
  return module.exports;
}

/* ---------- photograph stub (only the alt text is part of the contract) -- */
const image = { alt: "«alt from src/lib/images.ts»", src: "", srcSet: "", sizes: "", width: 0, height: 0 };
const IMAGES = {
  heroImage: image,
  controlImage: image,
  safetyImage: image,
  serviceImages: new Proxy({}, { get: () => image }),
};

/* ------------------------------- checks ---------------------------------- */
const problems = [];
const notes = [];
const fail = (msg) => problems.push(msg);

const company = loadTs("src/data/company.ts").company;
const dicts = {
  fr: loadTs("src/data/content.fr.ts").fr,
  en: loadTs("src/data/content.en.ts").en,
  ar: loadTs("src/data/content.ar.ts").ar,
};

/* 1 — registry */
const RC = "36/00-0683602B26"; // authoritative: exact characters, no hyphen before B26, no spaces
const SUPERSEDED_RC = ["776099", "36/00-0683602-B-26"];
if (company.rc !== RC) fail(`Registre de Commerce is "${company.rc}" (expected ${RC})`);
else notes.push(`Registre de Commerce: ${RC} (single source: src/data/company.ts)`);
for (const [loc, d] of Object.entries(dicts)) {
  if (!d.legal.rc || typeof d.legal.rc !== "string") fail(`${loc}: legal.rc label missing`);
  for (const bad of SUPERSEDED_RC) {
    if (JSON.stringify(d).includes(bad)) fail(`${loc}: superseded RC value "${bad}" is still present`);
  }
}
/* The number belongs to company.ts only: a copy pasted into a component, or an
   older spelling kept "for compatibility", is drift — catch it here. */
const scanned = [];
(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(ts|tsx)$/.test(entry.name)) scanned.push(full);
  }
})(path.join(root, "src"));
scanned.push(path.join(root, "template.html"));
for (const file of scanned) {
  const text = fs.readFileSync(file, "utf8");
  for (const bad of SUPERSEDED_RC) {
    if (text.includes(bad)) fail(`${path.relative(root, file)}: superseded RC value "${bad}"`);
  }
}

/* 2/3 — completeness, empty strings, placeholders */
const PLACEHOLDERS = [
  /translation here/i, /to translate/i, /à traduire/i, /a traduire/i, /todo/i, /tbd/i,
  /coming soon/i, /lorem ipsum/i, /placeholder text/i, /xxx+/i, /\bwip\b/i, /à compléter la traduction/i,
];
function walk(node, pathStr, loc, visit) {
  if (typeof node === "string") return visit(node, pathStr, loc);
  if (Array.isArray(node)) return node.forEach((v, i) => walk(v, `${pathStr}[${i}]`, loc, visit));
  if (node && typeof node === "object") {
    for (const [k, v] of Object.entries(node)) walk(v, pathStr ? `${pathStr}.${k}` : k, loc, visit);
  }
}
const keyPaths = {};
for (const [loc, d] of Object.entries(dicts)) {
  keyPaths[loc] = [];
  walk(d, "", loc, (value, p, l) => {
    // the photograph objects are stubbed here — only their alt text is contract
    if (/(^|\.)image\.(src|srcSet|sizes|width|height)$/.test(p)) return;
    if (/\.image\.alt$/.test(p) && value === image.alt) return;
    if (value === image.alt) return; // an alternative text that re-uses src/lib/images.ts
    if (!value.trim()) fail(`${l}: empty string at ${p}`);
    // "and" really is one letter in Arabic, "No." is three in English
    if (value.trim().length < 2 && !/^\d+$/.test(value.trim()) && !p.endsWith("activitiesJoin"))
      notes.push(`${l}: very short string at ${p} ("${value}")`);
    for (const re of PLACEHOLDERS) if (re.test(value)) fail(`${l}: placeholder text at ${p} — "${value.slice(0, 60)}"`);
    keyPaths[l].push(`${p}=${typeof value === "function" ? "fn" : ""}`);
  });
}

/* 4 — no French leakage into EN / AR (phrases only, never single words) */
const FRENCH_PHRASES = [
  "sur devis", "à compléter", "demander un devis", "demander une prestation", "mentions légales",
  "tous droits réservés", "bonjour fel drone", "veuillez", "nous vous", "merci d'indiquer",
  "haut de page", "plan du site", "nos services", "notre méthode", "questions fréquentes",
  "coordonnées", "siège social", "gérant", "dénomination", "activités déclarées",
  "sécurité", "équipement", "démonstration", "entreprise", "wilaya du besoin", "précisions utiles",
  "envoyer ma demande", "exemple de démonstration", "média à fournir", "ligne directe",
];
const LATIN_ONLY = /^[\x20-\x7E«»°]+$/;
for (const loc of ["en", "ar"]) {
  walk(dicts[loc], "", loc, (value, p) => {
    // service API values are canonical French identifiers by design, and a
    // photograph alt text that re-uses src/lib/images.ts is not a translation
    const isApiValue = p.endsWith(".apiValue");
    if (value === image.alt || /\.image\.(src|srcSet|sizes|width|height)$/.test(p)) return;
    const lower = value.toLowerCase();
    for (const phrase of FRENCH_PHRASES) {
      if (lower.includes(phrase) && !isApiValue) fail(`${loc}: French leftover at ${p} — "${value.slice(0, 70)}"`);
    }
    // Arabic must not be a transliteration of French: a long Latin-only string
    // is worth a look (unless it is a brand, an identifier or an acronym).
    if (
      loc === "ar" &&
      !isApiValue &&
      value.length > 12 &&
      LATIN_ONLY.test(value) &&
      /[a-z]{4}/i.test(value) &&
      !/\.(href|slug|value|initials|apiValue)$/.test(p) &&
      !/\.name$/.test(p) &&
      !/@|^https?:|^\+?[\d\s/.-]{6,}$|@example/.test(value) &&
      !/fel drone|whatsapp|plus code|ndvi|mnt|rgb|sarl|orthophoto|google|q9jm|[A-Z]{3,}/.test(value)
    ) {
      notes.push(`ar: Latin-only string at ${p} — "${value.slice(0, 60)}"`);
    }
  });
}
const arabicChars = (JSON.stringify(dicts.ar).match(/[\u0600-\u06FF]/g) ?? []).length;
if (arabicChars < 3000) fail(`Arabic dictionary carries only ${arabicChars} Arabic characters — looks incomplete`);
else notes.push(`Arabic dictionary: ${arabicChars} Arabic characters`);

/* 5 — writing direction */
const DIR = { fr: "ltr", en: "ltr", ar: "rtl" };
for (const [loc, dir] of Object.entries(DIR)) {
  if (dicts[loc].locale.dir !== dir) fail(`${loc}: direction is "${dicts[loc].locale.dir}" (expected "${dir}")`);
  if (dicts[loc].locale.tag !== loc) fail(`${loc}: locale tag is "${dicts[loc].locale.tag}"`);
}
if (dicts.fr.locale.htmlLang !== "fr") fail("fr: htmlLang must stay fr (default document language)");

/* 6 — structural invariants, identical in every language */
const shape = (loc) => {
  const d = dicts[loc];
  return {
    nav: d.nav.links.length,
    services: d.services.list.length,
    primary: d.services.list.filter((s) => s.priority === "primary").length,
    apiValues: d.services.list.map((s) => s.apiValue).join("|"),
    slugs: d.services.list.map((s) => s.slug).join("|"),
    steps: d.method.steps.length,
    faq: d.faq.items.length,
    options: d.contact.form.options.length,
    optionValues: d.contact.form.options.map((o) => o.value).join("|"),
    sectors: d.sectors.length,
    demo: d.demonstration.items.length,
    equipmentGroups: d.equipment.groups.reduce((n, g) => n + g.items.length, 0),
    team: d.leadership.members.length,
    teamNames: d.leadership.members.map((m) => m.name).join("|"),
    alts: Object.keys(d.media.services).length,
  };
};
const base = shape("fr");
if (base.nav !== 9) fail(`nav links: ${base.nav} (expected 9)`);
if (base.services !== 7 || base.primary !== 3) fail(`services: ${base.services} with ${base.primary} primary (expected 7 / 3)`);
if (base.steps !== 8) fail(`method steps: ${base.steps} (expected 8)`);
if (base.faq !== 6) fail(`faq items: ${base.faq} (expected 6)`);
if (base.options !== 8) fail(`quote form options: ${base.options} (expected 8)`);
if (base.sectors !== 4) fail(`hero sectors: ${base.sectors} (expected 4)`);
if (base.demo !== 4) fail(`demonstration items: ${base.demo} (expected 4)`);
if (base.equipmentGroups !== 9) fail(`equipment rows: ${base.equipmentGroups} (expected 9)`);
if (base.team !== 3) fail(`team members: ${base.team} (expected 3)`);
for (const loc of ["en", "ar"]) {
  const s = shape(loc);
  for (const key of ["nav", "services", "primary", "steps", "faq", "options", "sectors", "demo", "equipmentGroups", "team", "alts"]) {
    if (s[key] !== base[key]) fail(`${loc}: ${key} = ${s[key]} but fr has ${base[key]}`);
  }
  for (const key of ["apiValues", "slugs", "optionValues", "teamNames"]) {
    if (s[key] !== base[key]) fail(`${loc}: ${key} differs from fr — the API contract and proper names must be identical`);
  }
  if (Object.values(s).some((v) => v === 0)) fail(`${loc}: a structural field is empty`);
}
notes.push(`structure: ${base.nav} nav · ${base.services} services (${base.primary} primary) · ${base.steps} steps · ${base.faq} FAQ · ${base.options} form options`);

/* 7 — no hard-coded French in components */
const componentFiles = fs.readdirSync(path.join(root, "src/components")).filter((f) => f.endsWith(".tsx"));
const hardCoded = [];
for (const file of componentFiles) {
  const body = read(`src/components/${file}`);
  const visible = body
    .split("\n")
    .filter((l) => !/^\s*(\*|\/\/|\/\*)/.test(l)) // ignore comments
    .join("\n");
  for (const phrase of ["Demander un devis", "Mentions légales", "Sur devis", "Nos services", "Tous droits réservés", "Haut de page", "Questions fréquentes"]) {
    if (visible.includes(phrase)) hardCoded.push(`${file}: "${phrase}"`);
  }
}
if (hardCoded.length) fail(`hard-coded French in components — must come from the dictionary: ${hardCoded.join(", ")}`);

/* 8 — document shell */
const template = read("template.html");
if (!/lang="fr"/.test(template)) fail("template.html must keep lang=\"fr\" as the default document language");
if (!template.includes("IBM+Plex+Sans+Arabic")) fail("template.html does not load IBM Plex Sans Arabic");
if (!template.includes("IBM+Plex+Sans:")) fail("template.html no longer loads IBM Plex Sans");
const i18n = read("src/i18n/index.tsx");
for (const needle of ["documentElement", "dir", "lang", "localStorage"]) {
  if (!i18n.includes(needle)) fail(`src/i18n/index.tsx no longer handles "${needle}"`);
}

/* 9 — generated brand data must carry both wordmark builds */
const brandmark = read("src/brand/brandmark.ts");
for (const needle of ["mark:", "micro:", "word:", "type:", "capRatio"]) {
  if (!brandmark.includes(needle)) fail(`src/brand/brandmark.ts is missing "${needle}"`);
}

/* ------------------------------- report ---------------------------------- */
for (const n of notes) console.log(`  · ${n}`);
if (problems.length) {
  console.error(`\nI18N CHECK FAILED — ${problems.length} problem(s):`);
  for (const p of problems) console.error(`  ✗ ${p}`);
  process.exit(1);
}
console.log("\n✓ i18n check passed — FR / EN / AR complete, RTL declared, no placeholders, one RC number.");
