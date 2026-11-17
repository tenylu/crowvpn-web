"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ModalLayer } from "@/components/ModalLayer";
import { openZohoSalesiqChat } from "@/lib/zoho-salesiq";
import {
  TEAM_MAX_SEATS,
  TEAM_MIN_SEATS,
  clampTeamSeats,
  crowmeshBuyUrl,
  teamMonthlyEquivalentCny,
  teamPlanOffers,
  teamYearUnitCny,
} from "./pricing-data";

type TeamOffer = (typeof teamPlanOffers)[number];

function CheckMark() {
  return (
    <svg className="h-5 w-5 shrink-0 text-[#171717]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function HighlightLabel({ text }: { text: string }) {
  const parts = text.split(/(\d+(?:\.\d+)?)/);
  return (
    <>
      {parts.map((part, i) =>
        /^\d+(?:\.\d+)?$/.test(part) ? (
          <strong key={i} className="font-semibold text-[#171717]">
            {part}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

function FeatureList({ audience, features }: { audience: string; features: string[] }) {
  return (
    <div className="mt-5 border-t border-[var(--border)] pt-5">
      <p className="text-sm font-semibold text-[#171717] sm:text-base">{audience}</p>
      <ul className="mt-4 space-y-4">
        {features.map((line) => (
          <li key={line} className="flex items-start gap-3 text-sm text-[#5c5c5c]">
            <span className="mt-0.5 shrink-0">
              <CheckMark />
            </span>
            <span className="min-w-0 flex-1 text-left leading-snug">
              <HighlightLabel text={line} />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TeamOfferCard({
  offer,
  formatPrice,
}: {
  offer: TeamOffer;
  formatPrice: (cny: number) => string;
}) {
  const [seats, setSeats] = useState(TEAM_MIN_SEATS);
  const yearUnit = teamYearUnitCny(offer.id);
  const monthEquiv = teamMonthlyEquivalentCny(offer.id);
  const showStrike = offer.monthlyPriceCny > monthEquiv && monthEquiv > 0;
  const total = yearUnit * seats;
  const checkoutUrl = crowmeshBuyUrl(offer.checkoutPlanId, "12", {
    team: true,
    seats,
  });

  const features = [
    `每人 1份${offer.productName}流量`,
    `${TEAM_MIN_SEATS} 席起，最多 ${TEAM_MAX_SEATS} 席`,
    "中途加席按剩余时间补差价",
    "专属团队成员管理统计",
  ];

  return (
    <article className="flex h-full min-w-0 flex-col rounded-2xl border border-[var(--border)] bg-white p-5 text-left shadow-[var(--shadow-card)] sm:p-6">
      <div className="flex flex-1 flex-col">
        <div className="mx-auto flex h-28 w-full max-w-[220px] items-center justify-center">
          <Image
            src={offer.coverSrc}
            alt=""
            width={220}
            height={112}
            className="h-28 w-auto max-w-full object-contain"
            unoptimized
          />
        </div>
        <h3 className="mt-3 text-xl font-semibold tracking-tight text-[#171717] sm:text-2xl">{offer.title}</h3>
        <p className="mt-6 flex flex-wrap items-baseline gap-2">
          <span data-no-translate className="text-3xl font-semibold tracking-tight text-[#171717] sm:text-4xl">
            {formatPrice(monthEquiv)}
          </span>
          {showStrike ? (
            <span data-no-translate className="text-lg text-[#a3a3a3] line-through">
              {formatPrice(offer.monthlyPriceCny)}
            </span>
          ) : null}
          <span className="text-sm text-[#5c5c5c]">/席位/月</span>
        </p>
        <div className="mt-2 space-y-1 text-sm leading-relaxed text-[var(--muted)]">
          <p data-no-translate>按年计费，每席 {formatPrice(yearUnit)}/年</p>
          <p>每人 {offer.trafficGb} GB，与该套餐相同</p>
        </div>

        <div className="mt-6 flex flex-nowrap items-center justify-between gap-2">
          <div className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#f0f2f5] px-1.5 py-1.5">
            <button
              type="button"
              aria-label="减少席位"
              disabled={seats <= TEAM_MIN_SEATS}
              onClick={() => setSeats((n) => clampTeamSeats(n - 1))}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-base text-[#171717] transition disabled:cursor-not-allowed disabled:opacity-35"
            >
              −
            </button>
            <span className="whitespace-nowrap px-0.5 text-center text-sm font-semibold text-[#171717]">
              {seats} 席位
            </span>
            <button
              type="button"
              aria-label="增加席位"
              disabled={seats >= TEAM_MAX_SEATS}
              onClick={() => setSeats((n) => clampTeamSeats(n + 1))}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-base text-[#171717] transition disabled:cursor-not-allowed disabled:opacity-35"
            >
              +
            </button>
          </div>
          <p className="shrink-0 whitespace-nowrap text-base font-semibold text-[#171717] sm:text-lg">
            <span className="mr-1 text-xs font-medium text-[var(--muted)] sm:mr-1.5 sm:text-sm">合计</span>
            <span data-no-translate>{formatPrice(total)}</span>
          </p>
        </div>

        <div className="mt-auto pt-4">
          <a
            href={checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center rounded-full bg-[var(--accent-primary)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-primary-hover)]"
          >
            开通团队版
          </a>
        </div>
      </div>

      <FeatureList audience={offer.audience} features={features} />
    </article>
  );
}

function TeamSalesCard({ onContact }: { onContact: () => void }) {
  const features = ["定制节点与专线", "按使用场景单独报价", "专人协助开通", "专属团队成员管理统计"];

  return (
    <article className="flex h-full min-w-0 flex-col rounded-2xl border border-[var(--border)] bg-white p-5 text-left shadow-[var(--shadow-card)] sm:p-6">
      <div className="flex flex-1 flex-col">
        <div className="mx-auto flex h-28 w-full max-w-[220px] items-center justify-center">
          <Image
            src="/images/team/img-team-sales.png"
            alt=""
            width={220}
            height={112}
            className="h-28 w-auto max-w-full object-contain"
            unoptimized
          />
        </div>
        <p className="mt-3 text-2xl font-semibold tracking-tight text-[#171717] sm:text-3xl">10 人以上</p>
        <h3 className="mt-2 text-xl font-semibold tracking-tight text-[#171717] sm:text-2xl">联系销售</h3>
        <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">定制节点、专线套餐，按团队规模单独报价。</p>
        <div className="mt-auto pt-4">
          <button
            type="button"
            onClick={() => {
              onContact();
              openZohoSalesiqChat();
            }}
            className="inline-flex w-full items-center justify-center rounded-full border border-[#171717] bg-white px-6 py-3 text-sm font-semibold text-[#171717] transition hover:bg-black/[0.04]"
          >
            联系销售
          </button>
        </div>
      </div>
      <FeatureList audience="适用于更大的团队" features={features} />
    </article>
  );
}

export function TeamPlanModal({
  open,
  onClose,
  formatPrice,
}: {
  open: boolean;
  onClose: () => void;
  formatPrice: (cny: number) => string;
}) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
    };
  }, [onClose, open]);

  if (!open) return null;

  return (
    <ModalLayer
      className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-black/35 px-4 py-4 backdrop-blur-sm sm:items-center sm:py-6"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="team-plan-title"
        className="max-h-[calc(100dvh-2rem)] w-full max-w-6xl overflow-y-auto rounded-[24px] border border-[var(--border)] bg-white shadow-2xl sm:rounded-[28px]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] px-6 py-5 sm:px-8">
          <h2 id="team-plan-title" className="text-2xl font-semibold tracking-tight text-[#171717] sm:text-3xl">
            团队版
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f0f2f5] text-[#8b8f96] transition hover:bg-[#e8ebef] hover:text-[#171717]"
            aria-label="关闭弹窗"
          >
            <span aria-hidden className="text-3xl font-light leading-none">
              ×
            </span>
          </button>
        </div>

        <div className="grid items-stretch gap-4 px-6 py-6 sm:grid-cols-2 sm:px-8 lg:grid-cols-3 lg:gap-5">
          {teamPlanOffers.map((offer) => (
            <TeamOfferCard key={offer.id} offer={offer} formatPrice={formatPrice} />
          ))}
          <TeamSalesCard onContact={onClose} />
        </div>

        <p className="px-6 pb-6 text-xs leading-relaxed text-[var(--muted)] sm:px-8">
          团队版按年开通，每人一份对应套餐流量。选择席位后将跳转用户面板完成支付。
        </p>
      </div>
    </ModalLayer>
  );
}
