/**
 * FEL DRONE — French dictionary (reference language).
 *
 * This is the source language: every string here is the V10 production copy,
 * moved out of the components and out of the old `content.ts` without a single
 * wording change. The other dictionaries (`content.en.ts`, `content.ar.ts`)
 * mirror this shape exactly.
 *
 * EDITORIAL RULES (V10, still in force):
 * - No invented prices, drone models, sensors, flight times, accuracy,
 *   payloads, certifications, partnerships, clients, testimonials, stats.
 * - Unknown specs = "À compléter"
 * - Registry identifiers come from `data/company.ts` — never duplicated here.
 * - Amine note exactly "Étudiant en informatique."
 * - Roles use uppercase ACTIONNAIRE per spec
 */
import { company } from "./company";
import { serviceImages, heroImage, controlImage, safetyImage, type Img } from "../lib/images";
import type { Dictionary } from "../i18n/types";

const services: Dictionary["services"]["list"] = [
  {
    slug: "topographie",
    index: "01",
    title: "Topographie & photogrammétrie",
    tag: "Relevés",
    intro:
      "Relevés aériens par drone pour orthophotos géoréférencées, modèles numériques et plans — sur devis, étude selon le besoin.",
    points: [
      "Orthophotos géoréférencées — exemple de démonstration",
      "Modèles numériques de terrain (MNT) — À compléter selon capteur",
      "Plans topographiques — tarification selon la mission",
    ],
    steps: [
      "Cadrage du site et définition des livrables",
      "Plan de vol et vérifications réglementaires",
      "Acquisition et contrôle qualité terrain",
      "Traitement et livraison — sur devis",
    ],
    cta: { label: "Demander un devis", verb: "devis" },
    image: serviceImages.topographie,
    apiValue: "Topographie & photogrammétrie",
    priority: "primary",
  },
  {
    slug: "suivi-chantier",
    index: "02",
    title: "Suivi & inspection de chantier",
    tag: "BTP & suivi",
    intro:
      "Suivi d'avancement et inspection visuelle régulière du chantier — documentation horodatée, observations techniques, sans garantie de résultat.",
    points: [
      "Suivi photographique périodique",
      "Documentation des zones sensibles",
      "Observations sécurité et technique — rapport sur devis",
    ],
    steps: [
      "Définition du périmètre et des points d'attention",
      "Plan de vol et autorisations d'accès",
      "Acquisition photo et vidéo",
      "Rapport d'avancement — tarification selon la mission",
    ],
    cta: { label: "Demander une prestation", verb: "prestation" },
    image: serviceImages.inspection,
    apiValue: "Suivi & inspection de chantier",
    priority: "primary",
  },
  {
    slug: "maintenance",
    index: "03",
    title: "Maintenance & diagnostic drone",
    tag: "Atelier",
    intro:
      "Diagnostic, réparation et étalonnage des drones et capteurs — traçabilité à chaque étape, étude selon le besoin.",
    points: [
      "Diagnostic technique approfondi — À compléter selon modèle",
      "Réparation et remise en service — sur devis",
      "Étalonnage et calibration — tarification selon la mission",
    ],
    steps: [
      "Diagnostic et devis — sur devis",
      "Contrôle technique",
      "Intervention en atelier",
      "Vérification finale et restitution",
    ],
    cta: { label: "Demander un devis", verb: "devis" },
    image: serviceImages.maintenance,
    apiValue: "Maintenance & diagnostic drone",
    priority: "primary",
  },
  {
    slug: "thermographie",
    index: "04",
    title: "Thermographie",
    tag: "Inspection",
    intro:
      "Inspection thermographique par drone pour relevés thermiques — sur devis, selon le besoin et l'accessibilité du site.",
    points: [
      "Relevés thermiques aériens — exemple de démonstration",
      "Détection d'anomalies thermiques — interprétation à compléter",
      "Rapport visuel — tarification selon la mission",
    ],
    steps: [
      "Cadrage de la zone et des objectifs",
      "Plan de vol et conditions d'acquisition",
      "Acquisition thermique",
      "Livraison des visuels et observations — sur devis",
    ],
    cta: { label: "Demander une prestation", verb: "prestation" },
    image: serviceImages.thermographie,
    apiValue: "Thermographie",
    priority: "secondary",
  },
  {
    slug: "agriculture",
    index: "05",
    title: "Agriculture",
    tag: "Précision",
    intro:
      "Imagerie agricole par drone (NDVI, suivi de parcelles) — prestations sur étude, sans promesse de rendement.",
    points: [
      "Imagerie NDVI — exemple de démonstration",
      "Suivi de parcelles — À compléter",
      "Cartes de vigueur — tarification selon la mission",
    ],
    steps: [
      "Définition de la parcelle et de l'objectif",
      "Plan de vol et fenêtre d'acquisition",
      "Acquisition",
      "Livraison des cartes — sur devis",
    ],
    cta: { label: "Demander une prestation", verb: "prestation" },
    image: serviceImages.agriculture,
    apiValue: "Agriculture",
    priority: "secondary",
  },
  {
    slug: "vente",
    index: "06",
    title: "Vente",
    tag: "Commerce",
    intro:
      "Drones professionnels et accessoires — sélection selon l'usage, testés avant remise, sur devis.",
    points: [
      "Aéronefs professionnels — À compléter selon disponibilité",
      "Capteurs et accessoires — sur devis",
      "Pièces de rechange — tarification selon la mission",
    ],
    steps: [
      "Expression du besoin et du cas d'usage",
      "Sélection du matériel et configuration — À compléter",
      "Tests et vérifications avant remise",
      "Livraison et prise en main",
    ],
    cta: { label: "Demander un devis", verb: "devis" },
    image: serviceImages.vente,
    apiValue: "Vente",
    priority: "secondary",
  },
  {
    slug: "location",
    index: "07",
    title: "Location",
    tag: "Flotte",
    intro:
      "Mise à disposition ponctuelle d'aéronefs entretenus, sous supervision opérationnelle stricte — sur devis.",
    points: [
      "Flotte entretenue et calibrée — À compléter",
      "Supervision opérationnelle",
      "Missions ponctuelles — tarification selon la mission",
    ],
    steps: [
      "Définition de la mission et de la durée",
      "Disponibilité et devis — sur devis",
      "Préparation du matériel et briefing",
      "Restitution et contrôle",
    ],
    cta: { label: "Louer un drone", verb: "location" },
    image: serviceImages.location,
    apiValue: "Location",
    priority: "secondary",
  },
];

