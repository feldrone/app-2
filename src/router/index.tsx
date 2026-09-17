/**
 * FEL DRONE — router (V12). Dependency-free by design.
 *
 * The project is a single Vite/React bundle that deploys both to GitHub Pages
 * (project path `/app/`) and to Vercel (`/`). A routing library would add a
 * dependency, a bundle and a second source of truth for the base path — so the
 * router is ~150 lines of History API code instead:
 *
 *  · `pushState` navigation with real URLs (`/services/topographie`, `/devis`…)
 *  · the deployment base is read once from `import.meta.env.BASE_URL`
 *  · `<Link>` renders a real `<a href>` — middle-click, ⌘/Ctrl-click, "open in
 *    new tab", the status bar and screen readers all keep working; only a plain
 *    left click is intercepted
 *  · in-page anchors (`#contact`, `/#services`) still work, including from
 *    another route: the router scrolls the target into view after the paint
 *  · deep links survive a hard refresh on GitHub Pages through `404.html`,
 *    which parks the requested path and hands it back to the app (see
 *    `public/404.html` and `REDIRECT_KEY` below)
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  type AnchorHTMLAttributes,
  type ReactNode,
} from "react";
import { matchRoute, normalizePath, type RouteMatch } from "./routes";

/** Set by `public/404.html` so a hard refresh on a deep link is not lost. */
export const REDIRECT_KEY = "fel-drone:redirect";

/**
 * The deployment directory every route URL is built from.
 *
 * `import.meta.env.BASE_URL` is the natural source, but the single-file build
 * plugin rewrites it to `"./"` (relative), so it cannot be used as-is. In that
 * case the document the app was served as is the evidence:
 *
 *   · a directory index (`/app/`) or an HTML file (`/app/index.html`) means a
 *     static host — the app lives in that directory, and every route URL must
 *     keep the prefix (GitHub Pages project site: `/app/services`);
 *   · anything else means the host rewrote a route to the bundle (SPA hosting,
 *     `vite preview`), so the app is served from the site root and links stay
 *     absolute (`/services`).
 */
function detectBase(): string {
  const configured = import.meta.env.BASE_URL || "/";
  if (configured !== "./" && configured !== "." && configured !== "") {
    return configured.replace(/\/+$/, "");
  }
  const path = window.location.pathname;
  if (path.endsWith("/") || /\.html?$/i.test(path)) {
    return path.slice(0, path.lastIndexOf("/")).replace(/\/+$/, "");
  }
  return "";
}

const BASE = typeof window === "undefined" ? "" : detectBase();

/** App path → the real URL the visitor sees. */
export function routeHref(to: string): string {
  const [pathPart, hashPart] = to.split("#");
  const path = pathPart === "" ? "" : pathPart;
  const url = `${BASE}${path.startsWith("/") ? path : `/${path}`}`;
  return `${url || "/"}${hashPart ? `#${hashPart}` : ""}`;
}

type RouterValue = {
  /** Normalised app path, e.g. `/services/topographie`. */
  path: string;
  /** In-page anchor without the `#`, when present. */
  hash: string;
  match: RouteMatch;
  navigate: (to: string, options?: { replace?: boolean }) => void;
  isActive: (to: string) => boolean;
};

const RouterContext = createContext<RouterValue | null>(null);

type Location = { path: string; hash: string };

/** Read the current location, honouring a 404.html hand-off if there is one. */
function readLocation(): Location {
  if (typeof window === "undefined") return { path: "/", hash: "" };

  // GitHub Pages serves 404.html for unknown paths; it stores the intended
  // path and sends the visitor to the app root with `?p=`. We restore it here
  // and immediately clean the URL so the address bar shows the real route.
  const params = new URLSearchParams(window.location.search);
  const handedOver = params.get("p");
  if (handedOver) {
    const restored = normalizePath(handedOver, BASE);
    try {
      window.history.replaceState({}, "", routeHref(restored));
    } catch {
      /* history unavailable — the app still renders the restored path */
    }
    return { path: restored, hash: window.location.hash.replace(/^#/, "") };
  }

  try {
    const pending = window.sessionStorage.getItem(REDIRECT_KEY);
    if (pending) {
      window.sessionStorage.removeItem(REDIRECT_KEY);
      const restored = normalizePath(pending, BASE);
      window.history.replaceState({}, "", routeHref(restored));
      return { path: restored, hash: "" };
    }
  } catch {
    /* storage unavailable — nothing to restore */
  }

  return {
    path: normalizePath(window.location.pathname, BASE),
    hash: window.location.hash.replace(/^#/, ""),
  };
}

/** Scroll to an in-page target, or to the top for a fresh page. */
function scrollToTarget(hash: string, smooth: boolean) {
  if (hash) {
    const el = document.getElementById(hash);
    if (el) {
      el.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
      return;
    }
  }
  window.scrollTo({ top: 0, behavior: "auto" });
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<Location>(() => readLocation());

  // Back/forward: the browser owns the URL, we only mirror it.
  useEffect(() => {
    const onPop = () => setLocation(readLocation());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const navigate = useCallback((to: string, options?: { replace?: boolean }) => {
    const [pathPart, hashPart = ""] = to.split("#");
    const target = normalizePath(pathPart === "" ? location.path : pathPart, BASE);
    const url = routeHref(`${pathPart === "" ? location.path : pathPart}${hashPart ? `#${hashPart}` : ""}`);

    // Same page, different anchor: no history entry, just move.
    const samePage = target === location.path;
    if (!samePage || options?.replace) {
      window.history[samePage || options?.replace ? "replaceState" : "pushState"]({}, "", url);
    }
    setLocation({ path: target, hash: hashPart });
    const reduce =
      typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Let React commit the new view before measuring the anchor target.
    window.requestAnimationFrame(() => scrollToTarget(hashPart, !reduce && samePage));
  }, [location.path]);

  // A hard navigation to `/#services` (or a hash typed in the bar) must scroll too.
  useLayoutEffect(() => {
    if (location.hash) window.requestAnimationFrame(() => scrollToTarget(location.hash, false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const match = useMemo(() => matchRoute(location.path), [location.path]);

  const isActive = useCallback(
    (to: string) => {
      const target = normalizePath(to.split("#")[0] || "/", BASE);
      if (target === "/") return location.path === "/";
      return location.path === target || location.path.startsWith(`${target}/`);
    },
    [location.path],
  );

  const value = useMemo<RouterValue>(
    () => ({ path: location.path, hash: location.hash, match, navigate, isActive }),
    [location.path, location.hash, match, navigate, isActive],
  );

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRouter(): RouterValue {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error("useRouter must be used within <RouterProvider>");
  return ctx;
}

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  to: string;
  /** Skip routing (used for the skip-link, which must stay an anchor jump). */
  plainAnchor?: boolean;
};

/**
 * Route-aware anchor. Renders exactly like `<a href>`, so keyboard, middle
 * click, "copy link address" and assistive technology behave natively.
 */
export function Link({ to, onClick, plainAnchor = false, children, ...rest }: LinkProps) {
  const { navigate } = useRouter();
  const isRelativeAnchor = to.startsWith("#");
  const href = isRelativeAnchor ? to : routeHref(to);

  return (
    <a
      href={href}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented || plainAnchor) return;
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        if (rest.target && rest.target !== "_self") return;
        if (isRelativeAnchor) return; // native in-page jump on the current page

        event.preventDefault();
        navigate(to);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
