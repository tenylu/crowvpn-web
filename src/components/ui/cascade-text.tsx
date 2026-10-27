"use client";

import { memo, useMemo, type ElementType, type CSSProperties, type MouseEvent } from "react";
import styles from "./cascade-text.module.css";

export interface TextRevealProps {
  text: string;
  as?: ElementType;
  href?: string;
  target?: string;
  className?: string;
  style?: CSSProperties;
  fontSize?: string;
  staggerDelay?: number;
  duration?: number;
  delay?: number;
  easing?: string;
  color?: string;
  direction?: "up" | "down";
  onClick?: (e: MouseEvent) => void;
}

// Autoplay adaptation: identical-color glyph copies roll on mount, once.
// CSS owns playback; there are no hover listeners, timers or render loops.
export const TextReveal = memo(function TextReveal({
  text, as: Component = "span", href, target, className = "", style,
  fontSize = "inherit", staggerDelay = 75, duration = 650, delay = 250,
  easing = "cubic-bezier(.22,1,.36,1)", color = "inherit", direction = "up", onClick,
}: TextRevealProps) {
  const chars = useMemo(() => {
    if (typeof Intl !== "undefined" && Intl.Segmenter) {
      return Array.from(new Intl.Segmenter("zh", { granularity: "grapheme" }).segment(text), s => s.segment);
    }
    return Array.from(text);
  }, [text]);
  const sign = direction === "up" ? 1 : -1;
  const linkProps = Component === "a" ? { href, target, rel: target === "_blank" ? "noopener noreferrer" : undefined } : {};
  return (
    <Component {...linkProps} className={`${styles.root} ${className}`} style={{ fontSize, color, ...style }} onClick={onClick}>
      <span className={styles.accessible}>{text}</span>
      <span className={styles.viewport} aria-hidden="true">
        {chars.map((char, i) => (
          <span key={`${text}-${i}`} className={styles.char} style={{
            "--cascade-end": `${-sign * 1.2}em`,
            textShadow: `0 ${sign * 1.2}em currentColor`,
            animationDuration: `${duration}ms`,
            animationDelay: `${delay + i * staggerDelay}ms`,
            animationTimingFunction: easing,
          } as CSSProperties}>{char === " " ? "\u00a0" : char}</span>
        ))}
      </span>
    </Component>
  );
});