const img = (i: Img) => i.alt;

export const fr: Dictionary = {
  locale: { tag: "fr", htmlLang: "fr", dir: "ltr", name: "Français", short: "FR" },

  seo: {
    title:
      "FEL DRONE — Topographie & photogrammétrie, suivi de chantier, maintenance drone | El Tarf, Algérie",
    description:
      "SARL FEL DRONE à El Tarf : topographie & photogrammétrie par drone, suivi & inspection de chantier, maintenance & diagnostic, thermographie, agriculture, vente et location. Devis sur étude, tarification selon la mission.",
  },

  nav: {
    aria: "Navigation principale",
    mobileAria: "Navigation mobile",
    // V12 — real routes for the journeys that deserve a URL; the home-page
    // sections keep their anchors, addressed as `/#section` so they work from
    // every route (the router scrolls the target into view after the paint).
    links: [
      { href: "/#expertise", label: "Expertise" },
      { href: "/services", label: "Services" },
      { href: "/#methode", label: "Méthode" },
      { href: "/#demonstration", label: "Démonstration" },
      { href: "/#equipement", label: "Équipement" },
      { href: "/#securite", label: "Sécurité" },
      { href: "/a-propos", label: "À propos" },
      { href: "/#faq", label: "FAQ" },
      { href: "/contact", label: "Contact" },
    ],
    cta: "Demander un devis",
    skip: "Aller au contenu principal",
    logoHome: "FEL DRONE — retour en haut de page",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
    language: "Langue",
    languageAria: "Choisir la langue du site",
    servicesMenu: "Prestations par drone",
  },

  hero: {
    aria: "Présentation de FEL DRONE",
    eyebrow:
      "Topographie & photogrammétrie, suivi & inspection de chantier, maintenance & diagnostic drone — huit étapes, zéro improvisation.",
    titleTop: "Des relevés aériens",
    titleBottom: "exploités comme des aéronefs.",
    body: (c) =>
      `${c.legalName} à El Tarf : topographie & photogrammétrie par drone, suivi de chantier, maintenance & diagnostic, thermographie, agriculture, vente et location. Méthode en huit étapes — sur devis, tarification selon la mission.`,
    ctaPrimary: "Demander un devis",
    ctaSecondary: "Découvrir nos services",
    phoneLabel: "ligne directe",
    whatsapp: "WhatsApp",
    whatsappMessage: "Bonjour FEL DRONE — demande d'informations",
    verifiedNote: "Numéro vérifié existant — pas de bulle intrusive. Sur devis.",
    figcaption: "Méthode en huit étapes, zéro improvisation — contrôle pré-vol au sol.",
  },

  expertise: {
    eyebrow: "L'expertise",
    title: "Deux disciplines réunies : la sécurité aérienne et l'ingénierie moderne.",
    lede: "FEL DRONE réunit une discipline opérationnelle héritée des standards de l'aviation et une maîtrise fine des systèmes embarqués. Cette double culture structure notre manière de vendre, d'exploiter et de maintenir chaque drone : rien n'est laissé à l'approximation.",
    principles: [
      {
        n: "01",
        title: "Discipline aéronautique",
        text: "Chaque mission est planifiée, briefée et supervisée selon les standards d'exigence de l'aviation — la nôtre et celle de nos clients.",
      },
      {
        n: "02",
        title: "Ingénierie embarquée",
        text: "Automatisation, systèmes embarqués et outils numériques développés en interne pour fiabiliser chaque opération de bout en bout.",
      },
      {
        n: "03",
        title: "Précision de terrain",
        text: "Du diagnostic à la restitution des données, une exécution rigoureuse, quel que soit le secteur d'application.",
      },
    ],
    figcaption:
      "La station de contrôle avant chaque mission : check-list, briefing, collégialité, refus de l'improvisation.",
  },

  services: {
    eyebrow: "Nos services",
    title: "Sept pôles, trois priorités — le reste sur devis.",
    lede: "Topographie & photogrammétrie, suivi & inspection de chantier, maintenance & diagnostic drone en priorité. Thermographie, agriculture, vente, location en appui — chaque mission cadrée par devis, tarification selon la mission, étude selon le besoin.",
    note: 'Aucun prix affiché, aucun modèle, capteur, autonomie, précision ou certification inventé. Les mentions "À compléter" signalent les informations non vérifiées. Sur devis, tarification selon la mission, étude selon le besoin.',
    priorityBadge: "Priorité",
    stepsToggle: "Comment ça fonctionne ?",
    coverageLabel: (service) => `Ce que couvre ${service}`,
    list: services,
  },

  method: {
    eyebrow: "Notre méthode",
    title: "Huit étapes, zéro improvisation",
    lede: "De l'expression du besoin à la livraison — chaque mission suit le même cadre, cadré par devis, sans zone grise. Sur devis, tarification selon la mission, étude selon le besoin.",
    note: "Aucune promesse de résultat, aucune statistique inventée. La méthode décrit le déroulement, pas une garantie.",
    aria: "Méthodologie en huit étapes",
    steps: [
      {
        n: "01",
        title: "Expression du besoin",
        desc: "Nom, société, wilaya du besoin, service demandé, précisions utiles — le contexte d'abord.",
      },
      {
        n: "02",
        title: "Étude & faisabilité",
        desc: "Vérification de la faisabilité technique et réglementaire, sans promesse.",
      },
      {
        n: "03",
        title: "Devis — sur devis",
        desc: "Tarification selon la mission, livrables et contraintes d'accès.",
      },
      {
        n: "04",
        title: "Planification",
        desc: "Plan de vol, autorisations, météo, briefing — huit étapes, zéro improvisation.",
      },
      {
        n: "05",
        title: "Préparation terrain",
        desc: "Check-list matériel, calibration, sécurité — contrôle pré-vol au sol.",
      },
      {
        n: "06",
        title: "Acquisition",
        desc: "Vol opéré, supervision stricte, traçabilité des prises.",
      },
      {
        n: "07",
        title: "Traitement & contrôle",
        desc: "Traitement des données, vérifications qualité — À compléter selon capteur.",
      },
      {
        n: "08",
        title: "Livraison & archivage",
        desc: "Livraison des livrables convenus, archivage — exemple de démonstration non issu d'une mission client.",
      },
    ],
  },

  demonstration: {
    eyebrow: "Démonstration",
    title: "À quoi ressemble un livrable ?",
    lede: "Quatre exemples de démonstration — non issus d'une mission client. Chaque visuel est un placeholder documenté, pas un projet client.",
    badge: "Démo",
    disclaimer:
      "Exemple de démonstration — non issu d'une mission client. À compléter selon capteur et mission. Sur devis.",
    mediaPending: "Média à fournir",
    projectsTitle: "Projets",
    projectsBadge: "Transparence",
    projectsText:
      "Premières réalisations à venir. Nous ne présentons aucun nom de client, aucun projet, aucun résultat, aucun témoignage ou statistique sans base vérifiable. Cette section sera alimentée uniquement avec des missions réelles et autorisées.",
    projectsNote: "À compléter — aucun projet fictif présenté comme réel.",
    items: [
      {
        slug: "orthophoto",
        title: "Orthophoto",
        desc: "Exemple de démonstration — non issu d'une mission client. Orthomosaïque géoréférencée — À compléter.",
      },
      {
        slug: "mnt",
        title: "MNT",
        desc: "Exemple de démonstration — non issu d'une mission client. Modèle numérique de terrain — À compléter.",
      },
      {
        slug: "ndvi",
        title: "NDVI",
        desc: "Exemple de démonstration — non issu d'une mission client. Carte de vigueur végétale — À compléter.",
      },
      {
        slug: "rapport",
        title: "Rapport",
        desc: "Exemple de démonstration — non issu d'une mission client. Rapport d'observation — tarification selon la mission.",
      },
    ],
  },

  equipment: {
    eyebrow: "Équipement",
    title: "Capacités vérifiées, pas de catalogue inventé",
    lede: "Seules les capacités vérifiées sont listées. Le reste est marqué À compléter — nous ne spéculons pas sur modèles, capteurs, autonomie ou précision.",
    note: "Aucun modèle de drone, aucun capteur, aucune autonomie, aucune précision ou certification n'est inventé. Sur devis, étude selon le besoin.",
    mediaPending: "Média à fournir",
    mediaNote:
      "Photos d'atelier, fiches techniques vérifiées, certificats — À compléter. Aucune image de drone jouet, aucun rendu 3D, aucune aviation habitée.",
    groups: [
      {
        category: "Aéronefs",
        items: [
          { label: "Multirotores professionnels", value: "À compléter — modèles selon disponibilité" },
          { label: "Autonomie", value: "À compléter" },
          { label: "Charge utile", value: "À compléter" },
        ],
      },
      {
        category: "Capteurs",
        items: [
          { label: "RGB / Photogrammétrie", value: "À compléter — capteur selon mission" },
          { label: "Thermique", value: "À compléter" },
          { label: "Multispectral / NDVI", value: "À compléter" },
        ],
      },
      {
        category: "Traitement",
        items: [
          { label: "Orthophoto", value: "Sur devis — exemple de démonstration" },
          { label: "MNT / Modélisation", value: "À compléter" },
          { label: "Livrables", value: "Tarification selon la mission" },
        ],
      },
    ],
  },

  safety: {
    eyebrow: "Sécurité & normes d'exploitation",
    title: "La sécurité aérienne n'est pas une option. C'est le socle.",
    lede: "Notre direction des opérations applique à chaque mission une rigueur égale à celle des opérations aériennes : planification, vérification, supervision. Aucun vol n'est improvisé.",
    standards: [
      {
        n: "S.1",
        label: "Compétence certifiée",
        detail: "Chaque mission est opérée par un télépilote titulaire d'une certification professionnelle.",
      },
      {
        n: "S.2",
        label: "Plan de vol systématique",
        detail: "Aucun vol n'est engagé sans plan formalisé et validation préalable des conditions d'opération.",
      },
      {
        n: "S.3",
        label: "Supervision aéronautique",
        detail: "La flotte est exploitée sous supervision aéronautique : protocoles, check-lists et traçabilité à chaque sortie.",
      },
    ],
    figcaption:
      "Contrôle pré-vol au sol : le geste le plus important est celui qui précède le décollage.",
  },

  leadership: {
    eyebrow: "Direction",
    title: "Leadership & expertise",
    lede: "Une gouvernance resserrée, appuyée sur une expertise aéronautique et technique directement engagée dans les opérations.",
    footnote: "Les rôles ci-dessus reflètent les fonctions exercées au sein de la société.",
    members: [
      {
        name: "Yassine Fellah",
        initials: "YF",
        role: "ACTIONNAIRE — DIRECTEUR & GÉRANT",
        note: "Responsable légal et administratif de la société.",
      },
      {
        name: "Menouar Fellah",
        initials: "MF",
        role: "ACTIONNAIRE — CONSEILLER AVIATION & OPÉRATIONS",
        note: "Cadre de l'aviation (à la retraite) — référent de la supervision des vols et de la culture sécurité.",
      },
      {
        name: "Amine Fellah",
        initials: "AF",
        role: "ACTIONNAIRE — RESPONSABLE TECHNIQUE & SYSTÈMES",
        note: "Étudiant en informatique.",
      },
    ],
  },

  faq: {
    eyebrow: "Questions fréquentes",
    title: "Les réponses, sans langue de bois.",
    lede: "Location, maintenance, inspections, devis — l'essentiel, dit simplement. Pour le reste, un appel répond mieux qu'un formulaire.",
    askCta: "Poser une question précise",
    items: [
      {
        q: "Proposez-vous des relevés topographiques par drone ?",
        a: "Oui — topographie & photogrammétrie : orthophotos géoréférencées, MNT, plans selon le besoin. Chaque demande fait l'objet d'une étude et d'un devis ; la tarification dépend de la surface, de l'accessibilité et des livrables attendus.",
      },
      {
        q: "Comment se déroule un suivi de chantier ?",
        a: "Définition du périmètre et des points d'attention, plan de vol et autorisations d'accès, acquisition photo/vidéo, puis rapport d'avancement horodaté. Sur devis, tarification selon la mission.",
      },
      {
        q: "Le service de location est-il destiné aux particuliers ou aux entreprises ?",
        a: "La flotte est mise à disposition pour des missions ponctuelles, sous supervision opérationnelle stricte — un cadre pensé pour des usages professionnels. Décrivez votre projet : nous évaluons la faisabilité et les conditions adaptées. Sur devis.",
      },
      {
        q: "Combien de temps prend une opération de maintenance ?",
        a: "La durée dépend de la nature de l'intervention. Le diagnostic préalable permet de communiquer un délai avant toute intervention. Sur devis.",
      },
      {
        q: "Intervenez-vous dans toute l'Algérie ?",
        a: "Implantés à El Tarf, commune de Aïn El Assel. Pour les projets hors zone immédiate, indiquez la wilaya du besoin : nous étudions la logistique et répondons sur la faisabilité. Tarification selon la mission.",
      },
      {
        q: "Comment demander un devis ?",
        a: "Formulaire en bas de page (nom, téléphone, société, wilaya du besoin, service demandé, précisions utiles) ou appel direct. Plus le contexte est précis, plus le chiffrage est juste. Sur devis.",
      },
    ],
  },

  sectors: [
    { label: "Topographie", value: "Orthophoto, MNT, photogrammétrie — sur devis" },
    { label: "BTP & suivi", value: "Suivi de chantier, inspection — tarification selon la mission" },
    { label: "Maintenance", value: "Diagnostic & étalonnage — étude selon le besoin" },
    { label: "Agriculture", value: "NDVI & suivi de parcelles — exemple de démonstration" },
  ],

  place: {
    addressLine1: company.addressLine1,
    addressLine2: company.addressLine2,
    country: "Algérie",
    city: company.city,
    placeName: "Aïn El Assel",
    seatLine: `${company.addressLine1}, ${company.addressLine2}, Algérie`,
  },

  contact: {
    eyebrow: "Contact & devis",
    title: "Parlons de votre projet.",
    lede: "Devis sur étude, tarification selon la mission. Formulaire avec nom, téléphone, société, wilaya du besoin, service demandé, précisions utiles — la demande part dans le système FEL DRONE.",
    plusCode: (code) => `Plus Code ${code} — Aïn El Assel`,
    phoneNote: "ligne directe — horaires ouvrés — À compléter",
    whatsappNote: "Message pré-rempli selon le service et la wilaya",
    whatsappMessage: (service, wilaya) =>
      `Bonjour FEL DRONE — ${service ? `demande ${service}` : "demande d'informations"} — ${wilaya ? `wilaya ${wilaya}` : ""}`,
    mapTitle: `Localisation FEL DRONE — Q9JM+542, Aïn El Assel, Wilaya d'El Tarf, Algérie`,
    form: {
      name: "Nom",
      namePlaceholder: "Prénom et nom",
      phone: "Téléphone",
      phonePlaceholder: "+213 …",
      phoneHint: "Indicatif +213.",
      company: "Société",
      companyPlaceholder: "Société (facultatif)",
      wilaya: "Wilaya du besoin",
      wilayaPlaceholder: "Ex. El Tarf, Annaba…",
      email: "Email (facultatif)",
      emailPlaceholder: "vous@exemple.dz",
      service: "Service demandé",
      servicePlaceholder: "Choisir un service…",
      message: "Précisions utiles",
      messagePlaceholder:
        "Lieu précis, période souhaitée, surface, livrables attendus — ce qui permet de chiffrer juste. Sur devis.",
      honeypot: "Ne pas remplir",
      required: "Champs",
      submit: "Envoyer ma demande",
      submitting: "Envoi en cours…",
      footnote:
        "requis. Demande enregistrée dans le système FEL DRONE, transmise à l'équipe — utilisée uniquement pour vous répondre. Aucune allégation d'email envoyé sans confirmation serveur.",
      options: [
        { value: "Topographie & photogrammétrie", label: "Topographie & photogrammétrie" },
        { value: "Suivi & inspection de chantier", label: "Suivi & inspection de chantier" },
        { value: "Maintenance & diagnostic drone", label: "Maintenance & diagnostic drone" },
        { value: "Thermographie", label: "Thermographie" },
        { value: "Agriculture", label: "Agriculture" },
        { value: "Vente", label: "Vente" },
        { value: "Location", label: "Location" },
        { value: "Autre", label: "Autre" },
      ],
      errors: {
        nameRequired: "Merci d'indiquer votre nom.",
        nameLength: "Entre 2 et 80 caractères.",
        phoneRequired: "Un numéro nous permet de vous rappeler.",
        phoneInvalid: "Numéro invalide — ex. +213 6 61 61 33 99.",
        emailInvalid: "Format d'email invalide.",
        companyLength: "120 caractères maximum.",
        wilayaRequired: "Indiquez la wilaya du besoin.",
        wilayaLength: "Entre 2 et 80 caractères.",
        serviceRequired: "Sélectionnez un service.",
        messageRequired: "Précisez votre besoin — quelques détails utiles.",
        messageShort: "Quelques mots de plus (15 caractères minimum).",
        messageLong: "3 000 caractères maximum.",
        rateLimited: "Trop d'envois récents — réessayez dans une minute.",
      },
      mailto: {
        subject: (service, name) => `Demande ${service || "d'informations"} — ${name || "(site FEL DRONE)"}`,
        fallbackService: "d'informations",
        fallbackName: "(site FEL DRONE)",
        name: "Nom",
        phone: "Téléphone",
        company: "Société",
        wilaya: "Wilaya du besoin",
        email: "Email",
        service: "Service demandé",
        message: "Précisions utiles",
      },
      success: {
        title: "Demande enregistrée",
        reference: "réf.",
        body: "Votre demande est consignée et transmise à l'équipe. Aucun email n'est prétendu envoyé tant que la livraison n'est pas confirmée côté serveur. Besoin urgent ? Appelez le",
        again: "Envoyer une autre demande",
      },
      errorSend: "L'envoi a échoué — serveur non confirmé. Réessayez ou appelez",
      offlineTitle: "Formulaire momentanément indisponible — rien n'a été envoyé.",
      offlineBody: (phone) => `Votre message est prêt : envoyez-le par email pré-rempli ou appelez le ${phone}.`,
      offlineEmail: "Envoyer par email",
      retry: "Réessayer",
    },
  },

  legal: {
    heading: "Mentions légales",
    denomination: "Dénomination",
    legalForm: "Forme juridique",
    legalFormValue: "Société à Responsabilité Limitée (SARL)",
    rc: "Registre de commerce",
    rcPrefix: "N°",
    seat: "Siège social",
    gerant: "Gérant",
    contact: "Contact",
    activities: "Activités déclarées",
    activitiesJoin: "et",
    activitiesList: [
      "Commerce de gros et de détail en drones et accessoires",
      "Location d'aéronefs télépilotés",
      "Maintenance, diagnostic et calibration",
      "Prestations de services par drone — topographie & photogrammétrie, suivi & inspection de chantier, thermographie, agriculture",
    ],
  },

  footer: {
    tagline:
      "Vente, location, maintenance et prestations de services par drone. Rigueur aéronautique, précision technologique.",
    sitemap: "Plan du site",
    legalLink: "Mentions légales",
    contactTitle: "Coordonnées",
    rights: "Tous droits réservés.",
    credit3d: "Modèle 3D : « Quadcopter DJI Matrice 300 RTK » par 19vitali99, CC BY 4.0, via Sketchfab.",
    backToTop: "Haut de page",
  },

  /**
   * V12 — page copy for the real routes. Wording stays inside what V11 already
   * established: no client, no figure, no certification, no coverage claim.
   * Unknown specifics keep the V10 convention ("À compléter", "sur devis",
   * "selon la mission").
   */
  routes: {
    common: {
      home: "Accueil",
      services: "Services",
      detailCta: "Voir la prestation",
      quoteCta: "Demander un devis",
      contactCta: "Nous contacter",
      phoneCta: "Appeler",
      breadcrumb: "Fil d'Ariane",
      coverageTitle: "Ce que couvre cette prestation",
      stepsTitle: "Déroulé d'une mission",
      ctaTitle: "Parlons de votre besoin",
      ctaBody:
        "Décrivez la zone, le livrable attendu et l'échéance : nous répondons avec une proposition d'intervention. Devis sur étude, tarification selon la mission.",
      relatedTitle: "Autres prestations",
      backHome: "Retour à l'accueil",
    },

    services: {
      meta: {
        title: "Services par drone — topographie, inspection, maintenance",
        description:
          "Prestations par drone de FEL DRONE : topographie & photogrammétrie, suivi & inspection de chantier, maintenance & diagnostic, thermographie, agriculture, vente et location. Devis sur étude.",
      },
      eyebrow: "Prestations",
      title: "Nos prestations par drone",
      lede:
        "Sept pôles, dont trois prioritaires — topographie & photogrammétrie, suivi & inspection de chantier, maintenance & diagnostic. Chaque prestation suit la même méthode : cadrage, plan de vol, acquisition contrôlée, traitement et livraison.",
      note: "Devis sur étude — tarification selon la mission, la surface et le livrable attendu.",
    },

    service: {
      topographie: {
        label: "Topographie & photogrammétrie",
        meta: {
          title: "Topographie & photogrammétrie par drone — El Tarf",
          description:
            "Relevés aériens par drone : orthophotos géoréférencées, modèles numériques de terrain et plans topographiques. Devis sur étude selon le livrable attendu.",
        },
        eyebrow: "Relevés aériens",
        lede:
          "Le pôle prioritaire de FEL DRONE : transformer une zone en données exploitables — orthophoto, modèle numérique, plan — avec un cadrage clair des livrables avant le vol.",
      },
      inspection: {
        label: "Suivi & inspection de chantier",
        meta: {
          title: "Suivi & inspection de chantier par drone — El Tarf",
          description:
            "Inspection et suivi de chantier par drone : documentation visuelle, suivi de l'avancement et relevés périodiques d'une zone d'intervention. Devis sur étude.",
        },
        eyebrow: "Suivi de chantier",
        lede:
          "Documenter un chantier et son avancement, sans échafaudage ni nacelle : survols programmés, images datées et comparaison entre deux passages.",
      },
      thermographie: {
        label: "Thermographie",
        meta: {
          title: "Thermographie par drone — inspection thermique | FEL DRONE",
          description:
            "Inspection thermique par drone : mise en évidence de contrastes de température sur bâtiments et installations, dans le cadre d'un diagnostic. Devis sur étude.",
        },
        eyebrow: "Inspection thermique",
        lede:
          "Une caméra thermique portée par drone pour révéler des contrastes de température là où l'accès est difficile — l'interprétation reste un travail de diagnostic, encadré au cas par cas.",
      },
      agriculture: {
        label: "Agriculture",
        meta: {
          title: "Agriculture — observation aérienne par drone | FEL DRONE",
          description:
            "Observation aérienne de parcelles par drone : imagerie de la végétation et suivi de l'état des cultures. Devis sur étude selon la parcelle et le besoin.",
        },
        eyebrow: "Observation aérienne",
        lede:
          "Survoler une parcelle et rapporter une image exploitable de son état — observation, suivi visuel et imagerie de la végétation, sans promesse de rendement.",
      },
      maintenance: {
        label: "Maintenance & diagnostic",
        meta: {
          title: "Maintenance & diagnostic drone — atelier FEL DRONE",
          description:
            "Maintenance et diagnostic de drones : entretien, contrôle et intervention technique en atelier, pour particuliers et professionnels. Devis sur étude.",
        },
        eyebrow: "Atelier",
        lede:
          "Le pôle qui fait tenir l'activité : entretien, diagnostic et intervention technique sur drone, avec la même rigueur de vérification que sur un vol.",
      },
      "vente-location": {
        label: "Vente & location",
        meta: {
          title: "Vente & location de drones — FEL DRONE El Tarf",
          description:
            "Vente de drones et d'accessoires, location d'aéronefs télépilotés et prestations associées à El Tarf. Devis sur étude, selon le besoin.",
        },
        eyebrow: "Vente & location",
        lede:
          "Deux pôles commerciaux regroupés sur une même page : vente de drones et d'accessoires, location d'aéronefs télépilotés. Pas de catalogue, pas de prix affiché — le besoin se discute.",
      },
    },

    devis: {
      meta: {
        title: "Demander un devis — prestation par drone",
        description:
          "Demande de devis FEL DRONE : décrivez la zone, le livrable et l'échéance. Formulaire sécurisé, réponse par téléphone ou e-mail, devis sur étude.",
      },
      eyebrow: "Devis",
      title: "Demander un devis",
      lede:
        "Un formulaire, un seul. Renseignez la zone, la prestation et votre besoin : la demande part vers notre registre, nous revenons vers vous avec une proposition d'intervention.",
      processTitle: "Ce qui se passe ensuite",
      process: [
        { title: "Votre demande est enregistrée", body: "Le formulaire écrit la demande dans notre registre et vous renvoie une référence." },
        { title: "Nous étudions la mission", body: "Cadrage de la zone, livrable attendu, contraintes d'accès et de vol." },
        { title: "Nous revenons vers vous", body: "Réponse par téléphone ou e-mail, puis devis sur étude — tarification selon la mission." },
      ],
      asideTitle: "Besoin d'une réponse rapide ?",
      asideBody:
        "Le téléphone reste le moyen le plus direct de cadrer une mission, surtout quand la zone ou l'échéance demandent une précision immédiate.",
      asideNote:
        "Si la messagerie du site n'est pas disponible, l'écran de confirmation vous propose l'e-mail et le téléphone : la demande n'est jamais perdue de vue.",
      backToServices: "Revoir les prestations",
    },

    contact: {
      meta: {
        title: "Contact — SARL FEL DRONE, Aïn El Assel (El Tarf)",
        description:
          "Contacter FEL DRONE : téléphone, e-mail et WhatsApp. Siège à Cité 150 Logements B, Aïn El Assel, El Tarf, Algérie. Demande de devis en ligne.",
      },
      eyebrow: "Contact",
      title: "Nous contacter",
      lede:
        "Une question, une zone à survoler, un drone à remettre en état : les coordonnées ci-dessous sont celles de la société. Pour une mission chiffrée, le formulaire de devis va plus vite.",
      channelsTitle: "Coordonnées",
      quoteTitle: "Demande de devis",
      quoteBody:
        "Le formulaire enregistre la demande dans notre registre et vous renvoie une référence. Aucun engagement à ce stade : nous étudions la mission avant de chiffrer.",
      formTitle: "Formulaire de devis",
    },

    about: {
      meta: {
        title: "À propos — SARL FEL DRONE, El Tarf",
        description:
          "SARL FEL DRONE : société algérienne spécialisée dans les prestations par drone — topographie, inspection de chantier, maintenance et diagnostic. Direction et informations légales.",
      },
      eyebrow: "À propos",
      title: "La société FEL DRONE",
      lede:
        "Une société à responsabilité limitée basée à Aïn El Assel, dans la wilaya d'El Tarf, organisée autour de trois pôles : prestations par drone, atelier et commerce d'aéronefs télépilotés.",
      companyTitle: "Ce que nous faisons",
      companyBody:
        "FEL DRONE conduit des relevés et des inspections par drone, entretient et diagnostique des aéronefs télépilotés, et fournit drones et accessoires à la vente comme à la location. Chaque mission suit la même méthode en huit étapes : cadrage, plan de vol, vérifications, acquisition, traitement, contrôle, livraison, retour d'expérience.",
      factsTitle: "Informations légales",
      ctaTitle: "Travailler avec nous",
      ctaBody:
        "Décrivez votre zone ou votre besoin : nous répondons avec une proposition d'intervention, puis un devis sur étude.",
    },

    notFound: {
      meta: {
        title: "Page introuvable",
        description: "Cette adresse ne correspond à aucune page du site FEL DRONE.",
      },
      code: "Erreur 404",
      title: "Cette page n'existe pas",
      body:
        "L'adresse demandée a peut-être été déplacée, ou le lien qui vous a conduit ici est incomplet. Les prestations, le devis et le contact restent à un clic.",
      homeCta: "Revenir à l'accueil",
      servicesCta: "Voir les prestations",
    },
  },

  media: {
    hero: img(heroImage),
    control: img(controlImage),
    safety: img(safetyImage),
    services: {
      topographie: img(serviceImages.topographie),
      inspection: img(serviceImages.inspection),
      maintenance: img(serviceImages.maintenance),
      thermographie: img(serviceImages.thermographie),
      agriculture: img(serviceImages.agriculture),
      vente: img(serviceImages.vente),
      location: img(serviceImages.location),
      prestations: img(serviceImages.prestations),
    },
  },
};
