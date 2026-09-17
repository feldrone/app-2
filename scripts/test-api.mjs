/**
 * End-to-end + security-regression suite for the quote API.
 *
 * Boots local dev servers (file stores, strong admin tokens) and exercises:
 * valid intake, validation errors, honeypot, rate limiting, admin auth,
 * status updates, and the approved security-baseline regressions:
 *   1. forged X-Forwarded-For cannot freely choose the rate-limit bucket (R1)
 *   2. query ?token= cannot authenticate (R4)
 *   3. weak ADMIN_TOKEN is rejected (R3)
 *   4. failed admin authentication is rate-limited (R5)
 *   5. non-2xx Upstash → 503, never a false 201/200 (R8)
 *   6. oversized parsed/body requests → 413 (R7)
 *   7. Content-Type enforcement → 415 (R2)
 *   8. 201 is returned only after persistence (R8)
 * Plus: no fail-open rate limiting (R6).
 *
 * Run with `npm run test:api`.
 */
import http from "node:http";
import { spawn } from "node:child_process";
import { adminRequests, readJsonBody } from "../lib/quote-core.mjs";

const PORT = 8791;
const PORT_MOCK = 8792; // mock Upstash (always 500)
const PORT_FAIL = 8793; // API instance pointed at the mock Upstash
const PORT3 = 8794; // dedicated instance for XFF / auth-budget regressions
const BASE = `http://127.0.0.1:${PORT}`;
const BASE3 = `http://127.0.0.1:${PORT3}`;
const BASE_FAIL = `http://127.0.0.1:${PORT_FAIL}`;

// R3: admin tokens in tests must satisfy the production bar (≥32 chars,
// not a known default) — a weak token would leave the admin surface closed.
const STRONG_TOKEN = "test-admin-token-0123456789abcdef0123456789abcdef01";

const baseEnv = {
  ...process.env,
  ADMIN_TOKEN: STRONG_TOKEN,
  RATE_LIMIT_PER_MINUTE: "3",
  RATE_LIMIT_PER_DAY: "10",
};
const env = { ...baseEnv, PORT: String(PORT), DEV_DATA_FILE: ".dev-data/test-quotes.ndjson" };
const env3 = { ...baseEnv, PORT: String(PORT3), DEV_DATA_FILE: ".dev-data/test-quotes-3.ndjson" };
const envFail = {
  ...baseEnv,
  PORT: String(PORT_FAIL),
  UPSTASH_REDIS_REST_URL: `http://127.0.0.1:${PORT_MOCK}`,
  UPSTASH_REDIS_REST_TOKEN: "mock-token",
};

const server = spawn("node", ["scripts/dev-api.mjs"], { env, stdio: ["ignore", "pipe", "pipe"] });
const server3 = spawn("node", ["scripts/dev-api.mjs"], { env: env3, stdio: ["ignore", "pipe", "pipe"] });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let failed = 0;
const check = (name, cond, extra = "") => {
  console.log(`${cond ? "✓" : "✗"} ${name}${cond ? "" : " — " + extra}`);
  if (!cond) failed++;
};

const post = (path, body, headers = {}) =>
  fetch(BASE + path, { method: "POST", headers: { "Content-Type": "application/json", ...headers }, body: JSON.stringify(body) });
const post3 = (path, body, headers = {}) =>
  fetch(BASE3 + path, { method: "POST", headers: { "Content-Type": "application/json", ...headers }, body: JSON.stringify(body) });

const VALID = {
  name: "Karim Benali",
  phone: "+213 6 12 34 56 78",
  email: "karim@exemple.dz",
  service: "Inspection sur chantier",
  message: "Suivi d'avancement hebdomadaire d'un chantier R+4 à El Caliptous — besoin d'un devis.",
  website: "",
};

