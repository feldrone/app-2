# FEL DRONE — Security Baseline (R1–R10 + R14)

Scope of this baseline: the deployed marketing site (Vercel) and the quote
request API (`api/*.js` + `lib/quote-core.mjs`). The baseline is
**additive and non-invasive**: no UI, branding, fonts, routes or product
logic changes, no new dependencies, services, database or auth system.

Revision 2 (corrective commit on `security/hardening`): R1–R7 and R10
implemented exactly per the approved definitions; R8, R9 and R14 keep their
previously verified behaviour.

## In-scope items

| ID | Item | Where | Contract |
| -- | ---- | ----- | -------- |
| R1 | Input hygiene + client identity | `lib/quote-core.mjs` | All intake text is NFC-normalized; bidi controls and zero-width characters are stripped. `clientIp()` never trusts the first caller-supplied `X-Forwarded-For` value — it selects the LAST syntactically valid forwarded IP (bounded IPv4/IPv6 check), then the socket address. Forged/invalid values cannot pick an arbitrary rate-limit bucket or inflate key space. |
| R2 | Strict JSON Content-Type | `lib/quote-core.mjs` (intake + admin PATCH) | `application/json` required (charset parameter allowed); missing or any other type → **415**. Payload-size protections preserved. |
| R3 | ADMIN_TOKEN hardening | `lib/quote-core.mjs` | Comparison via `crypto.timingSafeEqual` (uniform timing). **Bearer-only**. Missing, <32-char or known-default tokens refuse service — the private surface stays closed (401), no oracle, no fallback. |
| R4 | No query-string authentication | `lib/quote-core.mjs`, `api/quote-requests.js` | `?token=` removed completely — it MUST never authenticate. Documentation updated accordingly. |
| R5 | Admin auth-failure budget | `lib/quote-core.mjs` | Bounded per-IP budget: 10 failures / 15 minutes → **429**. Successful authentication clears the IP's counter. Failure map is pruned/bounded. |
| R6 | Rate-limit resilience | `lib/quote-core.mjs` | Upstash calls used by rate limiting carry a bounded 5 s timeout. Redis/rate-limit errors do NOT fail open as unrestricted `true` — they fall back to a bounded per-instance limiter. |
| R7 | Body-size protection | `lib/quote-core.mjs` | Oversized requests → **413** on all three paths: `Content-Length` (checked before reading), pre-parsed Vercel bodies (serialized size), and streamed bodies. The 4 KB admin PATCH cap is preserved. |
| R8 | Persistence integrity | `lib/quote-core.mjs` | `redisStore.save()`, `setStatus()` and `list()` reject every non-2xx Upstash REST response. A persistence failure returns **503** — intake never answers a false 201, the admin route never a false 200. Regression tests: mock Upstash answering 500 → intake 503, admin PATCH 503. |
| R9 | Security headers | `vercel.json` + `lib/quote-core.mjs` `json()` | `Content-Security-Policy-Report-Only` **only — there is no enforcing `Content-Security-Policy` header anywhere, and there must never be one** — plus HSTS, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: no-referrer`, `Permissions-Policy`. |
| R10 | CI hardening | `.github/workflows/deploy.yml` | **SHA-pinned** GitHub Actions (full 40-char commit SHAs, tag in comment), least-privilege workflow permissions, full validation suite (typecheck, brand, API, i18n, build) and a security-gate step asserting: security.txt present with a mail contact, report-only CSP present, **no enforcing CSP**, R3–R7 headers present, R8 reject marker present, and every `uses:` SHA-pinned. |

## Out of scope (explicitly excluded)

- **R11** — excluded from this baseline.
- **R12** — excluded from this baseline.
- **R13** — excluded from this baseline.

Exclusion is a deliberate boundary: anything outside R1–R10 + R14 must not
be smuggled into this change set.

## Documentation gate (R14)

- This file (`SECURITY_BASELINE.md`) — what the baseline is and why.
- `SECURITY_HARDENING_GATE_B.md` — how the baseline is verified before it may be published.
- `docs/BACKEND.md` — API-side behaviour documented (R8 503 contract, R2 415, R3–R5 auth, R6/R7).
- `public/.well-known/security.txt` — valid RFC 9116 security contact.

## Changed files (complete list vs `main` — nothing else)

```
M .github/workflows/deploy.yml
M api/quote-requests.js
M vercel.json
M docs/BACKEND.md
A SECURITY_BASELINE.md
M lib/quote-core.mjs
M scripts/test-api.mjs
A SECURITY_HARDENING_GATE_B.md
A public/.well-known/security.txt
```
