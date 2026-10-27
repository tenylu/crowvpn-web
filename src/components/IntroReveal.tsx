"use client";

import { useEffect, useRef, type ReactNode } from "react";
import styles from "./IntroReveal.module.css";

/** Progressive enhancement: content stays visible without JS or motion support. */
export function IntroReveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!root || preference.matches || !("IntersectionObserver" in window)) return;

    // Text is animated separately by ContentScrollReveal, avoiding double motion.
    const items = Array.from(root.children).slice(1) as HTMLElement[];
    const animations = new Map<HTMLElement, Animation>();
    items.forEach((item) => { item.dataset.revealPending = "true"; });
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const item = entry.target as HTMLElement;
        if (!entry.isIntersecting) {
          animations.get(item)?.cancel();
          animations.delete(item);
          item.dataset.revealPending = "true";
          return;
        }
        if (!item.dataset.revealPending) return;
        delete item.dataset.revealPending;
        // Observe each column separately so mobile images reveal when actually visible.
        animations.set(item, item.animate([
          { opacity: 0, transform: "translateY(32px)" },
          { opacity: 1, transform: "translateY(0)" },
        ], {
          duration: 760,
          delay: window.matchMedia("(min-width: 1024px)").matches ? 180 : 0,
          easing: "cubic-bezier(.22,1,.36,1)",
          fill: "backwards",
        }));
      });
    }, { threshold: 0 });
    items.forEach((item) => observer.observe(item));

    const showImmediately = () => {
      if (!preference.matches) return;
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
      items.forEach((item) => { delete item.dataset.revealPending; });
    };
    preference.addEventListener("change", showImmediately);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", showImmediately);
      animations.forEach((animation) => animation.cancel());
      items.forEach((item) => { delete item.dataset.revealPending; });
    };
  }, []);

  return <div ref={ref} className={`${styles.reveal} ${className ?? ""}`}>{children}</div>;
}
