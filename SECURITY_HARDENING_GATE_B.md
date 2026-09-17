# FEL DRONE — Security Hardening Gate B

Gate B is the verification procedure the security-hardening change set
(`SECURITY_BASELINE.md`, scope R1–R10 + R14) must pass **before** it may be
committed and published. It exists because a previous security-hardening
commit was lost: it existed only inside an ephemeral workspace and was never
made durable on GitHub. **GitHub is the primary artifact. A local commit or
bundle is never sufficient on its own.**

## Mandatory validations (all must exit 0)

```bash
npm run typecheck
npm run brand:check
npm run test:api
npm run build
npm run check:i18n
npm run pages:sync
```

## Content assertions

1. **CSP is Report-Only.** `vercel.json` contains
   `Content-Security-Policy-Report-Only`; it must NOT contain an enforcing
   `Content-Security-Policy` header key anywhere.
2. **R8 behaviour.** `lib/quote-core.mjs`: `redisStore.save()` and
   `redisStore.setStatus()` reject every non-2xx Upstash response;
   persistence failure returns 503 and never a false 201/200.
   `npm run test:api` includes the non-2xx persistence-failure regression
   tests (mock Upstash answering 500 → intake 503, admin PATCH 503).
3. **No unrelated changes.** `git status --porcelain` shows exactly the nine
   files listed in `SECURITY_BASELINE.md` — nothing more, nothing else.
4. **Scope.** R11/R12/R13 not implemented; no branding/logo/fonts/routes/UI
   changes; no new dependencies or services.

## Tree pin

With the nine changes staged, `git write-tree` must reproduce the verified
baseline tree. If the hash differs, the change set is not the verified state:
stop, do not commit, do not publish.

## Publish protocol (same session — do not stop between commit and push)

1. One focused commit on branch `security/hardening`, parent = the verified
   production/main baseline, tree = the verified baseline tree.
2. Record commit SHA, tree SHA, parent SHA.
3. Push ONLY `security/hardening` (never `main`; no force-push, no merge).
4. `git ls-remote origin refs/heads/security/hardening` must equal the new
   commit SHA.
5. `git fetch origin security/hardening && git rev-parse FETCH_HEAD` must
   equal the remote SHA.
6. Stop.
