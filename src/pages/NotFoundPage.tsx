import { ArrowRight, Compass } from "lucide-react";
import { Link } from "../router";
import { PATHS } from "../router/routes";
import { useDict } from "../i18n";
import { usePageMeta } from "../router/seo";

/**
 * 404 — a real page, not a stack trace.
 *
 * Status semantics: this is a static bundle served for unknown paths, so the
 * HTTP status is still 200 (GitHub Pages serves `404.html`, which hands the
 * path back to the app). The page therefore says plainly that the address does
 * not exist, marks itself `noindex` so it never enters an index, and offers the
 * three routes a lost visitor actually wants.
 */
export default function NotFoundPage({ path }: { path: string }) {
  const dict = useDict();
  const t = dict.routes.notFound;
  const c = dict.routes.common;
  usePageMeta({ title: t.meta.title, description: t.meta.description, path, noindex: true });

  const links = [
    { to: PATHS.home, label: t.homeCta, primary: true },
    { to: PATHS.services, label: t.servicesCta, primary: false },
    { to: PATHS.devis, label: c.quoteCta, primary: false },
    { to: PATHS.contact, label: c.contactCta, primary: false },
  ];

  return (
    <section aria-labelledby="notfound-heading" className="bg-paper pt-[calc(var(--header-h)+4rem)] pb-24 lg:pt-[calc(var(--header-h)+6rem)] lg:pb-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="max-w-3xl">
          <p className="flex flex-wrap items-center gap-3 text-[11px] font-medium tracking-[0.24em] text-mute uppercase sm:text-[12px]">
            <span className="h-px w-8 bg-signal-600" aria-hidden="true" />
            {t.code}
          </p>
          <h1 id="notfound-heading" className="mt-5 font-display text-[2.2rem] leading-[1.08] font-medium tracking-tight text-navy-900 sm:text-[3rem]">
            {t.title}
          </h1>
          <p className="mt-7 text-[15.5px] leading-relaxed text-ink-soft">{t.body}</p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={
                  link.primary
                    ? "group inline-flex items-center gap-2 bg-navy-900 px-6 py-3.5 text-[13px] font-medium tracking-wide text-white shadow-[0_16px_32px_-18px_rgba(14,31,48,0.65)] transition-[background-color,transform] duration-200 hover:bg-navy-800 active:translate-y-px"
                    : "inline-flex items-center gap-2 border border-line-strong px-6 py-3.5 text-[13px] font-medium tracking-wide text-navy-900 transition-colors hover:border-navy-900 hover:bg-white"
                }
              >
                {link.label}
                {link.primary && (
                  <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" aria-hidden="true" />
                )}
              </Link>
            ))}
          </div>

          <div className="mt-14 flex items-start gap-4 border-t border-line pt-8">
            <Compass size={18} className="mt-0.5 shrink-0 text-signal-600" aria-hidden="true" />
            <p className="text-[13px] leading-relaxed text-mute">{dict.footer.tagline}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
