"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { aboutTimelineCoverAspectRatio, type AboutMilestone } from "./about-milestones-data";

const columnW = "w-[min(82vw,280px)] sm:w-[260px] lg:w-[272px]";

const cardClass =
  `data-milestone-card flex ${columnW} shrink-0 flex-col overflow-visible rounded-[24px] border border-[var(--border)] bg-white shadow-[var(--shadow-card)] sm:rounded-3xl`;

/** 白色内容区底边中点的「气泡尾」，参考图：与卡片一体，非独立箭头 */
function MilestoneCardBody({ title, body }: { title: string; body: string }) {
  return (
    <div
      className={[
        "relative flex flex-1 flex-col rounded-b-[22px] bg-white p-5 sm:rounded-b-3xl sm:p-6",
        /* 气泡尾：双层三角，外圈贴近卡片描边 */
        "before:pointer-events-none before:absolute before:left-1/2 before:top-full before:z-[1] before:size-0 before:-translate-x-1/2",
        "before:border-l-[9px] before:border-r-[9px] before:border-t-[10px] before:border-l-transparent before:border-r-transparent before:border-t-[#e5e7eb]",
        "after:pointer-events-none after:absolute after:left-1/2 after:top-full after:z-[2] after:size-0 after:-translate-x-1/2",
        "after:border-l-[8px] after:border-r-[8px] after:border-t-[9px] after:border-l-transparent after:border-r-transparent after:border-t-white",
      ].join(" ")}
    >
      <h3 className="text-base font-semibold text-[#171717] sm:text-lg">{title}</h3>
      <p className="mt-2.5 flex-1 text-sm leading-relaxed text-[var(--muted)] sm:mt-3">{body}</p>
    </div>
  );
}

/** 与原先右侧留白等宽 */
function MilestoneRowEndSpacer() {
  return <div className="w-2 shrink-0 sm:w-4" aria-hidden />;
}

function rubberMagnitude(overflow: number) {
  const a = Math.abs(overflow);
  if (a < 0.5) return 0;
  return Math.min(88, 5.2 * Math.pow(a, 0.68));
}

function rubberOverscrollLeft(desiredScroll: number) {
  if (desiredScroll >= 0) return 0;
  return rubberMagnitude(desiredScroll);
}

function rubberOverscrollRight(desiredScroll: number, max: number) {
  if (desiredScroll <= max) return 0;
  return rubberMagnitude(desiredScroll - max);
}

