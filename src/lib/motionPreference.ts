const STORAGE_KEY = "crowvpn:motion";

export function allowFullMotion() {
  if (typeof window !== "undefined") {
    try {
      const query = new URLSearchParams(window.location.search).get("motion");
      if (query === "reduce") return false;
      if (query === "full") return true;
      if (window.localStorage.getItem(STORAGE_KEY) === "reduce") return false;
    } catch {
      // Storage and search params are optional preview overrides.
    }
  }
  return true;
}

export function prefersReducedMotion(query?: MediaQueryList) {
  if (allowFullMotion()) return false;
  return (query ?? window.matchMedia("(prefers-reduced-motion: reduce)")).matches;
}
