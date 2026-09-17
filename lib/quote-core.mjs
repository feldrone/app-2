/**
 * FEL DRONE — quote-request core (framework-free, dependency-free) — V10.
 *
 * Same module runs inside Vercel serverless functions (`api/*.js`) and in
 * the local dev server (`scripts/dev-api.mjs`). No secrets are imported
 * anywhere except via `process.env` at call time, so nothing can leak into
 * the frontend bundle (which never imports this file).
 *
 * V10: adds optional company, required wilaya (for new forms), preserves
 * backward compat with V8 payloads (without wilaya) — validation, sanitization,
 * honeypot, rate limiting, CORS, payload protection, durable storage,
 * admin protection, honest email status all preserved.
 *
 * Security baseline (R1–R10 + R14): NFC normalization + bidi/zero-width
 * stripping; last-valid X-Forwarded-For selection (never the first hop);
 * strict JSON Content-Type (415); timing-safe Bearer-only ADMIN_TOKEN
 * (query tokens removed, weak/default tokens refused); bounded admin
 * auth-failure budget (10/15 min → 429); Upstash rate-limit calls with a
 * 5 s timeout and a bounded per-instance fallback (never fail-open);
 * body caps on Content-Length/parsed/streamed bodies (413); and
 * redisStore.save()/setStatus()/list() rejecting every non-2xx Upstash
 * response (persistence failure → 503, never a false 201/200).
 * See SECURITY_BASELINE.md / SECURITY_HARDENING_GATE_B.md.
 */
import { randomUUID, timingSafeEqual } from "node:crypto";
import fsNode from "node:fs";

export const SERVICES = [
  "Topographie & photogrammétrie",
  "Suivi & inspection de chantier",
  "Maintenance & diagnostic drone",
  "Thermographie",
  "Agriculture",
  "Vente",
  "Location",
  "Autre",
  // Legacy V8 values for backward compatibility
  "Maintenance",
  "Prestations de services",
  "Inspection sur chantier",
];

export const LIMITS = {
  name: 80,
  phone: 20,
  email: 120,
  company: 120,
  wilaya: 80,
  service: 60,
  message: 3000,
};

/**
 * R1: NFC-normalize, then strip control chars, angle brackets, null bytes,
 * bidi controls (U+202A–202E, U+2066–2069, U+061C, …) and zero-width
 * characters (ZWSP/ZWNJ/ZWJ, U+2060 word joiner, U+FEFF, …).
 */
const BIDI_AND_ZERO_WIDTH = /[\u00ad\u034f\u061c\u180e\u200b-\u200f\u202a-\u202e\u2060-\u2064\u2066-\u2069\ufeff]/g;

function clean(value, max) {
  if (typeof value !== "string") return "";
  return value
    .normalize("NFC")
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f<>]/g, "")
    .replace(BIDI_AND_ZERO_WIDTH, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

export function validateQuote(raw) {
  const errors = {};
  const src = raw && typeof raw === "object" ? raw : {};

  const message = clean(src.message, LIMITS.message);
  const value = {
    name: clean(src.name, LIMITS.name),
    phone: clean(src.phone, LIMITS.phone),
    email: src.email === undefined || src.email === null || src.email === "" ? null : clean(src.email, LIMITS.email),
    company: src.company === undefined || src.company === null || src.company === "" ? null : clean(src.company, LIMITS.company),
    wilaya: clean(src.wilaya ?? src.wilayaDuBesoin ?? "", LIMITS.wilaya),
    service: SERVICES.includes(String(src.service ?? "").trim()) ? String(src.service).trim() : "",
    message,
  };

  if (value.name.length < 2) errors.name = "Nom trop court (2 caractères minimum).";
  const phoneDigits = (value.phone.match(/\d/g) ?? []).length;
  if (!/^[+0-9][0-9 ().+/–-]{5,19}$/.test(value.phone) || phoneDigits < 8 || phoneDigits > 15)
    errors.phone = "Numéro de téléphone invalide.";
  if (value.email !== null && !/^[^\\s@]+@[^\\s@]+\.[^\\s@]{2,}$/.test(value.email))
    errors.email = "Format d'email invalide.";
  if (value.company !== null && value.company.length > LIMITS.company) errors.company = "Société trop longue.";
  // Wilaya required for V10 when field is present; allow legacy V8 payloads without wilaya for backward compat
  if (src.wilaya !== undefined || src.wilayaDuBesoin !== undefined) {
    if (value.wilaya.length < 2) errors.wilaya = "Wilaya du besoin trop courte (2 caractères minimum).";
  }
  if (!value.service) errors.service = "Service inconnu ou manquant.";
  if (value.message.length < 15) errors.message = "Message trop court (15 caractères minimum).";

  return { ok: Object.keys(errors).length === 0, errors, value };
}

/* ------------------------------------------------------------------ */
/* Storage — Upstash Redis when configured, file in dev, memory worst. */
/* ------------------------------------------------------------------ */

export function createStore(env = process.env) {
  const url = env.UPSTASH_REDIS_REST_URL;
  const token = env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) return redisStore(url, token, fetch);
  if (env.DEV_DATA_FILE) return fileStore(env.DEV_DATA_FILE);
  return memoryStore();
}

