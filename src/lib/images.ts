/**
 * Photography system — FEL DRONE.
 *
 * One coherent direction, and one hard rule: only real, professional
 * DRONE / UAV photography — operators, aircraft, controllers, workshops,
 * field missions. Manned aviation (cockpits, airliners, light aircraft,
 * airfields) is excluded by policy: the site must never read as an
 * airline or a military unit. No renders, no toy drones, no sci-fi, no
 * staged stock "cheese". Every asset is licensed stock photography hosted
 * on the Pexels CDN under the Pexels License (free for commercial use, no
 * attribution required — see docs/IMAGES.md for the full inventory).
 *
 * Crops and compression are pinned through CDN parameters, so each image
 * renders at exactly the aspect ratio of its layout container — zero
 * cumulative layout shift — while `srcSet` lets the browser download only
 * the size it needs.
 *
 * NOTE — portability: if the company later hosts optimized files locally
 * (e.g. /images/hero-drone.webp), only the `src`/`srcSet` produced by
 * `photo()` below needs to change; components never hard-code a URL.
 */

export type Img = {
  alt: string;
  src: string;
  srcSet: string;
  sizes: string;
  width: number;
  height: number;
};

/** Build a Pexels CDN URL: cropped to w×h, auto-compressed, sRGB. */
function pexels(id: number, w: number, h: number): string {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}&h=${h}&fit=crop`;
}

type PhotoConfig = {
  id: number;
  alt: string;
  /** Natural layout ratio, e.g. [4, 5] for a portrait column. */
  ratio: [number, number];
  /** Match the component's CSS layout to guide `sizes`. */
  sizes: string;
};

/**
 * Master file is 1600 px wide (covers a 5-column desktop image at 2× DPI);
 * a 800 px variant serves phones and narrow tablets.
 */
function photo({ id, alt, ratio, sizes }: PhotoConfig): Img {
  const [rw, rh] = ratio;
  const width = 1600;
  const height = Math.round((width * rh) / rw);
  const mWidth = 800;
  const mHeight = Math.round((mWidth * rh) / rw);
  return {
    alt,
    src: pexels(id, width, height),
    srcSet: `${pexels(id, mWidth, mHeight)} 800w, ${pexels(id, width, height)} 1600w`,
    sizes,
    width,
    height,
  };
}

/* ------------------------------------------------------------------ */
/* Section imagery                                                      */
/* ------------------------------------------------------------------ */

export const heroImage: Img = photo({
  id: 28467369,
  alt: "Télépilote en tenue opérationnelle contrôlant un drone professionnel face à un parc éolien",
  ratio: [4, 5],
  sizes: "(max-width: 1023px) 100vw, 44vw",
});

/**
 * Full-bleed photographic banner (the same master shot as the hero subject,
 * cropped 21:9 for the edge-to-edge strip). Referenced by the Demonstration
 * section's overlaid-headline banner.
 */
export const bannerImage: Img = photo({
  id: 28467369,
  alt: "Télépilote en tenue opérationnelle contrôlant un drone professionnel face à un parc éolien",
  ratio: [21, 9],
  sizes: "100vw",
});

export const controlImage: Img = photo({
  id: 8981852,
  alt: "Mains d'un télépilote tenant la radiocommande d'un drone professionnel, smartphone de retour vidéo fixé sur le support",
  ratio: [4, 5],
  sizes: "(max-width: 1023px) 92vw, 38vw",
});

export const safetyImage: Img = photo({
  id: 34585109,
  alt: "Drone professionnel et radiocommande posés au sol, préparés et contrôlés avant le décollage",
  ratio: [4, 5],
  sizes: "(max-width: 1023px) 92vw, 32vw",
});

/* ------------------------------------------------------------------ */
/* Service cards — consistent framing: hands-on, documentary, warm    */
/* natural light, no renders. Each subject verified on its Pexels     */
/* page as real UAV / drone-operations photography.                   */
/* ------------------------------------------------------------------ */

export const serviceImages: Record<string, Img> = {
  topographie: photo({
    id: 1087180,
    alt: "Vue aérienne topographique — relevé photogrammétrique, exemple de démonstration",
    ratio: [16, 10],
    sizes: "(max-width: 767px) 92vw, (max-width: 1279px) 45vw, 29vw",
  }),
  inspection: photo({
    id: 6165166,
    alt: "Drone professionnel en vol à proximité d'un chantier urbain, structures et engins dans le cadre",
    ratio: [16, 10],
    sizes: "(max-width: 767px) 92vw, (max-width: 1279px) 45vw, 29vw",
  }),
  maintenance: photo({
    id: 32208773,
    alt: "Technicien réparant un drone à l'établi, outils de précision en atelier",
    ratio: [16, 10],
    sizes: "(max-width: 767px) 92vw, (max-width: 1279px) 45vw, 29vw",
  }),
  thermographie: photo({
    id: 442150,
    alt: "Inspection thermographique par drone — exemple de démonstration",
    ratio: [16, 10],
    sizes: "(max-width: 767px) 92vw, (max-width: 1279px) 45vw, 29vw",
  }),
  agriculture: photo({
    id: 34182367,
    alt: "Drone agricole en vol au-dessus d'une parcelle — imagerie NDVI, exemple de démonstration",
    ratio: [16, 10],
    sizes: "(max-width: 767px) 92vw, (max-width: 1279px) 45vw, 29vw",
  }),
  vente: photo({
    id: 9182739,
    alt: "Drone professionnel et sa radiocommande présentés en lumière rasante, matériel prêt à la livraison",
    ratio: [16, 10],
    sizes: "(max-width: 767px) 92vw, (max-width: 1279px) 45vw, 29vw",
  }),
  location: photo({
    id: 37288723,
    alt: "Drone professionnel en configuration de décollage dans un champ au lever du soleil, prêt pour une mission",
    ratio: [16, 10],
    sizes: "(max-width: 767px) 92vw, (max-width: 1279px) 45vw, 29vw",
  }),
  // Legacy keys for V8 compatibility (kept, not used in V10 primary)
  prestations: photo({
    id: 34182367,
    alt: "Drone agricole de traitement en vol au-dessus d'une parcelle cultivée, reliefs en arrière-plan",
    ratio: [16, 10],
    sizes: "(max-width: 767px) 92vw, (max-width: 1279px) 45vw, 29vw",
  }),
};

/** 1200×630 crop for social preview cards. */
export const ogImageUrl = pexels(28467369, 1200, 630);
