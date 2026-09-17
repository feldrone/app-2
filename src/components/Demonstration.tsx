import { ArrowRight } from "lucide-react";
import { useDict } from "../i18n";
import { Link } from "../router";
import { PATHS } from "../router/routes";
import { bannerImage } from "../lib/images";
import DroneFigure from "./DroneFigure";
import Reveal from "./Reveal";

/**
 * Demonstration — the full-bleed photographic banner of the design system,
 * carrying the honest example-deliverables grid.
 *
 * The banner is aspirational context only (operator + aircraft in the field),
 * with a flat tonal scrim — no gradient — holding the overlaid light display
 * headline and two ghost outlined buttons. The small drone silhouette
 * crossing the banner is the section's motion register: one slow pass,
 * transform-only, aria-hidden, removed entirely under reduced motion.
 *
 * Every deliverable below still says "Demonstration example — not from a
 * client mission"; no fictional work is presented as a real client project.
 */
export default function Demonstration() {
  const dict = useDict();
  const t = dict.demonstration;

  return (
    <section id="demonstration" aria-labelledby="demonstration-heading" className="bg-fog">
      {/* Full-bleed banner */}
      <div className="relative overflow-hidden">
        <div className="relative h-[22rem] w-full sm:h-[26rem] lg:h-[30rem]">
          <img
            src={bannerImage.src}
            srcSet={bannerImage.srcSet}
            sizes={bannerImage.sizes}
            width={bannerImage.width}
            height={bannerImage.height}
            alt={dict.media.hero}
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
          {/* Flat tonal scrim — solid, no gradient — for type legibility */}
          <div className="absolute inset-0 bg-void/55" aria-hidden="true" />
        </div>

        {/* The slow crossing flight — decorative, off-canvas at both ends */}
        <div className="pointer-events-none absolute inset-y-0 start-0 flex w-full items-center" aria-hidden="true">
          <DroneFigure variant="drift" className="drone-drift w-16 opacity-45 sm:w-20" />
        </div>

        <div className="dark-stage pointer-events-none absolute inset-0 flex items-center justify-center">
          <Reveal className="pointer-events-auto max-w-3xl px-6 text-center">
            <h2
              id="demonstration-heading"
              className="font-display text-balance text-[1.7rem] font-light leading-[1.2] tracking-[-0.02em] text-white sm:text-[2.25rem] lg:text-[2.5rem]"
            >
              {t.title}
            </h2>
            <div className="mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
              <Link
                to={PATHS.services}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/40 px-7 py-3 text-[13.5px] font-medium tracking-wide text-white transition-[border-color,background-color] duration-200 hover:border-white hover:bg-white/5 sm:w-auto"
              >
                {dict.hero.ctaSecondary}
                <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" aria-hidden="true" />
              </Link>
              <Link
                to={PATHS.devis}
                className="inline-flex w-full items-center justify-center rounded-full border border-white/40 px-7 py-3 text-[13.5px] font-medium tracking-wide text-white transition-[border-color,background-color] duration-200 hover:border-white hover:bg-white/5 sm:w-auto"
              >
                {dict.hero.ctaPrimary}
              </Link>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Example deliverables — flat white cards on the canvas */}
      <div className="mx-auto max-w-[1400px] px-6 py-20 lg:px-12 lg:py-28">
        <Reveal>
          <p className="flex flex-wrap items-center gap-3 text-[11px] font-medium uppercase tracking-[0.2em] text-slate sm:text-[12px]">
            <span className="h-px w-8 bg-signal-600" aria-hidden="true" />
            {t.eyebrow}
          </p>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {t.items.map((item, i) => (
            <Reveal key={item.slug} delay={i * 80}>
              <article className="flex h-full flex-col rounded-[4px] bg-white p-6">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-[12px] font-medium tracking-[0.14em] text-slate uppercase">
                    <span dir="ltr">{String(i + 1).padStart(2, "0")}</span>
                  </span>
                  <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-ash">
                    {t.badge}
                  </span>
                </div>
                <h3 className="font-display text-[18px] font-semibold leading-[1.3] tracking-[-0.02em] text-navy-900">
                  {item.title}
                </h3>
                <p className="mt-3 text-[14px] leading-relaxed text-graphite">
                  {item.desc}
                </p>
                <p className="mt-4 border-t border-fog pt-4 text-[12px] leading-snug text-slate">
                  {t.disclaimer}
                </p>
                <div className="mt-6 flex h-24 items-center justify-center rounded-[4px] bg-fog">
                  <span className="text-[11px] uppercase tracking-[0.16em] text-slate">
                    {t.mediaPending}
                  </span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {/* Projects — truthful */}
        <Reveal delay={160}>
          <div className="mt-14 rounded-[4px] bg-white p-8 lg:p-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-baseline sm:justify-between">
              <h3 className="text-[16px] font-semibold tracking-tight text-navy-900">
                {t.projectsTitle}
              </h3>
              <span className="text-[12px] font-medium uppercase tracking-[0.16em] text-signal-700">
                {t.projectsBadge}
              </span>
            </div>
            <p className="mt-4 max-w-2xl text-[14.5px] leading-relaxed text-graphite">
              {t.projectsText}
            </p>
            <p className="mt-3 text-[13px] leading-relaxed text-slate">{t.projectsNote}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
