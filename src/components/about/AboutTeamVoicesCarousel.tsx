"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { AboutTeamVoice } from "./about-team-voices-data";

function CarouselArrow({ dir, onClick, disabled }: { dir: "prev" | "next"; onClick: () => void; disabled: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "prev" ? "上一条心声" : "下一条心声"}
      className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/15 disabled:pointer-events-none disabled:opacity-35"
    >
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        {dir === "prev" ? (
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
        )}
      </svg>
    </button>
  );
}

export function AboutTeamVoicesCarousel({ items }: { items: readonly AboutTeamVoice[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const measureStep = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const slide = el.querySelector<HTMLElement>("[data-voice-slide]");
    if (slide) {
      const gapPx = parseFloat(getComputedStyle(el).columnGap || getComputedStyle(el).gap || "0") || 20;
      setStep(slide.offsetWidth + gapPx);
    }
  }, []);

  const updateEdges = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const gapPx = parseFloat(getComputedStyle(el).columnGap || getComputedStyle(el).gap || "0") || 20;
    const slide = el.querySelector<HTMLElement>("[data-voice-slide]");
    const slideStep = slide ? slide.offsetWidth + gapPx : el.clientWidth;
    const index = slideStep <= 0 ? 0 : Math.round(el.scrollLeft / slideStep);
    setActiveIndex(Math.min(Math.max(index, 0), items.length - 1));
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(max <= 4 || el.scrollLeft >= max - 4);
  }, [items.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    measureStep();
    updateEdges();
    el.addEventListener("scroll", updateEdges, { passive: true });
    const ro = new ResizeObserver(() => {
      measureStep();
      updateEdges();
    });
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateEdges);
      ro.disconnect();
    };
  }, [items, measureStep, updateEdges]);

  const scrollByDir = (dir: -1 | 1) => {
    const el = scrollRef.current;
    if (!el || step <= 0) return;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  const scrollToIndex = (index: number) => {
    const el = scrollRef.current;
    if (!el || step <= 0) return;
    el.scrollTo({ left: index * step, behavior: "smooth" });
  };

  return (
    <div className="mt-12" aria-roledescription="carousel" aria-label="团队心声轮播">
      <div
        ref={scrollRef}
        className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth overscroll-x-contain sm:gap-6 [-webkit-overflow-scrolling:touch]"
      >
        {items.map((voice) => (
          <figure
            key={voice.id}
            data-voice-slide
            className="grid w-full min-w-full shrink-0 basis-full snap-start snap-always grid-cols-1 gap-8 overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.06] p-8 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-10 sm:rounded-[32px] sm:p-10 lg:p-12"
          >
            <blockquote className="min-w-0 text-lg leading-relaxed text-white/90 sm:text-xl">
              <span className="mb-2 block text-[76px] leading-none text-[var(--accent-primary)]" aria-hidden>
                &ldquo;
              </span>
              {voice.quote}
            </blockquote>
            <figcaption className="flex shrink-0 flex-col items-center gap-4 text-center sm:min-w-[11rem]">
              <div className="relative h-36 w-36 overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/15 sm:h-40 sm:w-40">
                <Image
                  src={voice.photo}
                  alt={voice.name}
                  fill
                  className="object-cover object-top"
                  sizes="160px"
                />
              </div>
              <div>
                <p className="text-lg font-semibold tracking-tight text-white">{voice.name}</p>
                <p className="mt-1 text-sm text-white/65">{voice.role}</p>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2" role="tablist" aria-label="选择心声">
          {items.map((voice, i) => (
            <button
              key={voice.id}
              type="button"
              role="tab"
              aria-selected={activeIndex === i}
              aria-label={`${voice.name}, ${voice.role}`}
              onClick={() => scrollToIndex(i)}
              className={`h-2 rounded-full transition-all ${
                activeIndex === i ? "w-8 bg-[var(--accent-primary)]" : "w-2 bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <CarouselArrow dir="prev" onClick={() => scrollByDir(-1)} disabled={atStart} />
          <CarouselArrow dir="next" onClick={() => scrollByDir(1)} disabled={atEnd} />
        </div>
      </div>
    </div>
  );
}
