import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { useDict } from "../i18n";

/**
 * Equipment / Capabilities — truthful, no invented specs.
 * Unknown specifications stay clearly marked (FR "À compléter" / EN "To be
 * completed" / AR "قيد الاستكمال"); no drone model, sensor, flight time,
 * accuracy, payload or certification is ever invented.
 */
export default function Equipment() {
  const dict = useDict();
  const t = dict.equipment;

  return (
    <section
      id="equipement"
      aria-labelledby="equipement-heading"
      className="bg-fog py-28 lg:py-36"
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <SectionHeading
              id="equipement-heading"
              eyebrow={t.eyebrow}
              title={t.title}
              lede={t.lede}
            />
            <Reveal delay={120}>
              <p className="mt-8 max-w-md text-[13.5px] leading-relaxed text-slate">{t.note}</p>
            </Reveal>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <div className="space-y-12">
              {t.groups.map((group, gi) => (
                <Reveal key={group.category} delay={gi * 80}>
                  <div className="border-t border-line-fog pt-8">
                    <h3 className="text-[13px] font-semibold uppercase tracking-[0.16em] text-iron">
                      {group.category}
                    </h3>
                    <dl className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                      {group.items.map((item) => (
                        <div key={item.label} className="border-b border-fog pb-4">
                          <dt className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate">
                            {item.label}
                          </dt>
                          <dd className="mt-2 text-[14px] leading-snug text-graphite">
                            {item.value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={200}>
              <div className="mt-12 rounded-[4px] bg-white p-6 text-[13px] leading-relaxed text-graphite">
                <p className="font-medium text-navy-900">{t.mediaPending}</p>
                <p className="mt-2">{t.mediaNote}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