const KEY = "feldrone:quotes";

function redisStore(url, token, fetchImpl) {
  // R8: a non-2xx Upstash REST response IS a persistence failure. Reject on
  // every one of them — swallowing a 4xx/5xx here is what made a lost write
  // look like a successful 201.
  const call = async (...args) => {
    const res = await fetchImpl(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(args),
    });
    if (!res.ok) throw new Error(`upstash:${res.status}`);
    return (await res.json()).result;
  };
  return {
    kind: "redis",
    async save(record) {
      await call("HSET", KEY, record.id, JSON.stringify(record));
    },
    async list(limit = 200) {
      const result = await call("HGETALL", KEY);
      const out = [];
      for (let i = 0; i < (result ?? []).length; i += 2) {
        try {
          out.push(JSON.parse(result[i + 1]));
        } catch {
          /* corrupted entry — skip, never leak */
        }
      }
      return out.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)).slice(0, limit);
    },
    async setStatus(id, status) {
      const result = await call("HGET", KEY, id);
      if (!result) return null;
      const record = { ...JSON.parse(result), status, updatedAt: new Date().toISOString() };
      await call("HSET", KEY, id, JSON.stringify(record));
      return record;
    },
  };
}

function memoryStore() {
  const data = new Map();
  return {
    kind: "memory",
    async save(record) {
      data.set(record.id, record);
    },
    async list(limit = 200) {
      return [...data.values()].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)).slice(0, limit);
    },
    async setStatus(id, status) {
      const r = data.get(id);
      if (!r) return null;
      const next = { ...r, status, updatedAt: new Date().toISOString() };
      data.set(id, next);
      return next;
    },
  };
}

function fileStore(file) {
  const fs = () => fsNode;
  return {
    kind: "file",
    async save(record) {
      fs().appendFileSync(file, JSON.stringify(record) + "\n");
    },
    async list(limit = 200) {
      try {
        const lines = fs().readFileSync(file, "utf8").split("\n").filter(Boolean);
        return lines
          .map((l) => {
            try {
              return JSON.parse(l);
            } catch {
              return null;
            }
          })
          .filter(Boolean)
          .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
          .slice(0, limit);
      } catch {
        return [];
      }
    },
    async setStatus(id, status) {
      const all = await this.list(10000);
      const target = all.find((r) => r.id === id);
      if (!target) return null;
      const updated = all.map((r) => (r.id === id ? { ...r, status, updatedAt: new Date().toISOString() } : r));
      fs().writeFileSync(file, updated.map((r) => JSON.stringify(r)).join("\n") + "\n");
      return updated.find((r) => r.id === id);
    },
  };
}

/* ------------------------------------------------------------------ */
/* Rate limiting — fixed windows; Redis when present, memory fallback. */
/* ------------------------------------------------------------------ */

