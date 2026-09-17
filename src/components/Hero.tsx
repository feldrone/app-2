import { ArrowRight, PhoneCall, MessageCircle } from "lucide-react";
import Reveal from "./Reveal";
import { company } from "../data/company";
import { Link } from "../router";
import { PATHS } from "../router/routes";
import { useDict } from "../i18n";
import { heroImage } from "../lib/images";

/**
 * Hero — first viewport, white-first premium aviation.
 * V11: every string, the WhatsApp prefill and the image alternative text come
 * from the active dictionary; the phone number and the company identity stay
 * language-independent values from `data/company.ts`.
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
      className="relative overflow-hidden bg-paper pb-20 pt-[calc(var(--header-h)+4.5rem)] lg:pb-24 lg:pt-[calc(var(--header-h)+7rem)]"
    >
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-x-10 gap-y-16 px-6 lg:grid-cols-12 lg:px-12">
        <div className="lg:col-span-7">
          <Reveal>
            <div className="mb-7 flex items-start gap-3">
              <span className="mt-2 h-px w-8 shrink-0 bg-signal-600" aria-hidden="true" />
              <p className="max-w-md text-[13px] leading-relaxed text-ink-soft sm:text-[14px]">
                {hero.eyebrow}
              </p>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="font-display text-[2.4rem] leading-[1.05] font-semibold tracking-[-0.02em] text-navy-900 sm:text-[3rem] lg:text-[3.5rem]">
              {hero.titleTop}
              <br className="hidden sm:block" /> {hero.titleBottom}
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-6 max-w-xl text-[16.5px] leading-relaxed text-ink-soft">
              {hero.body(company)}
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                to={PATHS.devis}
                className="group inline-flex w-full items-center justify-center gap-2.5 bg-navy-900 px-8 py-4 text-[14px] font-medium tracking-wide text-white shadow-[0_18px_36px_-18px_rgba(14,31,48,0.7)] transition-[background-color,transform,box-shadow] duration-200 hover:bg-navy-800 hover:shadow-[0_22px_40px_-18px_rgba(14,31,48,0.75)] active:translate-y-px sm:w-auto"
              >
                {hero.ctaPrimary}
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" aria-hidden="true" />
              </Link>
              <Link
                to={PATHS.services}
                className="inline-flex w-full items-center justify-center border border-line-strong bg-white px-8 py-4 text-[14px] font-medium tracking-wide text-navy-900 transition-[border-color,background-color] duration-200 hover:border-navy-900 hover:bg-paper active:translate-y-px sm:w-auto"
              >
                {hero.ctaSecondary}
              </Link>
            </div>
          </Reveal>

          <Reveal delay={300}>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <a
                href={`tel:${company.phoneHref}`}
                className="inline-flex items-center gap-2 text-[14px] font-medium text-ink-soft transition-colors hover:text-navy-900"
              >
                <PhoneCall size={15} className="text-signal-600" aria-hidden="true" />
                <span dir="ltr">{company.phone}</span> — {hero.phoneLabel}
              </a>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[14px] font-medium text-ink-soft transition-colors hover:text-navy-900"
              >
                <MessageCircle size={15} className="text-signal-600" aria-hidden="true" />
                {hero.whatsapp}
              </a>
            </div>
            <p className="mt-3 text-[11.5px] leading-relaxed text-mute">{hero.verifiedNote}</p>
          </Reveal>
        </div>

        <div className="relative lg:col-span-5">
          <Reveal delay={120}>
            <figure className="relative">
              <div className="relative aspect-[16/11] w-full overflow-hidden bg-navy-900 sm:aspect-[4/3] lg:aspect-[4/5] lg:h-full lg:min-h-[540px]">
                <img
                  src={heroImage.src}
                  srcSet={heroImage.srcSet}
                  sizes={heroImage.sizes}
                  width={heroImage.width}
                  height={heroImage.height}
                  alt={dict.media.hero}
                  className="h-full w-full object-cover"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/50 via-transparent to-transparent" aria-hidden="true" />
              </div>
              <figcaption className="mt-3 text-[11.5px] leading-snug text-mute">
                {hero.figcaption}
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </div>

      <Reveal delay={200}>
        <div className="mx-auto mt-20 max-w-[1400px] border-t border-line px-6 lg:px-12">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-8 py-10 sm:grid-cols-4">
            {dict.sectors.map((sector) => (
              <div key={sector.label} className="border-s border-line ps-5">
                <dt className="text-[11px] font-medium uppercase tracking-[0.14em] text-mute">
                  {sector.label}
                </dt>
                <dd className="mt-2 text-[14px] font-semibold leading-snug tracking-tight text-navy-900">
                  {sector.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Reveal>
    </section>
  );
}
