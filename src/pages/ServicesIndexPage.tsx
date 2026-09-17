import { ArrowRight } from "lucide-react";
import PageHeader from "../components/PageHeader";
import Reveal from "../components/Reveal";
import { Link, useRouter } from "../router";
import { SERVICE_PAGES, PATHS } from "../router/routes";
import { useDict } from "../i18n";
import { usePageMeta } from "../router/seo";
import { requestQuoteRoute } from "../utils/quote";
import { cn } from "../utils/cn";

/**
 * `/services` — the service overview.
 *
 * Six detail pages, three of them priority. Each card routes to its own page;
 * the priority ones are marked and given the first row, so the commercial
 * poles (sales & rental) never visually dominate the professional services.
 */
export default function ServicesIndexPage() {
  const dict = useDict();
  const { navigate } = useRouter();
  const t = dict.routes.services;
  const c = dict.routes.common;
  usePageMeta({ title: t.meta.title, description: t.meta.description, path: PATHS.services });

  const entries = SERVICE_PAGES.map((page, index) => {
    const copy = dict.routes.service[page.slug];
    const sources = page.sources
      .map((slug) => dict.services.list.find((s) => s.slug === slug))
      .filter((s): s is NonNullable<typeof s> => Boolean(s));
    return {
      slug: page.slug,
      label: copy.label,
      summary: sources[0]?.intro ?? "",
      points: sources.flatMap((s) => s.points).slice(0, 3),
      primary: sources.some((s) => s.priority === "primary"),
      apiValue: sources[0]?.apiValue ?? "",
      index: String(index + 1).padStart(2, "0"),
    };
  });

  return (
    <>
      <PageHeader eyebrow={t.eyebrow} title={t.title} lede={t.lede}>
        <p className="mt-7 border-s-2 border-signal-600 ps-4 text-[13.5px] leading-relaxed text-mute">{t.note}</p>
      </PageHeader>

      <section aria-labelledby="services-index-heading" className="bg-paper py-20 lg:py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          <h2 id="services-index-heading" className="sr-only">
            {t.title}
          </h2>
          <ul className="grid grid-cols-1 gap-px border border-line bg-line md:grid-cols-2 xl:grid-cols-3">
            {entries.map((entry, i) => (
              <Reveal as="li" key={entry.slug} delay={i * 60} className="bg-white">
                <article className="flex h-full flex-col p-8 lg:p-10">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="font-display text-[12px] font-semibold tracking-[0.2em] text-mute tabular-nums">
                      {entry.index}
                    </span>
                    {entry.primary && (
                      <span className="border border-signal-600/40 px-2.5 py-1 text-[10.5px] font-semibold tracking-[0.14em] text-signal-600 uppercase">
                        {dict.services.priorityBadge}
                      </span>
                    )}
                  </div>

                  <h3 className="mt-6 font-display text-[1.35rem] leading-snug font-medium tracking-tight text-navy-900">
                    <Link to={`/services/${entry.slug}`} className="transition-colors hover:text-navy-700">
                      {entry.label}
                    </Link>
                  </h3>
                  <p className="mt-4 text-[14px] leading-relaxed text-ink-soft">{entry.summary}</p>

                  {entry.points.length > 0 && (
                    <ul aria-label={c.coverageTitle} className="mt-6 space-y-2">
                      {entry.points.map((point) => (
                        <li key={point} className="flex items-baseline gap-2.5 text-[12.5px] leading-snug text-ink">
                          <span className="mt-[5px] h-1 w-1 shrink-0 rounded-full bg-signal-600" aria-hidden="true" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-3 pt-8">
                    <Link
                      to={`/services/${entry.slug}`}
                      className="group inline-flex items-center gap-2 text-[12.5px] font-semibold tracking-wide text-navy-900 uppercase"
                    >
                      {c.detailCta}
                      <ArrowRight
                        size={14}
                        className="transition-transform duration-300 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
                        aria-hidden="true"
                      />
                    </Link>
                    <button
                      type="button"
                      onClick={() => requestQuoteRoute(entry.apiValue, navigate)}
                      className={cn(
                        "inline-flex items-center gap-2 px-4 py-2 text-[12px] font-medium tracking-wide transition-colors",
                        entry.primary
                          ? "bg-navy-900 text-white hover:bg-navy-800"
                          : "border border-line-strong text-navy-900 hover:border-navy-900 hover:bg-paper",
                      )}
                    >
                      {c.quoteCta}
                    </button>
                  </div>
                </article>
              </Reveal>
            ))}
          </ul>

        </div>
      </section>

      {/* Closing action band — one clear next step, in the site's own idiom. */}
      <section aria-labelledby="services-cta-heading" className="bg-white py-20 lg:py-24">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          <div className="border border-line bg-paper px-8 py-12 lg:px-14 lg:py-14">
            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <h2 id="services-cta-heading" className="font-display text-[1.7rem] leading-tight font-medium tracking-tight text-navy-900 sm:text-[2rem]">
                  {c.ctaTitle}
                </h2>
                <p className="mt-5 max-w-2xl text-[14.5px] leading-relaxed text-ink-soft">{c.ctaBody}</p>
              </div>
              <div className="flex flex-wrap items-center gap-4 lg:col-span-5 lg:justify-end">
                <button
                  type="button"
                  onClick={() => navigate(PATHS.devis)}
                  className="group inline-flex items-center gap-2 bg-navy-900 px-6 py-3.5 text-[13px] font-medium tracking-wide text-white shadow-[0_16px_32px_-18px_rgba(14,31,48,0.65)] transition-[background-color,transform] duration-200 hover:bg-navy-800 active:translate-y-px"
                >
                  {c.quoteCta}
                  <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" aria-hidden="true" />
                </button>
                <Link
                  to={PATHS.contact}
                  className="inline-flex items-center gap-2 border border-line-strong px-6 py-3.5 text-[13px] font-medium tracking-wide text-navy-900 transition-colors hover:border-navy-900 hover:bg-white"
                >
                  {c.contactCta}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
