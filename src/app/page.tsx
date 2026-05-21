import type { Metadata } from "next";
import Image from "next/image";
import { BrandLogoStrip } from "@/components/BrandLogoStrip";
import { DestinationPickerProvider } from "@/components/DestinationPickerProvider";
import { HeroSearchBar } from "@/components/HeroSearchBar";
import { LocalizedImage } from "@/components/LocalizedImage";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { DownloadSection } from "@/components/DownloadSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { PlatformInstantSection } from "@/components/PlatformInstantSection";
import { VpnHighlightsSection } from "@/components/VpnHighlightsSection";

/** 将配图放在项目 `public/images/` 下，默认读取此文件名（可改扩展名或常量） */
const HERO_BANNER_SRC = "/images/hero-banner.png";

export const metadata: Metadata = {
  title: "CrowVPN — 官方首页：VPN 套餐、客户端下载与加密连接",
  description:
    "CrowVPN 官方网站首页：了解 VPN 加密隧道与全球节点，比较套餐与价格，下载 Windows、macOS、Linux、Android、iOS 客户端，获得更稳定、更注重隐私的日常与跨境上网体验。",
  alternates: { canonical: "/" },
  openGraph: {
    title: "CrowVPN — 官方首页：VPN 套餐、客户端下载与加密连接",
    description:
      "加密连接、多平台客户端与清晰套餐说明，为日常上网与跨境访问场景而设计。立即了解 CrowVPN 服务。",
    url: "https://crowvpn.com/",
    type: "website",
    images: [{ url: "/images/hero-banner.png", width: 1200, height: 630, alt: "CrowVPN" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CrowVPN — 官方首页",
    description:
      "VPN 套餐、多平台下载与加密连接。CrowVPN 官方网站，安全、顺畅的网络访问体验。",
    images: ["/images/hero-banner.png"],
  },
};

const steps = [
  { title: "选择适合您的节点套餐", body: "按您的目的地与使用时长选择线路方案，随时可调整连接策略。" },
  { title: "下载 CrowVPN 并完成配置", body: "按照应用内指引登录并启用配置，在设备上快速完成连接准备。" },
  { title: "连接后即可安全访问", body: "连接成功后即可获得稳定加密通道，跨境访问与日常上网更安心。" },
];

function HeroBannerImage() {
  return (
    <div className="pointer-events-none relative mx-auto h-full min-h-[320px] w-[118%] max-w-[560px] -translate-x-[3%] sm:w-full sm:max-w-lg sm:translate-x-0 lg:max-w-none">
      <Image
        src={HERO_BANNER_SRC}
        alt="CrowVPN 产品配图"
        fill
        className="scale-[1.32] object-contain object-center sm:scale-100 lg:object-right-bottom"
        sizes="(max-width: 1024px) 100vw, 50vw"
        priority
      />
    </div>
  );
}

export default function Home() {
  return (
    <DestinationPickerProvider>
    <div className="flex min-h-full flex-1 flex-col bg-[var(--background)]">
      <section
        className="relative min-h-[680px] overflow-x-clip sm:h-[764px]"
        style={{
          background: "linear-gradient(180deg, #9ECEF1 0%, #E9F2FF 100%)",
        }}
      >
        <SiteHeader />
        <div className="mx-auto flex h-full w-full max-w-[var(--page-max)] flex-col gap-3 px-6 pb-10 pt-24 sm:gap-8 sm:pt-24 lg:flex-row lg:items-stretch lg:gap-10 lg:px-10 lg:pt-28">
          <div className="order-2 relative z-30 flex max-w-xl shrink-0 flex-col justify-center lg:order-1 lg:w-[46%] lg:max-w-none">
            <h1 className="text-3xl font-semibold leading-[1.15] tracking-tight text-[#171717] sm:text-5xl sm:leading-[1.1]">
              经济实惠，适合国际旅行的网络服务
            </h1>
            <p className="mt-4 text-lg text-[var(--muted)] sm:text-xl">您需要在连接到哪里去？</p>
            <HeroSearchBar />
          </div>
          <div className="order-1 relative min-h-[330px] flex-1 lg:order-2 lg:min-h-0">
            <HeroBannerImage />
          </div>
        </div>
      </section>

      <div className="relative z-10 mx-auto mt-6 w-full max-w-[var(--page-max)] px-6 sm:-mt-14 lg:px-10">
        <div className="flex flex-col gap-5 rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)] sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:rounded-full sm:p-8">
          <p className="text-center text-base font-semibold text-[#171717] sm:text-left sm:text-lg">
            他们都在使用
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-4 sm:justify-end sm:gap-x-12">
            <BrandLogoStrip imageClassName="h-7 w-auto object-contain sm:h-8" />
          </div>
        </div>
      </div>

      <main className="flex-1 bg-[var(--background)]">
        <section id="vpn-intro" className="scroll-mt-24 py-20 sm:py-28">
          <div className="mx-auto grid max-w-[var(--page-max)] items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16 lg:px-10">
            <div className="relative mx-auto w-full max-w-xl lg:mx-0">
              <LocalizedImage
                zhSrc="/images/crowvpn-intro-illustration.png"
                neutralSrc="/images/i18n-neutral/crowvpn-intro-illustration.png"
                alt="CrowVPN 产品展示图"
                width={1692}
                height={930}
                className="h-auto w-full object-contain"
                unoptimized
              />
            </div>
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-[#171717] sm:text-4xl">什么是 CrowVPN?</h2>
              <p className="mt-5 text-base leading-relaxed text-[var(--muted)] sm:text-lg">
                CrowVPN 通过加密隧道与全球节点网络，帮助你减少地理限制与网络审查带来的访问阻碍。无论是国际网站、流媒体视频、直播活动，还是国际 AI模型相关服务，都能获得更自由、稳定且私密的连接体验。
              </p>
            </div>
          </div>
        </section>

        <VpnHighlightsSection />

        <PlatformInstantSection />

        <section id="how" className="scroll-mt-24 py-20 sm:py-24">
          <div className="mx-auto max-w-[var(--page-max)] px-6 lg:px-10">
            <p className="text-sm font-medium text-[#8b8f96]">如何使用 CrowVPN 服务</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#171717] sm:text-4xl">CrowVPN 的工作原理？</h2>
            <p className="mt-4 text-base text-[var(--muted)]">只需三步，即可完成配置并保持在线安全。</p>
            <ol className="mt-10 grid gap-5 lg:grid-cols-3 lg:gap-6">
              {steps.map((s, i) => (
                <li
                  key={s.title}
                  className="rounded-[24px] border border-[var(--border)] bg-[#EEF1F5] p-5 sm:p-6"
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-semibold text-[#171717]">
                    {i + 1}
                  </span>
                  <h3 className="mt-5 text-xl font-semibold leading-tight text-[#171717] sm:text-2xl">{s.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--muted)] sm:text-base">{s.body}</p>

                  <div className="mt-8">
                    {i === 0 && (
                      <div className="relative space-y-3 overflow-hidden rounded-2xl bg-white/70 p-4">
                        <div className="flex items-center justify-between rounded-xl border border-[#171717]/10 bg-white/90 px-4 py-3 opacity-60">
                          <span className="inline-flex h-5 w-5 rounded-full border-2 border-[#d4d8de]" />
                          <span className="text-base font-semibold text-[#171717]">3 GB / 30 天</span>
                          <span className="text-sm text-[#8b8f96]">可选</span>
                        </div>
                        <div className="flex items-center justify-between rounded-xl border border-[#171717]/20 bg-white px-4 py-3">
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#171717]">
                            <span className="h-2.5 w-2.5 rounded-full bg-[#171717]" />
                          </span>
                          <span className="text-base font-semibold text-[#171717]">5 GB / 30 天</span>
                          <span className="text-sm font-semibold text-[#22c55e]">已选择</span>
                        </div>
                        <div className="flex items-center justify-between rounded-xl border border-[#171717]/10 bg-white/90 px-4 py-3 opacity-60">
                          <span className="inline-flex h-5 w-5 rounded-full border-2 border-[#d4d8de]" />
                          <span className="text-base font-semibold text-[#171717]">10 GB / 30 天</span>
                          <span className="text-sm text-[#8b8f96]">可选</span>
                        </div>
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-b from-transparent to-[#EEF1F5]/85" />
                      </div>
                    )}
                    {i === 1 && (
                      <div className="relative flex min-h-[220px] items-center justify-center overflow-hidden rounded-2xl bg-white/75">
                        <div className="text-center">
                          <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-[var(--accent-primary)] text-2xl text-white">
                            ✓
                          </span>
                          <p className="mt-6 text-2xl font-semibold text-[#171717]">已安装 CrowVPN</p>
                        </div>
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-b from-transparent to-[#EEF1F5]/85" />
                      </div>
                    )}
                    {i === 2 && (
                      <div className="relative space-y-3 overflow-hidden rounded-2xl bg-white/75 p-4">
                        <div className="rounded-xl bg-white p-4">
                          <p className="text-lg font-semibold text-[#171717]">美国节点 · 已启用</p>
                          <div className="mt-3 flex justify-between text-sm text-[var(--muted)]">
                            <span>剩余流量</span>
                            <span className="font-semibold text-[#171717]">5 / 5 GB</span>
                          </div>
                          <div className="mt-2 flex justify-between text-sm text-[var(--muted)]">
                            <span>连接状态</span>
                            <span className="font-semibold text-[#22c55e]">已保护</span>
                          </div>
                          <div className="mt-2 flex justify-between text-sm text-[var(--muted)]">
                            <span>剩余时间</span>
                            <span className="font-semibold text-[#171717]">29 天 7 小时</span>
                          </div>
                        </div>
                        <div className="h-10 rounded-xl bg-white/80" />
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-b from-transparent to-[#EEF1F5]/85" />
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <TestimonialsSection />

        <DownloadSection />
      </main>
      <SiteFooter />
    </div>
    </DestinationPickerProvider>
  );
}
