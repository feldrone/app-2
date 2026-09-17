import { ArrowRight, Mail, MessageCircle, Phone } from "lucide-react";
import PageHeader from "../components/PageHeader";
import QuoteForm from "../components/QuoteForm";
import Reveal from "../components/Reveal";
import { Link } from "../router";
import { PATHS } from "../router/routes";
import { company } from "../data/company";
import { useDict } from "../i18n";
import { usePageMeta } from "../router/seo";

/**
 * `/devis` — the quote route.
 *
 * It mounts the one and only quote form (same component as the home page and
 * `/contact`), so `POST /api/quote`, its payload contract, its validation and
 * its honest success state are exactly the V11 ones. The page adds what the
 * inline section could not: the process, and the direct channels for a visitor
 * who would rather talk than type.
 */
export default function DevisPage() {
  const dict = useDict();
  const t = dict.routes.devis;
  const ct = dict.contact;
  usePageMeta({ title: t.meta.title, description: t.meta.description, path: PATHS.devis });

  const whatsappHref = `https://wa.me/${company.phoneHref.replace(/\+/g, "")}?text=${encodeURIComponent(
    ct.whatsappMessage("", ""),
  )}`;

  return (
    <>
      <PageHeader
        eyebrow={t.eyebrow}
        title={t.title}
        lede={t.lede}
        crumbs={[{ label: t.title }]}
        className="bg-fog"
        tone="paper"
      />

      <section aria-labelledby="devis-form-heading" className="bg-fog pb-20 lg:pb-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7">
              <h2 id="devis-form-heading" className="sr-only">
                {t.title}
              </h2>
              <Reveal>
                <QuoteForm />
              </Reveal>
            </div>

            <aside className="lg:col-span-4 lg:col-start-9">
              <Reveal>
                <div className="rounded-[4px] bg-white p-8">
                  <h2 className="font-display text-[1.2rem] leading-snug font-medium tracking-tight text-navy-900">
                    {t.asideTitle}
                  </h2>
                  <p className="mt-4 text-[13.5px] leading-relaxed text-graphite">{t.asideBody}</p>
                  <div className="mt-7 flex flex-col gap-3">
                    <a
                      href={`tel:${company.phoneHref}`}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-slate px-5 py-3 text-[13px] font-medium text-iron transition-colors hover:border-navy-900 hover:text-navy-900"
                    >
                      <Phone size={15} aria-hidden="true" />
                      <span dir="ltr" className="inline-block">{company.phone}</span>
                    </a>
                    <a
                      href={`mailto:${company.email}`}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-slate px-5 py-3 text-[13px] font-medium text-iron transition-colors hover:border-navy-900 hover:text-navy-900"
                    >
                      <Mail size={15} aria-hidden="true" />
                      <span className="break-all">{company.email}</span>
                    </a>
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-slate px-5 py-3 text-[13px] font-medium text-iron transition-colors hover:border-navy-900 hover:text-navy-900"
                    >
                      <MessageCircle size={15} aria-hidden="true" />
                      WhatsApp
                    </a>
                  </div>
                  <p className="mt-6 text-[12px] leading-relaxed text-slate">{t.asideNote}</p>
                </div>
              </Reveal>

              <Reveal delay={80}>
                <ol className="mt-10 border-t border-line-fog pt-8" role="list">
                  <p className="text-[11px] font-medium tracking-[0.16em] text-slate uppercase">{t.processTitle}</p>
                  {t.process.map((step, i) => (
                    <li key={step.title} className="mt-6 flex gap-5">
                      <span className="w-6 shrink-0 font-display text-[12px] font-light text-signal-600 tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>
                        <span className="block text-[14px] font-semibold tracking-tight text-navy-900">{step.title}</span>
                        <span className="mt-1.5 block text-[13.5px] leading-relaxed text-graphite">{step.body}</span>
                      </span>
                    </li>
                  ))}
                </ol>
              </Reveal>

              <Link
                to={PATHS.services}
                className="mt-10 inline-flex items-center gap-2 text-[12px] font-semibold tracking-wide text-signal-700 uppercase"
              >
                {t.backToServices}
                <ArrowRight size={14} className="rtl:rotate-180" aria-hidden="true" />
              </Link>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
