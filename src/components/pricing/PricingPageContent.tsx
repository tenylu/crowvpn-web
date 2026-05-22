"use client";

import Link from "next/link";
import { Fragment, useLayoutEffect, useRef, useState } from "react";
import { LocalizedImage } from "@/components/LocalizedImage";
import { usePricingLocale } from "@/hooks/usePricingLocale";
import {
  billingToggleOptions,
  crowmeshBuyUrl,
  featureCategories,
  formatPeriodNote,
  monthlyEquivalentCny,
  pricingPlans,
  savingsPercent,
  type BillingPeriod,
  type FeatureValue,
  planOrder,
  whyChooseItems,
} from "./pricing-data";
import { RefundGuaranteeIcon } from "./RefundGuaranteeIcon";

function CheckMark() {
  return (
    <svg className="h-5 w-5 shrink-0 text-[#171717]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function DashMark() {
  return (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center" aria-hidden>
      <span className="block h-0.5 w-4 rounded-full bg-[#c4c8ce]" />
    </span>
  );
}

/** 将文案中的阿拉伯数字片段加粗展示 */
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

function FeatureCell({ value }: { value: FeatureValue }) {
  return <div className="flex justify-center">{value === true ? <CheckMark /> : <DashMark />}</div>;
}

/** 功能对比表 tbody：首列与带 cellText 的单元格统一字号与字重 */
const compareTableBodyText = "text-sm font-normal leading-snug text-[#171717] sm:text-base";

const TRAFFIC_SEGMENTS_TOTAL = 18;

function TrafficSegmentBar({ filled, total = TRAFFIC_SEGMENTS_TOTAL }: { filled: number; total?: number }) {
  const n = Math.max(0, Math.min(total, Math.round(filled)));
  return (
    <div
      className="flex w-full min-w-0 flex-nowrap items-stretch gap-1 sm:gap-1.5"
      role="img"
      aria-label={`${n}/${total}`}
    >
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={`h-2 min-h-0 flex-1 basis-0 rounded-[2px] sm:h-2.5 ${i < n ? "bg-[#171717]" : "bg-[#e8e8e8]"}`}
        />
      ))}
    </div>
  );
}

