import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { useDict } from "../i18n";

/**
 * Method — "Eight steps, zero improvisation".
 * Truthful process description, no guarantees, no invented timelines.
 * V11: the eight steps and every caption come from the active dictionary.
 */
export default function Method() {
  const dict = useDict();
  const t = dict.method;

  return (
    <section
      id="methode"
      aria-labelledby="methode-heading"
      className="bg-white py-28 lg:py-36"
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <SectionHeading
              id="methode-heading"
              eyebrow={t.eyebrow}
              title={t.title}
              lede={t.lede}
            />
            <Reveal delay={120}>
              <p className="mt-8 max-w-md text-[13.5px] leading-relaxed text-mute">{t.note}</p>
            </Reveal>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <ol className="border-t border-line" aria-label={t.aria}>
              {t.steps.map((step, i) => (
                <Reveal key={step.n} delay={i * 40}>
                  <li className="grid grid-cols-[3.5rem_1fr] gap-x-6 border-b border-line py-7">
                    <span className="font-display text-[22px] font-semibold text-signal-600">
                      {step.n}
                    </span>
                    <div>
                      <h3 className="text-[16px] font-semibold tracking-tight text-navy-900">
                        {step.title}
                      </h3>
                      <p className="mt-2 max-w-xl text-[14.5px] leading-relaxed text-ink-soft">
                        {step.desc}
                      </p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
