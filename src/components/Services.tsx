import { useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useDict, type Dictionary } from "../i18n";
import { Link } from "../router";
import { routeForLegacyService } from "../router/routes";
import { requestQuote } from "../utils/quote";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { cn } from "../utils/cn";

/**
 * Services — seven poles, three primary (surveying, site monitoring, maintenance).
 * Primary cards larger, secondary quieter (sales, rental). No prices, truthful
 * wording: on quotation, pricing according to the mission, study according to
 * the requirement.
 *
 * V11: titles, points, steps and CTAs come from the active dictionary, while
 * the quote button always hands the form the canonical French service value
 * (`service.apiValue`) so POST /api/quote keeps receiving the same identifiers
 * in every language.
 */
export default function Services() {
  const dict = useDict();
  const t = dict.services;
  const primary = t.list.filter((s) => s.priority === "primary");
  const secondary = t.list.filter((s) => s.priority === "secondary");

  return (
    <section id="services" aria-labelledby="services-heading" className="bg-fog py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <SectionHeading
          id="services-heading"
          eyebrow={t.eyebrow}
          title={t.title}
          lede={t.lede}
          className="mb-14 lg:mb-20"
        />

        {/* Primary — larger, visually prioritized */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 xl:gap-8">
          {primary.map((service, i) => (
            <Reveal key={service.slug} delay={(i % 3) * 90} className="md:col-span-1">
              <ServiceCard service={service} primary />
            </Reveal>
          ))}
        </div>

        {/* Secondary — quieter */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4 xl:gap-6">
          {secondary.map((service, i) => (
            <Reveal key={service.slug} delay={i * 70} className="">
              <ServiceCard service={service} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <p className="mt-10 max-w-3xl text-[13px] leading-relaxed text-graphite">{t.note}</p>
        </Reveal>
      </div>
    </section>
  );
}

function ServiceCard({
  service,
  primary = false,
}: {
  service: Dictionary["services"]["list"][number];
  primary?: boolean;
}) {
  const dict = useDict();
  const t = dict.services;
  const [open, setOpen] = useState(false);
  const panelId = `service-steps-${service.slug}`;

  return (
    <article
      className="flex h-full flex-col overflow-hidden rounded-[4px] bg-white"
    >
      <div className="flex flex-1 flex-col p-6 lg:p-7">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-slate">
            <span dir="ltr">{service.index}</span> — {service.tag}
          </p>
          {primary && (
            <span className="rounded-full border border-signal-600 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-signal-700">
              {t.priorityBadge}
            </span>
          )}
        </div>
        <h3
          className={cn(
            "font-display mt-2.5 leading-[1.25] font-semibold tracking-[-0.02em] text-navy-900",
            primary ? "text-[1.35rem]" : "text-[1.15rem]",
          )}
        >
          {service.title}
        </h3>
        <p className="mt-2.5 text-[14px] leading-relaxed text-graphite">{service.intro}</p>

        {/* Centered product image — brightness against the card, no frame */}
        <div className="relative mt-5 aspect-[16/10] w-full shrink-0 overflow-hidden rounded-[4px] bg-fog">
          <img
            src={service.image.src}
            srcSet={service.image.srcSet}
            sizes="(max-width: 767px) 92vw, (max-width: 1279px) 45vw, 29vw"
            width={service.image.width}
            height={service.image.height}
            alt={dict.media.services[service.slug] ?? service.image.alt}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </div>

        <ul className="mt-5 space-y-1.5" aria-label={t.coverageLabel(service.title)}>
          {service.points.map((point) => (
            <li key={point} className="flex items-baseline gap-2.5 text-[13px] leading-snug text-iron">
              <span className="mt-[6px] h-1 w-1 shrink-0 rounded-full bg-signal-600" aria-hidden="true" />
              {point}
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={panelId}
          className="mt-5 inline-flex min-h-10 w-fit items-center gap-1.5 border-b border-transparent py-1 text-[12px] font-semibold tracking-wide text-graphite uppercase transition-colors hover:text-navy-900"
        >
          {t.stepsToggle}
          <ChevronDown size={12} className={cn("transition-transform duration-300", open && "rotate-180")} aria-hidden="true" />
        </button>
        <div
          id={panelId}
          className={cn(
            "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
            open ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
          )}
        >
          <ol className="overflow-hidden" role="list">
            {service.steps.map((step, idx) => (
              <li key={step} className="flex gap-3 py-[4px] text-[13px] leading-snug text-graphite first:pt-0 last:pb-0">
                <span className="w-4 shrink-0 font-display text-[11px] font-semibold text-signal-600 tabular-nums">
                  {idx + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-3 pt-6">
          {routeForLegacyService(service.slug) && (
            <Link
              to={routeForLegacyService(service.slug) as string}
              className="group/link inline-flex items-center gap-2 text-[12px] font-semibold tracking-wide text-signal-700 uppercase"
            >
              {dict.routes.common.detailCta}
              <ArrowRight
                size={13}
                className="transition-transform duration-300 group-hover/link:translate-x-0.5 rtl:rotate-180 rtl:group-hover/link:-translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          )}
          <button
            type="button"
            onClick={() => requestQuote(service.apiValue)}
            className={cn(
              "ms-auto inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-medium tracking-wide transition-[background-color,border-color,color] duration-200 active:translate-y-px",
              primary
                ? "bg-signal-500 text-navy-950 hover:bg-signal-600"
                : "border border-slate bg-white text-iron hover:border-navy-900 hover:text-navy-900",
            )}
          >
            {service.cta.label}
            <ArrowRight size={14} className="rtl:rotate-180" aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}
