/**
 * Vercel serverless function — POST /api/quote
 * Public intake endpoint for quote/service requests. All logic lives in
 * lib/quote-core.mjs (validation, rate limiting, storage, notification).
 */
import { allowedOrigin, json } from "../lib/quote-core.mjs";
import { intakeQuote } from "../lib/quote-core.mjs";

export const method = "POST";

export default async function handler(req, res) {
  const origin = allowedOrigin(process.env, req.headers.origin);

  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Max-Age", "86400");
    if (origin) res.setHeader("Access-Control-Allow-Origin", origin);
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return json(res, 405, { ok: false, error: "Méthode non permise.", allow: "POST" }, { origin });
  }

  const result = await intakeQuote(req, process.env);
  if (result.debug) {
    // dev introspection only — never surfaced in production payloads
    console.info("[quote]", JSON.stringify(result.debug));
  }
  return json(res, result.status, result.body, { origin });
}
