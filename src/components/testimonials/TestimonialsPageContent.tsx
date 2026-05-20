"use client";

import { ConnectionPoint, Devices, HeadsetOne, WalletOne } from "@icon-park/react";
import Image from "next/image";
import Link from "next/link";
import { TestimonialsSection } from "@/components/TestimonialsSection";

const reviewReasons = [
  {
    title: "连接更稳定",
    description: "日常办公、海外社交和跨境检索时，连接体验更连贯，减少重复切换和中断。",
    icon: <ConnectionPoint theme="outline" size="30" fill="#171717" strokeWidth={2.6} />,
  },
  {
    title: "多设备使用方便",
    description: "手机、电脑和平板都能安装，家里和外出设备切换更顺手。",
    icon: <Devices theme="outline" size="30" fill="#171717" strokeWidth={2.6} />,
  },
  {
    title: "套餐选择清晰",
    description: "按设备数和流量选择方案，不需要为用不到的能力额外付费。",
    icon: <WalletOne theme="outline" size="30" fill="#171717" strokeWidth={2.6} />,
  },
  {
    title: "支持入口明确",
    description: "需要帮助时能快速找到支持渠道，排查问题不必来回翻找。",
    icon: <HeadsetOne theme="outline" size="30" fill="#171717" strokeWidth={2.6} />,
  },
] as const;

const comparisonRows = [
  { feature: "多地区节点", crowVpn: true, freeVpn: false, basicVpn: true, premiumVpn: true },
  { feature: "12/7 在线专家", crowVpn: true, freeVpn: false, basicVpn: false, premiumVpn: true },
  {
    feature: "30天退款",
    tooltip: "支持30天内退款，退款理由符合体验问题导致可退款",
    crowVpn: true,
    freeVpn: false,
    basicVpn: true,
    premiumVpn: true,
  },
  { feature: "应用流量记录", crowVpn: true, freeVpn: false, basicVpn: false, premiumVpn: false },
  { feature: "安全功能", crowVpn: true, freeVpn: false, basicVpn: false, premiumVpn: false },
  { feature: "拦截恶意 URL", crowVpn: true, freeVpn: false, basicVpn: false, premiumVpn: false },
  { feature: "10年+资历平台", crowVpn: true, freeVpn: false, basicVpn: false, premiumVpn: true },
  { feature: "下载与安装流程简单", crowVpn: true, freeVpn: false, basicVpn: false, premiumVpn: true },
] as const;

