import { ArrowRight, Check } from "lucide-react";
import PageHeader from "../components/PageHeader";
import Reveal from "../components/Reveal";
import { Link, useRouter } from "../router";
import { PATHS, SERVICE_PAGES, type ServicePageSlug } from "../router/routes";
import { useDict } from "../i18n";
import { usePageMeta } from "../router/seo";
import { requestQuoteRoute } from "../utils/quote";

/**
 * One route, six service pages: `/services/:slug`.
 *
 * The technical body is *reused*, not rewritten — the intro, the coverage
 * points, the mission steps and the photograph all come from the validated
 * V11 service entries (see `SERVICE_PAGES[].sources`), so the page can never
 * claim more than the corporate site already claims. What the route adds is
 * framing (eyebrow, lede, head copy), the cross-links and the CTA hierarchy.
 */
export default function ServiceDetailPage({ slug }: { slug: ServicePageSlug }) {
  const dict = useDict();
  const { navigate } = useRouter();
  const page = SERVICE_PAGES.find((p) => p.slug === slug);
  const copy = dict.routes.service[slug];
  const c = dict.routes.common;

  const sources = (page?.sources ?? [])
    .map((s) => dict.services.list.find((item) => item.slug === s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  usePageMeta({ title: copy.meta.title, description: copy.meta.description, path: `/services/${slug}` });

  if (sources.length === 0) {
    // Defensive only: the route table and the dictionaries are checked for
    // parity, so this cannot happen with a valid build.
    return <ServiceFallback />;
  }

  const primary = sources.find((s) => s.priority === "primary") ?? sources[0];
  const image = sources.find((s) => s.image)?.image ?? sources[0].image;
  const points = sources.flatMap((s) => s.points);
  const steps = sources.flatMap((s) => s.steps);
  const related = SERVICE_PAGES.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <>
      <PageHeader
        eyebrow={copy.eyebrow}
        title={copy.label}
        lede={copy.lede}
        crumbs={[{ label: c.services, to: PATHS.services }, { label: copy.label }]}
      />

      <section aria-labelledby="service-detail-heading" className="bg-paper py-20 lg:py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          <h2 id="service-detail-heading" className="sr-only">
            {copy.label}
          </h2>
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7">
              <p className="text-[16px] leading-relaxed text-ink">{primary.intro}</p>

              <div className="mt-12 border-t border-line pt-10">
                <h3 className="font-display text-[1.15rem] font-medium tracking-tight text-navy-900">{c.coverageTitle}</h3>
                <ul className="mt-6 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
                  {points.map((point) => (
                    <li key={point} className="flex items-start gap-3 text-[14px] leading-snug text-ink">
                      <Check size={15} className="mt-0.5 shrink-0 text-signal-600" aria-hidden="true" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-12 border-t border-line pt-10">
                <h3 className="font-display text-[1.15rem] font-medium tracking-tight text-navy-900">{c.stepsTitle}</h3>
                <ol className="mt-6 space-y-5" role="list">
                  {steps.map((step, i) => (
                    <li key={step} className="flex gap-5">
                      <span className="w-6 shrink-0 font-display text-[12px] font-semibold text-signal-600 tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-[14.5px] leading-relaxed text-ink-soft">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="lg:col-span-5">
              <Reveal>
                <figure className="border border-line bg-white">
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <img
                      src={image.src}
                      srcSet={image.srcSet}
                      sizes={image.sizes}
                      width={image.width}
                      height={image.height}
                      alt={image.alt}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <figcaption className="border-t border-line px-6 py-4 text-[12px] leading-snug text-mute">
                    {dict.place.seatLine}
                  </figcaption>
                </figure>
              </Reveal>

              <div className="mt-10 border border-line bg-white p-8">
                <h3 className="font-display text-[1.2rem] leading-snug font-medium tracking-tight text-navy-900">{c.ctaTitle}</h3>
                <p className="mt-4 text-[13.5px] leading-relaxed text-ink-soft">{c.ctaBody}</p>
                <div className="mt-7 flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={() => requestQuoteRoute(primary.apiValue, navigate)}
                    className="group inline-flex items-center justify-center gap-2 bg-navy-900 px-6 py-3.5 text-[13px] font-medium tracking-wide text-white shadow-[0_16px_32px_-18px_rgba(14,31,48,0.65)] transition-[background-color,transform] duration-200 hover:bg-navy-800 active:translate-y-px"
                  >
                    {c.quoteCta}
                    <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" aria-hidden="true" />
                  </button>
                  <Link
                    to={PATHS.contact}
                    className="inline-flex items-center justify-center border border-line-strong px-6 py-3.5 text-[13px] font-medium tracking-wide text-navy-900 transition-colors hover:border-navy-900 hover:bg-paper"
                  >
                    {c.contactCta}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="related-heading" className="bg-white py-18 lg:py-24">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          <h2 id="related-heading" className="font-display text-[1.3rem] font-medium tracking-tight text-navy-900">
            {c.relatedTitle}
          </h2>
          <ul className="mt-8 grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-3">
            {related.map((item, i) => (
              <Reveal as="li" key={item.slug} delay={i * 60} className="bg-white">
                <Link to={`/services/${item.slug}`} className="group flex h-full flex-col justify-between gap-6 p-7">
                  <span className="font-display text-[1.05rem] leading-snug font-medium tracking-tight text-navy-900">
                    {dict.routes.service[item.slug].label}
                  </span>
                  <span className="inline-flex items-center gap-2 text-[12px] font-semibold tracking-wide text-navy-700 uppercase">
                    {c.detailCta}
                    <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" aria-hidden="true" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
          <div className="mt-10">
            <Link to={PATHS.services} className="text-[13.5px] font-medium text-navy-900 underline decoration-signal-600 decoration-2 underline-offset-4">
              {c.services}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function ServiceFallback() {
  const dict = useDict();
  return (
    <PageHeader eyebrow={dict.routes.services.eyebrow} title={dict.routes.services.title} lede={dict.routes.services.lede}>
      <Link to={PATHS.services} className="mt-8 inline-flex items-center gap-2 text-[13px] font-medium text-navy-900 underline decoration-signal-600 decoration-2 underline-offset-4">
        {dict.routes.devis.backToServices}
      </Link>
    </PageHeader>
  );
}
