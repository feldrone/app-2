import { ArrowUp } from "lucide-react";
import { company } from "../data/company";
import { Link } from "../router";
import { PATHS } from "../router/routes";
import { useDict } from "../i18n";
import Logo from "./Logo";

/**
 * Corporate footer — quiet, dense with the useful facts only: identity,
 * navigation, contact. No newsletter mock, no social icons we cannot back,
 * no filler.
 *
 * V11: the sitemap, the legal link, the tagline and the copyright line follow
 * the active language; the address comes from the dictionary (place names are
 * translated, the registry values are not) and the logo switches to the
 * inverse lockup on the navy ground.
 */
export default function Footer() {
  const dict = useDict();
  const t = dict.footer;

  return (
    <footer className="bg-navy-950 text-white/90">
      <div className="mx-auto max-w-[1400px] px-6 pt-16 pb-10 lg:px-12">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <Link to={PATHS.home} aria-label={dict.nav.logoHome}>
              <Logo dark />
            </Link>
            <p className="mt-6 max-w-xs text-[14px] leading-relaxed text-white/70">
              {t.tagline}
            </p>
          </div>

          <nav aria-label={t.sitemap} className="lg:col-span-3 lg:col-start-6">
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-white">{t.sitemap}</p>
            <ul className="mt-5 space-y-3">
              {dict.nav.links.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-[14px] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <a href="#mentions-legales" className="text-[14px]">
                  {t.legalLink}
                </a>
              </li>
            </ul>
          </nav>

          <div className="lg:col-span-4 lg:col-start-9">
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-white">{t.contactTitle}</p>
            <address className="mt-5 space-y-2.5 text-[14px] leading-relaxed not-italic text-white/80">
              <p>{dict.place.seatLine}</p>
              <p>
                <a href={`mailto:${company.email}`}>
                  {company.email}
                </a>
              </p>
              <p>
                <a href={`tel:${company.phoneHref}`}>
                  <span dir="ltr" className="inline-block">{company.phone}</span>
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-7 text-[13px] text-white/70 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p>
              © {new Date().getFullYear()} {company.legalName}. {t.rights}
            </p>
            {/* CC-BY-4.0 attribution for the hero 3D model (public/3d/). */}
            <p className="mt-1 text-[11px] text-white/45">
              <a
                href="https://sketchfab.com/3d-models/fpv-racing-drone-quadcopter-fa8b1ca2695e4022a9b4c70401f04b05"
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-2 transition-colors hover:text-white/75 hover:underline"
              >
                {t.credit3d}
              </a>
            </p>
          </div>
          <a
            href="#main"
            className="inline-flex items-center gap-2 self-start sm:self-auto"
          >
            {t.backToTop}
            <ArrowUp size={13} aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
