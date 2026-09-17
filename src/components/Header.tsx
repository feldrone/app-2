import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import Logo from "./Logo";
import LanguageSwitcher from "./LanguageSwitcher";
import { Link, useRouter } from "../router";
import { PATHS, SERVICE_PAGES, servicePath } from "../router/routes";
import { useDict } from "../i18n";
import { cn } from "../utils/cn";

/**
 * Corporate header: fixed rail with a stable height (--header-h), quiet
 * borders instead of shadows, scroll-state tinting, a services menu, and a
 * full-height but uncluttered mobile sheet (Escape closes it, body scroll locks
 * while open).
 *
 * V12 — real routes. The rail renders `dict.nav.links`, which now carry route
 * paths (`/services`, `/a-propos`, `/contact`) as well as home-page anchors
 * addressed as `/#section`. Navigation uses the router's `<Link>`, so a plain
 * click is client-side while middle-click, ⌘/Ctrl-click and "copy link" keep
 * their native behaviour.
 *
 * The services entry opens a menu instead of being a bare link: the six service
 * detail pages are one click from any route — the requirement that mattered
 * most in V12. It is a button + `ul` pair (aria-expanded / aria-haspopup), not a
 * hover-only widget, and it closes on Escape, on an outside click and whenever
 * the route changes.
 *
 * Breakpoints (measured at 1024 / 1100 / 1280 / 1366 / 1440 in FR / EN / AR):
 * the full rail only fits from xl (1280 px), so below that the burger + sheet
 * takes over while the language selector stays visible in the header from lg.
 */
