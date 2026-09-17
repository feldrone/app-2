/**
 * FEL DRONE — i18n contract (V11).
 *
 * One typed shape per locale. Every string a visitor can read — navigation,
 * hero, sections, forms, FAQ, legal, footer, image alternative text — is a
 * field of `Dictionary`. Components never hard-code copy, so adding or
 * correcting a language is a data change, not a layout change.
 *
 * Kept deliberately dependency-free: no i18n library, no framework migration
 * (see docs/I18N.md).
 */
import type { Img } from "../lib/images";
import type { TeamMemberBase } from "../data/company";

export type Locale = "fr" | "en" | "ar";
export type Direction = "ltr" | "rtl";

export const LOCALES: Locale[] = ["fr", "en", "ar"];

/** Name of each language in its own script — used by the language selector. */
export const LOCALE_NAMES: Record<Locale, string> = {
  fr: "Français",
  en: "English",
  ar: "العربية",
};

export const LOCALE_SHORT: Record<Locale, string> = { fr: "FR", en: "EN", ar: "AR" };

/** `lang` attribute value written to <html> (region-qualified for FR/AR). */
export const LOCALE_HTML_LANG: Record<Locale, string> = {
  fr: "fr",
  en: "en",
  ar: "ar",
};

export type TeamMember = TeamMemberBase & {
  role: string;
  note?: string;
};

export type ServiceCta = {
  /** Localized button label */
  label: string;
  verb: "devis" | "location" | "prestation";
};

export type Service = {
  slug: string;
  index: string;
  title: string;
  tag: string;
  intro: string;
  points: string[];
  steps: string[];
  cta: ServiceCta;
  image: Img;
  /**
   * Canonical value sent to POST /api/quote — always the French service name,
   * whatever the interface language: the API contract never changes with the
   * locale (see docs/BACKEND.md and docs/I18N.md).
   */
  apiValue: string;
  priority: "primary" | "secondary";
};

export type FaqItem = { q: string; a: string };
export type NavLink = { href: string; label: string };
export type Sector = { label: string; value: string };
export type MethodStep = { n: string; title: string; desc: string };
export type DemonstrationItem = { slug: string; title: string; desc: string };
export type EquipmentGroup = { category: string; items: { label: string; value: string }[] };
export type ServiceOption = { value: string; label: string };

/** Alternative text for every photograph used by the site. */
export type MediaAlts = {
  hero: string;
  control: string;
  safety: string;
  services: Record<string, string>;
};

/* -------------------------------------------------------------------------- */
/* V12 — route & page copy                                                     */
/* -------------------------------------------------------------------------- */

/** Every page carries its own head copy; the router applies it per route. */
export type MetaCopy = { title: string; description: string };

/**
 * Copy for one service detail page. The technical body (intro, points, steps,
 * API value) still comes from `services.list` — the page recomposes validated
 * content and only adds framing, so no capability is ever invented twice.
 */
export type ServicePageCopy = {
  /** Nav, breadcrumb and menu label — may group several poles (Vente & location). */
  label: string;
  meta: MetaCopy;
  eyebrow: string;
  lede: string;
};

export type RoutesCopy = {
  /** Labels shared by every route page. */
  common: {
    home: string;
    services: string;
    detailCta: string;
    quoteCta: string;
    contactCta: string;
    phoneCta: string;
    breadcrumb: string;
    coverageTitle: string;
    stepsTitle: string;
    ctaTitle: string;
    ctaBody: string;
    relatedTitle: string;
    backHome: string;
  };
  services: { meta: MetaCopy;
    eyebrow: string;
    title: string;
    lede: string;
    note: string;
  };
  /** Keyed by route slug — see SERVICE_PAGES in src/router/routes.ts. */
  service: Record<string, ServicePageCopy>;
  devis: { meta: MetaCopy;
    eyebrow: string;
    title: string;
    lede: string;
    processTitle: string;
    process: { title: string; body: string }[];
    asideTitle: string;
    asideBody: string;
    asideNote: string;
    backToServices: string;
  };
  contact: { meta: MetaCopy;
    eyebrow: string;
    title: string;
    lede: string;
    channelsTitle: string;
    quoteTitle: string;
    quoteBody: string;
    formTitle: string;
  };
  about: { meta: MetaCopy;
    eyebrow: string;
    title: string;
    lede: string;
    companyTitle: string;
    companyBody: string;
    factsTitle: string;
    ctaTitle: string;
    ctaBody: string;
  };
  notFound: { meta: MetaCopy;
    code: string;
    title: string;
    body: string;
    homeCta: string;
    servicesCta: string;
  };
};

