import { LOCALES, useI18n } from "../i18n";
import { cn } from "../utils/cn";

/**
 * Language selector — a compact segmented control in the site's own idiom:
 * hairline separators, square corners, no flags, no dropdown. Three real
 * buttons, so it works with a keyboard, a screen reader and a thumb.
 *
 * It is a state switch, not a route: the site is a single-page bundle with
 * hash navigation, so no URL changes and every deep link (#services, #contact)
 * keeps working in all three languages. The active language is marked with
 * `aria-current` plus a filled state the eye can pick out instantly.
 *
 * `variant="sheet"` renders the mobile-sheet build (larger tap targets);
 * the default is the header build.
 */
export default function LanguageSwitcher({
  variant = "header",
  onSelect,
  className,
}: {
  variant?: "header" | "sheet";
  onSelect?: () => void;
  className?: string;
}) {
  const { locale, dict, setLocale } = useI18n();
  const sheet = variant === "sheet";

  return (
    <div className={cn("flex items-center", className)}>
      <span className="sr-only" id="language-selector-label">
        {dict.nav.language}
      </span>
      <ul
        aria-labelledby="language-selector-label"
        dir="ltr"
        className={cn(
          "flex items-center rounded-full border border-slate bg-white p-0.5",
          sheet ? "w-full max-w-xs" : "",
        )}
      >
        {LOCALES.map((code, i) => {
          const active = code === locale;
          return (
            <li key={code} className={cn("flex", i > 0 && "border-l border-fog")}>
              <button
                type="button"
                lang={code}
                aria-current={active ? "true" : undefined}
                onClick={() => {
                  setLocale(code);
                  onSelect?.();
                }}
                className={cn(
                  "flex items-center justify-center rounded-full font-medium tracking-[0.08em] transition-colors duration-200",
                  sheet ? "flex-1 px-4 py-2.5 text-[14px]" : "px-3 py-1.5 text-[11.5px]",
                  active
                    ? "bg-navy-900 text-white"
                    : "text-graphite hover:bg-fog hover:text-navy-900",
                )}
              >
                {code.toUpperCase()}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
