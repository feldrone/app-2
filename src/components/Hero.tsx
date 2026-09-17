import { ArrowRight, PhoneCall, MessageCircle } from "lucide-react";
import Reveal from "./Reveal";
import DroneFigure from "./DroneFigure";
import { company } from "../data/company";
import { Link } from "../router";
import { PATHS } from "../router/routes";
import { useDict } from "../i18n";

/**
 * Hero — the dark product stage of the design system: a full-bleed void
 * where the "product" — the aircraft itself — emerges from shadow with edge
 * lighting, above centered light-weight display copy. Two actions only:
 * the persistent gold pill (devis) and a ghost outlined button; the phone /
 * WhatsApp routes stay one quiet row below.
 *
 * The drone figure is decorative (aria-hidden), animated purely with CSS
 * transforms, and parks as a static edge-lit diagram under
 * `prefers-reduced-motion`. The sectors strip stays as the stage's stat row.
 */
export default function Hero() {
  const dict = useDict();
  const { hero } = dict;

  const whatsappHref = `https://wa.me/${company.phoneHref.replace(/\+/g, "")}?text=${encodeURIComponent(
    hero.whatsappMessage,
  )}`;

  return (
    <section
      id="accueil"
      aria-label={hero.aria}
      className="dark-stage relative overflow-hidden bg-void pb-16 pt-[calc(var(--header-h)+3.5rem)] text-white lg:pb-20 lg:pt-[calc(var(--header-h)+5rem)]"
    >
      {/* Edge lighting — the only luminance transition on the stage, kept at
          whisper level so the aircraft reads as emerging from the void. */}
      <div
        className="pointer-events-none absolute left-1/2 top-[max(6rem,calc(var(--header-h)-2rem))] h-[26rem] w-[42rem] max-w-[100vw] -translate-x-1/2 rounded-full opacity-[0.16]"
        style={{ background: "radial-gradient(closest-side, #dfe7f2, transparent 72%)" }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          {/* The aircraft — descends into frame once, then keeps station. */}
          <div className="drone-enter relative mb-2 sm:mb-4">
            <div className="drone-bob">
              <DroneFigure variant="hero" className="w-36 sm:w-48 lg:w-56" />
            </div>
          </div>

          <Reveal>
            <p className="mx-auto mt-2 max-w-md text-[13px] leading-relaxed text-white/55 sm:text-[14px]">
              {hero.eyebrow}
            </p>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="font-display mt-5 text-[2rem] font-light leading-[1.15] tracking-[-0.03em] text-white sm:text-[2.6rem] lg:text-[2.9rem]">
              {hero.titleTop}
              <br className="hidden sm:block" /> {hero.titleBottom}
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-6 max-w-xl text-[15.5px] leading-relaxed text-white/70 sm:text-[16px]">
              {hero.body(company)}
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-10 flex flex-col gap-3.5 sm:flex-row sm:items-center">
              <Link
                to={PATHS.devis}
                className="group inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-signal-500 px-8 py-3.5 text-[14px] font-medium tracking-wide text-navy-950 transition-[background-color,transform] duration-200 hover:bg-signal-600 active:translate-y-px sm:w-auto"
              >
                {hero.ctaPrimary}
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180" aria-hidden="true" />
              </Link>
              <Link
                to={PATHS.services}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/35 px-8 py-3.5 text-[14px] font-medium tracking-wide text-white transition-[border-color,background-color] duration-200 hover:border-white hover:bg-white/5 active:translate-y-px sm:w-auto"
              >
                {hero.ctaSecondary}
                <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" aria-hidden="true" />
              </Link>
            </div>
          </Reveal>

          <Reveal delay={300}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              <a
                href={`tel:${company.phoneHref}`}
                className="inline-flex items-center gap-2 text-[13.5px] font-medium text-white/65 transition-colors hover:text-white"
              >
                <PhoneCall size={15} className="text-signal-500" aria-hidden="true" />
                <span dir="ltr">{company.phone}</span>
              </a>
              <span className="hidden h-3 w-px bg-white/20 sm:block" aria-hidden="true" />
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[13.5px] font-medium text-white/65 transition-colors hover:text-white"
              >
                <MessageCircle size={15} className="text-signal-500" aria-hidden="true" />
                {hero.whatsapp}
              </a>
            </div>
            <p className="mt-3 text-[11.5px] leading-relaxed text-white/35">{hero.verifiedNote}</p>
          </Reveal>
        </div>

        <Reveal delay={200}>
          <div className="mt-16 border-t border-white/10 lg:mt-20">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-8 py-9 sm:grid-cols-4">
              {dict.sectors.map((sector) => (
                <div key={sector.label} className="border-s border-white/12 ps-5">
                  <dt className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/40">
                    {sector.label}
                  </dt>
                  <dd className="mt-2 text-[13.5px] font-semibold leading-snug tracking-tight text-white/90">
                    {sector.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
