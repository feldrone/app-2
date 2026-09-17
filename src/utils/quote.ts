/**
 * Cross-component handshake for the quote flow.
 *
 * Two mechanisms, one purpose — hand the chosen service to the quote form:
 *
 *  · `PREFILL_EVENT` (V11): a CustomEvent, used when the form is mounted on the
 *    same page (the service cards on the home page scroll down to it).
 *  · `PENDING_SERVICE_KEY` (V12): the same intent across a route change — a
 *    service page sends the visitor to `/devis` and the value travels in
 *    sessionStorage, consumed by the form on mount.
 *
 * Both carry canonical French identifiers only, so the API contract is
 * untouched no matter which language the visitor is reading.
 */
import { PATHS, servicePath } from "../router/routes";

export const PREFILL_EVENT = "fel:prefill-service";
export const PENDING_SERVICE_KEY = "fel-drone:pending-service";

type Navigator = (to: string, options?: { replace?: boolean }) => void;

/**
 * Keep the V11 in-page behaviour: prefill the mounted form, scroll to it and
 * focus the name field once the motion settles.
 */
export function requestQuote(serviceLabel: string) {
  window.dispatchEvent(new CustomEvent(PREFILL_EVENT, { detail: serviceLabel }));
  const el = document.getElementById("contact") ?? document.getElementById("quote-form");
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  // Focus the name field once the scroll settles — focus lands after motion.
  window.setTimeout(
    () => {
      document
        .getElementById("quote-form")
        ?.querySelector<HTMLInputElement>("[data-quote-field='name']")
        ?.focus({ preventScroll: true });
    },
    reduce ? 0 : 520,
  );
}

/**
 * V12 — go to the quote page with the chosen service already selected. Used by
 * the service pages and the services index, where the form is not on screen.
 */
export function requestQuoteRoute(serviceLabel: string, navigate: Navigator) {
  try {
    window.sessionStorage.setItem(PENDING_SERVICE_KEY, serviceLabel);
  } catch {
    /* storage unavailable — the visitor picks the service on the form */
  }
  navigate(PATHS.devis);
}

export { PATHS, servicePath };
