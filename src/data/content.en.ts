/**
 * FEL DRONE — English dictionary.
 *
 * B2B English for an Algerian drone operator: factual, restrained, no
 * marketing inflation. Mirrors `content.fr.ts` field for field — same facts,
 * same caveats ("To be completed" where a specification is not verified), no
 * claim added or removed in translation.
 *
 * Service identifiers sent to POST /api/quote stay canonical (French) in
 * `apiValue`: only the visible labels change with the language.
 */
import { serviceImages } from "../lib/images";
import type { Dictionary } from "../i18n/types";

const services: Dictionary["services"]["list"] = [
  {
    slug: "topographie",
    index: "01",
    title: "Surveying & photogrammetry",
    tag: "Surveys",
    intro:
      "Aerial drone surveys for georeferenced orthophotos, digital models and plans — on quotation, study according to the requirement.",
    points: [
      "Georeferenced orthophotos — demonstration example",
      "Digital terrain models (DTM) — to be completed, sensor dependent",
      "Topographic plans — pricing according to the mission",
    ],
    steps: [
      "Site scoping and definition of deliverables",
      "Flight plan and regulatory checks",
      "Acquisition and on-site quality control",
      "Processing and delivery — on quotation",
    ],
    cta: { label: "Request a quote", verb: "devis" },
    image: serviceImages.topographie,
    apiValue: "Topographie & photogrammétrie",
    priority: "primary",
  },
  {
    slug: "suivi-chantier",
    index: "02",
    title: "Site monitoring & inspection",
    tag: "Construction",
    intro:
      "Progress monitoring and regular visual inspection of the site — time-stamped documentation and technical observations, with no guarantee of outcome.",
    points: [
      "Periodic photographic monitoring",
      "Documentation of sensitive areas",
      "Safety and technical observations — report on quotation",
    ],
    steps: [
      "Definition of the perimeter and points of attention",
      "Flight plan and access authorisations",
      "Photo and video acquisition",
      "Progress report — pricing according to the mission",
    ],
    cta: { label: "Request a service", verb: "prestation" },
    image: serviceImages.inspection,
    apiValue: "Suivi & inspection de chantier",
    priority: "primary",
  },
  {
    slug: "maintenance",
    index: "03",
    title: "Drone maintenance & diagnostics",
    tag: "Workshop",
    intro:
      "Diagnostics, repair and calibration of drones and sensors — traceability at every step, study according to the requirement.",
    points: [
      "In-depth technical diagnostics — to be completed, model dependent",
      "Repair and return to service — on quotation",
      "Calibration and adjustment — pricing according to the mission",
    ],
    steps: [
      "Diagnostics and quotation — on quotation",
      "Technical inspection",
      "Workshop intervention",
      "Final verification and hand-back",
    ],
    cta: { label: "Request a quote", verb: "devis" },
    image: serviceImages.maintenance,
    apiValue: "Maintenance & diagnostic drone",
    priority: "primary",
  },
  {
    slug: "thermographie",
    index: "04",
    title: "Thermal imaging",
    tag: "Inspection",
    intro:
      "Drone-based thermal inspection for temperature surveys — on quotation, according to the requirement and site accessibility.",
    points: [
      "Aerial thermal surveys — demonstration example",
      "Detection of thermal anomalies — interpretation to be completed",
      "Visual report — pricing according to the mission",
    ],
    steps: [
      "Scoping of the area and objectives",
      "Flight plan and acquisition conditions",
      "Thermal acquisition",
      "Delivery of visuals and observations — on quotation",
    ],
    cta: { label: "Request a service", verb: "prestation" },
    image: serviceImages.thermographie,
    apiValue: "Thermographie",
    priority: "secondary",
  },
  {
    slug: "agriculture",
    index: "05",
    title: "Agriculture",
    tag: "Precision",
    intro:
      "Agricultural drone imaging (NDVI, plot monitoring) — services on study, with no yield promise.",
    points: [
      "NDVI imagery — demonstration example",
      "Plot monitoring — to be completed",
      "Vigour maps — pricing according to the mission",
    ],
    steps: [
      "Definition of the plot and the objective",
      "Flight plan and acquisition window",
      "Acquisition",
      "Delivery of the maps — on quotation",
    ],
    cta: { label: "Request a service", verb: "prestation" },
    image: serviceImages.agriculture,
    apiValue: "Agriculture",
    priority: "secondary",
  },
  {
    slug: "vente",
    index: "06",
    title: "Equipment sales",
    tag: "Sales",
    intro:
      "Professional drones and accessories — selected for the use case, tested before hand-over, on quotation.",
    points: [
      "Professional aircraft — to be completed, availability dependent",
      "Sensors and accessories — on quotation",
      "Spare parts — pricing according to the mission",
    ],
    steps: [
      "Requirement and use-case definition",
      "Equipment selection and configuration — to be completed",
      "Testing and checks before hand-over",
      "Delivery and hand-over briefing",
    ],
    cta: { label: "Request a quote", verb: "devis" },
    image: serviceImages.vente,
    apiValue: "Vente",
    priority: "secondary",
  },
  {
    slug: "location",
    index: "07",
    title: "Equipment rental",
    tag: "Fleet",
    intro:
      "Occasional provision of maintained aircraft under strict operational supervision — on quotation.",
    points: [
      "Maintained and calibrated fleet — to be completed",
      "Operational supervision",
      "One-off missions — pricing according to the mission",
    ],
    steps: [
      "Definition of the mission and duration",
      "Availability and quotation — on quotation",
      "Equipment preparation and briefing",
      "Hand-back and inspection",
    ],
    cta: { label: "Rent a drone", verb: "location" },
    image: serviceImages.location,
    apiValue: "Location",
    priority: "secondary",
  },
];