function ScrollArrow({ dir, onClick, disabled }: { dir: "prev" | "next"; onClick: () => void; disabled: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "prev" ? "上一组" : "下一组"}
      className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--border-strong)] bg-white text-[#171717] transition hover:bg-black/[0.04] disabled:pointer-events-none disabled:opacity-35"
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

export function AboutMilestonesCarousel({ items }: { items: readonly AboutMilestone[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; startScroll: number; pointerId: number } | null>(null);
  const springRafRef = useRef<number | null>(null);
  const elasticRef = useRef(0);

  const [step, setStep] = useState(296);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const applyElastic = useCallback((px: number) => {
    elasticRef.current = px;
    const t = trackRef.current;
    if (!t) return;
    if (px === 0) {
      t.style.transform = "";
      t.style.transition = "";
    } else {
      t.style.transition = "none";
      t.style.transform = `translate3d(${px}px,0,0)`;
    }
  }, []);

  const cancelSpring = useCallback(() => {
    if (springRafRef.current != null) {
      cancelAnimationFrame(springRafRef.current);
      springRafRef.current = null;
    }
  }, []);

  const springElasticToZero = useCallback(
    (onDone?: () => void) => {
      cancelSpring();
      const start = elasticRef.current;
      if (Math.abs(start) < 0.25) {
        applyElastic(0);
        onDone?.();
        return;
      }
      const t0 = performance.now();
      const dur = 460;
      const tick = (now: number) => {
        const u = Math.min(1, (now - t0) / dur);
        const eased = 1 - Math.pow(1 - u, 3);
        applyElastic(start * (1 - eased));
        if (u < 1) {
          springRafRef.current = requestAnimationFrame(tick);
        } else {
          applyElastic(0);
          springRafRef.current = null;
          onDone?.();
        }
      };
      springRafRef.current = requestAnimationFrame(tick);
    },
    [applyElastic, cancelSpring],
  );

  const updateEdges = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(max <= 4 || el.scrollLeft >= max - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const measure = () => {
      const row = el.querySelector("[data-milestone-cards]");
      const card = row?.querySelector("[data-milestone-card]");
      if (row instanceof HTMLElement && card instanceof HTMLElement) {
        const gapPx = parseFloat(getComputedStyle(row).columnGap || getComputedStyle(row).gap || "16") || 16;
        setStep(card.offsetWidth + gapPx);
      }
      updateEdges();
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    el.addEventListener("scroll", updateEdges, { passive: true });
    return () => {
      ro.disconnect();
      el.removeEventListener("scroll", updateEdges);
    };
  }, [items, updateEdges]);

  useEffect(() => () => cancelSpring(), [cancelSpring]);

  const scrollByDir = (dir: -1 | 1) => {
    cancelSpring();
    applyElastic(0);
    scrollRef.current?.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  const endPointerDrag = useCallback(() => {
    dragRef.current = null;
    setIsDragging(false);
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return;
    if (e.button !== 0) return;
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    if (max <= 1) return;
    cancelSpring();
    dragRef.current = { startX: e.clientX, startScroll: el.scrollLeft, pointerId: e.pointerId };
    setIsDragging(true);
    try {
      el.setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const el = scrollRef.current;
    if (!drag || !el || e.pointerId !== drag.pointerId) return;
    if (e.pointerType === "touch") return;
    e.preventDefault();
    const dx = e.clientX - drag.startX;
    const max = el.scrollWidth - el.clientWidth;
    const desired = drag.startScroll - dx;

    if (desired < 0) {
      el.scrollLeft = 0;
      applyElastic(rubberOverscrollLeft(desired));
    } else if (desired > max) {
      el.scrollLeft = max;
      applyElastic(-rubberOverscrollRight(desired, max));
    } else {
      el.scrollLeft = desired;
      applyElastic(0);
    }
    updateEdges();
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || e.pointerId !== drag.pointerId) return;
    try {
      scrollRef.current?.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    const hadElastic = Math.abs(elasticRef.current) > 0.5;
    endPointerDrag();
    if (hadElastic) {
      springElasticToZero(() => updateEdges());
    } else {
      updateEdges();
    }
  };

  return (
    <div className="mt-10 sm:mt-12">
      <div
        ref={scrollRef}
        role="region"
        aria-label="里程碑与时间轴，可横向拖动或使用下方按钮滚动"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className={`no-scrollbar block touch-pan-x overflow-x-auto overflow-y-hidden overscroll-x-contain pb-1 [-webkit-overflow-scrolling:touch] ${
          isDragging ? "cursor-grabbing scroll-auto select-none" : "cursor-grab"
        }`}
      >
        {/* w-max shrink-0：避免被父级 flex 压成视口宽，否则时间轴横线 inset-x-0 只铺满视口，滑到 2022 后像“断线” */}
        <div ref={trackRef} className="relative flex w-max shrink-0 flex-col gap-1 sm:gap-1.5">
          {/* 卡片行（白区底边自带气泡尾，指向下方日期与圆点） */}
          <div data-milestone-cards className="flex gap-4 sm:gap-5 lg:gap-5">
            {items.map((m) => (
              <article key={m.title} className={cardClass}>
                {/* 与素材 2048×1226 同比例，宽度随卡片走、高度等比，object-cover 不再裁掉上下 */}
                <div
                  className="relative w-full shrink-0 overflow-hidden rounded-t-[22px] bg-[#eceef1] sm:rounded-t-3xl"
                  style={{ aspectRatio: aboutTimelineCoverAspectRatio }}
                >
                  <Image
                    src={m.cover}
                    alt={`${m.title}（${m.date}）`}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 640px) min(82vw, 280px), 272px"
                  />
                </div>
                <MilestoneCardBody title={m.title} body={m.body} />
              </article>
            ))}
            <MilestoneRowEndSpacer />
          </div>

          {/* 日期（紧挨气泡尾下方，与参考图一致） */}
          <div data-milestone-timeline-labels className="flex gap-4 sm:gap-5 lg:gap-5">
            {items.map((m) => (
              <div key={`${m.title}-axis`} className={`flex shrink-0 flex-col items-center ${columnW}`}>
                <p className="max-w-[13rem] text-center text-xs font-semibold leading-snug text-[#171717] sm:max-w-none sm:text-sm">
                  {m.date}
                </p>
              </div>
            ))}
            <MilestoneRowEndSpacer />
          </div>

          {/* 圆点 + 连续横线 */}
          <div data-milestone-timeline-dots className="relative flex gap-4 sm:gap-5 lg:gap-5">
            <div
              className="pointer-events-none absolute inset-x-0 top-1/2 z-[1] h-[2px] -translate-y-1/2 rounded-full bg-[#cbd5e1]"
              aria-hidden
            />
            {items.map((m) => (
              <div
                key={`${m.title}-dot`}
                className={`relative z-[2] flex shrink-0 justify-center ${columnW}`}
              >
                <div
                  className="box-border h-[18px] w-[18px] shrink-0 rounded-full border-[3.5px] border-[#171717] bg-[var(--background)] sm:h-5 sm:w-5"
                  aria-hidden
                />
              </div>
            ))}
            <MilestoneRowEndSpacer />
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-2 sm:mt-8">
        <ScrollArrow dir="prev" onClick={() => scrollByDir(-1)} disabled={atStart} />
        <ScrollArrow dir="next" onClick={() => scrollByDir(1)} disabled={atEnd} />
      </div>
    </div>
  );
}
