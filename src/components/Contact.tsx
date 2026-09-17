import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { company } from "../data/company";
import { useDict } from "../i18n";
import QuoteForm from "./QuoteForm";
import Reveal from "./Reveal";

/**
 * Contact section on the landing page — V10 layout, V11 languages, V12 form.
 *
 * The form itself now lives in `QuoteForm` (one implementation shared with
 * `/devis` and `/contact`), so the payload, the validation, the honeypot, the
 * rate-limit handling and the honest success/offline states are identical on
 * every surface. The section keeps `id="contact"` and the form keeps
 * `id="quote-form"`, so the V11 anchors and the focus handshake in
 * `utils/quote.ts` keep working unchanged.
 */
export default function Contact() {
  const dict = useDict();
  const t = dict.contact;

  const whatsappHref = `https://wa.me/${company.phoneHref.replace(/\+/g, "")}?text=${encodeURIComponent(
    t.whatsappMessage("", ""),
  )}`;

  return (
    <section id="contact" aria-labelledby="contact-heading" className="bg-fog py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <Reveal>
              <p className="mb-5 flex flex-wrap items-center gap-3 text-[11px] font-medium tracking-[0.2em] text-slate uppercase sm:text-[12px]">
                <span className="h-px w-8 bg-signal-600" aria-hidden="true" />
                {t.eyebrow}
              </p>
              <h2 id="contact-heading" className="font-display text-[1.6rem] text-balance leading-[1.22] font-light tracking-[-0.02em] text-navy-900 sm:text-[2rem]">
                {t.title}
              </h2>
              <p className="mt-6 text-[15.5px] leading-relaxed text-graphite">{t.lede}</p>
            </Reveal>

            <ul className="mt-10 space-y-6">
              <li className="flex items-start gap-4">
                <MapPin size={18} className="mt-0.5 shrink-0 text-signal-600" aria-hidden="true" />
                <span className="text-[14px] leading-relaxed text-iron">
                  {dict.place.seatLine}
                  <span className="block text-[12px] text-slate">{t.plusCode(company.plusCode)}</span>
                </span>
              </li>
              <li className="flex items-start gap-4">
                <Phone size={18} className="mt-0.5 shrink-0 text-signal-600" aria-hidden="true" />
                <a href={`tel:${company.phoneHref}`} className="group text-[14px] text-iron transition-colors hover:text-navy-900">
                  <span dir="ltr" className="inline-block">{company.phone}</span>
                  <span className="block text-[12px] text-slate group-hover:text-graphite">{t.phoneNote}</span>
                </a>
              </li>
              <li className="flex items-start gap-4">
                <Mail size={18} className="mt-0.5 shrink-0 text-signal-600" aria-hidden="true" />
                <a href={`mailto:${company.email}`} className="text-[14px] break-all text-iron transition-colors hover:text-navy-900">
                  {company.email}
                </a>
              </li>
              <li className="flex items-start gap-4">
                <MessageCircle size={18} className="mt-0.5 shrink-0 text-signal-600" aria-hidden="true" />
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="text-[14px] text-iron transition-colors hover:text-navy-900">
                  WhatsApp — <span dir="ltr" className="inline-block">{company.phone}</span>
                  <span className="block text-[12px] text-slate">{t.whatsappNote}</span>
                </a>
              </li>
            </ul>

            <Reveal delay={160}>
              <div className="no-print mt-12 aspect-[4/3] w-full overflow-hidden rounded-[4px] grayscale transition-[filter] duration-500 hover:grayscale-0">
                <iframe
                  title={t.mapTitle}
                  src="https://www.google.com/maps?q=Q9JM%2B542%20A%C3%AFn%20El%20Assel&output=embed"
                  className="h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <Reveal>
              <QuoteForm />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
