import { ArrowRight, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import PageHeader from "../components/PageHeader";
import QuoteForm from "../components/QuoteForm";
import Reveal from "../components/Reveal";
import { Link } from "../router";
import { PATHS } from "../router/routes";
import { company } from "../data/company";
import { useDict } from "../i18n";
import { usePageMeta } from "../router/seo";

/**
 * `/contact` — the contact route.
 *
 * Every value on this page is verified company data: the registry
 * (`src/data/company.ts`) for the seat, phone, e-mail and Plus Code, and the
 * same WhatsApp number the V11 contact section already used. Nothing is
 * invented — there are no opening hours, no coverage claims, no second phone
 * number, because the repository does not establish any.
 *
 * The quote form is the same component as `/devis`: one implementation, one
 * API contract.
 */
export default function ContactPage() {
  const dict = useDict();
  const t = dict.routes.contact;
  const c = dict.routes.common;
  const ct = dict.contact;
  usePageMeta({ title: t.meta.title, description: t.meta.description, path: PATHS.contact });

  const whatsappHref = `https://wa.me/${company.phoneHref.replace(/\+/g, "")}?text=${encodeURIComponent(
    ct.whatsappMessage("", ""),
  )}`;

  const channels = [
    {
      icon: MapPin,
      label: dict.place.seatLine,
      note: ct.plusCode(company.plusCode),
      dir: undefined,
      href: undefined,
    },
    {
      icon: Phone,
      label: company.phone,
      note: ct.phoneNote,
      href: `tel:${company.phoneHref}`,
      dir: "ltr" as const,
    },
    {
      icon: Mail,
      label: company.email,
      note: dict.footer.contactTitle,
      href: `mailto:${company.email}`,
      dir: undefined,
    },
    {
      icon: MessageCircle,
      label: company.phone,
      note: ct.whatsappNote,
      href: whatsappHref,
      dir: "ltr" as const,
      external: true,
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow={t.eyebrow}
        title={t.title}
        lede={t.lede}
        crumbs={[{ label: t.title }]}
        className="bg-paper"
        tone="paper"
      >
        <div className="mt-9 flex flex-wrap items-center gap-4">
          <Link
            to={PATHS.devis}
            className="group inline-flex items-center gap-2 bg-navy-900 px-6 py-3.5 text-[13px] font-medium tracking-wide text-white shadow-[0_16px_32px_-18px_rgba(14,31,48,0.65)] transition-[background-color,transform] duration-200 hover:bg-navy-800 active:translate-y-px"
          >
            {c.quoteCta}
            <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" aria-hidden="true" />
          </Link>
          <a
            href={`tel:${company.phoneHref}`}
            className="inline-flex items-center gap-2 border border-line-strong px-6 py-3.5 text-[13px] font-medium tracking-wide text-navy-900 transition-colors hover:border-navy-900 hover:bg-white"
          >
            <Phone size={15} aria-hidden="true" />
            {c.phoneCta}
          </a>
        </div>
      </PageHeader>

      <section aria-labelledby="contact-channels-heading" className="bg-white py-20 lg:py-24">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-5">
              <h2 id="contact-channels-heading" className="font-display text-[1.4rem] font-medium tracking-tight text-navy-900">
                {t.channelsTitle}
              </h2>
              <ul className="mt-8 border-t border-line">
                {channels.map((channel) => {
                  const Icon = channel.icon;
                  const body = (
                    <>
                      <span className="block text-[14.5px] leading-snug text-ink">
                        <span dir={channel.dir} className="inline-block">
                          {channel.label}
                        </span>
                      </span>
                      <span className="mt-1 block text-[12.5px] text-mute">{channel.note}</span>
                    </>
                  );
                  return (
                    <li key={channel.note} className="border-b border-line">
                      <div className="flex items-start gap-4 py-6">
                        <Icon size={18} className="mt-0.5 shrink-0 text-signal-600" aria-hidden="true" />
                        {channel.href ? (
                          <a
                            href={channel.href}
                            target={channel.external ? "_blank" : undefined}
                            rel={channel.external ? "noopener noreferrer" : undefined}
                            className="transition-colors hover:text-navy-900"
                          >
                            {body}
                          </a>
                        ) : (
                          <span>{body}</span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>

              <Reveal delay={80}>
                <div className="no-print mt-10 aspect-[4/3] w-full overflow-hidden border border-line grayscale transition-[filter] duration-500 hover:grayscale-0">
                  <iframe
                    title={ct.mapTitle}
                    src="https://www.google.com/maps?q=Q9JM%2B542%20A%C3%AFn%20El%20Assel&output=embed"
                    className="h-full w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-7">
              <h2 className="font-display text-[1.4rem] font-medium tracking-tight text-navy-900">{t.quoteTitle}</h2>
              <p className="mt-4 max-w-2xl text-[14.5px] leading-relaxed text-ink-soft">{t.quoteBody}</p>
              <Reveal>
                <div className="mt-8">
                  <QuoteForm />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
