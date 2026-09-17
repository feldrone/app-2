/**
 * GitHub Pages sync (legacy branch-source mode).
 * Pages deploys this repo's ROOT folder, so the entry index.html at the
 * root must be the BUILT single-file bundle (the app template lives in
 * template.html). Run after `npm run build`:
 *   node scripts/sync-pages.mjs
 * Copies dist/index.html → ./index.html (with a do-not-edit banner),
 * dist/404.html → ./404.html (deep-link hand-off, see public/404.html),
 * public/favicon.svg → ./favicon.svg, and the two crawler files
 * (robots.txt, sitemap.xml) so /app/robots.txt resolves on Pages and the V12
 * route list in sitemap.xml is actually reachable from the deployed root.
 * CI does this automatically; the Actions-artifact pipeline remains the
 * forward-looking deploy path if the Pages source is switched to
 * "GitHub Actions".
 */
import fs from "node:fs";

const banner =
  "<!-- GENERATED FILE — built artifact of template.html (npm run build && npm run pages:sync). Do not edit by hand. -->\n";

const distHtml = fs.readFileSync("dist/index.html", "utf8");
if (distHtml.includes("/src/main.tsx")) {
  console.error("refusing to sync: dist/index.html looks like the dev template, run the build first");
  process.exit(1);
}
fs.writeFileSync("index.html", banner + distHtml);
fs.copyFileSync("public/favicon.svg", "favicon.svg");

// Deep links on Pages: an unknown path must be answered by the hand-off page
// that parks the route and returns to the app (dist/404.html is copied by Vite
// from public/404.html).
const notFound = "dist/404.html";
if (!fs.existsSync(notFound)) {
  console.error("refusing to sync: dist/404.html is missing (is public/404.html present?)");
  process.exit(1);
}
fs.copyFileSync(notFound, "404.html");

for (const crawlerFile of ["robots.txt", "sitemap.xml"]) {
  const from = "dist/" + crawlerFile;
  if (fs.existsSync(from)) fs.copyFileSync(from, crawlerFile);
}

console.log(
  "synced: index.html (" +
    (banner.length + distHtml.length) +
    " bytes) + 404.html (" +
    fs.statSync("404.html").size +
    " bytes) + favicon.svg + robots.txt + sitemap.xml",
);
