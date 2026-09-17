# FEL DRONE — Production Development & Deployment Protocol

> Standing operating contract issued by the site owner on 2026-09-12.
> It binds every agent session working on this repository. Future
> sessions: read this file first — it is the workflow contract, not
> optional documentation. Baseline for all work is the current remote
> `main` of `feldrone/app`.

## 1. Source of truth

- GitHub repository: `feldrone/app`
- Production branch: `main`
- The Vercel project is connected to this repository and production
  branch. Treat GitHub `main` as the production source of truth.

Before making changes:

- Inspect the current repository state.
- Verify the current remote repository and branch.
- Fetch the latest remote state when network access is available.
- Never assume an old local commit is still current.
- Preserve all existing production work.

Never replace the current project with an older/stale version.

## 2. Every future request

Whenever a new website modification is requested, the agent handles the
entire process. The owner describes WHAT; the agent decides HOW. Do not
ask for manual file edits or git commands unless the environment
technically prevents the operation.

For every request:

1. Understand the requested change.
2. Inspect the relevant existing implementation.
3. Implement the change completely.
4. Preserve all existing functionality and previous approved work.
5. Do not make unrelated changes.
6. Keep the website production-quality and consistent with the existing
   FEL DRONE design system.

Pipeline for each request:

```
REQUEST → IMPLEMENT → VALIDATE → COMMIT → PUSH → VERIFY GITHUB → VERIFY/ALLOW VERCEL DEPLOYMENT
```

## 3. Quality & regression protection

Before considering a change complete:

- Run TypeScript validation (`npm run typecheck`).
- Run the production build (`npm run build`).
- Run API tests when relevant (`npm run test:api`).
- Run relevant static/content checks (brand system: `npm run
  brand:check` + `npm run pages:sync` when src/brand output changed).
- Check for broken imports, assets, routes and references.
- Check that no existing feature was accidentally removed.
- Check responsive/mobile behavior when the change affects UI.
- Fix any errors before proceeding.

A change is NOT complete until validation succeeds.

## 4. Git safety

For every completed change:

- Create a clean, descriptive Git commit.
- The commit must contain only the intended changes.
- Never force-push.
- Never rewrite public `main` history.
- Never delete production commits.
- Never use destructive reset/checkout operations that could discard
  approved work.
- Never overwrite newer remote work with stale local work.

Before pushing:

1. Determine the current remote `main` SHA.
2. Confirm the new commit is based on the current remote `main` or can
   be safely fast-forwarded.
3. If there is divergence, STOP before changing remote history.
4. Explain the divergence and resolve it safely.
5. Never solve divergence with force-push.

## 5. Push to GitHub

After validation, push the completed commit to `feldrone/app`
`refs/heads/main`. After the push, verify the actual remote SHA:

```
git ls-remote --heads origin main
```

and confirm remote `main` points to the newly created commit. Never
report "pushed successfully" without this verification.

## 6. Vercel deployment

After GitHub `main` is updated:

- Vercel detects the new `main` commit automatically (Git integration).
- Verify the Vercel deployment when access is available.
- Confirm the deployment corresponds to the new GitHub commit.
- If the deployment fails: inspect the build/deployment error, fix the
  underlying issue, validate again, push a corrective commit.
- Never leave a known broken production deployment.

Never claim deployment merely because a local build succeeded, a commit
exists, or a push was attempted.

If Vercel is paused, the webhook is unavailable, or the sandbox cannot
reach Vercel: do not pretend automatic deployment happened — finish and
validate the code, push to GitHub if possible, verify GitHub `main`,
and clearly report what external step remains.

## 7. Network / sandbox failures

If GitHub access fails (TLS, network restrictions, sandbox limits,
authentication, session limits):

1. Preserve the completed work; keep the commit intact.
2. Do not repeatedly destroy/rebuild the repository chasing fixes.
3. Create a transportable Git bundle if appropriate (`git bundle create
   <name>.bundle <remoteMainSha>..HEAD`) and verify it
   (`git bundle verify`).
4. State exactly what succeeded and what remains.
5. Make the work easy to continue from another coding session — a new
   session continues from the preserved commit, not a rebuild.

Known sandbox fact (2026-09-12): GitHub auth here is a short-lived
`GH_TOKEN` relayed through the sandbox egress proxy; `git`/`curl`
cannot authenticate directly. When the token expires mid-session, all
pushes 401 — recovery is reconnecting GitHub in the Arena UI, then
retrying the push once.

## 8. Existing FEL DRONE work

Never remove or regress previously approved functionality. Preserve:

- premium white-first corporate design
- responsive mobile UX, working navigation, mobile hamburger menu
  (body-portalled sheet — see `src/components/Header.tsx`)
- Logo v4 system + favicon system (generated from
  `scripts/brand-gen.mjs`; never hand-edit generated brand files)
- brand documentation (`docs/BRAND.md`, `docs/brand-board.png`)
- service sections: Vente, Location, Maintenance, Prestations,
  Inspection sur chantier
- contact/quote workflow and existing API behavior
- FAQ, legal information (Mentions légales isolation rules)
- existing validation tooling
- SEO/meta implementation, accessibility, performance optimizations

When modifying one feature, inspect its dependencies before changing it.

## 9. Content & brand safety

Do not invent: certifications, statistics, testimonials, partnerships,
prices, employees, job titles, guarantees, service areas, company
claims. Keep FEL DRONE company-first and professional. Use drone/UAV
imagery only where required; never introduce passenger aircraft,
fighter jets, cockpits or unrelated aviation imagery.

## 10. Final report

At the end of every request, report clearly, with exact facts:

1. What changed.
2. Validation results.
3. Commit SHA.
4. Whether GitHub `main` was successfully updated.
5. Verified remote `main` SHA.
6. Whether a Vercel deployment was detected.
7. Vercel deployment status, if accessible.
8. Any remaining blocker.

Never report an operation as successful when it was only attempted.

## 11. Definition of done

- [ ] Requested change implemented
- [ ] Existing functionality preserved
- [ ] TypeScript passes
- [ ] Production build passes
- [ ] Relevant tests pass
- [ ] Git commit created
- [ ] Commit safely based on current main
- [ ] Commit pushed to `feldrone/app` main
- [ ] Remote main SHA verified
- [ ] Vercel deployment triggered/detected when available
- [ ] Deployment corresponds to the new commit
- [ ] No known regression remains

If an external system blocks a final step, report it as BLOCKED — never
as done.

## 12. Operating rule

Requests phrased as "Add X / Change Y / Improve Z / Fix this / Make the
mobile version better" are production-ready change requests. Run the
full pipeline automatically:

```
IMPLEMENT → TEST → COMMIT → PUSH → VERIFY → VERCEL
```

while respecting every safety rule above. No repeated confirmations for
ordinary safe steps covered by this protocol.

## 13. Efficiency & session continuity

- Do not spend excessive time re-diagnosing the same network/auth/sandbox
  problem twice. If GitHub authentication expired, it is restored by
  reconnecting GitHub through the Arena/GitHub integration; retry the
  push only after that.
- If an artifact, commit, bundle or previous session state is missing:
  inspect the current GitHub `main` first, preserve what is there, and
  do not rebuild working functionality unnecessarily.
- Prefer the current remote GitHub `main` as the baseline for every new
  request.
- Do not wait indefinitely for Vercel. If GitHub `main` is verified and
  Vercel is unreachable from the environment, mark Vercel verification
  BLOCKED and continue without pretending it succeeded.
