import { useDict } from "../i18n";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

/**
 * Leadership & expertise — company-first, not person-first.
 * Deliberately minimal: name, role, one line of context. No biographies, no
 * timelines, no invented titles. People appear strictly as a trust signal
 * supporting the brand. New members can be appended to every dictionary's
 * `leadership.members` (or to `data/company.ts → teamMembers`); this layout
 * adapts to 1..N entries.
 *
 * V11: proper names stay identical in every language; only the role and the
 * one-line note are translated.
 */
export default function Leadership() {
  const dict = useDict();
  const t = dict.leadership;

  return (
    <section id="direction" aria-labelledby="leadership-heading" className="bg-white py-32 lg:py-40">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <SectionHeading
              id="leadership-heading"
              eyebrow={t.eyebrow}
              title={t.title}
              lede={t.lede}
            />
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <ul className="border-t border-line">
              {t.members.map((member, i) => (
                <Reveal key={member.name} as="li" delay={i * 80} className="border-b border-line">
                  <div className="flex flex-col gap-4 py-8 sm:flex-row sm:items-start sm:gap-7">
                    <span
                      className="flex h-14 w-14 shrink-0 items-center justify-center border border-line bg-paper font-display text-[14px] font-semibold tracking-wide text-navy-900"
                      aria-hidden="true"
                    >
                      <span dir="ltr">{member.initials}</span>
                    </span>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-3.5 gap-y-1">
                        <h3 className="text-[17px] font-semibold tracking-tight text-navy-900">
                          {member.name}
                        </h3>
                        <span className="text-balance text-[13px] font-bold tracking-[0.075em] text-signal-600 uppercase md:whitespace-nowrap">
                          {member.role}
                        </span>
                      </div>
                      {member.note && (
                        <p className="mt-2 max-w-xl text-[14.5px] leading-relaxed text-ink-soft">
                          {member.note}
                        </p>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}
            </ul>
            <p className="mt-5 text-[13px] leading-relaxed text-mute">{t.footnote}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
