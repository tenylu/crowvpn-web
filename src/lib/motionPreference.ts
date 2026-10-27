const STORAGE_KEY = "crowvpn:motion";

export function allowFullMotion() {
  if (process.env.NODE_ENV === "development") return true;
  if (typeof window === "undefined") return false;
  try {
    if (new URLSearchParams(window.location.search).get("motion") === "full") return true;
    if (window.localStorage.getItem(STORAGE_KEY) === "full") return true;
  } catch {
    // Storage and search params are optional preview overrides.
  }
  return false;
}

export function prefersReducedMotion(query?: MediaQueryList) {
  if (allowFullMotion()) return false;
  return (query ?? window.matchMedia("(prefers-reduced-motion: reduce)")).matches;
}