export function createRateLimiter(env = process.env) {
  const perMinute = Number(env.RATE_LIMIT_PER_MINUTE ?? 3);
  const perDay = Number(env.RATE_LIMIT_PER_DAY ?? 10);
  const url = env.UPSTASH_REDIS_REST_URL;
  const token = env.UPSTASH_REDIS_REST_TOKEN;

  // R6: bounded per-instance fallback. A Redis outage degrades to THIS
  // limiter — never to an unrestricted `true` (fail-open).
  const hits = new Map();
  const memoryCheck = (ip) => {
    const now = Date.now();
    let entry = hits.get(ip);
    if (!entry) hits.set(ip, (entry = { minute: [], day: [] }));
    entry.minute = entry.minute.filter((t) => now - t < 60_000);
    entry.day = entry.day.filter((t) => now - t < 86_400_000);
    if (entry.minute.length >= perMinute || entry.day.length >= perDay) return false;
    entry.minute.push(now);
    entry.day.push(now);
    if (hits.size > 10_000) {
      for (const [k, v] of hits) {
        if (!v.minute.length && !v.day.length) hits.delete(k);
        if (hits.size <= 5_000) break;
      }
    }
    return true;
  };

  if (url && token) {
    return {
      async check(ip) {
        const call = async (...args) => {
          const res = await fetch(url, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify(args),
            signal: AbortSignal.timeout(5000), // R6: bounded Upstash timeout
          });
          if (!res.ok) throw new Error(`rate:${res.status}`);
          return (await res.json()).result;
        };
        try {
          const minute = await call("INCR", `feldrone:rl:m:${ip}`, "EXPIRE", 61);
          const day = await call("INCR", `feldrone:rl:d:${ip}`, "EXPIRE", 86461);
          return minute <= perMinute && day <= perDay;
        } catch {
          return memoryCheck(ip); // R6: bounded fallback, never fail-open
        }
      },
    };
  }

  return {
    async check(ip) {
      return memoryCheck(ip);
    },
  };
}

/* ------------------------------------------------------------------ */
/* Notification email — Resend REST, env-gated, never throws.          */
/* ------------------------------------------------------------------ */

export async function notifyCompany(record, env = process.env) {
  const key = env.RESEND_API_KEY;
  const to = env.NOTIFY_TO;
  const from = env.EMAIL_FROM;
  if (!key || !to || !from) return { sent: false, reason: "email-not-configured" };
  const text = [
    "Nouvelle demande reçue via feldrone.dz — V10",
    "",
    `Référence : ${record.id}`,
    `Nom      : ${record.name}`,
    `Téléphone: ${record.phone}`,
    `Société  : ${record.company ?? "—"}`,
    `Wilaya du besoin : ${record.wilaya || "—"}`,
    `Email    : ${record.email ?? "—"}`,
    `Service demandé : ${record.service}`,
    `Date     : ${record.createdAt}`,
    "",
    "Précisions utiles :",
    record.message,
    "",
    `Traiter la demande : API ${env.SITE_ORIGIN ?? "(déploiement)"}/api/quote-requests`,
  ].join("\n");
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: to.split(","), subject: `Demande ${record.service} — ${record.name} — ${record.wilaya || ""}`, text }),
      signal: AbortSignal.timeout(6000),
    });
    return { sent: res.ok, reason: res.ok ? undefined : `resend:${res.status}` };
  } catch (err) {
    return { sent: false, reason: String(err?.name ?? err) };
  }
}

/* ------------------------------------------------------------------ */
/* HTTP plumbing shared by Vercel and the dev server.                  */
/* ------------------------------------------------------------------ */

export function json(res, status, body, { origin } = {}) {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer",
  };
  if (origin) headers["Access-Control-Allow-Origin"] = origin;
  send(res, status, JSON.stringify(body), headers);
}

export function send(res, status, payload, headers = {}) {
  if (res.headersSent) return;
  res.writeHead(status, headers);
  res.end(payload);
}

