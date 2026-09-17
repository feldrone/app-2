# FEL DRONE — corporate website

SARL FEL DRONE (El Tarf, Algérie): vente, location, maintenance et prestations
de services par drone professionnel.

## Stack

- Vite 7 + React 19 + TypeScript (strict)
- Tailwind CSS 4 — design tokens in `src/index.css` (`@theme`)
- No UI framework, no animation library: interactions are ~50 lines of
  hand-rolled IntersectionObserver (`src/components/Reveal.tsx`)
- Single-file production build (`vite-plugin-singlefile`)

## Commands

```bash
npm install
npm run dev       # local dev server
npm run build     # production build → dist/
npm run preview   # serve dist/ (host allowlist: *.e2b.app, see vite.config.ts)
npm run pages:sync # after build: write the single-file bundle to ./index.html
                   # (the entry GitHub Pages' branch source serves under /app/)

npm run typecheck   # TypeScript, strict
npm run brand:check # brand assets are in sync with the generator
npm run check:i18n  # FR/EN/AR completeness, RTL, no placeholders, RC number
npm run test:api    # quote API end-to-end suite
```

## GitHub Pages deployment

- `base: "/app/"` in `vite.config.ts` matches the Pages project path.
- Pages currently deploys **branch `main` / root**. The repo-root `index.html`
  is therefore the *built* single-file bundle (generated — never edited by
  hand); the Vite source template lives in `template.html` (`npm run dev`
  opens `/template.html`).
- `.github/workflows/deploy.yml` builds on every push to `main`, refreshes
  the generated root `index.html` + `favicon.svg` (commit `[skip ci]`), and
  additionally uploads `dist/` as a Pages artifact — so the site also works
  out of the box if the Pages source is ever switched to "GitHub Actions".
```

## Content & imagery — how to change them

| What to change                  | Where                          |
| ------------------------------- | ------------------------------ |
| Legal identity, contacts, RC number | `src/data/company.ts`       |
| Page copy — French (reference)  | `src/data/content.fr.ts`       |
| Page copy — English             | `src/data/content.en.ts`       |
| Page copy — Arabic (العربية)    | `src/data/content.ar.ts`       |
| Leadership entries (1..N)       | every dictionary → `leadership.members` (names also in `data/company.ts → teamMembers`) |
| Services (cards, workflows, CTAs) | every dictionary → `services.list` |
| FAQ entries                       | every dictionary → `faq.items`    |
| Quote API (backend)               | `api/` + `lib/quote-core.mjs` (see `docs/BACKEND.md`) |
| Photography (source & crops)    | `src/lib/images.ts`            |
| Logo mark & wordmark            | `scripts/brand-gen.mjs` (generator) → `src/brand/brandmark.ts` + `public/brand/*.svg` + `public/favicon.svg` |
| Identity rules, lockups, palette  | `docs/BRAND.md` + `public/brand/`    |
| Image licensing inventory       | `docs/IMAGES.md`               |

The current identity is **v11 "QUAD FD"**: one emblem that combines a
simplified front-view quadcopter (two rotor blades over two motor hubs on a
central body) with a heavy geometric F+D monogram, plus the "FEL DRONE"
wordmark typeset in the project typeface. Geometry, usage rules and the full
asset manifest live in **[`docs/BRAND.md`](docs/BRAND.md)**; ready-to-use SVGs
in `public/brand/`. Nothing is hand-drawn: `scripts/brand-gen.mjs` is the one
geometry source — it emits every brand SVG, `src/brand/brandmark.ts` (which
`src/components/Logo.tsx` renders) and the favicon chip. Change geometry
there, then run `npm run brand:gen`. `npm run brand:check` (CI + the Vercel
build command) fails if the committed assets drift from the generator.


Factual rules for this site:

- **Only company-supplied data is published.** No testimonials, no client
  logos, no statistics, no awards unless the company provides them.
- **No administrative or financial data in the marketing UI.** Share
  capital, registry dates and similar fields live in `src/data/company.ts`
  as internal records and are never rendered; the Registre de Commerce
  number appears solely in the discreet "Mentions légales" block (footer
  link), outside the marketing flow, and is stated exactly as registered.
- **Drone imagery only.** Every aviation visual must show real professional
  UAVs, operators or workshops — never manned aircraft, cockpits, airports
  or military hardware (see `docs/IMAGES.md`).

## Notes

- Photography is hotlinked from the Pexels CDN with server-side crops
  (`auto=compress`, `fit=crop`, explicit `w`/`h`) — to move to self-hosted
  optimized files, change the URL builders in `src/lib/images.ts` only.
- The contact form has **no backend** by design: it validates, then opens
  the visitor's mail client with a prefilled `mailto:` draft. The UI states
  this explicitly.
- Print: the whole page prints as a clean document — chrome, photos and
  interactive UI are hidden and page-break rules keep headings with their
  content (see `src/index.css` under `@media print`).
- SEO head (title, OG, canonical, JSON-LD Organization) lives in
  `index.html`; adjust the domain there and in `public/robots.txt` +
  `public/sitemap.xml` when the final hostname is decided.

## Languages — Français · English · العربية

The site is trilingual, with no framework migration and no i18n dependency:
three typed dictionaries (`src/data/content.{fr,en,ar}.ts`) share one contract
(`src/i18n/types.ts`), and a small React context (`src/i18n/index.tsx`) applies
the choice to `<html lang>` / `<html dir>` and remembers it in localStorage.
The header (and the mobile sheet) carries the FR · EN · AR selector.

- French stays the default and the reference language; the static `<title>`,
  meta and structured data in `template.html` remain French for SEO.
- Arabic ships a real RTL layout: the shell carries `dir="rtl"` and the
  components use logical properties (`ps-*`, `me-*`, `start-*`, `text-start`),
  so navigation, cards, forms and the footer mirror by themselves. Latin locks
  (the brand lockup, the Registre de Commerce number, phone numbers) stay
  left-to-right inside Arabic text.
- The quote form posts the same payload in every language: the service value
  handed to `POST /api/quote` is always the canonical French identifier, so the
  API contract, validation, honeypot, rate limiting and email flow are
  untouched.
- `npm run check:i18n` fails the build if a language is incomplete, if a
  placeholder string appears, if French leaks into another language, or if the
  Registre de Commerce number drifts.

Details, conventions and the reviewer checklist: **[`docs/I18N.md`](docs/I18N.md)**.

## Quote-request API (backend)

The contact form posts to `POST /api/quote` — Vercel serverless functions in
`api/` sharing one dependency-free core (`lib/quote-core.mjs`): server-side
validation + sanitisation, per-IP rate limiting, a honeypot, persistent
records (Upstash Redis when configured, in-memory for dev) and best-effort
email notification to the company via Resend. A private, token-guarded
`GET/PATCH /api/quote-requests` powers triage today and a future admin
dashboard later.

```bash
npm run dev      # site — vite proxies /api to the local API
npm run dev:api  # same handlers over node:http (:8787)
npm run test:api # 10-case end-to-end suite
```

Required environment variables are documented in `.env.example` and
`docs/BACKEND.md` (deployment, security notes, request schema). No secrets
are committed and the frontend never imports backend code. Without an API
(e.g. the GitHub Pages deployment) the form detects it and offers a
prefilled mailto fallback — it never pretends a message was sent.

For Vercel hosting, `vercel.json` builds with `VITE_BASE=/` so the bundle
serves at the domain root (GitHub Pages keeps the `/app/` base).
