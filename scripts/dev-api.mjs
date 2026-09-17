/**
 * Local API for development: serves the exact same handlers as the Vercel
 * functions over plain node:http so the form can be tested end-to-end with
 * `npm run dev:api` (default http://localhost:8787).
 *
 *   QUOTE_STORE=file  → records persisted in .dev-data/quotes.ndjson
 */
import http from "node:http";
import fs from "node:fs";
import { adminRequests, allowedOrigin, intakeQuote, json } from "../lib/quote-core.mjs";

const port = Number(process.env.PORT || 8787);
process.env.DEV_DATA_FILE ??= ".dev-data/quotes.ndjson";
fs.mkdirSync(".dev-data", { recursive: true });

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${port}`);
  const origin = allowedOrigin(process.env, req.headers.origin);

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Methods": "GET, POST, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    });
    return res.end();
  }
  try {
    if (url.pathname === "/api/quote") {
      if (req.method !== "POST") return json(res, 405, { ok: false, error: "Méthode non permise." }, { origin });
      const result = await intakeQuote(req, process.env);
      console.info("[dev-api] intake →", result.status, JSON.stringify(result.body).slice(0, 160));
      return json(res, result.status, result.body, { origin });
    }
    if (url.pathname === "/api/quote-requests") {
      const result = await adminRequests(req, req.method, process.env);
      return json(res, result.status, result.body, { origin });
    }
    return json(res, 404, { ok: false, error: "Not found" });
  } catch (err) {
    console.error("[dev-api] error:", err);
    return json(res, 500, { ok: false, error: "Erreur interne." });
  }
});

server.listen(port, () => console.info(`FEL DRONE dev API on http://localhost:${port} (store: ${process.env.DEV_DATA_FILE})`));