export function allowedOrigin(env, requestOrigin) {
  if (!requestOrigin) return null;
  const list = (env.SITE_ORIGIN ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  return list.includes(requestOrigin) ? requestOrigin : null;
}

/** R2: strict JSON Content-Type — `application/json` (charset allowed). */
function isJsonContentType(req) {
  const ct = req.headers?.["content-type"];
  if (typeof ct !== "string") return false;
  return ct.split(";")[0].trim().toLowerCase() === "application/json";
}

/* ------------------------------------------------------------------ */
/* Admin auth (R3/R4/R5): timing-safe, Bearer-only, no query tokens,   */
/* weak tokens refused, bounded per-IP failure budget.                 */
/* ------------------------------------------------------------------ */

const ADMIN_FAILURE_WINDOW_MS = 15 * 60 * 1000;
const ADMIN_FAILURE_LIMIT = 10;
const adminFailures = new Map(); // ip -> number[] — bounded, pruned per access

const KNOWN_DEFAULT_ADMIN_TOKENS = new Set([
  "admin",
  "admin-token",
  "admin123",
  "changeme",
  "change-me",
  "default",
  "feldrone-admin",
  "password",
  "secret",
  "test-admin-token",
]);

function adminTokenUsable(token) {
  return (
    typeof token === "string" &&
    token.length >= 32 &&
    !KNOWN_DEFAULT_ADMIN_TOKENS.has(token.toLowerCase())
  );
}

function timingSafeTokenMatch(presented, expected) {
  const a = Buffer.from(presented, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) {
    timingSafeEqual(a, a); // uniform timing before reporting a length mismatch
    return false;
  }
  return timingSafeEqual(a, b);
}

function pruneAdminFailures(now) {
  if (adminFailures.size <= 10_000) return;
  for (const [ip, ts] of adminFailures) {
    const recent = ts.filter((t) => now - t < ADMIN_FAILURE_WINDOW_MS);
    if (recent.length) adminFailures.set(ip, recent);
    else adminFailures.delete(ip);
    if (adminFailures.size <= 5_000) return;
  }
}

export function readJsonBody(req, maxBytes = 32 * 1024) {
  return new Promise((resolve, reject) => {
    const tooBig = () => reject(Object.assign(new Error("payload_too_large"), { status: 413 }));
    // R7: Content-Length is enforced before any body bytes are read.
    const contentLength = Number(req.headers?.["content-length"]);
    if (Number.isFinite(contentLength) && contentLength > maxBytes) return tooBig();
    // R7: pre-parsed bodies (Vercel `req.body`) are bounded by serialized size.
    if (req.body && typeof req.body === "object") {
      let size;
      try {
        size = JSON.stringify(req.body).length;
      } catch {
        return tooBig();
      }
      if (size > maxBytes) return tooBig();
      return resolve(req.body);
    }
    if (typeof req.text === "function") {
      req
        .text()
        .then((t) => {
          if (t.length > maxBytes) throw Object.assign(new Error("payload_too_large"), { status: 413 });
          return resolve(t ? JSON.parse(t) : {});
        })
        .catch(reject);
      return;
    }
    let size = 0;
    let aborted = false;
    const chunks = [];
    req.on("data", (c) => {
      if (aborted) return;
      size += c.length;
      if (size > maxBytes) {
        aborted = true;
        tooBig();
        return;
      }
      chunks.push(c);
    });
    req.on("end", () => {
      if (aborted) return;
      try {
        resolve(chunks.length ? JSON.parse(Buffer.concat(chunks).toString("utf8")) : {});
      } catch {
        reject(Object.assign(new Error("invalid_json"), { status: 400 }));
      }
    });
    req.on("error", (e) => {
      if (!aborted) reject(e);
    });
  });
}

const IPV4_RE = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
const IPV6_CHARS_RE = /^[0-9a-fA-F:]+$/;

/** R1: bounded IPv4/IPv6 syntax check — no parser, hard length caps. */
function isForwardedIp(v) {
  const s = v.trim();
  if (s.length < 3 || s.length > 45) return false;
  if (IPV4_RE.test(s)) return s.split(".").every((o) => Number(o) <= 255);
  // Bounded IPv6: hex + colons only, at least two colons, no zone/scope chars.
  return IPV6_CHARS_RE.test(s) && (s.match(/:/g) ?? []).length >= 2;
}

/**
 * R1: never trust the first caller-supplied X-Forwarded-For value. Select
 * the LAST syntactically valid forwarded IP; fall back to the socket
 * address when the header is absent or carries no valid IP (so forged
 * garbage can neither pick an arbitrary bucket nor inflate key space).
 */
export function clientIp(req) {
  const fwd = req.headers?.["x-forwarded-for"];
  if (typeof fwd === "string" && fwd.length) {
    const parts = fwd.split(",");
    for (let i = parts.length - 1; i >= 0; i--) {
      if (isForwardedIp(parts[i])) return parts[i].trim();
    }
  }
  return req.socket?.remoteAddress ?? "unknown";
}

let sharedStore = null;
let sharedLimiter = null;
export function getStore(env = process.env) {
  return (sharedStore ??= createStore(env));
}
export function getLimiter(env = process.env) {
  return (sharedLimiter ??= createRateLimiter(env));
}

export async function intakeQuote(req, env = process.env, services = { notify: notifyCompany }) {
  const store = services.store ?? getStore(env);
  const limiter = services.limiter ?? getLimiter(env);

  const ip = clientIp(req);

  // R2: strict JSON Content-Type for intake (415 on missing/invalid).
  if (!isJsonContentType(req)) {
    return { status: 415, body: { ok: false, error: "Content-Type application/json requis." } };
  }

  let payload;
  try {
    payload = await readJsonBody(req, 32 * 1024); // R7: 32 KB cap (CL/parsed/streamed)
  } catch (err) {
    return { status: err.status ?? 400, body: { ok: false, error: "Requête illisible." } };
  }

  if (typeof payload.website === "string" && payload.website !== "") {
    return { status: 201, body: { ok: true, id: randomUUID() } };
  }

  if (!(await limiter.check(ip))) {
    return { status: 429, body: { ok: false, error: "Trop de demandes récentes. Réessayez dans une minute." } };
  }

  const { ok, errors, value } = validateQuote(payload);
  if (!ok) return { status: 400, body: { ok: false, error: "Certains champs doivent être corrigés.", fields: errors } };

  const record = {
    id: randomUUID(),
    ...value,
    status: "new",
    createdAt: new Date().toISOString(),
  };

  try {
    await store.save(record);
  } catch {
    return { status: 503, body: { ok: false, error: "Le service est momentanément indisponible. Merci de réessayer ou de nous appeler." } };
  }

  const mail = await notifyCompany(record, env).catch(() => ({ sent: false, reason: "notify-error" }));

  return {
    status: 201,
    body: { ok: true, id: record.id },
    debug: env.NODE_ENV === "production" ? undefined : { store: store.kind, email: mail },
  };
}

export async function adminRequests(req, method, env = process.env) {
  // R3/R4: Bearer-only authentication. Query-string tokens (e.g. ?token=)
  // and every non-Bearer scheme are NOT authentication, ever.
  const authHeader = typeof req.headers?.authorization === "string" ? req.headers.authorization : "";
  const presented = /^Bearer\s+(\S+)$/i.test(authHeader) ? authHeader.replace(/^Bearer\s+/i, "").trim() : "";

  // R3: a missing/weak/default ADMIN_TOKEN (<32 chars or known default)
  // keeps the private surface fully closed — no oracle, no fallback.
  const usable = adminTokenUsable(env.ADMIN_TOKEN);
  if (!usable || !timingSafeTokenMatch(presented, String(env.ADMIN_TOKEN))) {
    if (usable) {
      // R5: bounded per-IP failure budget — 10 failures / 15 min → 429.
      const ip = clientIp(req);
      const now = Date.now();
      const recent = (adminFailures.get(ip) ?? []).filter((t) => now - t < ADMIN_FAILURE_WINDOW_MS);
      if (recent.length >= ADMIN_FAILURE_LIMIT) {
        return { status: 429, body: { ok: false, error: "Trop de tentatives d'authentification. Réessayez dans 15 minutes." } };
      }
      recent.push(now);
      pruneAdminFailures(now);
      adminFailures.set(ip, recent);
    }
    return { status: 401, body: { ok: false, error: "Non autorisé." } };
  }

  // R5: successful authentication clears the IP's failure budget.
  adminFailures.delete(clientIp(req));

  const query = new URL(req.url ?? "/", "http://local");
  const store = getStore(env);
  if (method === "GET") {
    const limit = Math.min(500, Number(query.searchParams.get("limit") ?? 100));
    const statusFilter = query.searchParams.get("status");
    let list;
    try {
      list = await store.list(limit);
    } catch {
      // R8: the store cannot be read — answer 503, never an empty 200.
      return { status: 503, body: { ok: false, error: "Le service est momentanément indisponible. Merci de réessayer." } };
    }
    if (statusFilter) list = list.filter((r) => r.status === statusFilter);
    return { status: 200, body: { ok: true, count: list.length, requests: list } };
  }
  if (method === "PATCH") {
    // R2: strict JSON Content-Type for admin PATCH.
    if (!isJsonContentType(req)) {
      return { status: 415, body: { ok: false, error: "Content-Type application/json requis." } };
    }
    let payload;
    try {
      payload = await readJsonBody(req, 4096); // 4 KB admin cap preserved (R7)
    } catch (err) {
      return { status: err.status ?? 400, body: { ok: false, error: "Requête illisible." } };
    }
    const allowed = ["new", "in_review", "scheduled", "done", "archived"];
    if (!payload.id || !allowed.includes(payload.status)) return { status: 400, body: { ok: false, error: "id et status requis." } };
    let updated;
    try {
      updated = await store.setStatus(String(payload.id).slice(0, 64), payload.status);
    } catch {
      // R8: the write could not be persisted — answer 503, never a false 200.
      return { status: 503, body: { ok: false, error: "Le service est momentanément indisponible. Merci de réessayer." } };
    }
    return updated
      ? { status: 200, body: { ok: true, request: updated } }
      : { status: 404, body: { ok: false, error: "Demande introuvable." } };
  }
  return { status: 405, body: { ok: false, error: "Méthode non permise." } };
}