function ComparisonMark({ value, featured = false }: { value: boolean; featured?: boolean }) {
  return value ? (
    <span
      className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${
        featured ? "text-[#49d17d]" : "text-[#22c55e]"
      }`}
      aria-label="支持"
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
        <path d="m5 12.5 4.2 4.2L19 7" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  ) : (
    <span className="inline-flex h-8 w-8 items-center justify-center text-[#c5c9d0]" aria-label="不支持">
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
        <path d="M6 6 18 18M18 6 6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    </span>
  );
}

export function TestimonialsPageContent() {
  return (
    <>
      <section className="bg-white pb-14 pt-16 sm:pb-20 sm:pt-20 lg:pb-24 lg:pt-28">
        <div className="mx-auto grid max-w-[var(--page-max)] items-center gap-10 px-6 lg:grid-cols-[0.86fr_1.14fr] lg:gap-16 lg:px-10">
          <div>
            <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-[#171717] sm:text-5xl">
              用户评价和反馈：CrowVPN 值得选择吗？
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-[var(--muted)] sm:text-lg">
              看看不同场景下的用户，为什么把 CrowVPN 作为日常连接、跨境协作和海外信息访问的工具。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="#reviews"
                className="inline-flex items-center justify-center rounded-full bg-[var(--accent-primary)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-primary-hover)]"
              >
                查看用户评价
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-full border border-[#171717] px-6 py-3 text-sm font-semibold text-[#171717] transition hover:bg-black/[0.04]"
              >
                查看套餐
              </Link>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[28px]">
            <Image
              src="/images/testimonials-hero.png"
              alt="两位用户正在查看手机"
              width={1536}
              height={1152}
              className="h-auto w-full object-cover"
              priority
            />
          </div>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-[var(--page-max)] px-6 lg:px-10">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold tracking-tight text-[#171717] sm:text-4xl">
              用户选择 CrowVPN 的理由
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[var(--muted)] sm:text-lg">
              从连接稳定性到支持体验，真正影响长期使用感受的，往往就是这些日常细节。
            </p>
          </div>

          <div className="mt-10 grid gap-x-8 gap-y-10 md:grid-cols-2">
            {reviewReasons.map((item) => (
              <article key={item.title} className="max-w-xl">
                <div className="text-[#171717]">
                  {item.icon}
                </div>
                <h3 className="mt-4 text-xl font-semibold text-[#171717]">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--muted)] sm:text-base">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7f8fa] py-14 sm:py-20">
        <div className="mx-auto max-w-[var(--page-max)] px-6 lg:px-10">
          <h2 className="text-3xl font-semibold tracking-tight text-[#171717] sm:text-4xl">
            CrowVPN 与其他 VPN 有何不同？
          </h2>
          <div className="mt-10 overflow-x-auto rounded-[28px] border border-[var(--border)] bg-white">
            <div className="min-w-[860px]">
              <div className="grid grid-cols-[1.2fr_repeat(4,0.9fr)] bg-[#eef2f6] text-sm font-semibold text-[#171717]">
                <div className="border-b border-[var(--border)] px-5 py-4 sm:px-6" />
                <div className="rounded-t-[24px] border-l border-b border-white/10 bg-[#171717] px-5 py-4 text-white sm:px-6">
                  <span className="flex items-center justify-center gap-2">
                    <Image src="/logo.svg" alt="" width={24} height={24} className="h-6 w-6" />
                    <span>CrowVPN</span>
                  </span>
                </div>
                <div className="border-l border-b border-[var(--border)] px-5 py-4 text-center sm:px-6">私人VPN(免费)</div>
                <div className="border-l border-b border-[var(--border)] px-5 py-4 text-center sm:px-6">杂牌VPN</div>
                <div className="border-l border-b border-[var(--border)] px-5 py-4 text-center sm:px-6">知名VPN</div>
              </div>
              {comparisonRows.map((row) => (
                <div key={row.feature} className="grid grid-cols-[1.2fr_repeat(4,0.9fr)]">
                  <div className="border-b border-[var(--border)] px-5 py-5 font-medium text-[#171717] sm:px-6">
                    <span className="inline-flex items-center gap-2">
                      {row.feature}
                      {"tooltip" in row ? (
                        <span className="group relative inline-flex">
                          <span
                            tabIndex={0}
                            className="inline-flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-[#171717] text-[10px] font-bold leading-none text-white outline-none ring-offset-2 transition group-hover:bg-[var(--accent-primary)] focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
                            aria-label={row.tooltip}
                          >
                            !
                          </span>
                          <span className="pointer-events-none absolute left-full top-1/2 z-20 ml-2 hidden w-64 -translate-y-1/2 rounded-xl bg-[#171717] px-3 py-2 text-xs font-medium leading-relaxed text-white shadow-lg group-hover:block group-focus-within:block">
                            {row.tooltip}
                          </span>
                        </span>
                      ) : null}
                    </span>
                  </div>
                  <div className="flex items-center justify-center border-l border-b border-white/10 bg-[#171717] px-5 py-5 sm:px-6">
                    <ComparisonMark value={row.crowVpn} featured />
                  </div>
                  <div className="flex items-center justify-center border-l border-b border-[var(--border)] px-5 py-5 sm:px-6">
                    <ComparisonMark value={row.freeVpn} />
                  </div>
                  <div className="flex items-center justify-center border-l border-b border-[var(--border)] px-5 py-5 sm:px-6">
                    <ComparisonMark value={row.basicVpn} />
                  </div>
                  <div className="flex items-center justify-center border-l border-b border-[var(--border)] px-5 py-5 sm:px-6">
                    <ComparisonMark value={row.premiumVpn} />
                  </div>
                </div>
              ))}
              <div className="grid grid-cols-[1.2fr_repeat(4,0.9fr)]">
                <div className="col-start-2 flex justify-center rounded-b-[24px] border-l border-white/10 bg-[#171717] px-5 py-5 sm:px-6">
                  <Link
                    href="/pricing"
                    className="inline-flex items-center justify-center rounded-full bg-[var(--accent-primary)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--accent-primary-hover)]"
                  >
                    查看套餐
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div id="reviews">
        <TestimonialsSection />
      </div>
    </>
  );
}
