import { MessageCircle } from "lucide-react";
import { company } from "../data/company";
import { useDict } from "../i18n";

/**
 * FloatingActions — the persistent utility control of the design system:
 * a single circular WhatsApp button fixed to the inline-end edge. White
 * surface, hairline border, the reserved floating shadow, and the one warm
 * accent on the icon — the same "support/chat" pattern the reference
 * reserves for persistent help entries, mapped to the company's real,
 * verified WhatsApp channel (prefilled from the active dictionary).
 *
 * Hidden in print, below the mobile sheet's z-index so the menu always
 * wins, and small enough (48px) to never obstruct content or CTAs.
 */
export default function FloatingActions() {
  const dict = useDict();
  const t = dict.contact;

  const whatsappHref = `https://wa.me/${company.phoneHref.replace(/\+/g, "")}?text=${encodeURIComponent(
    t.whatsappMessage("", ""),
  )}`;

  return (
    <div className="no-print fixed bottom-5 end-5 z-30 print:hidden">
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${dict.hero.whatsapp} — ${company.phone}`}
        className="flex h-12 w-12 items-center justify-center rounded-full border border-fog bg-white text-signal-600 shadow-[var(--shadow-float)] transition-[color,transform] duration-200 hover:-translate-y-0.5 hover:text-signal-700"
      >
        <MessageCircle size={20} strokeWidth={1.5} aria-hidden="true" />
      </a>
    </div>
  );
}
