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
  align?: "start" | "end";
  onClick?: (e: MouseEvent) => void;
}

function segmentText(value: string) {
  if (typeof Intl !== "undefined" && Intl.Segmenter) {
    return Array.from(new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(value), (s) => s.segment);
  }
  return Array.from(value);
}

// Autoplay adaptation: identical-color glyph copies roll on mount, once.
// CSS owns playback; there are no hover listeners, timers or render loops.
export const TextReveal = memo(function TextReveal({
  text, as: Component = "span", href, target, className = "", style,
  fontSize = "inherit", staggerDelay = 75, duration = 650, delay = 250,
  easing = "cubic-bezier(.22,1,.36,1)", color = "inherit", direction = "up",
  align = "start", onClick,
}: TextRevealProps) {
  const lines = useMemo(() => {
    let offset = 0;
    return text.split("\n").map((line) => {
      const chars = segmentText(line).map((char, index) => ({ char, index: offset + index }));
      offset += chars.length;
      return chars;
    });
  }, [text]);
  const sign = direction === "up" ? 1 : -1;
  const linkProps = Component === "a" ? { href, target, rel: target === "_blank" ? "noopener noreferrer" : undefined } : {};

  return (
    <Component
      {...linkProps}
      className={`${styles.root} ${className}`}
      style={{ fontSize, color, ...style }}
      onClick={onClick}
      data-no-translate
    >
      <span className={styles.accessible}>{text}</span>
      <span
        className={`${styles.viewport} ${align === "end" ? styles.viewportEnd : ""}`}
        aria-hidden="true"
      >
        {lines.map((chars, lineIndex) => (
          <span key={`${text}-line-${lineIndex}`} className={styles.line}>
            {chars.map(({ char, index }) => (
              <span
                key={`${text}-${index}`}
                className={styles.char}
                style={{
                  "--cascade-end": `${-sign * 1.2}em`,
                  textShadow: `0 ${sign * 1.2}em currentColor`,
                  animationDuration: `${duration}ms`,
                  animationDelay: `${delay + index * staggerDelay}ms`,
                  animationTimingFunction: easing,
                } as CSSProperties}
              >
                {char === " " ? "\u00a0" : char}
              </span>
            ))}
          </span>
        ))}
      </span>
    </Component>
  );
});
