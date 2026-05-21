"use client";

import Link from "next/link";
import { useDestinationPicker } from "@/components/DestinationPickerProvider";
import { LocalizedImage } from "@/components/LocalizedImage";

export function PlatformInstantSection() {
  const { openDestinationPicker } = useDestinationPicker();
  return (
    <section id="instant-connect" className="scroll-mt-24 bg-[#ffffff] py-14 sm:py-24">
      <div className="mx-auto max-w-[var(--page-max)] px-6 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-[#171717] sm:text-4xl">
            使用 CrowVPN 即时连接，浏览更安全
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--muted)] sm:text-lg">
            您是否经常出差、跨境办公，或是在旅途中需要稳定可靠的加密网络？CrowVPN
            让您随时随地保持连接，减少地理限制与公共网络带来的风险。
          </p>
          <button
            type="button"
            onClick={openDestinationPicker}
            className="mt-8 inline-flex h-11 items-center justify-center rounded-full bg-[var(--accent-primary)] px-8 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--accent-primary-hover)]"
          >
            查看所有节点
          </button>
        </div>

        <div className="mt-10 grid gap-8 sm:mt-16 lg:grid-cols-2 lg:gap-12 lg:items-start">
          {/* 左：顶部文案 + 下方配图（参考 Saily：加高模块，文案不靠半透明层） */}
          <div>
            <div className="flex w-full flex-col overflow-hidden rounded-[32px] border border-[var(--border)] bg-[#EEF1F5] shadow-[var(--shadow-card)] sm:min-h-[660px] sm:rounded-[50px] lg:min-h-[740px]">
              <div className="shrink-0 px-5 pb-5 pt-7 sm:px-8 sm:pb-8 sm:pt-10 lg:px-10 lg:pt-12">
                <h3 className="text-xl font-semibold text-[#171717] sm:text-2xl">一键接入，落地即用</h3>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--muted)] sm:text-base">
                  CrowVPN
                  是省心方案：在客户端选好目的地或线路，出发前完成登录与配置即可。抵达当地后打开应用一键连接，无需再折腾复杂网络设置。
                </p>
              </div>
              <div className="mt-auto shrink-0 bg-[#EEF1F5]">
                <LocalizedImage
                  zhSrc="/images/banner1.png"
                  neutralSrc="/images/i18n-neutral/banner1.png"
                  alt="CrowVPN 一键接入示意"
                  width={1110}
                  height={1110}
                  className="h-auto w-full object-contain object-bottom"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority={false}
                />
              </div>
            </div>
          </div>

          {/* 右：顶部文案 + 下方配图（与左侧结构一致） */}
          <div>
            <div className="flex w-full flex-col overflow-hidden rounded-[32px] border border-[var(--border)] bg-[#EEF1F5] shadow-[var(--shadow-card)] sm:min-h-[660px] sm:rounded-[50px] lg:min-h-[740px]">
              <div className="shrink-0 px-5 pb-5 pt-7 sm:px-8 sm:pb-8 sm:pt-10 lg:px-10 lg:pt-12">
                <h3 className="text-xl font-semibold text-[#171717] sm:text-2xl">适用于所有设备，不必碰运气</h3>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--muted)] sm:text-base">
                  无论您是在电脑、智能手机、平板电脑还是路由器上，只需 60 秒即可释放互联网的力量。我们的应用程序让您无限制地冲浪，无需编码或复杂的设置。只需下载并连接。
                </p>
              </div>
              <div className="mt-auto shrink-0 bg-[#EEF1F5]">
                <LocalizedImage
                  zhSrc="/images/banner2.png"
                  neutralSrc="/images/i18n-neutral/banner2.png"
                  alt="CrowVPN 多设备支持示意"
                  width={1110}
                  height={1110}
                  className="h-auto w-full object-contain object-bottom"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority={false}
                />
              </div>
            </div>
          </div>
        </div>

        <div id="online-safety" className="scroll-mt-24 mt-8 sm:mt-14 lg:mt-16">
          <div className="overflow-hidden rounded-[32px] border border-[var(--border)] bg-[#EEF1F5] shadow-[var(--shadow-card)] sm:rounded-[50px]">
            <div className="flex flex-col gap-8 p-5 sm:min-h-[520px] sm:gap-12 sm:p-10 lg:min-h-[560px] lg:flex-row lg:items-center lg:gap-14 lg:p-14 xl:min-h-[600px] xl:p-16">
              <div className="flex max-w-xl shrink-0 flex-col justify-center lg:w-[46%] lg:max-w-none">
                <h3 className="text-xl font-semibold text-[#171717] sm:text-2xl">出门在外，也能安心上网</h3>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--muted)] sm:text-base">
                  差旅、留学或日常外出时，公共 Wi‑Fi
                  与跨境网络环境更容易暴露风险。CrowVPN
                  通过加密隧道与可预期的连接策略，帮助你降低窃听与追踪顾虑，让访问更稳定、身份更隐蔽，把复杂交给产品，把时间留给自己。
                </p>
                <Link
                  href="/security"
                  className="mt-6 inline-flex w-fit items-center justify-center rounded-full border border-[#171717] bg-transparent px-6 py-2.5 text-sm font-semibold text-[#171717] transition hover:bg-black/[0.04] sm:mt-8 sm:px-7 sm:py-3"
                >
                  了解更多
                </Link>
              </div>

              <div className="relative min-h-[260px] flex-1 overflow-hidden rounded-[28px] sm:min-h-[320px] lg:self-stretch lg:-my-14 lg:-mr-14 lg:rounded-none xl:-my-16 xl:-mr-16">
                <LocalizedImage
                  zhSrc="/images/banner4.png"
                  neutralSrc="/images/i18n-neutral/banner4.png"
                  alt="CrowVPN 在线安全：加密连接与网络保护示意"
                  fill
                  className="object-contain object-center lg:object-right-bottom"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority={false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
