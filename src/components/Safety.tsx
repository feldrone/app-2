import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { useDict } from "../i18n";
import { safetyImage } from "../lib/images";

/**
 * Operational standards — the single intentional dark band on the page, used
 * as a register change, not as an aesthetic. Claims stay strictly at the level
 * the company's own positioning supports: certified remote pilots,
 * plan-before-fly, structured supervision. Imagery is UAV ground operations.
 * V11: standards and captions come from the active dictionary.
 */
export default function Safety() {
  const dict = useDict();
  const t = dict.safety;

  return (
    <section
      id="securite"
      aria-labelledby="safety-heading"
      className="dark-stage relative overflow-hidden bg-void py-32 text-white lg:py-44"
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <SectionHeading
              id="safety-heading"
              eyebrow={t.eyebrow}
              tone="navy"
              title={t.title}
              lede={t.lede}
            />

            <dl className="mt-12">
              {t.standards.map((item, i) => (
                <Reveal key={item.n} delay={i * 90}>
                  <div className="grid grid-cols-[4.25rem_1fr] gap-x-6 border-t border-white/12 py-6">
                    <dt className="font-display text-[15px] font-light tracking-wide text-signal-500">
                      <span dir="ltr">{item.n}</span>
                    </dt>
                    <dd>
                      <p className="text-[15.5px] font-semibold tracking-tight text-white">{item.label}</p>
                      <p className="mt-2 max-w-md text-[14px] leading-relaxed text-white/65">{item.detail}</p>
                    </dd>
                  </div>
                </Reveal>
              ))}
            </dl>
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            <Reveal delay={100} className="h-full">
              <figure className="relative h-full">
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[4px] lg:h-full lg:min-h-[420px]">
                  <img
                    src={safetyImage.src}
                    srcSet={safetyImage.srcSet}
                    sizes={safetyImage.sizes}
                    width={safetyImage.width}
                    height={safetyImage.height}
                    alt={dict.media.safety}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-void/35" aria-hidden="true" />
                </div>
                <figcaption className="absolute bottom-5 start-5 end-5 text-[12.5px] leading-snug text-white/80">
                  {t.figcaption}
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