export const en: Dictionary = {
  locale: { tag: "en", htmlLang: "en", dir: "ltr", name: "English", short: "EN" },

  seo: {
    title:
      "FEL DRONE — Drone surveying, site inspection and drone maintenance | El Tarf, Algeria",
    description:
      "SARL FEL DRONE, El Tarf: drone surveying and photogrammetry, site inspection and progress monitoring, maintenance and diagnostics, thermography, agriculture, sales and rental. Quoted per mission.",
  },

  nav: {
    aria: "Main navigation",
    mobileAria: "Mobile navigation",
    links: [
      { href: "/#expertise", label: "Expertise" },
      { href: "/services", label: "Services" },
      { href: "/#methode", label: "Method" },
      { href: "/#demonstration", label: "Demonstration" },
      { href: "/#equipement", label: "Capabilities" },
      { href: "/#securite", label: "Flight safety" },
      { href: "/a-propos", label: "About" },
      { href: "/#faq", label: "FAQ" },
      { href: "/contact", label: "Contact" },
    ],
    cta: "Request a quote",
    skip: "Skip to main content",
    logoHome: "FEL DRONE — back to top of page",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    language: "Language",
    languageAria: "Choose the site language",
    servicesMenu: "Drone services",
  },

  hero: {
    aria: "Introduction to FEL DRONE",
    eyebrow:
      "Surveying & photogrammetry, site monitoring & inspection, drone maintenance & diagnostics — eight steps, zero improvisation.",
    titleTop: "Aerial survey data",
    titleBottom: "operated like aircraft.",
    body: (c) =>
      `${c.legalName} in El Tarf: drone surveying & photogrammetry, site monitoring, maintenance & diagnostics, thermal imaging, agriculture, sales and rental. Eight-step method — on quotation, pricing according to the mission.`,
    ctaPrimary: "Request a quote",
    ctaSecondary: "Explore our services",
    phoneLabel: "direct line",
    whatsapp: "WhatsApp",
    whatsappMessage: "Hello FEL DRONE — information request",
    verifiedNote: "Existing verified number — no intrusive bubble. On quotation.",
    figcaption: "Eight-step method, zero improvisation — pre-flight check on the ground.",
  },

  expertise: {
    eyebrow: "Expertise",
    title: "Two disciplines combined: air safety and modern engineering.",
    lede: "FEL DRONE combines an operational discipline inherited from aviation standards with a close command of embedded systems. That dual culture shapes how we sell, operate and maintain every drone: nothing is left to approximation.",
    principles: [
      {
        n: "01",
        title: "Aeronautical discipline",
        text: "Every mission is planned, briefed and supervised to aviation standards of rigour — ours and our clients'.",
      },
      {
        n: "02",
        title: "Embedded engineering",
        text: "Automation, embedded systems and digital tools developed in-house to make every operation reliable end to end.",
      },
      {
        n: "03",
        title: "Field precision",
        text: "From diagnostics to data hand-over, rigorous execution whatever the sector of application.",
      },
    ],
    figcaption:
      "The control station before every mission: checklist, briefing, collective review, no improvisation.",
  },

  services: {
    eyebrow: "Our services",
    title: "Seven service lines, three priorities — the rest on quotation.",
    lede: "Surveying & photogrammetry, site monitoring & inspection, drone maintenance & diagnostics first. Thermal imaging, agriculture, sales and rental in support — every mission framed by a quotation, pricing according to the mission, study according to the requirement.",
    note: 'No price shown, and no model, sensor, flight time, accuracy or certification invented. Entries marked "To be completed" flag information that is not verified. On quotation, pricing according to the mission, study according to the requirement.',
    priorityBadge: "Priority",
    stepsToggle: "How does it work?",
    coverageLabel: (service) => `What ${service} covers`,
    list: services,
  },

  method: {
    eyebrow: "Our method",
    title: "Eight steps, zero improvisation",
    lede: "From the requirement to delivery — every mission follows the same framework, framed by a quotation, with no grey areas. On quotation, pricing according to the mission, study according to the requirement.",
    note: "No promise of results, no invented statistics. The method describes the process, not a guarantee.",
    aria: "Eight-step methodology",
    steps: [
      {
        n: "01",
        title: "Requirement definition",
        desc: "Name, company, wilaya of the requirement, requested service, useful details — context first.",
      },
      {
        n: "02",
        title: "Study & feasibility",
        desc: "Verification of technical and regulatory feasibility, with no promise.",
      },
      {
        n: "03",
        title: "Quotation",
        desc: "Pricing according to the mission, deliverables and access constraints.",
      },
      {
        n: "04",
        title: "Planning",
        desc: "Flight plan, authorisations, weather, briefing — eight steps, zero improvisation.",
      },
      {
        n: "05",
        title: "Field preparation",
        desc: "Equipment checklist, calibration, safety — pre-flight check on the ground.",
      },
      {
        n: "06",
        title: "Acquisition",
        desc: "Operated flight, strict supervision, traceability of every capture.",
      },
      {
        n: "07",
        title: "Processing & control",
        desc: "Data processing, quality checks — to be completed, sensor dependent.",
      },
      {
        n: "08",
        title: "Delivery & archiving",
        desc: "Delivery of the agreed deliverables, archiving — demonstration example not from a client mission.",
      },
    ],
  },

  demonstration: {
    eyebrow: "Demonstration",
    title: "What does a deliverable look like?",
    lede: "Four demonstration examples — not from a client mission. Each visual is a documented placeholder, not a client project.",
    badge: "Demo",
    disclaimer:
      "Demonstration example — not from a client mission. To be completed according to sensor and mission. On quotation.",
    mediaPending: "Media to be supplied",
    projectsTitle: "Projects",
    projectsBadge: "Transparency",
    projectsText:
      "First projects to come. We present no client name, no project, no result, no testimonial and no statistic without a verifiable basis. This section will only be fed with real, authorised missions.",
    projectsNote: "To be completed — no fictional project presented as real.",
    items: [
      {
        slug: "orthophoto",
        title: "Orthophoto",
        desc: "Demonstration example — not from a client mission. Georeferenced orthomosaic — to be completed.",
      },
      {
        slug: "mnt",
        title: "DTM",
        desc: "Demonstration example — not from a client mission. Digital terrain model — to be completed.",
      },
      {
        slug: "ndvi",
        title: "NDVI",
        desc: "Demonstration example — not from a client mission. Vegetation vigour map — to be completed.",
      },
      {
        slug: "rapport",
        title: "Report",
        desc: "Demonstration example — not from a client mission. Observation report — pricing according to the mission.",
      },
    ],
  },

  equipment: {
    eyebrow: "Equipment",
    title: "Verified capabilities, no invented catalogue",
    lede: "Only verified capabilities are listed. Everything else is marked to be completed — we do not speculate on models, sensors, flight time or accuracy.",
    note: "No drone model, no sensor, no flight time, no accuracy figure and no certification is invented. On quotation, study according to the requirement.",
    mediaPending: "Media to be supplied",
    mediaNote:
      "Workshop photographs, verified data sheets, certificates — to be completed. No toy-drone imagery, no 3D renders, no manned aviation.",
    groups: [
      {
        category: "Aircraft",
        items: [
          { label: "Professional multirotors", value: "To be completed — models according to availability" },
          { label: "Flight time", value: "To be completed" },
          { label: "Payload", value: "To be completed" },
        ],
      },
      {
        category: "Sensors",
        items: [
          { label: "RGB / Photogrammetry", value: "To be completed — sensor according to mission" },
          { label: "Thermal", value: "To be completed" },
          { label: "Multispectral / NDVI", value: "To be completed" },
        ],
      },
      {
        category: "Processing",
        items: [
          { label: "Orthophoto", value: "On quotation — demonstration example" },
          { label: "DTM / Modelling", value: "To be completed" },
          { label: "Deliverables", value: "Pricing according to the mission" },
        ],
      },
    ],
  },

  safety: {
    eyebrow: "Safety & operating standards",
    title: "Air safety is not an option. It is the foundation.",
    lede: "Our operations direction applies to every mission the same rigour as manned air operations: planning, verification, supervision. No flight is improvised.",
    standards: [
      {
        n: "S.1",
        label: "Certified competence",
        detail: "Every mission is operated by a remote pilot holding a professional certification.",
      },
      {
        n: "S.2",
        label: "Systematic flight plan",
        detail: "No flight is engaged without a formalised plan and prior validation of the operating conditions.",
      },
      {
        n: "S.3",
        label: "Aeronautical supervision",
        detail: "The fleet is operated under aeronautical supervision: protocols, checklists and traceability on every sortie.",
      },
    ],
    figcaption:
      "Pre-flight check on the ground: the most important gesture is the one before take-off.",
  },

  leadership: {
    eyebrow: "Leadership",
    title: "Leadership & expertise",
    lede: "A tight governance structure, backed by aeronautical and technical expertise directly engaged in operations.",
    footnote: "The roles above reflect the functions exercised within the company.",
    members: [
      {
        name: "Yassine Fellah",
        initials: "YF",
        role: "SHAREHOLDER — DIRECTOR & MANAGER",
        note: "Legal and administrative officer of the company.",
      },
      {
        name: "Menouar Fellah",
        initials: "MF",
        role: "SHAREHOLDER — AVIATION & OPERATIONS ADVISER",
        note: "Aviation executive (retired) — reference point for flight supervision and safety culture.",
      },
      {
        name: "Amine Fellah",
        initials: "AF",
        role: "SHAREHOLDER — TECHNICAL & SYSTEMS MANAGER",
        note: "Computer science student.",
      },
    ],
  },

  faq: {
    eyebrow: "Frequently asked questions",
    title: "Straight answers, no jargon.",
    lede: "Rental, maintenance, inspections, quotations — the essentials, plainly stated. For anything else, a call answers better than a form.",
    askCta: "Ask a specific question",
    items: [
      {
        q: "Do you provide drone topographic surveys?",
        a: "Yes — surveying & photogrammetry: georeferenced orthophotos, DTM, plans according to the requirement. Every request is studied and quoted; pricing depends on the area, accessibility and expected deliverables.",
      },
      {
        q: "How does site monitoring work?",
        a: "Definition of the perimeter and points of attention, flight plan and access authorisations, photo/video acquisition, then a time-stamped progress report. On quotation, pricing according to the mission.",
      },
      {
        q: "Is the rental service for private individuals or companies?",
        a: "The fleet is made available for one-off missions under strict operational supervision — a framework designed for professional use. Describe your project: we assess feasibility and the suitable conditions. On quotation.",
      },
      {
        q: "How long does a maintenance operation take?",
        a: "The duration depends on the nature of the intervention. The prior diagnostics allow us to communicate a lead time before any work. On quotation.",
      },
      {
        q: "Do you operate throughout Algeria?",
        a: "Based in El Tarf, commune of Aïn El Assel. For projects outside the immediate area, indicate the wilaya of the requirement: we study the logistics and answer on feasibility. Pricing according to the mission.",
      },
      {
        q: "How do I request a quote?",
        a: "Form at the bottom of the page (name, phone, company, wilaya of the requirement, requested service, useful details) or a direct call. The more precise the context, the more accurate the quotation. On quotation.",
      },
    ],
  },

  sectors: [
    { label: "Surveying", value: "Orthophoto, DTM, photogrammetry — on quotation" },
    { label: "Construction", value: "Site monitoring, inspection — pricing according to the mission" },
    { label: "Maintenance", value: "Diagnostics & calibration — study according to the requirement" },
    { label: "Agriculture", value: "NDVI & plot monitoring — demonstration example" },
  ],

  place: {
    addressLine1: "Cité 150 Logements B",
    addressLine2: "Commune of Aïn El Assel, El Tarf Province",
    country: "Algeria",
    city: "El Tarf",
    placeName: "Aïn El Assel",
    seatLine: "Cité 150 Logements B, Commune of Aïn El Assel, El Tarf Province, Algeria",
  },

  contact: {
    eyebrow: "Contact & quotations",
    title: "Let's talk about your project.",
    lede: "Quotes on study, pricing according to the mission. Form with name, phone, company, wilaya of the requirement, requested service and useful details — the request enters the FEL DRONE system.",
    plusCode: (code) => `Plus Code ${code} — Aïn El Assel`,
    phoneNote: "direct line — business hours — to be completed",
    whatsappNote: "Pre-filled message according to service and wilaya",
    whatsappMessage: (service, wilaya) =>
      `Hello FEL DRONE — ${service ? `request for ${service}` : "information request"}${wilaya ? ` — wilaya ${wilaya}` : ""}`,
    mapTitle: "FEL DRONE location — Q9JM+542, Aïn El Assel, El Tarf Province, Algeria",
    form: {
      name: "Name",
      namePlaceholder: "First and last name",
      phone: "Phone",
      phonePlaceholder: "+213 …",
      phoneHint: "Country code +213.",
      company: "Company",
      companyPlaceholder: "Company (optional)",
      wilaya: "Wilaya of the requirement",
      wilayaPlaceholder: "E.g. El Tarf, Annaba…",
      email: "Email (optional)",
      emailPlaceholder: "you@example.dz",
      service: "Requested service",
      servicePlaceholder: "Choose a service…",
      message: "Useful details",
      messagePlaceholder:
        "Exact location, desired period, area, expected deliverables — what allows an accurate quotation. On quotation.",
      honeypot: "Do not fill in",
      required: "Fields marked",
      submit: "Send my request",
      submitting: "Sending…",
      footnote:
        "are required. The request is recorded in the FEL DRONE system and passed to the team — used only to answer you. No claim of a sent email without server confirmation.",
      options: [
        { value: "Topographie & photogrammétrie", label: "Surveying & photogrammetry" },
        { value: "Suivi & inspection de chantier", label: "Site monitoring & inspection" },
        { value: "Maintenance & diagnostic drone", label: "Drone maintenance & diagnostics" },
        { value: "Thermographie", label: "Thermal imaging" },
        { value: "Agriculture", label: "Agriculture" },
        { value: "Vente", label: "Equipment sales" },
        { value: "Location", label: "Equipment rental" },
        { value: "Autre", label: "Other" },
      ],
      errors: {
        nameRequired: "Please give your name.",
        nameLength: "Between 2 and 80 characters.",
        phoneRequired: "A number lets us call you back.",
        phoneInvalid: "Invalid number — e.g. +213 6 61 61 33 99.",
        emailInvalid: "Invalid email format.",
        companyLength: "120 characters maximum.",
        wilayaRequired: "Indicate the wilaya of the requirement.",
        wilayaLength: "Between 2 and 80 characters.",
        serviceRequired: "Select a service.",
        messageRequired: "Describe your requirement — a few useful details.",
        messageShort: "A few more words (15 characters minimum).",
        messageLong: "3,000 characters maximum.",
        rateLimited: "Too many recent submissions — try again in a minute.",
      },
      mailto: {
        subject: (service, name) => `Request ${service || "for information"} — ${name || "(FEL DRONE website)"}`,
        fallbackService: "for information",
        fallbackName: "(FEL DRONE website)",
        name: "Name",
        phone: "Phone",
        company: "Company",
        wilaya: "Wilaya of the requirement",
        email: "Email",
        service: "Requested service",
        message: "Useful details",
      },
      success: {
        title: "Request recorded",
        reference: "ref.",
        body: "Your request is recorded and passed to the team. No email is claimed as sent until delivery is confirmed server-side. Urgent need? Call",
        again: "Send another request",
      },
      errorSend: "Sending failed — server not confirmed. Try again or call",
      offlineTitle: "Form temporarily unavailable — nothing was sent.",
      offlineBody: (phone) => `Your message is ready: send it by pre-filled email or call ${phone}.`,
      offlineEmail: "Send by email",
      retry: "Try again",
    },
  },

  legal: {
    heading: "Legal notice",
    denomination: "Company name",
    legalForm: "Legal form",
    legalFormValue: "Limited Liability Company (SARL)",
    rc: "Trade register (Registre de Commerce)",
    rcPrefix: "No.",
    seat: "Registered office",
    gerant: "Manager",
    contact: "Contact",
    activities: "Declared activities",
    activitiesJoin: "and",
    activitiesList: [
      "Wholesale and retail trade in drones and accessories",
      "Rental of remotely piloted aircraft",
      "Maintenance, diagnostics and calibration",
      "Drone service operations — surveying & photogrammetry, site monitoring & inspection, thermal imaging, agriculture",
    ],
  },

  footer: {
    tagline:
      "Sales, rental, maintenance and drone services. Aeronautical rigour, technological precision.",
    sitemap: "Site map",
    legalLink: "Legal notice",
    contactTitle: "Contact details",
    rights: "All rights reserved.",
    credit3d: "3D model: “Quadcopter DJI Matrice 300 RTK” by 19vitali99, CC BY 4.0, via Sketchfab.",
    backToTop: "Back to top",
  },

  /**
   * V12 — page copy for the real routes. English stays factual B2B: no client,
   * no figure, no certification, no coverage claim, nothing the French copy
   * does not already support.
   */
  routes: {
    common: {
      home: "Home",
      services: "Services",
      detailCta: "View the service",
      quoteCta: "Request a quote",
      contactCta: "Contact us",
      phoneCta: "Call",
      breadcrumb: "Breadcrumb",
      coverageTitle: "What this service covers",
      stepsTitle: "How a mission runs",
      ctaTitle: "Tell us what you need",
      ctaBody:
        "Describe the area, the deliverable you expect and the timeline — we answer with a proposed approach. Quoted per mission, priced on study.",
      relatedTitle: "Other services",
      backHome: "Back to home",
    },

    services: {
      meta: {
        title: "Drone services — surveying, inspection, maintenance",
        description:
          "FEL DRONE drone services: surveying and photogrammetry, site inspection and progress monitoring, maintenance and diagnostics, thermography, agriculture, sales and rental. Quoted per mission.",
      },
      eyebrow: "Services",
      title: "Drone services",
      lede:
        "Seven service lines, three of them priority — surveying and photogrammetry, site inspection and progress monitoring, maintenance and diagnostics. Every job follows the same method: scoping, flight plan, controlled acquisition, processing and hand-over.",
      note: "Quoted per mission — pricing depends on the area, the scope and the deliverable.",
    },

    service: {
      topographie: {
        label: "Surveying & photogrammetry",
        meta: {
          title: "Drone surveying & photogrammetry — El Tarf",
          description:
            "Drone aerial surveys: georeferenced orthophotos, digital terrain models and survey drawings. Quoted per mission, deliverable agreed before the flight.",
        },
        eyebrow: "Aerial survey",
        lede:
          "Our priority service line: turning an area into usable data — orthophoto, digital model, drawing — with the deliverable agreed before anyone flies.",
      },
      inspection: {
        label: "Site inspection & progress monitoring",
        meta: {
          title: "Drone site inspection & progress monitoring — El Tarf",
          description:
            "Drone inspection and construction monitoring: dated visual documentation, progress tracking and repeated surveys of a site. Quoted per mission.",
        },
        eyebrow: "Site monitoring",
        lede:
          "Document a site and its progress without scaffolding or a cherry picker: scheduled flights, dated imagery and a comparison between two passes.",
      },
      thermographie: {
        label: "Thermography",
        meta: {
          title: "Drone thermography — thermal inspection | FEL DRONE",
          description:
            "Drone thermal inspection: showing temperature contrasts on buildings and installations as part of a diagnostic. Quoted per mission.",
        },
        eyebrow: "Thermal inspection",
        lede:
          "A thermal camera carried by drone to reveal temperature contrasts where access is difficult — interpretation remains diagnostic work, scoped case by case.",
      },
      agriculture: {
        label: "Agriculture",
        meta: {
          title: "Agriculture — drone aerial observation | FEL DRONE",
          description:
            "Drone aerial observation of farmland: vegetation imagery and visual monitoring of crop condition. Quoted per mission, depending on the plot.",
        },
        eyebrow: "Aerial observation",
        lede:
          "Fly a plot and bring back a usable picture of its condition — observation, visual monitoring and vegetation imagery, with no yield promise attached.",
      },
      maintenance: {
        label: "Maintenance & diagnostics",
        meta: {
          title: "Drone maintenance & diagnostics — FEL DRONE workshop",
          description:
            "Drone maintenance and diagnostics: servicing, inspection and technical intervention in the workshop, for private owners and professionals. Quoted per mission.",
        },
        eyebrow: "Workshop",
        lede:
          "The service line that keeps everything else flying: servicing, diagnostics and technical intervention on drones, checked with the same rigour as a pre-flight inspection.",
      },
      "vente-location": {
        label: "Sales & rental",
        meta: {
          title: "Drone sales & rental — FEL DRONE, El Tarf",
          description:
            "Drone and accessory sales, remote aircraft rental and related services in El Tarf. Quoted per mission, depending on what the project needs.",
        },
        eyebrow: "Sales & rental",
        lede:
          "Two commercial lines on one page: drones and accessories for sale, remote aircraft for rent. No catalogue and no published prices — requirements come first.",
      },
    },

    devis: {
      meta: {
        title: "Request a quote — drone service",
        description:
          "FEL DRONE quote request: describe the area, the deliverable and the timeline. Secure form, reply by phone or e-mail, priced on study.",
      },
      eyebrow: "Quote",
      title: "Request a quote",
      lede:
        "One form, one place. Give us the area, the service and what you need: the request is written to our register and we come back with a proposed approach.",
      processTitle: "What happens next",
      process: [
        { title: "Your request is recorded", body: "The form writes it to our register and returns a reference." },
        { title: "We scope the mission", body: "Area, expected deliverable, access and flight constraints." },
        { title: "We get back to you", body: "A reply by phone or e-mail, then a quote priced on study." },
      ],
      asideTitle: "Need a quick answer?",
      asideBody:
        "The phone is still the fastest way to scope a mission, especially when the area or the deadline needs an immediate answer.",
      asideNote:
        "If the site's mail service is unavailable, the confirmation screen offers e-mail and phone instead — the request is never left hanging.",
      backToServices: "Review the services",
    },

    contact: {
      meta: {
        title: "Contact — SARL FEL DRONE, Aïn El Assel (El Tarf)",
        description:
          "Contact FEL DRONE: phone, e-mail and WhatsApp. Registered office at Cité 150 Logements B, Aïn El Assel, El Tarf, Algeria. Online quote request.",
      },
      eyebrow: "Contact",
      title: "Contact us",
      lede:
        "A question, an area to fly, a drone that needs servicing: the details below are the company's own. For a priced mission, the quote form is faster.",
      channelsTitle: "Company details",
      quoteTitle: "Quote request",
      quoteBody:
        "The form records your request in our register and returns a reference. Nothing is committed at this stage: we study the mission before quoting.",
      formTitle: "Quote form",
    },

    about: {
      meta: {
        title: "About — SARL FEL DRONE, El Tarf",
        description:
          "SARL FEL DRONE: an Algerian company working with drones — surveying, site inspection, maintenance and diagnostics. Management and legal information.",
      },
      eyebrow: "About",
      title: "The FEL DRONE company",
      lede:
        "A limited liability company based in Aïn El Assel, El Tarf, built around three lines: drone services, a maintenance workshop and remote aircraft sales.",
      companyTitle: "What we do",
      companyBody:
        "FEL DRONE carries out drone surveys and inspections, services and diagnoses remote aircraft, and supplies drones and accessories for sale or rental. Every mission follows the same eight-step method: scoping, flight plan, checks, acquisition, processing, control, hand-over and review.",
      factsTitle: "Legal information",
      ctaTitle: "Work with us",
      ctaBody:
        "Describe your area or your requirement: we answer with a proposed approach, then a quote priced on study.",
    },

    notFound: {
      meta: {
        title: "Page not found",
        description: "This address does not match any page on the FEL DRONE site.",
      },
      code: "Error 404",
      title: "This page does not exist",
      body:
        "The address may have moved, or the link that brought you here is incomplete. The services, the quote form and the contact details are one click away.",
      homeCta: "Back to home",
      servicesCta: "View the services",
    },
  },

  media: {
    hero: "Remote pilot in operational gear controlling a professional drone in front of a wind farm",
    control: "Hands of a remote pilot holding the controller of a professional drone, with a video-feed smartphone on the mount",
    safety: "Professional drone and controller on the ground, prepared and checked before take-off",
    services: {
      topographie: "Aerial topographic view — photogrammetric survey, demonstration example",
      inspection: "Professional drone in flight near an urban construction site, structures and machinery in frame",
      maintenance: "Technician repairing a drone at the workbench, precision tools in the workshop",
      thermographie: "Drone-based thermal inspection — demonstration example",
      agriculture: "Agricultural drone in flight over a plot — NDVI imagery, demonstration example",
      vente: "Professional drone and its controller presented in raking light, equipment ready for delivery",
      location: "Professional drone in take-off configuration in a field at sunrise, ready for a mission",
      prestations: "Agricultural treatment drone in flight over a cultivated plot, reliefs in the background",
    },
  },
};
