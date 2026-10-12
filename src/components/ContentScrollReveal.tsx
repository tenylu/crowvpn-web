"use client";

import { useEffect } from "react";

/** Replay only after a block fully leaves the viewport, avoiding threshold flicker. */
export function ContentScrollReveal() {
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches || !("IntersectionObserver" in window)) return;
    const items = document.querySelectorAll<HTMLElement>(
      "#instant-connect h2, #instant-connect h3, #instant-connect p, #how h2, #how h3, #how p, #testimonials h2, #testimonials > div > p, #download h2, #download p",
    );
    const active = new Map<Element, Animation>();
    const headingCleanups = new Map<Element, () => void>();
    const visible = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) {
          continue;
        }
        if (entry.target.closest("#vpn-intro")?.getAttribute("data-cabin-ready") === "false") continue;
        if (visible.has(entry.target)) continue;
        visible.add(entry.target);
        if (entry.target.matches("h2")) {
          const title = entry.target as HTMLElement;
          if (title.childNodes.length !== 1 || title.firstChild?.nodeType !== Node.TEXT_NODE) continue;
          const text = title.textContent ?? "";
          const color = title.style.color;
          const position = title.style.position;
          const overlay = document.createElement("span");
          overlay.setAttribute("aria-hidden", "true");
          overlay.setAttribute("data-no-translate", "");
          overlay.style.cssText = `position:absolute;inset:0;pointer-events:none;color:${getComputedStyle(title).color};`;
          const animations: Animation[] = [];
          const words = Array.from(new Intl.Segmenter(undefined, { granularity: "word" }).segment(text), part => part.segment);
          let index = 0;
          let offset = 0;
          const bounds = title.getBoundingClientRect();
          for (const word of words) {
            const range = document.createRange();
            range.setStart(title.firstChild!, offset);
            offset += word.length;
            range.setEnd(title.firstChild!, offset);
            if (/^\s+$/.test(word)) continue;
            const rect = range.getBoundingClientRect();
            const mask = document.createElement("span");
            mask.style.cssText = `position:absolute;overflow:clip;left:${rect.left - bounds.left}px;top:${rect.top - bounds.top}px;width:${rect.width + 1}px;height:${rect.height}px;line-height:${rect.height}px;white-space:pre;`;
            const inner = document.createElement("span");
            inner.textContent = word;
            inner.style.display = "inline-block";
            mask.append(inner);
            overlay.append(mask);
            animations.push(inner.animate([
              { transform: "translateY(105%)" },
              { transform: "translateY(0)" },
            ], { duration: 900, delay: index++ * Math.min(65, 360 / Math.max(1, words.length)), easing: "cubic-bezier(.22,1,.36,1)", fill: "both" }));
          }
          title.style.position = "relative";
          title.style.color = "transparent";
          title.append(overlay);
          const cleanup = () => {
            animations.forEach(animation => animation.cancel());
            overlay.remove();
            title.style.color = color;
            title.style.position = position;
            headingCleanups.delete(title);
          };
          headingCleanups.set(title, cleanup);
          Promise.all(animations.map(animation => animation.finished)).then(cleanup).catch(() => {});
          continue;
        }
        const heading = entry.target.matches("h2,h3");
        // Reveal the existing text without splitting DOM nodes: translations,
        // screen-reader output and responsive line wrapping remain intact.
        active.set(entry.target, entry.target.animate([
          { opacity: 0, transform: `translateY(${heading ? 38 : 22}px)`, clipPath: "inset(0 0 100% 0)" },
          { opacity: 1, transform: "translateY(0)", clipPath: "inset(0 0 0% 0)" },
        ], {
          duration: heading ? 900 : 820,
          delay: heading ? 0 : 120,
          easing: "cubic-bezier(.22,1,.36,1)",
          fill: "backwards",
        }));
      }
    }, { threshold: 0 });
    // Re-arm only after leaving a wider boundary, not while text moves at the edge.
    const resetObserver = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) continue;
        visible.delete(entry.target);
        active.get(entry.target)?.cancel();
        active.delete(entry.target);
        headingCleanups.get(entry.target)?.();
      }
    }, { rootMargin: "64px 0px" });
    items.forEach((item) => observer.observe(item));
    items.forEach((item) => resetObserver.observe(item));
    const onCabinVisibility = () => {
      items.forEach(item => {
        if (!item.closest("#vpn-intro")) return;
        active.get(item)?.cancel();
        active.delete(item);
        headingCleanups.get(item)?.();
        visible.delete(item);
        // Recheck intersection once the cabin is gone, even if scroll position is pinned.
        observer.unobserve(item);
        observer.observe(item);
      });
    };
    window.addEventListener("crowvpn:cabin-visibility", onCabinVisibility);
    const stop = () => {
      observer.disconnect();
      window.removeEventListener("crowvpn:cabin-visibility", onCabinVisibility);
      resetObserver.disconnect();
      active.forEach((animation) => animation.cancel());
      active.clear();
      headingCleanups.forEach(cleanup => cleanup());
    };
    const onPreference = () => { if (preference.matches) stop(); };
    const onResize = () => { headingCleanups.forEach(cleanup => cleanup()); };
    preference.addEventListener("change", onPreference);
    window.addEventListener("resize", onResize);
    return () => { stop(); preference.removeEventListener("change", onPreference); window.removeEventListener("resize", onResize); };
  }, []);
  return null;
}
