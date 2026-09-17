/**
 * FEL DRONE — i18n runtime (V11).
 *
 * Deliberately tiny and dependency-free: a React context holding the active
 * locale, its dictionary and its writing direction. No i18n library, no
 * framework migration — the site stays a single Vite/React bundle. V12 added
 * real routes around it (`src/router`), and every route renders in all three
 * languages; the section anchors still work as well.
 *
 * Applied to the document:
 *   <html lang="…" dir="…" data-locale="…">  — so RTL is real, and CSS can
 *   target the writing direction without duplicating components.
 *   (The document title belongs to the SEO layer — `src/router/seo.ts` — which
 *   sets it per route: one owner, no race between locale and page.)
 *
 * The choice is remembered in localStorage and, on a first visit, inferred
 * from the browser language; French stays the default and is never broken.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { fr } from "../data/content.fr";
import { en } from "../data/content.en";
import { ar } from "../data/content.ar";
import { LOCALES, type Dictionary, type Direction, type Locale } from "./types";

export { LOCALES, LOCALE_NAMES, LOCALE_SHORT, LOCALE_HTML_LANG } from "./types";
export type { Dictionary, Locale, Direction };

const DICTIONARIES: Record<Locale, Dictionary> = { fr, en, ar };
const STORAGE_KEY = "fel-drone:locale";

export function dictionaryFor(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}

function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

/** Stored preference → browser language → French. */
function detectLocale(): Locale {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (isLocale(saved)) return saved;
  } catch {
    /* storage unavailable (private mode) — fall through to the browser hint */
  }
  const languages = typeof navigator === "undefined" ? [] : navigator.languages ?? [navigator.language];
  for (const raw of languages) {
    const tag = String(raw ?? "").toLowerCase();
    if (tag.startsWith("ar")) return "ar";
    if (tag.startsWith("en")) return "en";
    if (tag.startsWith("fr")) return "fr";
  }
  return "fr";
}

type I18nValue = {
  locale: Locale;
  dir: Direction;
  dict: Dictionary;
  setLocale: (locale: Locale) => void;
};

const I18nContext = createContext<I18nValue | null>(null);

/**
 * Push the locale onto <html> (pre-paint).
 *
 * The document TITLE is deliberately not set here: V12 gives every route its
 * own head copy through `usePageMeta`, and a parent layout effect runs after
 * its children — setting the title here would overwrite the page's own.
 */
function applyDocument(locale: Locale, dict: Dictionary) {
  const root = document.documentElement;
  root.lang = dict.locale.htmlLang;
  root.dir = dict.locale.dir;
  root.dataset.locale = locale;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => detectLocale());
  const dict = DICTIONARIES[locale];

  // useLayoutEffect: the very first paint is already in the right language and
  // direction — no LTR flash before Arabic, no French flash before English.
  useLayoutEffect(() => {
    applyDocument(locale, dict);
  }, [locale, dict]);

  useEffect(() => {
    // Persist only a deliberate choice (and the detected one, harmlessly).
    try {
      window.localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      /* storage unavailable — the session simply does not remember */
    }
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState((current) => (current === next ? current : next));
  }, []);

  const value = useMemo<I18nValue>(
    () => ({ locale, dir: dict.locale.dir, dict, setLocale }),
    [locale, dict, setLocale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within <I18nProvider>");
  return ctx;
}

/** Shorthand for components that only need the copy. */
export function useDict(): Dictionary {
  return useI18n().dict;
}
