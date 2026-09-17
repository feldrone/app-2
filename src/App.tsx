import { I18nProvider, useI18n } from "./i18n";
import { RouterProvider, useRouter } from "./router";
import Header from "./components/Header";
import LegalNotice from "./components/LegalNotice";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import ServicesIndexPage from "./pages/ServicesIndexPage";
import ServiceDetailPage from "./pages/ServiceDetailPage";
import DevisPage from "./pages/DevisPage";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";
import NotFoundPage from "./pages/NotFoundPage";

/**
 * V12 shell: provider → router → route view.
 *
 * The header, the legal notice and the footer are shared by every route, so
 * the language selector, the mobile sheet, the legal band and the sitemap
 * behave identically whether the visitor is on the landing page or on
 * `/services/vente-location`. The writing direction still comes from the
 * active dictionary, so Arabic is RTL on every route.
 *
 * Route resolution is a plain switch over the route table
 * (`src/router/routes.ts`) — no framework, no route configuration library.
 */
function RouteView() {
  const { match } = useRouter();

  switch (match.name) {
    case "home":
      return <HomePage />;
    case "services":
      return <ServicesIndexPage />;
    case "service":
      // `serviceSlug` is guaranteed by matchRoute; the fallback keeps TS honest.
      return match.serviceSlug ? <ServiceDetailPage slug={match.serviceSlug} /> : <NotFoundPage path={match.path} />;
    case "devis":
      return <DevisPage />;
    case "contact":
      return <ContactPage />;
    case "about":
      return <AboutPage />;
    case "notFound":
    default:
      return <NotFoundPage path={match.path} />;
  }
}

function Shell() {
  const { dir, locale } = useI18n();
  return (
    <div dir={dir} data-locale={locale} className="min-h-screen bg-paper">
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        <RouteView />
      </main>
      <LegalNotice />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <RouterProvider>
        <Shell />
      </RouterProvider>
    </I18nProvider>
  );
}
