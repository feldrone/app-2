import type { ReactNode } from "react";
import { Link } from "../router";
import { useDict } from "../i18n";
import { cn } from "../utils/cn";

/**
 * Shared masthead for the V12 route pages: breadcrumb, eyebrow, single H1 and
 * the page lede. Keeping one component means every route opens with the same
 * rhythm — the same measure, the same type scale, the same clearance under the
 * fixed header — instead of each page inventing its own top block.
 */
export default function PageHeader({
  eyebrow,
  title,
  lede,
  crumbs,
  children,
  tone = "light",
  className,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  /** Extra breadcrumb steps after "Home" (label + path). */
  crumbs?: { label: string; to?: string }[];
  children?: ReactNode;
  tone?: "light" | "paper";
  className?: string;
}) {
  const dict = useDict();

  return (
    <header
      data-tone={tone}
      className={cn(
        "border-b border-line-fog pt-[calc(var(--header-h)+3rem)] pb-14 lg:pt-[calc(var(--header-h)+4.5rem)] lg:pb-20 bg-fog",
        className,
      )}
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <nav aria-label={dict.routes.common.breadcrumb} className="mb-8">
          <ol className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[12.5px] text-slate">
            <li>
              <Link to="/" className="transition-colors hover:text-navy-900">
                {dict.routes.common.home}
              </Link>
            </li>
            {crumbs?.map((crumb) => (
              <li key={crumb.label} className="flex items-center gap-2.5">
                <span aria-hidden="true" className="text-ash">
                  /
                </span>
                {crumb.to ? (
                  <Link to={crumb.to} className="transition-colors hover:text-navy-900">
                    {crumb.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-iron">
                    {crumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <div className="max-w-4xl">
          <p className="flex flex-wrap items-center gap-3 text-[11px] font-medium tracking-[0.2em] text-slate uppercase sm:text-[12px]">
            <span className="h-px w-8 bg-signal-600" aria-hidden="true" />
            {eyebrow}
          </p>
          <h1 className="mt-5 font-display text-[2rem] text-balance leading-[1.15] font-light tracking-[-0.03em] text-navy-900 sm:text-[2.6rem]">
            {title}
          </h1>
          {lede && <p className="mt-6 max-w-3xl text-[16px] leading-relaxed text-graphite">{lede}</p>}
          {children}
        </div>
      </div>
    </header>
  );
}
