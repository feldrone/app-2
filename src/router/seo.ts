/**
 * FEL DRONE — per-route SEO (V12).
 *
 * The site is one static bundle served for every route, so the document head is
 * the only place a crawler learns what the current page is. This hook owns that
 * head: title, description, canonical and the Open Graph trio, in the active
 * language, for the active route.
 *
 * Rules kept from V11:
 *  · nothing is invented — descriptions restate what the page actually says;
 *  · the canonical URL is the real path on the production domain;
 *  · the structured data in `template.html` (Organization) stays truthful and
 *    is not duplicated per route;
 *  · `og:image` keeps the existing, real photograph — no fake social card.
 */
import { useEffect, useLayoutEffect } from "react";
import { company } from "../data/company";
import { useI18n } from "../i18n";

const SITE_NAME = "FEL DRONE";

function ogLocaleFor(locale: string): string {
  if (locale === "ar") return "ar_DZ";
  if (locale === "en") return "en";
  return "fr_DZ";
}

function setMeta(selector: string, attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  if (el.getAttribute("content") !== content) el.setAttribute("content", content);
}

export type PageMeta = {
  /** Page title without the brand suffix — the hook appends it once. */
  title: string;
  description: string;
  /** App path, e.g. `/services/topographie`. */
  path: string;
  /** 404 and other non-indexable views. */
  noindex?: boolean;
};

export function usePageMeta({ title, description, path, noindex }: PageMeta) {
  const { locale } = useI18n();
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} — ${SITE_NAME}`;
  const canonical = `${company.url.replace(/\/+$/, "")}${path === "/" ? "/" : path}`;

  // Layout effect: the head is correct before the first paint of the new route.
  useLayoutEffect(() => {
    document.title = fullTitle;
    setMeta('meta[name="description"]', "name", "description", description);
    setMeta('meta[property="og:title"]', "property", "og:title", fullTitle);
    setMeta('meta[property="og:description"]', "property", "og:description", description);
    setMeta('meta[property="og:site_name"]', "property", "og:site_name", SITE_NAME);
    setMeta('meta[property="og:type"]', "property", "og:type", "website");
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", fullTitle);
    setMeta('meta[name="twitter:description"]', "name", "twitter:description", description);
    setMeta('meta[name="robots"]', "name", "robots", noindex ? "noindex, follow" : "index, follow");

    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (noindex) {
      // A non-indexable view (the 404 route) must not advertise a canonical URL
      // for a path that does not exist — nor inherit the template's home one.
      link?.remove();
      document.head.querySelector('meta[property="og:url"]')?.remove();
    } else {
      setMeta('meta[property="og:url"]', "property", "og:url", canonical);
      if (!link) {
        link = document.createElement("link");
        link.rel = "canonical";
        document.head.appendChild(link);
      }
      if (link.getAttribute("href") !== canonical) link.setAttribute("href", canonical);
    }
  }, [fullTitle, description, canonical, noindex]);

  // The OG locale follows the reading language (the URL does not carry it).
  useEffect(() => {
    setMeta('meta[property="og:locale"]', "property", "og:locale", ogLocaleFor(locale));
  }, [locale]);
}
