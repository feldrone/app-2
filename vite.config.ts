import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages deployment lives under the /app/ project path — every
  // bundled and public asset URL must be prefixed with it. Vite rewrites
  // index.html references (favicon, module scripts) and publicDir files
  // (brand SVGs, robots, sitemap) through this base at build time.
  base: process.env.VITE_BASE ?? "/app/",
  plugins: [
    react(),
    tailwindcss(),
    viteSingleFile(),
    {
      // The static entry is template.html; Pages (and vite preview) need the
      // emitted file named index.html — rename it in the bundle graph.
      name: "entry-rename-to-index",
      enforce: "post",
      generateBundle(_options, bundle) {
        const key = Object.keys(bundle).find(
          (k) => bundle[k].fileName === "template.html",
        );
        if (key) {
          const file = bundle[key];
          file.fileName = "index.html";
          delete bundle[key];
          bundle["index.html"] = file;
        }
      },
    },
  ],
  build: {
    // Static HTML source entry. The repo-root index.html is reserved for the
    // built single-file bundle that GitHub Pages' branch-source pipeline
    // serves (kept in sync via npm run pages:sync / CI).
    // (object form keeps the emitted name as index.html, not template.html)
    rollupOptions: { input: { index: path.resolve(__dirname, "template.html") } },
  },
  server: {
    // Allow the sandbox/preview host (and any *.e2b.app dev host) in dev and preview.
    allowedHosts: [".e2b.app"],
    open: "/template.html",
    // Dev convenience: the quote API runs next to vite (npm run dev:api).
    proxy: { "/api": "http://localhost:8787" },
  },
  preview: {
    allowedHosts: [".e2b.app"],
    // Same /api wiring as dev, so `npm run preview` demos the real backend
    // flow (pair with `npm run dev:api`).
    proxy: { "/api": "http://localhost:8787" },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
