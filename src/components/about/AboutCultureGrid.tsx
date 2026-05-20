"use client";

import {
  Brightness,
  BuildingOne,
  Like,
  MedalOne,
  Peoples,
  TrendingUp,
} from "@icon-park/react";
import Image from "next/image";
import { Fragment, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import {
  aboutCultureColumns,
  cultureSectionCopy,
  type AboutCultureColumn,
  type AboutCultureImageItem,
  type AboutCultureTextItem,
  type CultureIconKey,
} from "./about-culture-data";

const colWidthClass = {
  title: "w-[min(78vw,300px)] sm:w-[300px]",
  narrow: "w-[min(72vw,272px)] sm:w-[272px]",
  medium: "w-[min(76vw,292px)] sm:w-[292px]",
  wide: "w-[min(84vw,340px)] sm:w-[340px]",
} as const;

const aspectClass = {
  landscape: "aspect-[16/10]",
  portrait: "aspect-[4/5]",
  tall: "aspect-[3/4]",
} as const;

function ScrollArrow({ dir, onClick, disabled }: { dir: "prev" | "next"; onClick: () => void; disabled: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "prev" ? "向左滚动" : "向右滚动"}
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

const cultureIconProps = {
  theme: "outline" as const,
  size: "28" as const,
  fill: "#fe405b",
  strokeWidth: 2.8,
};

function CultureIcon({ name }: { name: CultureIconKey }) {
  const icons: Record<CultureIconKey, ReactNode> = {
    growth: <TrendingUp {...cultureIconProps} />,
    balance: <Brightness {...cultureIconProps} />,
    culture: <Peoples {...cultureIconProps} />,
    together: <Like {...cultureIconProps} />,
    office: <BuildingOne {...cultureIconProps} />,
  };
  return <span className="inline-flex shrink-0 [&_svg]:block">{icons[name]}</span>;
}

function CultureTextCard({ item }: { item: AboutCultureTextItem }) {
  return (
    <div className="relative overflow-visible">
      <div className="relative overflow-visible rounded-[28px] border border-white/12 bg-white/[0.03] p-6 sm:rounded-[32px] sm:p-7">
        {item.badge ? (
          <div
            className="absolute -right-3 -top-3 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent-primary)] shadow-lg sm:-right-4 sm:-top-4 sm:h-14 sm:w-14"
            aria-hidden
          >
            <MedalOne theme="outline" size="28" fill="#ffffff" strokeWidth={2.6} />
          </div>
        ) : null}
        <CultureIcon name={item.icon} />
        <h3 className="mt-4 text-xl font-semibold leading-snug text-white sm:text-2xl">{item.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-white/65 sm:text-[15px]">{item.body}</p>
      </div>
    </div>
  );
}

function CultureImageCard({ item, fillCell }: { item: AboutCultureImageItem; fillCell?: boolean }) {
  return (
    <div
      className={`relative w-full overflow-hidden rounded-[28px] bg-[#1a1a1a] sm:rounded-[32px] ${
        fillCell ? "h-full min-h-0" : aspectClass[item.aspect]
      }`}
    >
      <Image src={item.photo} alt={item.alt} fill className="object-cover object-center" sizes="292px" />
    </div>
  );
}

function CultureCell({
  item,
  fillCell,
}: {
  item: AboutCultureTextItem | AboutCultureImageItem;
  fillCell?: boolean;
}) {
  return item.kind === "text" ? <CultureTextCard item={item} /> : <CultureImageCard item={item} fillCell={fillCell} />;
}

function gridCellWrapperClass(width: AboutCultureColumn["width"], isImage: boolean, hasBadge?: boolean) {
  const overflow = hasBadge ? " overflow-visible" : "";
  return `${colWidthClass[width]}${isImage ? " h-full min-h-0 self-stretch" : ""}${overflow}`;
}

function isSingleImageColumn(column: AboutCultureColumn) {
  const hasTop = Boolean(column.top);
  const hasBottom = Boolean(column.bottom);
  return (
    (hasTop && column.top!.kind === "image" && !hasBottom) ||
    (hasBottom && column.bottom!.kind === "image" && !hasTop)
  );
}

function CultureVerticalImageCell({ column, item }: { column: AboutCultureColumn; item: AboutCultureImageItem }) {
  return (
    <div
      className={`relative row-span-2 min-h-0 self-stretch overflow-hidden rounded-[28px] bg-[#1a1a1a] sm:rounded-[32px] ${colWidthClass[column.width]}`}
    >
      <Image src={item.photo} alt={item.alt} fill className="object-cover object-center" sizes="292px" />
    </div>
  );
}

function renderCultureGridCells(columns: readonly AboutCultureColumn[]) {
  return columns.map((column) => {
    if (isSingleImageColumn(column)) {
      const item = (column.top ?? column.bottom) as AboutCultureImageItem;
      return <CultureVerticalImageCell key={column.id} column={column} item={item} />;
    }

    return (
      <Fragment key={column.id}>
        {column.top ? (
          <div
            className={gridCellWrapperClass(
              column.width,
              column.top.kind === "image",
              column.top.kind === "text" && column.top.badge,
            )}
          >
            <CultureCell item={column.top} fillCell={column.top.kind === "image"} />
          </div>
        ) : null}
        {column.bottom ? (
          <div
            className={gridCellWrapperClass(
              column.width,
              column.bottom.kind === "image",
              column.bottom.kind === "text" && column.bottom.badge,
            )}
          >
            <CultureCell item={column.bottom} fillCell={column.bottom.kind === "image"} />
          </div>
        ) : null}
      </Fragment>
    );
  });
}

export function AboutCultureGrid({ columns = aboutCultureColumns }: { columns?: readonly AboutCultureColumn[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

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
    updateEdges();
    el.addEventListener("scroll", updateEdges, { passive: true });
    const ro = new ResizeObserver(updateEdges);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateEdges);
      ro.disconnect();
    };
  }, [columns, updateEdges]);

  const scrollByDir = (dir: -1 | 1) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.round(el.clientWidth * 0.72), behavior: "smooth" });
  };

  return (
    <div className="mt-0" aria-label="职场氛围">
      <div className="mb-8 max-w-md md:hidden">
        <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{cultureSectionCopy.title}</h2>
        <p className="mt-4 text-base leading-relaxed text-white/65 sm:text-lg">{cultureSectionCopy.subtitle}</p>
      </div>

      <div
        ref={scrollRef}
        className="no-scrollbar -mx-6 overflow-x-auto overflow-y-visible scroll-smooth overscroll-x-contain px-6 pb-2 pt-4 [-webkit-overflow-scrolling:touch] lg:mx-0 lg:px-0"
      >
        <div className="grid w-max auto-cols-max grid-flow-col grid-rows-[auto_auto] items-stretch gap-x-5 gap-y-5 overflow-visible sm:gap-x-6 sm:gap-y-6 lg:gap-x-7 lg:gap-y-7">
          <div className={`hidden flex-col justify-center md:flex ${colWidthClass.title} row-span-2`}>
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
              {cultureSectionCopy.title}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/65 sm:text-lg">{cultureSectionCopy.subtitle}</p>
          </div>

          {renderCultureGridCells(columns)}

          <div className="row-span-2 w-4 shrink-0 sm:w-6" aria-hidden />
        </div>
      </div>

      <div className="mt-8 flex justify-end gap-2">
        <ScrollArrow dir="prev" onClick={() => scrollByDir(-1)} disabled={atStart} />
        <ScrollArrow dir="next" onClick={() => scrollByDir(1)} disabled={atEnd} />
      </div>
    </div>
  );
}
