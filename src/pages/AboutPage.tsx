import { ArrowRight, Building2, ScrollText } from "lucide-react";
import PageHeader from "../components/PageHeader";
import Reveal from "../components/Reveal";
import { Link } from "../router";
import { PATHS } from "../router/routes";
import { company } from "../data/company";
import { useDict } from "../i18n";
import { usePageMeta } from "../router/seo";

/**
 * `/a-propos` — company and leadership.
 *
 * Content is strictly the verified V11/V10 material: the three shareholders and
 * their functions, Amine's note kept exactly as approved (« Étudiant en
 * informatique. »), the registry identifiers from `data/company.ts`, and the
 * declared activities. No invented history, no biographies, no qualifications.
 */
export default function AboutPage() {
  const dict = useDict();
  const t = dict.routes.about;
  const c = dict.routes.common;
  const legal = dict.legal;
  const leadership = dict.leadership;
  usePageMeta({ title: t.meta.title, description: t.meta.description, path: PATHS.about });

  const activities =
    legal.activitiesList.length > 1
      ? `${legal.activitiesList.slice(0, -1).join(", ")} ${legal.activitiesJoin} ${legal.activitiesList[legal.activitiesList.length - 1]}`
      : legal.activitiesList[0];

  const facts: { term: string; value: React.ReactNode }[] = [
    { term: legal.denomination, value: company.legalName },
    { term: legal.legalForm, value: legal.legalFormValue },
    { term: legal.rc, value: <><span>{legal.rcPrefix} </span><bdi>{company.rc}</bdi></> },
    { term: legal.seat, value: dict.place.seatLine },
    { term: legal.gerant, value: company.gerant },
  ];

  return (
    <>
      <PageHeader
        eyebrow={t.eyebrow}
        title={t.title}
        lede={t.lede}
        crumbs={[{ label: t.title }]}
      />

      <section aria-labelledby="about-company-heading" className="bg-fog pb-20 lg:pb-24">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-6">
              <h2 id="about-company-heading" className="flex items-center gap-3 font-display text-[1.4rem] font-medium tracking-tight text-navy-900">
                <Building2 size={20} className="text-signal-600" aria-hidden="true" />
                {t.companyTitle}
              </h2>
              <p className="mt-6 text-[15.5px] leading-relaxed text-graphite">{t.companyBody}</p>

              <ul className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-[4px] border border-line-fog bg-line-fog sm:grid-cols-2">
                {dict.services.list
                  .filter((s) => s.priority === "primary")
                  .map((service) => (
                    <li key={service.slug} className="bg-white p-6">
                      <span className="font-display text-[11px] font-semibold tracking-[0.2em] text-slate tabular-nums">{service.index}</span>
                      <span className="mt-3 block text-[14.5px] leading-snug font-medium tracking-tight text-navy-900">{service.title}</span>
                      <span className="mt-2 block text-[12.5px] leading-snug text-slate">{service.tag}</span>
                    </li>
                  ))}
              </ul>
            </div>

            <div className="lg:col-span-5 lg:col-start-8">
              <h2 className="flex items-center gap-3 font-display text-[1.4rem] font-medium tracking-tight text-navy-900">
                <ScrollText size={20} className="text-signal-600" aria-hidden="true" />
                {t.factsTitle}
              </h2>
              <dl className="mt-6 border-t border-line-fog">
                {facts.map((fact) => (
                  <div key={fact.term} className="border-b border-fog py-5">
                    <dt className="text-[10.5px] font-medium tracking-[0.14em] text-slate uppercase">{fact.term}</dt>
                    <dd className="mt-1.5 text-[14px] leading-relaxed text-ink">{fact.value}</dd>
                  </div>
                ))}
                <div className="border-b border-fog py-5">
                  <dt className="text-[10.5px] font-medium tracking-[0.14em] text-slate uppercase">{legal.activities}</dt>
                  <dd className="mt-1.5 text-[14px] leading-relaxed text-ink">{activities}</dd>
                </div>
              </dl>
              <Link
                to={PATHS.contact}
                className="mt-8 inline-flex items-center gap-2 text-[13px] font-medium tracking-wide text-navy-900 uppercase"
              >
                {c.contactCta}
                <ArrowRight size={14} className="rtl:rotate-180" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="about-leadership-heading" className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-4">
              <p className="flex flex-wrap items-center gap-3 text-[11px] font-medium tracking-[0.2em] text-slate uppercase sm:text-[12px]">
                <span className="h-px w-8 bg-signal-600" aria-hidden="true" />
                {leadership.eyebrow}
              </p>
              <h2 id="about-leadership-heading" className="mt-5 font-display text-[1.9rem] leading-[1.12] font-medium tracking-tight text-navy-900 sm:text-[2.2rem]">
                {leadership.title}
              </h2>
              <p className="mt-6 text-[15px] leading-relaxed text-graphite">{leadership.lede}</p>
            </div>

            <div className="lg:col-span-7 lg:col-start-6">
              <ul className="border-t border-fog">
                {leadership.members.map((member, i) => (
                  <Reveal as="li" key={member.name} delay={i * 80} className="border-b border-fog">
                    <div className="flex flex-col gap-4 py-8 sm:flex-row sm:items-start sm:gap-7">
                      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-fog bg-white font-display text-[14px] font-semibold tracking-wide text-navy-900" aria-hidden="true">
                        {member.initials}
                      </span>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-baseline gap-x-3.5 gap-y-1">
                          <h3 className="text-[17px] font-semibold tracking-tight text-navy-900">{member.name}</h3>
                          <span className="text-balance text-[13px] font-bold tracking-[0.075em] text-signal-600 uppercase md:whitespace-nowrap">{member.role}</span>
                        </div>
                        {member.note && <p className="mt-2 max-w-xl text-[14.5px] leading-relaxed text-graphite">{member.note}</p>}
                      </div>
                    </div>
                  </Reveal>
                ))}
              </ul>
              <p className="mt-5 text-[13px] leading-relaxed text-slate">{leadership.footnote}</p>
            </div>
          </div>

          <div className="mt-16 rounded-[4px] bg-fog px-8 py-12 lg:px-14">
            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <h2 className="font-display text-[1.6rem] leading-tight font-medium tracking-tight text-navy-900 sm:text-[1.9rem]">{t.ctaTitle}</h2>
                <p className="mt-5 max-w-2xl text-[14.5px] leading-relaxed text-graphite">{t.ctaBody}</p>
              </div>
              <div className="flex flex-wrap items-center gap-4 lg:col-span-5 lg:justify-end">
                <Link
                  to={PATHS.devis}
                  className="group inline-flex items-center gap-2 rounded-full bg-signal-500 px-6 py-3.5 text-[13.5px] font-medium tracking-wide text-navy-950 transition-[background-color,transform] duration-200 hover:bg-signal-600 active:translate-y-px"
                >
                  {c.quoteCta}
                  <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" aria-hidden="true" />
                </Link>
                <Link
                  to={PATHS.services}
                  className="inline-flex items-center gap-2 rounded-full border border-slate px-6 py-3.5 text-[13.5px] font-medium tracking-wide text-iron transition-colors hover:border-navy-900 hover:text-navy-900"
                >
                  {c.services}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
