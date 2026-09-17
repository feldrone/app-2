/**
 * Vercel serverless function — /api/quote-requests
 * Private management surface (foundation for a future admin dashboard):
 *   GET   ?status=new&limit=100  — list requests
 *   PATCH { id, status }         — update a request's workflow status
 *
 * Authentication is Bearer-only: `Authorization: Bearer <ADMIN_TOKEN>`.
 * Query-string tokens (e.g. `?token=`) are NOT an authentication method.
 * The surface stays closed (401) when ADMIN_TOKEN is missing or weaker than
 * 32 characters, and repeated auth failures per IP are rate-limited (429).
 *
 * Persistence integrity (baseline R8): when the store cannot be read or
 * written (non-2xx Upstash), this route answers 503 — never a false 200.
 */
import { allowedOrigin, json } from "../lib/quote-core.mjs";
import { adminRequests } from "../lib/quote-core.mjs";

export default async function handler(req, res) {
  const origin = allowedOrigin(process.env, req.headers.origin);

  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Methods", "GET, PATCH, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
    if (origin) res.setHeader("Access-Control-Allow-Origin", origin);
    return res.status(204).end();
  }

  if (req.method !== "GET" && req.method !== "PATCH") {
    return json(res, 405, { ok: false, error: "Méthode non permise." }, { origin });
  }

  const result = await adminRequests(req, req.method, process.env);
  return json(res, result.status, result.body, { origin });
}