function BillingToggle({ period, onChange }: { period: BillingPeriod; onChange: (p: BillingPeriod) => void }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const updateIndicator = () => {
      const activeTab = track.querySelector<HTMLButtonElement>(`[data-billing-period="${period}"]`);
      if (!activeTab) return;
      setIndicator({
        left: activeTab.offsetLeft,
        width: activeTab.offsetWidth,
      });
    };

    updateIndicator();
    const frame = requestAnimationFrame(updateIndicator);

    const observer = new ResizeObserver(updateIndicator);
    observer.observe(track);

    window.addEventListener("resize", updateIndicator);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", updateIndicator);
    };
  }, [period]);

  return (
    <div
      ref={trackRef}
      className="relative inline-flex max-w-full flex-nowrap items-stretch overflow-x-auto rounded-full border border-[var(--border-strong)] bg-transparent p-1"
      role="tablist"
      aria-label="计费周期"
    >
      {indicator ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-1 left-0 rounded-full bg-[#171717] transition-[transform,width] duration-300 ease-out will-change-transform"
          style={{
            width: indicator.width,
            transform: `translateX(${indicator.left}px)`,
          }}
        />
      ) : null}
      {billingToggleOptions.map((opt) => {
        const active = period === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            data-billing-period={opt.id}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.id)}
            className={`relative z-10 shrink-0 rounded-full bg-transparent px-3 py-2 text-xs font-semibold transition-colors duration-300 sm:px-5 sm:py-2.5 sm:text-sm ${
              active ? "text-white" : "text-[#5c5c5c] hover:text-[#171717]"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

type PlanCardProps = {
  period: BillingPeriod;
  plan: (typeof pricingPlans)[number];
  formatPrice: (cny: number) => string;
  priceLoading: boolean;
};

function PlanCard({ period, plan, formatPrice, priceLoading }: PlanCardProps) {
  const popular = "popular" in plan && plan.popular;
  const totalCny = plan.pricesCny[period];
  const monthlyCny = monthlyEquivalentCny(totalCny, period);
  const monthlyPrice = formatPrice(monthlyCny);
  const savePct = savingsPercent(plan, period);
  const checkoutUrl = crowmeshBuyUrl(plan.checkoutPlanId, period);

  const cardContent = (
    <>
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-xl font-semibold leading-snug text-[#171717] sm:text-2xl">{plan.productName}</h3>
        {savePct > 0 ? (
          <span className="shrink-0 rounded-full bg-[var(--accent-primary)]/18 px-1.5 py-px text-[10px] font-semibold leading-tight text-[var(--accent-primary)] sm:px-2 sm:py-0.5 sm:text-xs">
            节省 {savePct}%
          </span>
        ) : null}
      </div>
      <p className="mt-2 flex items-baseline gap-1">
        <span
          className={`text-xl font-semibold tracking-tight text-[#171717] sm:text-2xl ${priceLoading ? "animate-pulse opacity-70" : ""}`}
        >
          {monthlyPrice}
        </span>
        <span className="text-xs text-[#5c5c5c] sm:text-sm">/月</span>
      </p>
      <p className="mt-2 text-xs leading-relaxed text-[#8b8f96]">{formatPeriodNote(period, totalCny, formatPrice)}</p>
      <a
        href={checkoutUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`mt-5 inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition ${
          popular
            ? "bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)]"
            : "border border-[#171717] bg-transparent text-[#171717] hover:bg-black/[0.04]"
        }`}
      >
        {plan.cta}
      </a>
      <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-[#8b8f96]">
        <RefundGuaranteeIcon />
        30 天退款保证
      </p>
      <div className="mt-5 border-t border-[var(--border)] pt-5">
        <ul className="hidden space-y-4 sm:block">
          {plan.highlights.map((item) => {
            const showTrafficBar =
              "trafficBarSegments" in item && typeof item.trafficBarSegments === "number";
            return (
              <li key={item.label} className={showTrafficBar ? "w-full min-w-0 text-left" : "flex items-center gap-3 text-sm text-[#5c5c5c]"}>
                {showTrafficBar ? (
                  <div className="w-full min-w-0">
                    <p className="text-base text-[#5c5c5c] sm:text-lg">
                      <HighlightLabel text={item.label} />
                    </p>
                    <div className="mt-2 w-full min-w-0">
                      <TrafficSegmentBar filled={item.trafficBarSegments} />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3 text-sm text-[#5c5c5c]">
                    <span className="mt-0.5 shrink-0">{item.included ? <CheckMark /> : <DashMark />}</span>
                    <span className="min-w-0 flex-1 text-left leading-snug">
                      <HighlightLabel text={item.label} />
                    </span>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
        <a
          href="#compare-features"
          className="mt-0 inline-flex w-full items-center justify-center gap-1 rounded-full border border-[var(--border)] px-4 py-2.5 text-sm font-semibold text-[#171717] transition hover:bg-black/[0.04] sm:mt-4 sm:w-auto sm:justify-start sm:border-0 sm:px-0 sm:py-0 sm:font-medium sm:hover:bg-transparent sm:hover:underline"
        >
          查看所有功能
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
          </svg>
        </a>
      </div>
    </>
  );

  if (popular) {
    return (
      <div className="flex h-full flex-col">
        <div className="shrink-0 rounded-t-2xl border-2 border-b-0 border-[var(--accent-primary)] bg-[var(--accent-primary)] px-4 py-2 text-center text-sm font-semibold text-white">
          最受欢迎
        </div>
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-b-2xl border-2 border-t-0 border-[var(--accent-primary)] shadow-[var(--shadow-card)]">
          <article className="flex h-full flex-col rounded-b-2xl bg-white p-5 text-left sm:p-6">{cardContent}</article>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="h-9 shrink-0" aria-hidden />
      <article className="flex min-h-0 flex-1 flex-col rounded-2xl border border-[var(--border)] bg-white p-5 text-left shadow-[var(--shadow-card)] sm:p-6">
        {cardContent}
      </article>
    </div>
  );
}

function WhyIcon({ type }: { type: (typeof whyChooseItems)[number]["icon"] }) {
  const className = "h-8 w-8 text-[#171717]";
  if (type === "shield") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" aria-hidden>
        <path d="M12 3l7 4v5c0 4.4-2.9 8.5-7 9-4.1-.5-7-4.6-7-9V7l7-4z" strokeLinejoin="round" />
        <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (type === "server") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" aria-hidden>
        <rect x="4" y="4" width="16" height="6" rx="1.5" />
        <rect x="4" y="14" width="16" height="6" rx="1.5" />
        <circle cx="8" cy="7" r="0.75" fill="currentColor" />
        <circle cx="8" cy="17" r="0.75" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" aria-hidden>
      <rect x="6" y="4" width="12" height="16" rx="2" />
      <path d="M9 9h6M9 13h6M9 17h4" strokeLinecap="round" />
    </svg>
  );
}

export function PricingPageContent() {
  const [period, setPeriod] = useState<BillingPeriod>("24");
  const { status, formatPrice } = usePricingLocale();
  const priceLoading = status === "loading";

  const planColumnCount = pricingPlans.length + 1;
  const featuredCheckoutUrl = crowmeshBuyUrl(
    pricingPlans.find((plan) => "popular" in plan && plan.popular)?.checkoutPlanId ?? pricingPlans[0].checkoutPlanId,
    period,
  );

  return (
    <>
      <section className="bg-white pt-[calc(2rem+4.25rem+2rem)] pb-12 sm:pb-16">
        <div className="mx-auto max-w-[var(--page-max)] px-6 text-center lg:px-10">
          <h1 className="text-3xl font-semibold tracking-tight text-[#171717] sm:text-4xl lg:text-[2.75rem]">
            比较 VPN 套餐和定价
          </h1>
          <div className="mt-8 flex justify-center">
            <BillingToggle period={period} onChange={setPeriod} />
          </div>
          <div className="mt-10 grid items-stretch gap-6 sm:grid-cols-2 xl:grid-cols-4 xl:gap-4">
            {pricingPlans.map((plan) => (
              <PlanCard
                key={plan.id}
                period={period}
                plan={plan}
                formatPrice={formatPrice}
                priceLoading={priceLoading}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="compare-features" className="border-t border-[var(--border)] bg-white py-14 sm:py-20 scroll-mt-28">
        <div className="mx-auto max-w-[var(--page-max)] px-6 lg:px-10">
          <h2 className="text-center text-2xl font-semibold text-[#171717] sm:text-3xl">比较所有功能</h2>
          <div className="mt-10 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[880px] table-fixed border-collapse [&_tbody>tr:last-child]:border-b-0 [&_tbody>tr:last-child>td]:border-b [&_tbody>tr:last-child>td]:border-[var(--border)]">
              <colgroup>
                <col style={{ width: "26%" }} />
                {pricingPlans.map((plan) => (
                  <col key={plan.id} style={{ width: `${74 / pricingPlans.length}%` }} />
                ))}
              </colgroup>
              <thead>
                <tr>
                  <th className="border-b border-r border-[var(--border)] pl-4 pr-3 pb-6 pt-4 text-left text-sm font-semibold text-[#171717] sm:pl-5 sm:pr-4 sm:pb-6 sm:pt-5 sm:text-base">
                    比较所有功能
                  </th>
                  {pricingPlans.map((plan, planColIdx) => {
                    const isLastPlan = planColIdx === pricingPlans.length - 1;
                    return (
                    <th
                      key={plan.id}
                      className={
                        isLastPlan
                          ? "border-b border-l border-[var(--border)] pl-3 pr-4 pb-6 pt-4 text-center align-top sm:pl-4 sm:pr-5 sm:pb-6 sm:pt-5"
                          : "border-b border-l border-[var(--border)] px-3 pb-6 pt-4 text-center align-top sm:px-4 sm:pb-6 sm:pt-5"
                      }
                    >
                      <p className="text-base font-semibold leading-snug text-[#171717] sm:text-lg lg:text-xl">
                        {plan.productName}
                      </p>
                      <div className="hidden lg:block">
                        <p
                          className={`mt-1 text-center text-base font-semibold text-[#171717] sm:text-lg ${priceLoading ? "animate-pulse opacity-70" : ""}`}
                        >
                          {formatPrice(monthlyEquivalentCny(plan.pricesCny[period], period))}
                          <span className="text-xs font-normal text-[#5c5c5c] sm:text-sm"> /月</span>
                        </p>
                        <a
                          href={crowmeshBuyUrl(plan.checkoutPlanId, period)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`mt-3 inline-flex w-full items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition ${
                            "popular" in plan && plan.popular
                              ? "bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)]"
                              : "border border-[#171717] text-[#171717] hover:bg-black/[0.04]"
                          }`}
                        >
                          {plan.cta}
                        </a>
                        <p className="mt-2 flex items-center justify-center gap-1 text-xs text-[#8b8f96]">
                          <RefundGuaranteeIcon className="h-5 w-5 shrink-0" />
                          30 天退款保证
                        </p>
                      </div>
                    </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {featureCategories.map((category, catIdx) => (
                  <Fragment key={category.id}>
                    <tr>
                      <td
                        colSpan={planColumnCount}
                        className={`px-0 ${
                          catIdx === 0 ? "pt-5 sm:pt-6" : "border-t border-[var(--border)] pt-8 sm:pt-10"
                        }`}
                      >
                        <div className="w-full bg-[#f0f2f5] px-4 py-3 text-left text-sm font-semibold text-[#171717] sm:px-5 sm:text-base">
                          {category.label}
                        </div>
                      </td>
                    </tr>
                    {category.features.map((feature) => {
                      const textCells = feature.cellText;
                      return (
                      <tr key={feature.id} className="border-b border-[var(--border)]">
                        <td
                          className={`border-r border-[var(--border)] py-4 pl-4 pr-3 break-words sm:pl-5 sm:pr-4 ${compareTableBodyText}`}
                        >
                          {feature.label}
                        </td>
                        {planOrder.map((planId, planColIdx) => {
                          const isLast = planColIdx === planOrder.length - 1;
                          return (
                            <td
                              key={planId}
                              className={
                                isLast
                                  ? "border-l border-[var(--border)] py-4 pl-3 pr-4 text-center sm:pl-4 sm:pr-5"
                                  : "border-l border-[var(--border)] px-3 py-4 text-center sm:px-4"
                              }
                            >
                              {textCells ? (
                                <span className={`inline-block max-w-full text-center ${compareTableBodyText}`}>
                                  {textCells[planId]}
                                </span>
                              ) : (
                                <FeatureCell value={feature.values[planId]} />
                              )}
                            </td>
                          );
                        })}
                      </tr>
                      );
                    })}
                  </Fragment>
                ))}
              </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--border)] bg-[#f5f8fc] py-16 sm:py-20">
        <div className="mx-auto max-w-[var(--page-max)] px-6 lg:px-10">
          <h2 className="text-center text-2xl font-semibold text-[#171717] sm:text-3xl">为什么要购买 CrowVPN？</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-base text-[var(--muted)]">
            除了表中列出的诸多功能和优势外，我们还提供：
          </p>
          <ul className="mt-10 grid gap-6 sm:grid-cols-3 sm:gap-5">
            {whyChooseItems.map((item) => (
              <li
                key={item.title}
                className="rounded-2xl border border-[var(--border)] bg-white p-6 text-center shadow-[var(--shadow-card)] sm:p-8"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ffe8ec]">
                  <WhyIcon type={item.icon} />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-[#171717]">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto grid max-w-[var(--page-max)] items-center gap-10 px-6 lg:grid-cols-2 lg:gap-14 lg:px-10">
          <div>
            <h2 className="text-2xl font-semibold text-[#171717] sm:text-3xl">CrowVPN 对比免费 VPN</h2>
            <p className="mt-4 text-base leading-relaxed text-[var(--muted)]">
              免费 VPN 听起来很诱人，但往往会牺牲速度与隐私。付费 VPN 提供更可靠的加密、更稳定的路由策略，以及可预期的连接体验，让你在公共网络与跨境访问时更安心。
            </p>
            <Link
              href={featuredCheckoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-[var(--accent-primary)] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-primary-hover)]"
            >
              查看套餐
            </Link>
          </div>
          <div className="relative min-h-[280px] overflow-hidden bg-white sm:min-h-[340px]">
            <LocalizedImage
              zhSrc="/images/pricing-vpn-comparison.png"
              neutralSrc="/images/i18n-neutral/pricing-vpn-comparison.png"
              alt="选择可靠 VPN 连接"
              fill
              className="object-contain object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
              unoptimized
            />
          </div>
        </div>
      </section>
    </>
  );
}
