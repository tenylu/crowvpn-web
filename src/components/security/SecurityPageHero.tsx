"use client";

import { LocalizedImage } from "@/components/LocalizedImage";

/** 主视觉：`public/images/security-banner.png` */
const HERO_ART_SRC = "/images/security-banner.png";

/**
 * 安全头图：底层径向渐变 + 内缩配图（contain）；配图区下缘与区块底对齐。
 */
export function SecurityPageHero() {
  return (
    <section
      className="relative isolate w-full min-h-[780px] overflow-hidden pb-0 pt-[calc(2rem+4.25rem+1.25rem)] sm:min-h-[min(76vh,780px)] sm:pt-[calc(2rem+4.25rem+1.5rem)] lg:min-h-[min(78vh,820px)]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 125% 95% at 50% 18%, #f2f8fc 0%, #e4f0fa 40%, #d4e8f7 78%, #c8e2f4 100%)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 z-[1]">
        <div className="absolute inset-x-[-22%] top-[17%] bottom-0 sm:inset-x-[2%] sm:top-[10%] lg:inset-x-[9%] lg:top-[9%]">
          <div className="relative h-full w-full">
            <LocalizedImage
              zhSrc={HERO_ART_SRC}
              neutralSrc="/images/i18n-neutral/security-banner.png"
              alt="CrowVPN 安全能力示意"
              fill
              className="scale-[1.18] object-contain object-bottom sm:scale-100"
              priority
              sizes="(max-width: 1024px) 100vw, 90vw"
            />
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-[var(--page-max)] px-6 text-center lg:px-10">
        <h1 className="mx-auto max-w-3xl text-4xl font-semibold leading-[1.15] tracking-tight text-[#171717] sm:text-5xl sm:leading-[1.1] [text-shadow:0_1px_2px_rgba(255,255,255,0.85)]">
          安全能力，让连接与出行更安心
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-[var(--muted)] sm:text-xl [text-shadow:0_1px_1px_rgba(255,255,255,0.75)]">
          加密隧道与稳定节点，让公共网络与跨境访问更省心。
        </p>
      </div>
    </section>
  );
}
