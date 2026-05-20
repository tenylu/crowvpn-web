"use client";

import { BellRing, CheckOne, ConnectionPoint, Devices, WalletOne, World } from "@icon-park/react";
import type { ReactNode } from "react";
import { LocalizedImage } from "@/components/LocalizedImage";

const gridIconProps = {
  theme: "outline" as const,
  size: "44" as const,
  fill: "#111827",
  strokeWidth: 2.8,
};

const gridFeatures: { icon: ReactNode; title: string; body: string }[] = [
  {
    icon: <ConnectionPoint {...gridIconProps} />,
    title: "选择适合您的方案",
    body: "按天数与流量选套餐，节点与策略一目了然。",
  },
  {
    icon: <CheckOne {...gridIconProps} />,
    title: "简单易用",
    body: "下载登录、按引导启用；换网络时一键连接。",
  },
  {
    icon: <WalletOne {...gridIconProps} />,
    title: "费用更可预期",
    body: "少劫持、少无效重试，账单与体验更可控。",
  },
  {
    icon: <Devices {...gridIconProps} />,
    title: "多设备一起用",
    body: "手机、平板、电脑同一套体验，出行办公不断档。",
  },
  {
    icon: <BellRing {...gridIconProps} />,
    title: "数据流量用之不竭",
    body: "套餐流量用至 80% 时，我们会通知您，因此您随时都有时间充值。",
  },
  {
    icon: <World {...gridIconProps} />,
    title: "全球与区域线路",
    body: "覆盖常用地区与线路，出差多地也好选。",
  },
];

function FeatureLabel({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <p className="flex items-center justify-center gap-2 text-sm font-medium text-[#8b8f96] lg:justify-start">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#eef2f6] text-[#374151]">
        {icon}
      </span>
      {children}
    </p>
  );
}

function CheckItem({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-3 text-sm leading-relaxed text-[var(--muted)] sm:text-base">
      <span
        className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm"
        aria-hidden
      >
        <svg className="h-3.5 w-3.5" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2.5 6.2 5 8.7 9.5 3.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span>{children}</span>
    </li>
  );
}

function ShieldOutlineIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M12 3l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V7l8-4z" strokeLinejoin="round" />
    </svg>
  );
}

const NETWORK_VISUAL_SRC = "/images/banner7.png";
const NETWORK_VISUAL_NEUTRAL_SRC = "/images/i18n-neutral/banner7.png";

/** 与 banner7 源文件一致（1110×1110）。 */
const BANNER_PLACEHOLDER = { width: 1110, height: 1110 } as const;

function NetworkProtectionVisual() {
  return (
    <div className="relative mx-auto w-full max-w-xl lg:mx-0 lg:max-w-none">
      <div className="overflow-hidden rounded-2xl sm:rounded-3xl">
        <LocalizedImage
          zhSrc={NETWORK_VISUAL_SRC}
          neutralSrc={NETWORK_VISUAL_NEUTRAL_SRC}
          alt="CrowVPN 网络保护示意"
          width={BANNER_PLACEHOLDER.width}
          height={BANNER_PLACEHOLDER.height}
          className="h-auto w-full max-w-full"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
    </div>
  );
}

/**
 * 安全页继续向下：网络保护分栏配图 + 居中标题下的 3×2 特性宫格。
 */
export function SecurityExtendedFeatures() {
  return (
    <>
      <section className="border-t border-[var(--border)]/60 bg-[var(--background)] py-16 sm:py-20 lg:py-24">
        <div className="mx-auto grid max-w-[var(--page-max)] items-center gap-12 px-6 lg:grid-cols-2 lg:gap-x-16 lg:px-10 xl:gap-x-20">
          <NetworkProtectionVisual />

          <div className="text-center lg:text-left">
            <FeatureLabel icon={<ShieldOutlineIcon />}>网络保护</FeatureLabel>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#171717] sm:text-4xl">
              别让威胁打乱旅程
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[var(--muted)] sm:text-lg">
              拦截恶意站点、收紧 DNS，与加密隧道一起，路上少踩坑。
            </p>
            <ul className="mx-auto mt-8 max-w-lg space-y-4 text-left lg:mx-0">
              <CheckItem>拦恶意与钓鱼链接。</CheckItem>
              <CheckItem>限常见追踪脚本。</CheckItem>
              <CheckItem>少无效加载，更轻快。</CheckItem>
            </ul>
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--border)]/60 bg-[#f8fafc] py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[var(--page-max)] px-6 lg:px-10">
          <h2 className="mx-auto max-w-3xl text-center text-3xl font-semibold tracking-tight text-[#171717] sm:text-4xl">
            去哪都能安心联网
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-base leading-relaxed text-[var(--muted)] sm:text-lg">
            连接、隐私与费用，一套能力搞定。
          </p>

          <ul className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {gridFeatures.map((item) => (
              <li key={item.title}>
                <div className="mb-5 text-[#111827] [&_svg]:block">{item.icon}</div>
                <h3 className="text-xl font-semibold leading-tight text-[#171717] sm:text-2xl">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--muted)] sm:text-base">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