export type Dictionary = {
  /** BCP-47 tag + writing direction */
  locale: { tag: Locale; htmlLang: string; dir: Direction; name: string; short: string };

  /** Document head copy — the static tags in template.html are the French
   *  fallback; `usePageMeta` replaces them per route and language. */
  seo: { title: string; description: string };

  nav: {
    aria: string;
    mobileAria: string;
    links: NavLink[];
    cta: string;
    skip: string;
    logoHome: string;
    openMenu: string;
    closeMenu: string;
    language: string;
    languageAria: string;
    /** Accessible label of the services menu trigger. */
    servicesMenu: string;
  };

  hero: {
    aria: string;
    eyebrow: string;
    titleTop: string;
    titleBottom: string;
    body: (company: { legalName: string }) => string;
    ctaPrimary: string;
    ctaSecondary: string;
    phoneLabel: string;
    whatsapp: string;
    whatsappMessage: string;
    verifiedNote: string;
    figcaption: string;
  };

  expertise: {
    eyebrow: string;
    title: string;
    lede: string;
    principles: { n: string; title: string; text: string }[];
    figcaption: string;
  };

  services: {
    eyebrow: string;
    title: string;
    lede: string;
    note: string;
    priorityBadge: string;
    stepsToggle: string;
    coverageLabel: (service: string) => string;
    list: Service[];
  };

  method: {
    eyebrow: string;
    title: string;
    lede: string;
    note: string;
    aria: string;
    steps: MethodStep[];
  };

  demonstration: {
    eyebrow: string;
    title: string;
    lede: string;
    badge: string;
    disclaimer: string;
    mediaPending: string;
    projectsTitle: string;
    projectsBadge: string;
    projectsText: string;
    projectsNote: string;
    items: DemonstrationItem[];
  };

  equipment: {
    eyebrow: string;
    title: string;
    lede: string;
    note: string;
    mediaPending: string;
    mediaNote: string;
    groups: EquipmentGroup[];
  };

  safety: {
    eyebrow: string;
    title: string;
    lede: string;
    standards: { n: string; label: string; detail: string }[];
    figcaption: string;
  };

  leadership: {
    eyebrow: string;
    title: string;
    lede: string;
    footnote: string;
    members: TeamMember[];
  };

  faq: {
    eyebrow: string;
    title: string;
    lede: string;
    askCta: string;
    items: FaqItem[];
  };

  sectors: Sector[];

  /** V12 — real routes: one block of copy per page, in every language. */
  routes: RoutesCopy;

  /**
   * Place names as they must be READ by visitors. The registry values live in
   * `data/company.ts`; the French dictionary simply re-exports them, and the
   * other languages give the localized wording (Aïn El Assel / El Tarf).
   */
  place: {
    addressLine1: string;
    addressLine2: string;
    country: string;
    city: string;
    placeName: string;
    /** Ready-to-print seat line: address + country */
    seatLine: string;
  };

  contact: {
    eyebrow: string;
    title: string;
    lede: string;
    plusCode: (code: string) => string;
    phoneNote: string;
    whatsappNote: string;
    whatsappMessage: (service: string, wilaya: string) => string;
    mapTitle: string;
    form: {
      name: string;
      namePlaceholder: string;
      phone: string;
      phonePlaceholder: string;
      phoneHint: string;
      company: string;
      companyPlaceholder: string;
      wilaya: string;
      wilayaPlaceholder: string;
      email: string;
      emailPlaceholder: string;
      service: string;
      servicePlaceholder: string;
      message: string;
      messagePlaceholder: string;
      honeypot: string;
      required: string;
      submit: string;
      submitting: string;
      footnote: string;
      options: ServiceOption[];
      errors: {
        nameRequired: string;
        nameLength: string;
        phoneRequired: string;
        phoneInvalid: string;
        emailInvalid: string;
        companyLength: string;
        wilayaRequired: string;
        wilayaLength: string;
        serviceRequired: string;
        messageRequired: string;
        messageShort: string;
        messageLong: string;
        rateLimited: string;
      };
      mailto: {
        subject: (service: string, name: string) => string;
        fallbackService: string;
        fallbackName: string;
        name: string;
        phone: string;
        company: string;
        wilaya: string;
        email: string;
        service: string;
        message: string;
      };
      success: {
        title: string;
        reference: string;
        body: string;
        again: string;
      };
      errorSend: string;
      offlineTitle: string;
      offlineBody: (phone: string) => string;
      offlineEmail: string;
      retry: string;
    };
  };

  legal: {
    heading: string;
    denomination: string;
    legalForm: string;
    legalFormValue: string;
    rc: string;
    rcPrefix: string;
    seat: string;
    gerant: string;
    contact: string;
    activities: string;
    activitiesJoin: string;
    activitiesList: string[];
  };

  footer: {
    tagline: string;
    sitemap: string;
    legalLink: string;
    contactTitle: string;
    rights: string;
    backToTop: string;
  };

  media: MediaAlts;
};
