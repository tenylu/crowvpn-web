"use client";

import Image from "next/image";
import { getBrandLogoSrc, getTrustPack, type LocalizedReview } from "@/data/localizedTrust";
import { useLocaleCode } from "@/hooks/useLocaleCode";

const masonryBase = "w-full break-inside-avoid";

type ReviewItem = LocalizedReview;
type MasonryKind = "elevated" | "pane" | "spotlight";

function BrandLogoMark({ item }: { item: ReviewItem }) {
  return (
    <span className="flex h-7 shrink-0 items-center justify-end sm:h-8">
      <Image
        src={getBrandLogoSrc(item.brand)}
        alt={item.orgLine}
        width={132}
        height={36}
        className="h-6 w-auto max-w-[6.5rem] object-contain object-right"
        unoptimized
      />
    </span>
  );
}

function ReviewCardElevated({
  item,
  variant,
  gapClass,
  shellClass = "",
}: {
  item: ReviewItem;
  variant: 0 | 1 | 2;
  gapClass: string;
  shellClass?: string;
}) {
  const pad = variant === 1 ? "p-7 sm:p-8" : variant === 2 ? "p-5 sm:p-6" : "p-6 sm:p-7";
  const radiusDefault = variant === 1 ? "rounded-[22px]" : "rounded-2xl";

  return (
    <article
      className={`${gapClass} ${masonryBase} ${shellClass || radiusDefault} ${pad} bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-black/[0.04]`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="font-semibold text-[#111827]">{item.name}</span>
          <p className="mt-1 text-xs font-medium text-[#6b7280]">{item.orgLine}</p>
        </div>
        <BrandLogoMark item={item} />
      </div>
      <p className="mt-4 text-sm leading-relaxed text-[#4b5563] sm:text-base">{item.quote}</p>
    </article>
  );
}

function ReviewCardPane({
  item,
  variant,
  gapClass,
  shellClass = "",
}: {
  item: ReviewItem;
  variant: 0 | 1 | 2;
  gapClass: string;
  shellClass?: string;
}) {
  const pad = variant === 1 ? "p-7 sm:p-8" : variant === 2 ? "p-5 sm:p-6" : "p-6 sm:p-7";

  return (
    <article
      className={`${gapClass} ${masonryBase} ${shellClass || "rounded-2xl"} ${pad} border border-[var(--border)] bg-[#eef2f6]/90 shadow-[0_4px_18px_rgba(15,23,42,0.05)]`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="font-semibold text-[#111827]">{item.name}</span>
          <p className="mt-1 text-xs font-medium text-[#6b7280]">{item.orgLine}</p>
        </div>
        <BrandLogoMark item={item} />
      </div>
      <p className="mt-4 text-sm leading-relaxed text-[#374151] sm:text-base">{item.quote}</p>
    </article>
  );
}

function SpotlightReviewCard({
  item,
  gapClass,
  shellClass,
}: {
  item: ReviewItem;
  gapClass: string;
  shellClass: string;
}) {
  return (
    <article
      className={`${gapClass} ${masonryBase} ${shellClass} border border-[var(--border)] p-7 shadow-[0_12px_40px_rgba(15,23,42,0.08)] sm:p-9`}
    >
      <span className="font-serif text-5xl leading-none text-[#d1d5db] sm:text-6xl" aria-hidden>
        &ldquo;
      </span>
      <p className="mt-2 text-base font-semibold leading-snug tracking-tight text-[#111827] sm:text-lg">
        {item.quote}
      </p>
      <div className="mt-8 flex items-center justify-between gap-3 border-t border-[#e5e7eb] pt-6">
        <div>
          <p className="text-sm font-semibold text-[#111827]">{item.name}</p>
          <p className="mt-0.5 text-xs text-[#6b7280]">{item.orgLine}</p>
        </div>
        <BrandLogoMark item={item} />
      </div>
    </article>
  );
}

const MASONRY_SEQUENCE: Array<{
  index: number;
  variant: 0 | 1 | 2;
  kind: MasonryKind;
  gapClass: string;
  shellClass?: string;
}> = [
  { index: 1, variant: 0, kind: "spotlight", gapClass: "mb-7", shellClass: "rounded-[26px] bg-gradient-to-br from-white to-[#eef3f8]" },
  { index: 5, variant: 2, kind: "elevated", gapClass: "mb-10 sm:mb-11", shellClass: "rounded-[18px]" },
  { index: 6, variant: 1, kind: "pane", gapClass: "mb-5", shellClass: "rounded-3xl" },
  { index: 2, variant: 2, kind: "elevated", gapClass: "mb-9" },
  { index: 0, variant: 0, kind: "spotlight", gapClass: "mb-6 sm:mb-8", shellClass: "rounded-[22px] bg-gradient-to-b from-white via-[#f7fafc] to-[#e4ecf4]" },
  { index: 7, variant: 1, kind: "pane", gapClass: "mb-8", shellClass: "rounded-xl" },
  { index: 3, variant: 0, kind: "elevated", gapClass: "mb-5 sm:mb-6", shellClass: "rounded-3xl" },
  { index: 4, variant: 2, kind: "spotlight", gapClass: "mb-10", shellClass: "rounded-[24px] bg-gradient-to-br from-[#fcfdff] to-[#e8eef5]" },
];

function MasonryCard({ entry, reviews }: { entry: (typeof MASONRY_SEQUENCE)[number]; reviews: ReviewItem[] }) {
  const item = reviews[entry.index]!;
  const shell = entry.shellClass;

  switch (entry.kind) {
    case "elevated":
      return (
        <ReviewCardElevated
          item={item}
          variant={entry.variant}
          gapClass={entry.gapClass}
          shellClass={shell}
        />
      );
    case "pane":
      return <ReviewCardPane item={item} variant={entry.variant} gapClass={entry.gapClass} shellClass={shell} />;
    case "spotlight":
      return (
        <SpotlightReviewCard
          item={item}
          gapClass={entry.gapClass}
          shellClass={shell ?? "rounded-[24px] bg-gradient-to-br from-white to-[#f0f4f8]"}
        />
      );
  }
}

export function TestimonialsSection() {
  const locale = useLocaleCode();
  const { reviews } = getTrustPack(locale);
  const masonryEntries = MASONRY_SEQUENCE.filter((entry) => entry.index < reviews.length);

  return (
    <section id="testimonials" className="scroll-mt-24 bg-[#f3f7fa] py-16 sm:py-20">
      <div className="mx-auto max-w-[var(--page-max)] px-6 lg:px-10">
        <h2 className="text-center text-3xl font-semibold tracking-tight text-[#111827] sm:text-4xl">
          用户对 CrowVPN 的评价
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-base text-[#4b5563] sm:text-lg">
          不妨了解其他用户对 CrowVPN 的评价如何！
        </p>

        <div className="mt-12 columns-1 [column-gap:1.5rem] md:columns-2 lg:columns-4" data-no-translate>
          {masonryEntries.map((entry, i) => (
            <MasonryCard key={`${reviews[entry.index]!.name}-${i}`} entry={entry} reviews={reviews} />
          ))}
        </div>
      </div>
    </section>
  );
}
