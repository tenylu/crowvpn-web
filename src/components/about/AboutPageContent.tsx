import Image from "next/image";
import Link from "next/link";
import { AboutMilestonesCarousel } from "@/components/about/AboutMilestonesCarousel";
import { AboutCultureGrid } from "@/components/about/AboutCultureGrid";
import { AboutTeamVoicesCarousel } from "@/components/about/AboutTeamVoicesCarousel";
import { AboutValuesSection } from "@/components/about/AboutValuesSection";
import { BrandLogoStrip } from "@/components/BrandLogoStrip";
import { aboutMilestones } from "@/components/about/about-milestones-data";
import { aboutTeamVoices } from "@/components/about/about-team-voices-data";

const HERO_BG = "/images/about/about-banner.png";
const JOIN_BG = "/images/about/about-bg.png";

/**
 * 「关于我们」页主体：Hero、团队介绍、使命、背书、价值观、历程、团队心声、职场氛围。
 */
export function AboutPageContent() {
  return (
    <>
      {/* Hero：全幅背景图 + 底部开篇文案 */}
      <section className="relative flex min-h-[min(88vh,760px)] flex-col overflow-hidden pt-[calc(2rem+4.25rem+1.25rem)] sm:pt-[calc(2rem+4.25rem+1.5rem)]">
        <Image
          src={HERO_BG}
          alt="CrowVPN 关于我们"
          fill
          priority
          className="z-0 object-cover object-center"
          sizes="100vw"
        />
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-black/[0.22] via-black/[0.06] to-black/[0.62]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[min(55%,420px)] bg-gradient-to-t from-black/75 via-black/35 to-transparent"
          aria-hidden
        />
        <div
          className="relative z-10 mx-auto mt-auto w-full max-w-[var(--page-max)] px-6 pb-12 pt-16 sm:pb-14 sm:pt-20 lg:px-10 lg:pb-16 lg:pt-24"
        >
          <p className="text-sm font-semibold tracking-wide text-white/80 sm:text-base">关于我们</p>
          <h1 className="mt-3 max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            始终在线。
            <br className="sm:hidden" />
            始终如一。
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/90 sm:mt-5 sm:text-lg">
            加入一支相信「连接应简单、隐私应默认」的团队，一起把跨境与公共网络体验做到更可靠。
          </p>
        </div>
      </section>

      {/* 认识团队 */}
      <section className="scroll-mt-28 bg-[var(--background)] py-20 sm:py-28" id="team">
        <div className="mx-auto max-w-[var(--page-max)] px-6 lg:px-10">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold tracking-tight text-[#171717] sm:text-4xl">认识 CrowVPN 团队</h2>
            <p className="mt-3 text-sm font-medium text-[#8b8f96] sm:text-base">
              与你在同一条路上——先解决我们自己的连接痛点，再把它做成产品。
            </p>
          </div>

          <div className="mt-10 grid gap-8 lg:mt-14 lg:grid-cols-12 lg:items-stretch lg:gap-10 xl:gap-12">
            {/* 小屏：文案在上，配图在下；大屏：配图左、文案右 */}
            <div className="order-2 flex flex-col gap-4 sm:gap-5 lg:order-1 lg:col-span-5 lg:gap-5">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#eceef1] shadow-[var(--shadow-card)] ring-1 ring-black/[0.04] sm:rounded-3xl">
                  <Image src="/images/about/about1.png" alt="CrowVPN 团队场景一" fill className="object-cover" sizes="(max-width:1024px) 45vw, 22vw" />
                </div>
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#eceef1] shadow-[var(--shadow-card)] ring-1 ring-black/[0.04] sm:rounded-3xl">
                  <Image src="/images/about/about2.png" alt="CrowVPN 团队场景二" fill className="object-cover" sizes="(max-width:1024px) 45vw, 22vw" />
                </div>
              </div>
              <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-[#eceef1] shadow-[var(--shadow-card)] ring-1 ring-black/[0.04] sm:rounded-3xl">
                <Image src="/images/about/about3.png" alt="CrowVPN 团队场景三" fill className="object-cover" sizes="(max-width:1024px) 100vw, 42vw" />
              </div>
            </div>

            <div className="order-1 flex flex-col justify-center rounded-[24px] border border-[var(--border)] bg-white p-7 shadow-[var(--shadow-card)] sm:rounded-[28px] sm:p-9 lg:order-2 lg:col-span-7 lg:rounded-[32px] lg:p-10 xl:p-12">
              <div className="max-w-prose space-y-4 text-base leading-relaxed text-[var(--muted)] sm:text-lg lg:max-w-none">
                <p>
                  我们自己也常在路上：机场 Wi‑Fi、酒店网络、跨境会议——连接不稳时，最浪费的是时间与注意力。
                </p>
                <p>
                  CrowVPN 要做的，是把「加密、线路、状态」变成开箱即用的默认能力，让你把精力留给真正重要的事。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 初衷 + 波浪装饰 */}
      <section className="relative overflow-hidden bg-white py-20 sm:py-28" id="mission">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 top-1/2 h-[min(140%,900px)] w-[min(85%,720px)] -translate-y-1/2 text-[var(--accent-primary)] opacity-[0.14]"
        >
          <svg viewBox="0 0 600 400" className="h-full w-full" preserveAspectRatio="none" fill="currentColor">
            <path d="M0 220 C120 80 240 320 360 180 S520 40 600 200 L600 400 L0 400 Z" />
          </svg>
        </div>
        <div className="relative z-10 mx-auto grid max-w-[var(--page-max)] gap-12 px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-10">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-[#171717] sm:text-4xl">打造 CrowVPN 的初衷</h2>
            <p className="mt-6 text-base leading-relaxed text-[var(--muted)] sm:text-lg">
              探索是人类的天性。今天多数人不再扬帆跨洋寻找新大陆，但仍需要跨越数字边界去工作、学习与生活。我们希望用更现代的工具，让「连得上、连得稳、连得安心」成为默认体验。
            </p>
            <p className="mt-5 text-base leading-relaxed text-[var(--muted)] sm:text-lg">
              CrowVPN 以加密隧道与全球节点网络为底座，持续打磨路由与策略，让连接尽可能无感、少折腾，把复杂留给系统，把时间还给你。
            </p>
          </div>
          <div className="relative aspect-[4/5] max-h-[520px] overflow-hidden rounded-[28px] bg-[#eceef1] shadow-[var(--shadow-card)] sm:rounded-[32px] lg:max-h-none lg:aspect-[5/6]">
            <Image
              src="/images/about/about4.png"
              alt="CrowVPN 多端产品界面"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
          </div>
        </div>
      </section>

      {/* 媒体背书 */}
      <section className="border-y border-[var(--border)]/80 bg-[var(--surface-muted)] py-12 sm:py-14">
        <div className="mx-auto max-w-[var(--page-max)] px-6 lg:px-10">
          <p className="text-center text-sm font-semibold text-[#171717] sm:text-left sm:text-base">他们都在使用</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6 sm:mt-10 sm:justify-between">
            <BrandLogoStrip imageClassName="h-8 w-auto object-contain opacity-90 sm:h-9" />
          </div>
        </div>
      </section>

      <AboutValuesSection />

      {/* 使命与历程 */}
      <section className="scroll-mt-28 bg-[var(--background)] py-20 sm:py-28" id="milestones">
        <div className="mx-auto max-w-[var(--page-max)] px-6 lg:px-10">
          <h2 className="text-3xl font-semibold tracking-tight text-[#171717] sm:text-4xl">CrowVPN 的使命</h2>
          <p className="mt-4 w-full max-w-none text-base leading-relaxed text-[var(--muted)] sm:text-lg">
            自 2014 年由同事自用需求发起到今天，我们始终把「连得上、连得稳、连得安心」当作长期目标。以下是一些阶段性节点。
          </p>
          <AboutMilestonesCarousel items={aboutMilestones} />
        </div>
      </section>

      {/* 团队心声 */}
      <section className="bg-[#000000] pt-20 pb-10 text-white sm:pt-28 sm:pb-12" id="voices">
        <div className="mx-auto max-w-[var(--page-max)] px-6 lg:px-10">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">团队心声</h2>
          <p className="mt-3 max-w-2xl text-base text-white/70 sm:text-lg">了解 CrowVPN 团队如何把「稳定连接」当作长期主义来做。</p>
          <AboutTeamVoicesCarousel items={aboutTeamVoices} />
        </div>
      </section>

      {/* 职场氛围 */}
      <section className="bg-[#000000] pt-10 pb-20 text-white sm:pt-12 sm:pb-28" id="culture">
        <div className="mx-auto max-w-[var(--page-max)] px-6 lg:px-10">
          <AboutCultureGrid />
        </div>
      </section>

      {/* 加入 / 联系 */}
      <section className="relative overflow-hidden border-t border-[var(--border)] py-16 sm:py-20" id="join">
        <Image src={JOIN_BG} alt="" fill className="object-cover object-center" sizes="100vw" aria-hidden />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/25" aria-hidden />
        <div className="relative z-10 mx-auto max-w-[var(--page-max)] px-6 text-center lg:px-10">
          <div className="mx-auto max-w-2xl rounded-[28px] bg-white/92 px-8 py-10 shadow-[var(--shadow-card)] backdrop-blur-[2px] sm:rounded-[32px] sm:px-10 sm:py-12">
          <h2 className="text-2xl font-semibold text-[#171717] sm:text-3xl">期待与你同行</h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-[var(--muted)] sm:text-lg">
            若你认同我们的工作方式，欢迎通过支持渠道与我们取得联系，了解合作与岗位机会。
          </p>
          <Link
            href="/security#support"
            className="mt-8 inline-flex items-center justify-center rounded-full border border-[#171717] bg-transparent px-8 py-3 text-sm font-semibold text-[#171717] transition hover:bg-black/[0.06]"
          >
            联系我们
          </Link>
          </div>
        </div>
      </section>
    </>
  );
}
