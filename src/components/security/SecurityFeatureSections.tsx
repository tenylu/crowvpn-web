import type { ReactNode } from "react";
import { LocalizedImage } from "@/components/LocalizedImage";

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
    <li className="flex gap-3 text-base leading-relaxed text-[#4b5563] sm:text-lg">
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

function GlobeIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
    </svg>
  );
}

function ShieldBanIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M12 3l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V7l8-4z" />
      <path d="M9 9l6 6M15 9l-6 6" strokeLinecap="round" />
    </svg>
  );
}

const NODE_VISUAL_SRC = "/images/banner5.png";
const NODE_VISUAL_NEUTRAL_SRC = "/images/i18n-neutral/banner5.png";
const PRIVACY_VISUAL_SRC = "/images/banner6.png";
const PRIVACY_VISUAL_NEUTRAL_SRC = "/images/i18n-neutral/banner6.png";

/** 与 `banner5`–`banner7` 源文件一致（1110×1110），用于比例与 CLS；显示为整图缩放、不裁切。 */
const BANNER_PLACEHOLDER = { width: 1110, height: 1110 } as const;

function FeatureBannerFigure({ src, neutralSrc, alt }: { src: string; neutralSrc: string; alt: string }) {
  return (
    <div className="overflow-hidden rounded-2xl sm:rounded-3xl">
      <LocalizedImage
        zhSrc={src}
        neutralSrc={neutralSrc}
        alt={alt}
        width={BANNER_PLACEHOLDER.width}
        height={BANNER_PLACEHOLDER.height}
        className="h-auto w-full max-w-full"
        sizes="(max-width: 1024px) 100vw, 50vw"
      />
    </div>
  );
}

/**
 * 安全页下方：两栏交替的特性说明（纯配图 + 文案）。
 */
export function SecurityFeatureSections() {
  return (
    <section className="border-t border-[var(--border)]/60 bg-[var(--background)] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[var(--page-max)] space-y-20 px-6 sm:space-y-24 lg:space-y-28 lg:px-10">
        {/* 图左 · 文右：节点与出口 */}
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-x-16 xl:gap-x-20">
          <div className="relative mx-auto w-full max-w-xl lg:mx-0 lg:max-w-none">
            <FeatureBannerFigure
              src={NODE_VISUAL_SRC}
              neutralSrc={NODE_VISUAL_NEUTRAL_SRC}
              alt="CrowVPN 节点与线路示意"
            />
          </div>

          <div className="text-center lg:text-left">
            <FeatureLabel icon={<GlobeIcon />}>全球节点</FeatureLabel>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#171717] sm:text-4xl">
              轻松切换线路与策略
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[var(--muted)] sm:text-lg">
              按目的地或网络环境切换线路，选项清晰，少试错。
            </p>
            <ul className="mx-auto mt-8 max-w-lg space-y-4 text-left lg:mx-0">
              <CheckItem>多地区节点，按场景自选。</CheckItem>
              <CheckItem>公共 Wi‑Fi 下走加密路径。</CheckItem>
              <CheckItem>跨境与本地访问更顺畅。</CheckItem>
            </ul>
          </div>
        </div>

        {/* 文左 · 图右：拦截与更少打扰 */}
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-x-16 xl:gap-x-20">
          <div className="order-2 text-center lg:order-1 lg:text-left">
            <FeatureLabel icon={<ShieldBanIcon />}>DNS 与隐私</FeatureLabel>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#171717] sm:text-4xl">
              少追踪，浏览更自在
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[var(--muted)] sm:text-lg">
              一键收紧 DNS 与常见跟踪拦截，少跳转、少打扰。
            </p>
            <ul className="mx-auto mt-8 max-w-lg space-y-4 text-left lg:mx-0">
              <CheckItem>页面更干净，少意外跳转。</CheckItem>
              <CheckItem>少无效请求，省流量。</CheckItem>
              <CheckItem>加载更轻快。</CheckItem>
            </ul>
          </div>

          <div className="relative order-1 mx-auto w-full max-w-xl lg:order-2 lg:mx-0 lg:max-w-none">
            <FeatureBannerFigure
              src={PRIVACY_VISUAL_SRC}
              neutralSrc={PRIVACY_VISUAL_NEUTRAL_SRC}
              alt="在户外使用 CrowVPN 安全浏览"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
