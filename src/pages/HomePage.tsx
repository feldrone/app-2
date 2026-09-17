import Hero from "../components/Hero";
import Expertise from "../components/Expertise";
import Services from "../components/Services";
import Method from "../components/Method";
import Demonstration from "../components/Demonstration";
import Equipment from "../components/Equipment";
import Safety from "../components/Safety";
import Leadership from "../components/Leadership";
import Faq from "../components/Faq";
import Contact from "../components/Contact";
import { useDict } from "../i18n";
import { usePageMeta } from "../router/seo";

/**
 * The landing route — the V11 narrative spine, unchanged:
 * COMPANY (Hero) → CAPABILITY (Expertise) → SERVICES (7 poles, 3 primary)
 * → METHOD (eight steps, zero improvisation) → DEMONSTRATION → EQUIPMENT
 * → TRUST (Safety) → LEADERSHIP → FAQ → ACTION (Contact).
 *
 * V12 keeps every section and every anchor id exactly where they were, so
 * `#services`, `#contact`, `#mentions-legales` and the rest still resolve; the
 * section CTAs now also lead to real routes (`/services`, `/devis`, `/contact`).
 */
export default function HomePage() {
  const dict = useDict();
  usePageMeta({ title: dict.seo.title, description: dict.seo.description, path: "/" });

  return (
    <>
      <Hero />
      <Expertise />
      <Services />
      <Method />
      <Demonstration />
      <Equipment />
      <Safety />
      <Leadership />
      <Faq />
      <Contact />
    </>
  );
}
