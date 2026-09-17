import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { useDict } from "../i18n";
import { controlImage } from "../lib/images";

/**
 * Capability statement — two disciplines, one standard of execution.
 * Numbered editorial rows instead of icon cards; the grayscale shot of a
 * ground station in the field anchors the discipline claim visually — the
 * operator's hands, not an aircraft type, carry the credibility.
 * V11: copy and alternative text come from the active dictionary.
 */
export default function Expertise() {
  const dict = useDict();
  const t = dict.expertise;
  const principles = t.principles;

  return (
    <section id="expertise" aria-labelledby="expertise-heading" className="bg-fog py-28 lg:py-40">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
          {/* Image — offset, editorial framing */}
          <div className="lg:col-span-5 lg:col-start-1">
            <Reveal>
              <figure className="lg:me-10">
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[4px] bg-void">
                  <img
                    src={controlImage.src}
                    srcSet={controlImage.srcSet}
                    sizes={controlImage.sizes}
                    width={controlImage.width}
                    height={controlImage.height}
                    alt={dict.media.control}
                    className="h-full w-full object-cover grayscale"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <figcaption className="mt-4 max-w-xs text-[13px] leading-relaxed text-graphite">
                  {t.figcaption}
                </figcaption>
              </figure>
            </Reveal>
          </div>

          {/* Text column */}
          <div className="lg:col-span-6 lg:col-start-7 lg:pt-4">
            <SectionHeading
              id="expertise-heading"
              eyebrow={t.eyebrow}
              title={t.title}
              lede={t.lede}
            />

            <dl className="mt-12">
              {principles.map((p, i) => (
                <Reveal key={p.n} delay={i * 90}>
                  <div className="grid grid-cols-[3.5rem_1fr] gap-x-6 border-t border-line-fog py-7">
                    <dt className="font-display text-[24px] font-light text-signal-600">{p.n}</dt>
                    <dd>
                      <p className="text-[16.5px] font-semibold tracking-tight text-navy-900">{p.title}</p>
                      <p className="mt-2 max-w-lg text-[15px] leading-relaxed text-graphite">{p.text}</p>
                    </dd>
                  </div>
                </Reveal>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
