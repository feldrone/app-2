import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { useDict } from "../i18n";

/**
 * Demonstration — example deliverables.
 * Every placeholder still says "Demonstration example — not from a client
 * mission"; no fictional work is presented as a real client project.
 * V11: headings, disclaimers and the projects block come from the dictionary,
 * so the honesty statements are never left in French inside EN or AR.
 */
export default function Demonstration() {
  const dict = useDict();
  const t = dict.demonstration;

  return (
    <section
      id="demonstration"
      aria-labelledby="demonstration-heading"
      className="bg-paper py-28 lg:py-36"
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <SectionHeading
          id="demonstration-heading"
          eyebrow={t.eyebrow}
          title={t.title}
          lede={t.lede}
          className="mb-14 lg:mb-20"
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {t.items.map((item, i) => (
            <Reveal key={item.slug} delay={i * 80}>
              <article className="flex h-full flex-col border border-line bg-white p-7">
                <div className="mb-4 flex items-center justify-between">
                  <span className="bg-navy-900 px-2.5 py-1 text-[10.5px] font-semibold tracking-[0.18em] text-white uppercase">
                    <span dir="ltr">{String(i + 1).padStart(2, "0")}</span>
                  </span>
                  <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-mute">
                    {t.badge}
                  </span>
                </div>
                <h3 className="font-display text-[18px] font-medium tracking-tight text-navy-900">
                  {item.title}
                </h3>
                <p className="mt-3 text-[13.5px] leading-relaxed text-ink-soft">
                  {item.desc}
                </p>
                <p className="mt-4 border-t border-line pt-4 text-[11.5px] leading-snug text-mute">
                  {t.disclaimer}
                </p>
                <div className="mt-6 flex h-28 items-center justify-center border border-dashed border-line-strong bg-paper">
                  <span className="text-[11px] uppercase tracking-[0.16em] text-mute">
                    {t.mediaPending}
                  </span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {/* Projects — truthful */}
        <Reveal delay={160}>
          <div className="mt-16 border border-line bg-white p-8 lg:p-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-baseline sm:justify-between">
              <h3 className="text-[16px] font-semibold tracking-tight text-navy-900">
                {t.projectsTitle}
              </h3>
              <span className="text-[12px] font-medium uppercase tracking-[0.16em] text-signal-600">
                {t.projectsBadge}
              </span>
            </div>
            <p className="mt-4 max-w-2xl text-[14.5px] leading-relaxed text-ink-soft">
              {t.projectsText}
            </p>
            <p className="mt-3 text-[12.5px] leading-relaxed text-mute">{t.projectsNote}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
