/**
 * FEL DRONE — route table (V12).
 *
 * Real paths, no hash routing: every journey the site cares about has its own
 * URL that can be refreshed, shared and indexed. The table is deliberately
 * declarative so the router, the SEO layer, the sitemap and the i18n checker
 * all read the same source.
 *
 * V12 keeps the V11 anchors working *in addition*: the home page still exposes
 * `#expertise`, `#services`, `#methode`, `#demonstration`, `#equipement`,
 * `#securite`, `#direction`, `#faq`, `#contact`, `#mentions-legales`, so older
 * links keep resolving while the navigation rail now points at real routes.
 */

export type RouteName =
  | "home"
  | "services"
  | "service"
  | "devis"
  | "contact"
  | "about"
  | "notFound";

export type RouteMatch = {
  name: RouteName;
  /** Only set for `name === "service"` — the six service detail pages. */
  serviceSlug?: ServicePageSlug;
  /** The path that was matched (normalised). */
  path: string;
};

/** Top-level routes. Order matters only for readability. */
export const PATHS = {
  home: "/",
  services: "/services",
  devis: "/devis",
  contact: "/contact",
  about: "/a-propos",
} as const;

/**
 * The six service detail pages. `/services/vente-location` deliberately groups
 * the two commercial poles (Vente, Location) into one page: they are the same
 * conversation for a buyer, and the corporate site must not let commerce
 * dominate the professional services.
 *
 * `sources` maps a route to the V11 service entries whose already-validated,
 * already-translated content the page reuses. Nothing new is claimed: the
 * detail pages recompose verified content instead of inventing capabilities.
 */
export type ServicePageSlug =
  | "topographie"
  | "inspection"
  | "thermographie"
  | "agriculture"
  | "maintenance"
  | "vente-location";

export const SERVICE_PAGES: { slug: ServicePageSlug; sources: string[] }[] = [
  { slug: "topographie", sources: ["topographie"] },
  { slug: "inspection", sources: ["suivi-chantier"] },
  { slug: "maintenance", sources: ["maintenance"] },
  { slug: "thermographie", sources: ["thermographie"] },
  { slug: "agriculture", sources: ["agriculture"] },
  { slug: "vente-location", sources: ["vente", "location"] },
];

export const SERVICE_PAGE_SLUGS: ServicePageSlug[] = SERVICE_PAGES.map((s) => s.slug);

/**
 * Map a V11 service entry (the seven commercial poles) to its V12 route. Vente
 * and Location both live on `/services/vente-location`.
 */
export function routeForLegacyService(legacySlug: string): string | null {
  const page = SERVICE_PAGES.find((p) => p.sources.includes(legacySlug));
  return page ? servicePath(page.slug) : null;
}

export function servicePath(slug: string): string {
  return `/services/${slug}`;
}

/** Every route the sitemap and the SEO layer know about. */
export function allPaths(): string[] {
  return [PATHS.home, PATHS.services, ...SERVICE_PAGE_SLUGS.map(servicePath), PATHS.devis, PATHS.contact, PATHS.about];
}

/**
 * Normalise a browser path into the app's own path space:
 *  · strip the deployment base (`/app/` on GitHub Pages, `/` on Vercel)
 *  · drop query/hash, collapse duplicate slashes
 *  · drop the trailing slash except for the root
 */
export function normalizePath(raw: string, base: string): string {
  let path = (raw || "/").split("?")[0].split("#")[0];
  const normalisedBase = base.endsWith("/") ? base.slice(0, -1) : base;
  if (normalisedBase && normalisedBase !== "/" && path.startsWith(normalisedBase)) {
    path = path.slice(normalisedBase.length) || "/";
  }
  path = path.replace(/\/{2,}/g, "/");
  if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
  return path.startsWith("/") ? path : `/${path}`;
}

/** Resolve a normalised path to a route. Unknown paths → the 404 view. */
export function matchRoute(path: string): RouteMatch {
  if (path === PATHS.home) return { name: "home", path };
  if (path === PATHS.services) return { name: "services", path };
  if (path === PATHS.devis) return { name: "devis", path };
  if (path === PATHS.contact) return { name: "contact", path };
  if (path === PATHS.about) return { name: "about", path };
  if (path.startsWith("/services/")) {
    const slug = path.slice("/services/".length);
    if ((SERVICE_PAGE_SLUGS as string[]).includes(slug)) {
      return { name: "service", serviceSlug: slug as ServicePageSlug, path };
    }
  }
  return { name: "notFound", path };
}