export default function Header() {
  const dict = useDict();
  const { path, isActive } = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [activeAnchor, setActiveAnchor] = useState<string>("");
  const servicesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy — only meaningful on the landing page, where the sections live.
  // The observer watches the anchor entries of the nav and re-registers when
  // the visitor moves between routes.
  useEffect(() => {
    if (path !== PATHS.home) {
      setActiveAnchor("");
      return;
    }
    const targets = dict.nav.links
      .map((link) => (link.href.includes("#") ? link.href.slice(link.href.indexOf("#")) : null))
      .filter((hash): hash is string => Boolean(hash))
      .map((hash) => document.querySelector(hash))
      .filter((el): el is Element => Boolean(el));
    if (targets.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveAnchor(`#${entry.target.id}`);
        });
      },
      { rootMargin: "-40% 0px -50% 0px" },
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, [dict, path]);

  // Body scroll lock + Escape-to-close for the mobile sheet.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Escape + outside click for the services menu.
  useEffect(() => {
    if (!servicesOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setServicesOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) setServicesOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, [servicesOpen]);

  // Any navigation closes the menus (and the language switch closes the sheet).
  useEffect(() => {
    setServicesOpen(false);
    setOpen(false);
  }, [path, dict.locale.tag]);

  const serviceItems = SERVICE_PAGES.map((page) => ({
    to: servicePath(page.slug),
    label: dict.routes.service[page.slug].label,
  }));

  const servicesMenu = (
    <div ref={servicesRef} className="relative">
      <button
        type="button"
        aria-expanded={servicesOpen}
        aria-haspopup="true"
        aria-controls="services-menu"
        onClick={() => setServicesOpen((v) => !v)}
        className={cn(
          "relative inline-flex items-center gap-1.5 py-1 text-[13px] font-medium tracking-wide transition-colors hover:text-navy-900",
          isActive(PATHS.services) ? "text-navy-900" : "text-ink-soft",
        )}
      >
        {dict.nav.links.find((l) => l.href === PATHS.services)?.label ?? dict.routes.common.services}
        <ChevronDown size={13} className={cn("transition-transform duration-200", servicesOpen && "rotate-180")} aria-hidden="true" />
        <span
          className={cn(
            "absolute right-0 -bottom-0.5 left-0 h-px origin-left scale-x-0 bg-signal-600 transition-transform duration-300 rtl:origin-right",
            isActive(PATHS.services) && "scale-x-100",
          )}
          aria-hidden="true"
        />
      </button>
      <ul
        id="services-menu"
        aria-label={dict.nav.servicesMenu}
        className={cn(
          "absolute start-0 top-full z-50 mt-3 w-[19rem] border border-line bg-white py-2 shadow-[0_28px_56px_-34px_rgba(14,31,48,0.5)]",
          servicesOpen ? "block" : "hidden",
        )}
      >
        {serviceItems.map((item, i) => (
          <li key={item.to} className={cn(i > 0 && "border-t border-line/70")}>
            <Link
              to={item.to}
              className="block px-5 py-3 text-[13px] leading-snug text-ink transition-colors hover:bg-paper hover:text-navy-900"
            >
              {item.label}
            </Link>
          </li>
        ))}
        <li className="border-t border-line">
          <Link
            to={PATHS.services}
            className="flex items-center justify-between gap-3 px-5 py-3 text-[12px] font-semibold tracking-wide text-navy-900 uppercase transition-colors hover:bg-paper"
          >
            {dict.routes.common.services}
            <ArrowRight size={13} className="rtl:rotate-180" aria-hidden="true" />
          </Link>
        </li>
      </ul>
    </div>
  );

  // Mobile sheet — simple list, generous tap targets, no choreography.
  // Portal target: body (see class comment — never nest this inside the
  // filtered header, or `fixed` stops meaning "viewport").
  const mobileSheet = (
    <div
      id="mobile-menu"
      className={cn(
        "fixed inset-x-0 bottom-0 top-[var(--header-h)] z-40 flex flex-col bg-white transition-transform duration-300 ease-out xl:hidden",
        open ? "translate-x-0" : "invisible translate-x-full",
      )}
      inert={!open}
    >
      <nav aria-label={dict.nav.mobileAria} className="flex flex-col overflow-y-auto px-6 pt-2">
        {dict.nav.links.map((link) => (
          <div key={link.href}>
            <Link
              to={link.href}
              onClick={() => setOpen(false)}
              aria-current={isActive(link.href) ? "page" : undefined}
              className="block border-b border-line py-4.5 text-[17px] font-medium text-ink"
            >
              {link.label}
            </Link>
            {link.href === PATHS.services && (
              <ul className="border-b border-line bg-paper/60">
                {serviceItems.map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      onClick={() => setOpen(false)}
                      className="block px-4 py-3 text-[14px] text-ink-soft transition-colors hover:text-navy-900"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </nav>
      <div className="mt-auto border-t border-line px-6 py-6">
        {/* From lg up the header keeps a visible selector, so the sheet does not
            repeat it — one control, always in the same place. */}
        <div className="lg:hidden">
          <LanguageSwitcher variant="sheet" onSelect={() => setOpen(false)} className="mb-4" />
        </div>
        <Link
          to={PATHS.devis}
          onClick={() => setOpen(false)}
          className="flex items-center justify-center gap-2 bg-navy-900 px-5 py-4.5 text-[15px] font-medium tracking-wide text-white transition-colors hover:bg-navy-800"
        >
          {dict.nav.cta}
          <ArrowRight size={15} className="rtl:rotate-180" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300",
          scrolled || open
            ? "border-line bg-white/95 backdrop-blur-sm"
            : "border-transparent bg-paper/80 backdrop-blur-[2px]",
        )}
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-4 focus:z-[60] focus:bg-navy-900 focus:px-4 focus:py-2 focus:text-[13px] focus:font-medium focus:text-white"
        >
          {dict.nav.skip}
        </a>

        <div className="mx-auto flex h-[var(--header-h)] max-w-[1400px] items-center justify-between gap-4 px-6 lg:px-12">
          <Link to={PATHS.home} aria-label={dict.nav.logoHome} className="shrink-0">
            <Logo />
          </Link>

          <nav aria-label={dict.nav.aria} className="hidden items-center gap-4 xl:flex 2xl:gap-8">
            {dict.nav.links.map((link) => {
              if (link.href === PATHS.services) return <div key={link.href}>{servicesMenu}</div>;
              const routeLink = !link.href.includes("#") || link.href.startsWith("/");
              const anchorActive = path === PATHS.home && !routeLink && activeAnchor === link.href;
              const current = routeLink && link.href !== PATHS.home ? isActive(link.href) : anchorActive;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  aria-current={current ? "page" : undefined}
                  className={cn(
                    "relative py-1 text-[13px] font-medium tracking-wide text-ink-soft transition-colors hover:text-navy-900",
                    current && "text-navy-900",
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      "absolute right-0 -bottom-0.5 left-0 h-px origin-left scale-x-0 bg-signal-600 transition-transform duration-300 rtl:origin-right",
                      current && "scale-x-100",
                    )}
                    aria-hidden="true"
                  />
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 xl:flex">
            <LanguageSwitcher />
            <Link
              to={PATHS.devis}
              className="group inline-flex items-center gap-2 whitespace-nowrap bg-navy-900 px-4 py-2.5 text-[12.5px] font-medium tracking-wide text-white shadow-[0_12px_24px_-14px_rgba(14,31,48,0.7)] transition-[background-color,transform] duration-200 hover:bg-navy-800 active:translate-y-px 2xl:px-5 2xl:text-[13px]"
            >
              {dict.nav.cta}
              <ArrowRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>

          {/* Below xl the rail (9 links + selector + CTA) does not fit, so nav and
              CTA move into the sheet — but the language selector stays visible in
              the header from lg up, so a laptop user never has to open a menu to
              change language. */}
          <div className="flex items-center gap-1.5 xl:hidden">
            <div className="hidden lg:flex">
              <LanguageSwitcher />
            </div>
            <button
              type="button"
              className="inline-flex items-center justify-center p-2.5 text-navy-900"
              aria-label={open ? dict.nav.closeMenu : dict.nav.openMenu}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {createPortal(mobileSheet, document.body)}
    </>
  );
}
