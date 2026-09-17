import { company } from "../data/company";
import { useDict } from "../i18n";

/**
 * Legal notices — the single, deliberate place where company registry
 * information appears. It is NOT part of the marketing flow: no section hero
 * treatment, no cards, no data printed as decoration. It exists because a
 * corporate site is expected to identify its legal entity, and it is reachable
 * from the footer.
 *
 * V11: the entity values come from `data/company.ts` (never duplicated), and
 * only the field labels and the declared activities are translated. The
 * Registre de Commerce number is printed exactly as registered, in every
 * language, wrapped in <bdi> so an RTL paragraph cannot reorder its digits.
 */
function Term({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[10.5px] font-medium uppercase tracking-[0.14em] text-mute">
        {term}
      </dt>
      <dd className="mt-1 text-[13.5px] leading-relaxed text-ink-soft">{children}</dd>
    </div>
  );
}

export default function LegalNotice() {
  const dict = useDict();
  const t = dict.legal;
  const activities = t.activitiesList;

  return (
    <section
      id="mentions-legales"
      aria-labelledby="legal-heading"
      className="scroll-mt-24 border-t border-line bg-paper py-14 lg:py-16"
    >
      <div className="mx-auto max-w-5xl px-6 lg:px-12">
        <h2
          id="legal-heading"
          className="text-[12px] font-semibold uppercase tracking-[0.2em] text-navy-900"
        >
          {t.heading}
        </h2>

        <dl className="mt-7 grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          <Term term={t.denomination}>{company.legalName}</Term>
          <Term term={t.legalForm}>{t.legalFormValue}</Term>
          <Term term={t.rc}>
            <span dir="ltr">
              {t.rcPrefix} <bdi>{company.rc}</bdi>
            </span>
          </Term>
          <Term term={t.seat}>{dict.place.seatLine}</Term>
          {company.gerant && <Term term={t.gerant}>{company.gerant}</Term>}
          <Term term={t.contact}>
            <a href={`mailto:${company.email}`} className="transition-colors hover:text-navy-900">
              {company.email}
            </a>
            <br />
            <a href={`tel:${company.phoneHref}`} className="transition-colors hover:text-navy-900">
              <span dir="ltr" className="inline-block">{company.phone}</span>
            </a>
          </Term>
          <div className="sm:col-span-2 lg:col-span-3">
            <dt className="text-[10.5px] font-medium uppercase tracking-[0.14em] text-mute">
              {t.activities}
            </dt>
            <dd className="mt-1.5 text-[13.5px] leading-relaxed text-ink-soft">
              {activities.length > 1
                ? `${activities.slice(0, -1).join(", ")} ${t.activitiesJoin} ${activities[activities.length - 1]}`
                : activities[0]}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