try {
  await wait(700);

  // 1. valid request
  const good = await post("/api/quote", VALID);
  const goodJson = await good.json();
  check("valid request → 201 + id", good.status === 201 && goodJson.ok && goodJson.id, JSON.stringify(goodJson));

  // 2. invalid input
  const bad = await post("/api/quote", { name: "K", phone: "abc", service: "Voyage", message: "salut" });
  const badJson = await bad.json();
  check("invalid input → 400 + per-field errors", bad.status === 400 && badJson.fields?.phone && badJson.fields?.service && badJson.fields?.message, JSON.stringify(badJson));

  // 3. SQL/script injection is stripped, record still created
  const dirty = await post("/api/quote", {
    name: "Hacker <script>alert(1)</script>",
    phone: "0661223344",
    service: "Vente",
    message: "'; DROP TABLE quotes;-- besoin drone <img src=x onerror=alert(1)> ",
  });
  const dirtyJson = await dirty.json();
  const listed = await fetch(BASE + "/api/quote-requests", { headers: { Authorization: `Bearer ${STRONG_TOKEN}` } });
  const listedJson = await listed.json();
  const stored = listedJson.requests?.find((r) => r.id === dirtyJson.id);
  check("injection attempt sanitized", Boolean(stored) && !stored.name.includes("<") && !stored.name.includes(">"), JSON.stringify(stored?.name));

  // 4. honeypot → fake success, nothing stored
  const before = listedJson.count;
  const bot = await post("/api/quote", { name: "Bot", phone: "0600000000", service: "Vente", message: "x".repeat(20), website: "http://spam.example" });
  const botJson = await bot.json();
  const after = await (await fetch(BASE + "/api/quote-requests", { headers: { Authorization: `Bearer ${STRONG_TOKEN}` } })).json();
  check("honeypot bot → 201 but not stored", bot.status === 201 && botJson.ok && after.count === before /* honeypot stored nothing */, `before=${before} after=${after.count}`);

  // 5. rate limiting (limit = 3/min): this is request #4 in the window (good, bad, dirty)
  const limited = await post("/api/quote", { name: "Encore", phone: "0661223344", service: "Autre", message: "z".repeat(20) });
  check("rate limit → 429 after 3/min", limited.status === 429, "got " + limited.status);

  // 6. admin auth
  const anon = await fetch(BASE + "/api/quote-requests");
  check("admin list without token → 401", anon.status === 401);

  // 7. status update flow
  const patch = await fetch(BASE + "/api/quote-requests", {
    method: "PATCH",
    headers: { Authorization: `Bearer ${STRONG_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ id: goodJson.id, status: "in_review" }),
  });
  const patchJson = await patch.json();
  check("PATCH status → in_review persisted", patch.status === 200 && patchJson.request?.status === "in_review", JSON.stringify(patchJson));

  // 8. method + malformed handling
  const wrongMethod = await fetch(BASE + "/api/quote", { method: "GET" });
  check("GET /api/quote → 405", wrongMethod.status === 405);
  const malformed = await fetch(BASE + "/api/quote", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{oops" });
  check("malformed JSON → 400", malformed.status === 400);

  // 9. oversized streamed body rejected
  const huge = await post("/api/quote", { name: "A".repeat(9000), phone: "0600000000", service: "Vente", message: "B".repeat(40000) });
  check("oversized streamed payload → 400/413", huge.status === 400 || huge.status === 413, "got " + huge.status);

  /* ── security-baseline regressions ─────────────────────────────────────── */

  // 10. R8: non-2xx persistence (Upstash failure) → 503, never a false 201/200.
  // A mock Upstash REST proxy answers 500 to everything; a second API
  // instance is pointed at it.
  const mock = http.createServer((req, res) => {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "simulated upstash failure" }));
  });
  await new Promise((resolve) => mock.listen(PORT_MOCK, "127.0.0.1", resolve));
  const failingServer = spawn("node", ["scripts/dev-api.mjs"], { env: envFail, stdio: ["ignore", "pipe", "pipe"] });
  await wait(700);
  const failedIntake = await fetch(BASE_FAIL + "/api/quote", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(VALID),
  });
  const failedIntakeJson = await failedIntake.json();
  check("R8: non-2xx persistence → 503, never false 201", failedIntake.status === 503 && failedIntakeJson.ok === false, `got ${failedIntake.status} ${JSON.stringify(failedIntakeJson)}`);
  const failedPatch = await fetch(BASE_FAIL + "/api/quote-requests", {
    method: "PATCH",
    headers: { Authorization: `Bearer ${STRONG_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ id: "any-id", status: "in_review" }),
  });
  const failedPatchJson = await failedPatch.json();
  check("R8: admin PATCH on failing store → 503, never false 200", failedPatch.status === 503 && failedPatchJson.ok === false, `got ${failedPatch.status} ${JSON.stringify(failedPatchJson)}`);

  // 10b. R6: no fail-open — with Upstash failing, the bounded per-instance
  // fallback still enforces 3/min (this is hit #2..#4 in the window).
  const f1 = await fetch(BASE_FAIL + "/api/quote", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(VALID) });
  const f2 = await fetch(BASE_FAIL + "/api/quote", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(VALID) });
  const f3 = await fetch(BASE_FAIL + "/api/quote", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(VALID) });
  check("R6: failing Upstash → bounded fallback, no fail-open (503, 503, 429)", f1.status === 503 && f2.status === 503 && f3.status === 429, `f1=${f1.status} f2=${f2.status} f3=${f3.status}`);
  failingServer.kill("SIGTERM");
  mock.close();

  // 11. R2: strict JSON Content-Type → 415 (intake + admin PATCH).
  const noCt = await fetch(BASE + "/api/quote", { method: "POST", body: JSON.stringify(VALID) });
  check("R2: intake without Content-Type → 415", noCt.status === 415, "got " + noCt.status);
  const textCt = await fetch(BASE + "/api/quote", { method: "POST", headers: { "Content-Type": "text/plain" }, body: JSON.stringify(VALID) });
  check("R2: intake with text/plain → 415", textCt.status === 415, "got " + textCt.status);
  const patchNoCt = await fetch(BASE + "/api/quote-requests", {
    method: "PATCH",
    headers: { Authorization: `Bearer ${STRONG_TOKEN}` },
    body: JSON.stringify({ id: "x", status: "in_review" }),
  });
  check("R2: admin PATCH without JSON Content-Type → 415", patchNoCt.status === 415, "got " + patchNoCt.status);
  const ctCharset = await fetch(BASE3 + "/api/quote", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8", "X-Forwarded-For": "10.8.8.8" },
    body: JSON.stringify(VALID),
  });
  check("R2: application/json with charset accepted (201, not 415)", ctCharset.status === 201, "got " + ctCharset.status);

  // 11b. Email-format regression: the validation regex must accept any
  // well-formed address — including ones containing the letter "s", which a
  // double-escaped character class ([^\\s@]) silently rejected in production.
  const emailWithS = await fetch(BASE3 + "/api/quote", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Forwarded-For": "10.8.8.9" },
    body: JSON.stringify({ ...VALID, email: "sonia.messaoud@gmail.com" }),
  });
  check(
    "email containing \"s\" is accepted (201, not 400 email-invalid)",
    emailWithS.status === 201,
    "got " + emailWithS.status,
  );
  const emailMalformed = await post3("/api/quote", { ...VALID, email: "not-an-email" }, { "X-Forwarded-For": "10.8.8.10" });
  const emailMalformedJson = await emailMalformed.json();
  check(
    "malformed email still rejected (400 + email field)",
    emailMalformed.status === 400 && Boolean(emailMalformedJson.fields?.email),
    "got " + emailMalformed.status + " " + JSON.stringify(emailMalformedJson.fields ?? {}),
  );


  // 12. R7: body-size protection on Content-Length, pre-parsed and the
  // 4 KB admin PATCH cap.
  const clRejected = await new Promise((resolve) => {
    const body = JSON.stringify({ name: VALID.name, phone: VALID.phone, service: "Vente", message: "C".repeat(100000) });
    const req = http.request(
      { host: "127.0.0.1", port: PORT, path: "/api/quote", method: "POST", headers: { "Content-Type": "application/json", "Content-Length": String(Buffer.byteLength(body)) } },
      (res) => {
        res.resume();
        res.on("end", () => resolve(res.statusCode));
      },
    );
    req.on("error", () => resolve(null));
    req.write(body);
    req.end();
  });
  check("R7: oversized Content-Length body → 413", clRejected === 413, "got " + clRejected);
  let preParsedRejected = null;
  try {
    await readJsonBody({ body: { message: "x".repeat(40000) }, headers: {} }, 32 * 1024);
  } catch (e) {
    preParsedRejected = e;
  }
  check("R7: oversized pre-parsed (Vercel-style) body → 413", preParsedRejected?.status === 413, String(preParsedRejected));
  const preParsedOk = await readJsonBody({ body: { a: "ok" }, headers: {} }, 32 * 1024);
  check("R7: small pre-parsed body accepted", preParsedOk?.a === "ok", JSON.stringify(preParsedOk));
  const bigPatch = await fetch(BASE + "/api/quote-requests", {
    method: "PATCH",
    headers: { Authorization: `Bearer ${STRONG_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ id: "x", status: "in_review", pad: "y".repeat(5000) }),
  });
  check("R7: admin PATCH over 4 KB cap → 413", bigPatch.status === 413, "got " + bigPatch.status);

  // 13. R3/R4: token semantics (in-process, deterministic).
  const unitAdmin = (headers, url, envVars, method = "GET") =>
    adminRequests({ headers, url, socket: { remoteAddress: "10.99.99.99" } }, method, envVars);
  const noToken = await unitAdmin({ authorization: `Bearer ${STRONG_TOKEN}` }, "/", {});
  check("R3: missing ADMIN_TOKEN → admin surface closed (401)", noToken.status === 401, "got " + noToken.status);
  const weakToken = await unitAdmin({ authorization: "Bearer test-admin-token" }, "/", { ADMIN_TOKEN: "test-admin-token" });
  check("R3: weak/default ADMIN_TOKEN rejected (401)", weakToken.status === 401, "got " + weakToken.status);
  const shortToken = "abcdef1234567890123456789012345"; // 31 chars
  const shortTok = await unitAdmin({ authorization: `Bearer ${shortToken}` }, "/", { ADMIN_TOKEN: shortToken });
  check("R3: <32-char ADMIN_TOKEN rejected (401)", shortTok.status === 401, "got " + shortTok.status);
  const queryToken = await unitAdmin({ authorization: "Bearer wrong-wrong-wrong" }, `/?token=${STRONG_TOKEN}`, { ADMIN_TOKEN: STRONG_TOKEN });
  check("R4: query-string ?token= never authenticates (401)", queryToken.status === 401, "got " + queryToken.status);
  const basicAuth = await unitAdmin({ authorization: `Basic ${STRONG_TOKEN}` }, "/", { ADMIN_TOKEN: STRONG_TOKEN });
  check("R3: non-Bearer scheme never authenticates (401)", basicAuth.status === 401, "got " + basicAuth.status);
  const bearerOk = await unitAdmin({ authorization: `Bearer ${STRONG_TOKEN}` }, "/", { ADMIN_TOKEN: STRONG_TOKEN });
  check("R3: valid Bearer token authenticates (200)", bearerOk.status === 200, "got " + bearerOk.status);

  // 14. R5: bounded auth-failure budget (e2e on the dedicated instance).
  const adminFail3 = async (headers = {}) =>
    (await fetch(BASE3 + "/api/quote-requests", { headers: { Authorization: "Bearer wrong-token-wrong", ...headers } })).status;
  let all401 = true;
  for (let i = 0; i < 10; i++) if ((await adminFail3()) !== 401) all401 = false;
  check("R5: 10 failed admin authentications → 401 each", all401);
  const lockout = await adminFail3();
  check("R5: 11th attempt within 15 min → 429", lockout === 429, "got " + lockout);
  let cleared3 = true;
  for (let i = 0; i < 3; i++) if ((await adminFail3({ "X-Forwarded-For": "10.5.5.5" })) !== 401) cleared3 = false;
  const success3 = (await fetch(BASE3 + "/api/quote-requests", { headers: { Authorization: `Bearer ${STRONG_TOKEN}`, "X-Forwarded-For": "10.5.5.5" } })).status;
  const afterClear = await adminFail3({ "X-Forwarded-For": "10.5.5.5" });
  check("R5: successful auth clears the failure budget (401, not 429)", cleared3 && success3 === 200 && afterClear === 401, `success=${success3} after=${afterClear}`);

  // 15. R1: forged X-Forwarded-For cannot freely choose the rate-limit
  // bucket — invalid values collapse to the socket bucket (3/min), and the
  // LAST syntactically valid IP is selected, never the first.
  const a = await post3("/api/quote", VALID, { "X-Forwarded-For": "not-an-ip, garbage!!" });
  const b = await post3("/api/quote", VALID, { "X-Forwarded-For": "<evil> junk, also-not-ip" });
  const c = await post3("/api/quote", VALID);
  const d = await post3("/api/quote", VALID, { "X-Forwarded-For": "yet-another-garbage" });
  check("R1: invalid forged XFF collapses to the socket bucket (201, 201, 201, 429)", a.status === 201 && b.status === 201 && c.status === 201 && d.status === 429, `a=${a.status} b=${b.status} c=${c.status} d=${d.status}`);
  const e = await post3("/api/quote", VALID, { "X-Forwarded-For": "127.0.0.1, 10.9.8.7" });
  check("R1: last syntactically valid forwarded IP is selected (201, not first-hop 429)", e.status === 201, "got " + e.status);

  // 16. R8 success path: 201 is only returned after persistence.
  const listedFinal = await (await fetch(BASE + "/api/quote-requests", { headers: { Authorization: `Bearer ${STRONG_TOKEN}` } })).json();
  check("R8: 201 only after persistence (record readable back)", listedFinal.requests?.some((r) => r.id === goodJson.id) === true, `count=${listedFinal.count}`);
} catch (err) {
  check("suite ran without exception", false, String(err));
} finally {
  server.kill("SIGTERM");
  server3.kill("SIGTERM");
}

console.log(failed === 0 ? "\nALL API TESTS PASSED" : `\n${failed} TEST(S) FAILED`);
process.exit(failed === 0 ? 0 : 1);
