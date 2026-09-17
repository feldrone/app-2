# FEL DRONE — Request API (backend)

Real backend for the public quote-request form. Vercel-native serverless
functions, zero npm dependencies, one shared core module that also runs
locally. The marketing site stays exactly as built — the form now speaks to
this API instead of a mailto.

## Endpoints

| Method | Route                | Public | Purpose                                        |
| ------ | -------------------- | ------ | ---------------------------------------------- |
| POST   | `/api/quote`         | ✅     | Submit a service request (the contact form)     |
| GET    | `/api/quote-requests`| 🔒     | List requests (`?status=new&limit=100`)         |
| PATCH  | `/api/quote-requests`| 🔒     | Update one request: `{ id, status }`            |

Admin routes require `Authorization: Bearer $ADMIN_TOKEN` — **Bearer-only**:
query-string tokens (e.g. `?token=`) are not an authentication method. The
surface stays closed (401) unless the token is at least 32 characters and
not a known default; comparisons are timing-safe. Repeated authentication
failures from one IP are budgeted (10 per 15 minutes → 429, cleared on
success). That token is the **only** secret the API ever needs for private
reads — it is designed so a future private dashboard (Next.js, Retool,
anything) is just a client of these two routes.

## Request lifecycle

```
visitor → POST /api/quote
            ├─ honeypot filled?      → 201 fake-success, nothing stored
            ├─ rate limited (3/min,  → 429 with a clear French message
            │  10/day per IP)
            ├─ server validation +    → 400 { fields: {…} }
            │  sanitisation (control
            │  chars, <> stripped)
            ├─ store.save(record)     → id, name, phone, email, service,
            │                            message, status:"new", createdAt
            ├─ notifyCompany()        → Resend email to the company
            │                            (silently skipped if not set up)
            └─ 201 { ok, id }         → UI shows the reference
```

Record shape (document/DB):

```json
{
  "id": "uuid",
  "name": "…", "phone": "…", "email": "… or null",
  "service": "Vente | Location | Maintenance | Prestations de services | Inspection sur chantier | Autre",
  "message": "…",
  "status": "new",
  "createdAt": "ISO-8601",
  "updatedAt": "ISO-8601 (after PATCH)"
}
```

Statuses for the future dashboard: `new → in_review → scheduled → done → archived`.

## Storage drivers

| Env configured                     | Backend                                   | Notes                          |
| ---------------------------------- | ----------------------------------------- | ------------------------------ |
| `UPSTASH_REDIS_REST_URL` + `TOKEN` | Upstash Redis (hash `feldrone:quotes`)    | Recommended free tier         |
| —                                  | In-memory                                 | Dev only; resets on cold start |
| `DEV_DATA_FILE` (dev runner sets it) | `.dev-data/quotes.ndjson` on disk        | Never committed (`git-ignored`) |

**No passwords, no IPs, no visitor analytics are stored.** Phone/email/name
exist solely to answer the request. Redis values are JSON per request; the
admin route is the only reader.

**Persistence integrity (baseline R8):** any non-2xx response from the
Upstash REST proxy is a persistence failure — the store rejects it and the
API answers **503**, never a false 201 (intake) or 200 (admin). A visitor
whose request could not be persisted is told to retry or call us instead of
being handed a reference number for a record that does not exist.

## Email notifications

Set `RESEND_API_KEY`, `EMAIL_FROM`, `NOTIFY_TO` and intake immediately also
sends a plain-text notification (reference, contact, service, message) to
the company address. Failures never break intake (best-effort, logged
server-side). Without the vars, requests queue silently in the store — the
documented behaviour of the current deployment.

## Deploying on Vercel

1. Import the repo (it builds `dist/` with `VITE_BASE=/` via `vercel.json`).
2. Project Settings → Environment Variables → add:
   - `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` (Upstash → Redis → REST proxy)
   - `RESEND_API_KEY`, `EMAIL_FROM`, `NOTIFY_TO=contact.feldrone@gmail.com`
   - `ADMIN_TOKEN` (generate: `openssl rand -hex 24`)
   - `SITE_ORIGIN=https://www.feldrone.dz,https://feldrone.github.io` (comma list, CORS allow-list — same-origin calls need no entry)
3. Optional `RATE_LIMIT_PER_MINUTE` / `RATE_LIMIT_PER_DAY` overrides.
4. Redeploy. No secret is committed; `.env*` is git-ignored (`.env.example` documents the contract).

GitHub Pages keeps working untouched: without an API, the form detects the
missing endpoint and offers the prefilled **mailto fallback** — it never
fakes a successful send.

## Local development

```bash
npm run dev          # site (vite proxies /api → :8787)
npm run dev:api      # the same handlers over node:http
npm run test:api     # end-to-end + security-regression suite (validation,
                     # bots, limits, auth, non-2xx persistence → 503 [R8],
                     # 415/413 body+content-type [R2/R7], token hardening
                     # [R3–R5], XFF buckets [R1], no fail-open [R6])
```

## Security notes

- **Server-side validation is authoritative** (the browser mirror is UX only):
  enum-checked service, phone digit-count + charset, lengths, `<>`-stripped,
  control chars removed, NFC-normalized with bidi controls and zero-width
  characters stripped (R1), 32 KB body cap enforced on Content-Length,
  pre-parsed and streamed bodies (413) — 4 KB cap on admin PATCH (R7).
- **Request hygiene**: intake and admin PATCH require an
  `application/json` Content-Type (415 otherwise) (R2).
- **Client identity**: the first caller-supplied `X-Forwarded-For` value is
  never trusted — the LAST syntactically valid forwarded IP (bounded
  IPv4/IPv6 check) is used, then the socket address, so forged values can
  neither pick arbitrary buckets nor inflate key space (R1).
- **Rate limiting**: fixed windows per client IP, 3/min + 10/day defaults.
  Upstash calls carry a 5 s timeout; on a Redis failure the limiter falls
  back to a bounded per-instance window — it never fails open (R6).
- **Admin auth**: timing-safe Bearer comparison; missing/weak (<32 chars)
  or known-default `ADMIN_TOKEN` refuses service (surface closed, 401);
  no query-string tokens; bounded per-IP failure budget, 10/15 min → 429,
  cleared on success (R3–R5).
- **CORS**: strict allow-list from `SITE_ORIGIN`; preflight only on the two
  routes; `Vary`-free because responses never carry cross-origin data to
  unknown callers.
- **Anti-abuse**: honeypot field (bots get a fake success), no timing oracle
  on admin token comparison in hot paths, `Cache-Control: no-store` on every
  API response, `X-Content-Type-Options: nosniff`.
- **Error handling**: 400 (with per-field map), 401, 404, 405, 413, 429, 503
  — all French-readable, never stack traces, never echo raw input.
- **Security baseline (R1–R10 + R14)**: see `SECURITY_BASELINE.md` and
  `SECURITY_HARDENING_GATE_B.md` — request hygiene and client identity
  (R1), strict JSON Content-Type (R2), token hardening (R3–R5), bounded
  rate-limit resilience (R6), body-size protection (R7),
  persistence-integrity 503s (R8), report-only-only CSP + HSTS + nosniff +
  X-Frame-Options + Referrer-Policy + Permissions-Policy (R9), SHA-pinned
  least-privilege CI with a security gate (R10) and the RFC 9116
  security.txt (R14). R11–R13 are explicitly out of scope for this
  baseline.

## Admin dashboard (ready, not built)

`GET /api/quote-requests` + `PATCH {id,status}` are everything a private
dashboard needs: list with `status=new`, triage, archive. The UI can be a
standalone page behind Vercel Authentication later — no API changes required.
