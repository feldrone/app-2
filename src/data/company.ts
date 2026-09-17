/**
 * FEL DRONE — company record (V11).
 *
 * Language-independent identity values live here ONCE so every locale — and
 * every display that mentions the company — reads the same registry. Marketing
 * copy lives in the per-language dictionaries (`src/data/content.{fr,en,ar}.ts`);
 * this file holds what must never be translated differently: legal name, the
 * Registre de Commerce number, address, phone, email, URL, gérant and the
 * proper names of the team.
 *
 * EDITORIAL RULES (unchanged since V10):
 * - No invented identifiers, capital, dates, certifications or contacts.
 * - `rc` is the ONE place the Registre de Commerce number is stored; the legal
 *   notice (and any future surface) reads it from here.
 */

export const company = {
  legalName: "SARL FEL DRONE",
  shortName: "FEL DRONE",
  /**
   * Registre de Commerce — single source of truth, rendered in Mentions légales.
   * Authoritative value: exactly as issued, character for character — no hyphen
   * between 0683602 and B26, no spaces. Do not "tidy" the formatting.
   */
  rc: "36/00-0683602B26",
  /** Internal record — not rendered */
  rcDate: "28.07.2026",
  /** Internal record only */
  capital: "1 000 000 DA",
  addressLine1: "Cité 150 Logements B",
  addressLine2: "Commune de Aïn El Assel, Wilaya d'El Tarf",
  city: "El Tarf",
  plusCode: "Q9JM+542",
  email: "contact.feldrone@gmail.com",
  phone: "+213 6 61 61 33 99",
  phoneHref: "+213661613399",
  url: "https://www.feldrone.dz",
  gerant: "Yassine Fellah",
} as const;

export type TeamMemberBase = {
  /** Proper name — identical in every language */
  name: string;
  initials: string;
};

/**
 * Proper names are language-independent; roles and notes are translated in the
 * dictionaries and merged with these entries in order (see `content.*.ts`).
 */
export const teamMembers: TeamMemberBase[] = [
  { name: "Yassine Fellah", initials: "YF" },
  { name: "Menouar Fellah", initials: "MF" },
  { name: "Amine Fellah", initials: "AF" },
];
