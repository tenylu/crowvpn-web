"use client";

import { ApplicationOne, Browser, BrowserChrome, DownloadOne } from "@icon-park/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { LocalizedImage } from "@/components/LocalizedImage";
import {
  DOWNLOAD_PLATFORMS_SECTION_ID,
  downloadItems,
  type DownloadItem,
} from "@/data/downloadPlatforms";
import { buildLatestDownloadLinks, type LatestDownloadLinks } from "@/lib/downloads/latest";

const HERO_ART = "/images/download-banner.png";
const FALLBACK_DOWNLOAD_LINKS = buildLatestDownloadLinks("2.2.0");

const heroBullets = [
  "获取 VPN 应用程序，随时随地保护您的在线活动",
  "手机、电脑与平板均可轻松安装",
  "多地区节点与清晰套餐，按设备数与流量灵活选择",
] as const;

const downloadIconProps = {
  theme: "outline" as const,
  size: "22" as const,
  fill: "#171717",
  strokeWidth: 2.5,
};

const windowsDownloadOptions = [
  {
    id: "windowsX64",
    label: "下载 64位版",
    description: "适用于大多数 Windows 电脑（Intel 或 AMD 处理器）。",
    badge: "推荐",
    primary: true,
  },
  {
    id: "windowsArm64",
    label: "下载 Arm版",
    description: "适用于 ARM 处理器的 Windows 设备（如 Surface Pro X）。",
    badge: "ARM 设备",
    primary: false,
  },
] as const;

const macDownloadOptions = [
  {
    id: "macIntel",
    label: "下载 Intel 版",
    description: "适用于搭载 Intel 处理器的 Mac 电脑。",
    badge: "Intel",
    primary: false,
  },
  {
    id: "macApple",
    label: "下载 Apple 芯片版",
    description: "适用于搭载 Apple M 系列芯片的 Mac 电脑。",
    badge: "Apple 芯片",
    primary: true,
  },
] as const;

const linuxDownloadOptions = [
  {
    id: "linuxAmd64Deb",
    label: "amd64 版本",
    description: "适用于 amd64 架构 Linux 系统（Debian/Ubuntu）。",
    badge: "Debian/Ubuntu",
    primary: true,
  },
  {
    id: "linuxArm64Deb",
    label: "arm64 版本",
    description: "适用于 arm64 架构 Linux 系统（Debian/Ubuntu）。",
    badge: "Debian/Ubuntu",
    primary: false,
  },
  {
    id: "linuxX8664Rpm",
    label: "x86_64 版本",
    description: "适用于 x86_64 架构 Linux 系统（RHEL/CentOS/Fedora）。",
    badge: "RHEL 系",
    primary: false,
  },
  {
    id: "linuxAarch64Rpm",
    label: "aarch64 版本",
    description: "适用于 aarch64 架构 Linux 系统（RHEL/CentOS/Fedora）。",
    badge: "RHEL 系",
    primary: false,
  },
] as const;

const downloadSteps = [
  {
    title: "创建账号并购买套餐",
    description: "选择适合您的流量和设备方案，完成注册与购买。",
  },
  {
    title: "下载应用程序",
    description: "根据当前设备下载安装包，并完成客户端安装。",
  },
  {
    title: "连接 VPN",
    description: "登录账号，选择节点后即可开始安全连接。",
  },
] as const;

const comparisonRows = [
  {
    feature: "数据收集风险",
    freeVpn: "较高：免费服务通常依赖广告或数据变现",
    crowVpn: "更低：以清晰套餐和服务质量为核心",
  },
  {
    feature: "速度和带宽",
    freeVpn: "受限：常见限速、排队或流量限制",
    crowVpn: "稳定：按套餐提供清晰可用的连接能力",
  },
  {
    feature: "广告和追踪",
    freeVpn: "常见：可能包含广告或额外追踪",
    crowVpn: "更少干扰：专注连接体验本身",
  },
  {
    feature: "客户支持",
    freeVpn: "有限：帮助渠道和响应时间不稳定",
    crowVpn: "更可靠：提供明确的支持入口",
  },
  {
    feature: "节点和线路",
    freeVpn: "较少：可选节点有限，拥堵更常见",
    crowVpn: "更灵活：多地区节点，按需求选择",
  },
  {
    feature: "隐私和安全",
    freeVpn: "不确定：配置和透明度参差不齐",
    crowVpn: "更清晰：以加密连接和可控体验为基础",
  },
] as const;

const appAdvantages = [
  {
    title: "更安心的隐私保护",
    description: "通过加密连接减少公共网络和跨境访问中的暴露风险，让日常浏览更安心。",
    image: "/images/download-advantages/advantage-1.png",
  },
  {
    title: "多设备轻松使用",
    description: "支持电脑、手机和平板安装，常用设备都能快速接入。",
    image: "/images/download-advantages/advantage-2.png",
  },
  {
    title: "快速选择合适节点",
    description: "多地区节点可按需求切换，帮助您更快找到合适线路。",
    image: "/images/download-advantages/advantage-3.png",
  },
  {
    title: "套餐更灵活",
    description: "按设备数与流量选择方案，不必为用不到的能力多付费。",
    image: "/images/download-advantages/advantage-4.png",
  },
  {
    title: "连接状态更清晰",
    description: "客户端展示连接状态和剩余信息，关键数据一目了然。",
    image: "/images/download-advantages/advantage-5.png",
  },
  {
    title: "安装流程简单",
    description: "从下载到登录再到连接，流程直接，几步即可开始使用。",
    image: "/images/download-advantages/advantage-6.png",
  },
  {
    title: "节点覆盖更丰富",
    description: "覆盖多地区线路，适合旅行、办公和跨境日常使用。",
    image: "/images/download-advantages/advantage-7.png",
  },
  {
    title: "稳定的使用体验",
    description: "围绕日常连接场景优化，减少重复配置和来回折腾。",
    image: "/images/download-advantages/advantage-8.png",
  },
  {
    title: "支持入口明确",
    description: "需要帮助时能快速找到支持渠道，减少自行排查成本。",
    image: "/images/download-advantages/advantage-9.png",
  },
] as const;

type HeroDownloadAction =
  | { label: string; href: string }
  | { label: string; href: `#${string}` };

type UserAgentDataLike = {
  platform?: string;
  getHighEntropyValues?: (hints: string[]) => Promise<{ architecture?: string; platform?: string }>;
};

function ExtensionIcon({ iconKey }: { iconKey: NonNullable<DownloadItem["iconKey"]> }) {
  const props = { ...downloadIconProps, size: "32" as const };
  switch (iconKey) {
    case "chrome":
      return <BrowserChrome {...props} />;
    case "firefox":
      return <Browser {...props} />;
    case "edge":
      return <ApplicationOne {...props} />;
  }
}

function PlatformCardIcon({ item }: { item: DownloadItem }) {
  if (item.src) {
    return (
      <Image src={item.src} alt="" width={36} height={36} className="h-9 w-9 object-contain" unoptimized />
    );
  }
  if (item.iconKey) {
    return <ExtensionIcon iconKey={item.iconKey} />;
  }
  return null;
}

function DownloadPlatformCard({ item, onSelect }: { item: DownloadItem; onSelect?: () => void }) {
  const cardClassName =
    "group relative flex min-h-[148px] w-full flex-col rounded-2xl bg-[#f0f2f5] p-5 text-left transition hover:bg-[#e8ebef] sm:min-h-[156px] sm:p-6";
  const cardContent = (
    <>
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center [&_svg]:block">
          <PlatformCardIcon item={item} />
        </span>
        <DownloadOne className="shrink-0 opacity-70 transition group-hover:opacity-100" {...downloadIconProps} />
      </div>
      <div>
        <p className="mt-6 text-sm text-[#171717]">下载</p>
        <p className="mt-0.5 text-base font-semibold leading-snug text-[#171717] sm:text-lg">{item.label}</p>
      </div>
    </>
  );

  if (onSelect) {
    return (
      <button type="button" onClick={onSelect} className={cardClassName}>
        {cardContent}
      </button>
    );
  }

  return (
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      className={cardClassName}
    >
      {cardContent}
    </a>
  );
}

export function WindowsDownloadDialog({
  links,
  open,
  onClose,
}: {
  links: LatestDownloadLinks;
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/35 px-4 py-6 backdrop-blur-sm"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="windows-download-title"
        className="w-full max-w-3xl overflow-hidden rounded-[28px] border border-[var(--border)] bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative overflow-hidden border-b border-[var(--border)] bg-[#f7f9fc] px-6 py-6 sm:px-8 sm:py-7">
          <div
            className="pointer-events-none absolute -right-20 -top-24 h-48 w-48 rounded-full bg-[var(--accent-primary)]/10 blur-3xl"
            aria-hidden
          />
          <div className="relative flex items-start justify-between gap-4">
            <div className="flex min-w-0 gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-[var(--shadow-card)]">
                <Image src="/images/win.svg" alt="" width={30} height={30} className="h-7 w-7" unoptimized />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[var(--accent-primary)]">Windows 应用程序</p>
                <h3
                  id="windows-download-title"
                  className="mt-1 text-2xl font-semibold tracking-tight text-[#171717] sm:text-3xl"
                >
                  请选择适合你的版本
                </h3>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--muted)]">
                  根据你的电脑处理器架构选择安装包。大多数用户选择 64位版即可。
                </p>
              </div>
            </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/70 text-[#8b8f96] shadow-sm transition hover:bg-white hover:text-[#171717]"
            aria-label="关闭弹窗"
          >
            <span aria-hidden className="text-3xl font-light leading-none">
              ×
            </span>
          </button>
          </div>
        </div>

        <div className="px-6 pb-6 pt-6 sm:px-8 sm:pb-8">
          <div className="grid gap-4 sm:grid-cols-2">
            {windowsDownloadOptions.map((option) => (
              <a
                key={option.label}
                href={links[option.id]}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-2xl border border-[var(--border)] bg-[#f0f2f5] p-5 transition hover:border-[#171717]/20 hover:bg-[#e8ebef]"
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="block text-lg font-semibold text-[#171717]">{option.label}</span>
                  <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-[#5c5c5c]">
                    {option.badge}
                  </span>
                </span>
                <span className="mt-2 block min-h-11 text-sm leading-relaxed text-[var(--muted)]">
                  {option.description}
                </span>
                <span
                  className={`mt-5 inline-flex w-full items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                    option.primary
                      ? "bg-[var(--accent-primary)] text-white group-hover:bg-[var(--accent-primary-hover)]"
                      : "border border-[#171717] bg-white text-[#171717] group-hover:bg-black/[0.04]"
                  }`}
                >
                  下载
                </span>
              </a>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-card)]">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--accent-primary)]/12 text-sm font-semibold text-[var(--accent-primary)]">
                ?
              </span>
              <div>
            <h4 className="text-base font-semibold text-[#171717]">如何选择合适的版本?</h4>
            <div className="mt-3 space-y-2 text-sm leading-relaxed text-[var(--muted)]">
              <p>64位版：适用于大多数 Windows 电脑（Intel 或 AMD 处理器）。</p>
              <p>ARM 版：适用于 ARM 处理器的 Windows 设备（如 Surface Pro X）。</p>
              <p>如果不确定，请选择 64位版，适用于大多数设备。</p>
            </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MacChipGuideIllustration() {
  return (
    <div className="mt-4 grid gap-4 sm:grid-cols-2">
      <div className="overflow-hidden rounded-2xl border border-[#dbe1ea] bg-[#dff2ff]">
        <div className="flex h-8 items-center gap-4 bg-[#9fd5ff] px-4 text-xs font-semibold text-[#27313b]">
          <span className="font-bold"></span>
          <span>访达</span>
          <span>文件</span>
          <span>编辑</span>
        </div>
        <div className="m-4 max-w-[14rem] rounded-xl bg-white/80 p-2 text-xs text-[#26313a] shadow-sm">
          <div className="rounded-lg bg-[#2688ff] px-3 py-2 font-semibold text-white">关于本机</div>
          <div className="px-3 py-2">系统设置...</div>
          <div className="px-3 py-2">App Store...</div>
          <div className="border-t border-[#c8d7e4] px-3 py-2">睡眠</div>
          <div className="px-3 py-2">重新启动...</div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#dbe1ea] bg-[#eef1f5]">
        <div className="flex h-8 items-center gap-2 bg-[#f8f9fb] px-4">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex min-h-[142px] flex-col items-center justify-center p-4 text-center">
          <div className="mb-4 h-10 w-24 rounded-t-lg border-4 border-[#2f3338] bg-[#8ccfff]" />
          <p className="text-lg font-semibold text-[#3c4046]">MacBook Pro</p>
          <div className="mt-3 w-full max-w-[13rem] space-y-1 text-left text-xs text-[#6a6f77]">
            <p>
              <span className="font-semibold text-[#3c4046]">芯片</span> Apple M 系列
            </p>
            <p>
              <span className="font-semibold text-[#3c4046]">处理器</span> Intel Core
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MacDownloadDialog({
  links,
  open,
  onClose,
}: {
  links: LatestDownloadLinks;
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/35 px-4 py-6 backdrop-blur-sm"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="mac-download-title"
        className="max-h-[calc(100vh-3rem)] w-full max-w-3xl overflow-y-auto rounded-[28px] border border-[var(--border)] bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative overflow-hidden border-b border-[var(--border)] bg-[#f7f9fc] px-6 py-6 sm:px-8 sm:py-7">
          <div
            className="pointer-events-none absolute -right-20 -top-24 h-48 w-48 rounded-full bg-[var(--accent-primary)]/10 blur-3xl"
            aria-hidden
          />
          <div className="relative flex items-start justify-between gap-4">
            <div className="flex min-w-0 gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-[var(--shadow-card)]">
                <Image src="/images/mac.svg" alt="" width={30} height={30} className="h-7 w-7" unoptimized />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[var(--accent-primary)]">macOS 应用程序</p>
                <h3
                  id="mac-download-title"
                  className="mt-1 text-2xl font-semibold tracking-tight text-[#171717] sm:text-3xl"
                >
                  请选择适合你的版本
                </h3>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--muted)]">
                  根据你的 Mac 芯片类型选择安装包。Apple 芯片用户请选择 Apple 芯片版。
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/70 text-[#8b8f96] shadow-sm transition hover:bg-white hover:text-[#171717]"
              aria-label="关闭弹窗"
            >
              <span aria-hidden className="text-3xl font-light leading-none">
                ×
              </span>
            </button>
          </div>
        </div>

        <div className="px-6 pb-6 pt-6 sm:px-8 sm:pb-8">
          <div className="grid gap-4 sm:grid-cols-2">
            {macDownloadOptions.map((option) => (
              <a
                key={option.label}
                href={links[option.id]}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-2xl border border-[var(--border)] bg-[#f0f2f5] p-5 transition hover:border-[#171717]/20 hover:bg-[#e8ebef]"
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="block text-lg font-semibold text-[#171717]">{option.label}</span>
                  <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-[#5c5c5c]">
                    {option.badge}
                  </span>
                </span>
                <span className="mt-2 block min-h-11 text-sm leading-relaxed text-[var(--muted)]">
                  {option.description}
                </span>
                <span
                  className={`mt-5 inline-flex w-full items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                    option.primary
                      ? "bg-[var(--accent-primary)] text-white group-hover:bg-[var(--accent-primary-hover)]"
                      : "border border-[#171717] bg-white text-[#171717] group-hover:bg-black/[0.04]"
                  }`}
                >
                  下载
                </span>
              </a>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-card)]">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--accent-primary)]/12 text-sm font-semibold text-[var(--accent-primary)]">
                ?
              </span>
              <div className="min-w-0 flex-1">
                <h4 className="text-base font-semibold text-[#171717]">如何确认芯片类型?</h4>
                <div className="mt-3 space-y-2 text-sm leading-relaxed text-[var(--muted)]">
                  <p>打开 Apple 菜单，选择“关于本机”。</p>
                  <p>查看“处理器”或“芯片”，确认是“Intel”还是“Apple”。</p>
                </div>
                <MacChipGuideIllustration />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LinuxDownloadDialog({
  links,
  open,
  onClose,
}: {
  links: LatestDownloadLinks;
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/35 px-4 py-6 backdrop-blur-sm"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="linux-download-title"
        className="max-h-[calc(100vh-3rem)] w-full max-w-4xl overflow-y-auto rounded-[28px] border border-[var(--border)] bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative overflow-hidden border-b border-[var(--border)] bg-[#f7f9fc] px-6 py-6 sm:px-8 sm:py-7">
          <div
            className="pointer-events-none absolute -right-20 -top-24 h-48 w-48 rounded-full bg-[var(--accent-primary)]/10 blur-3xl"
            aria-hidden
          />
          <div className="relative flex items-start justify-between gap-4">
            <div className="flex min-w-0 gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-[var(--shadow-card)]">
                <Image src="/images/liunx.svg" alt="" width={30} height={30} className="h-7 w-7" unoptimized />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[var(--accent-primary)]">Linux 应用程序</p>
                <h3
                  id="linux-download-title"
                  className="mt-1 text-2xl font-semibold tracking-tight text-[#171717] sm:text-3xl"
                >
                  请选择适合你的版本
                </h3>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--muted)]">
                  根据你的发行版家族和处理器架构选择安装包。
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/70 text-[#8b8f96] shadow-sm transition hover:bg-white hover:text-[#171717]"
              aria-label="关闭弹窗"
            >
              <span aria-hidden className="text-3xl font-light leading-none">
                ×
              </span>
            </button>
          </div>
        </div>

        <div className="px-6 pb-6 pt-6 sm:px-8 sm:pb-8">
          <div className="grid gap-4 sm:grid-cols-2">
            {linuxDownloadOptions.map((option) => (
              <a
                key={option.label}
                href={links[option.id]}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-2xl border border-[var(--border)] bg-[#f0f2f5] p-5 transition hover:border-[#171717]/20 hover:bg-[#e8ebef]"
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="block text-lg font-semibold text-[#171717]">{option.label}</span>
                  <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-[#5c5c5c]">
                    {option.badge}
                  </span>
                </span>
                <span className="mt-2 block min-h-11 text-sm leading-relaxed text-[var(--muted)]">
                  {option.description}
                </span>
                <span
                  className={`mt-5 inline-flex w-full items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                    option.primary
                      ? "bg-[var(--accent-primary)] text-white group-hover:bg-[var(--accent-primary-hover)]"
                      : "border border-[#171717] bg-white text-[#171717] group-hover:bg-black/[0.04]"
                  }`}
                >
                  下载
                </span>
              </a>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-card)]">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--accent-primary)]/12 text-sm font-semibold text-[var(--accent-primary)]">
                ?
              </span>
              <div>
                <h4 className="text-base font-semibold text-[#171717]">如何选择合适的版本?</h4>
                <div className="mt-3 space-y-2 text-sm leading-relaxed text-[var(--muted)]">
                  <p>Debian/Ubuntu 系发行版请选择 amd64 或 arm64。</p>
                  <p>RHEL/CentOS/Fedora 系发行版请选择 x86_64 或 aarch64。</p>
                  <p>如果不确定架构，可在终端运行 uname -m 查看当前系统架构。</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AndroidDownloadDialog({
  href,
  open,
  onClose,
}: {
  href: string;
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/35 px-4 py-6 backdrop-blur-sm"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="android-download-title"
        className="w-full max-w-2xl overflow-hidden rounded-[28px] border border-[var(--border)] bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative overflow-hidden border-b border-[var(--border)] bg-[#f7f9fc] px-6 py-6 sm:px-8 sm:py-7">
          <div
            className="pointer-events-none absolute -right-20 -top-24 h-48 w-48 rounded-full bg-[var(--accent-primary)]/10 blur-3xl"
            aria-hidden
          />
          <div className="relative flex items-start justify-between gap-4">
            <div className="flex min-w-0 gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-[var(--shadow-card)]">
                <Image src="/images/android.svg" alt="" width={30} height={30} className="h-7 w-7" unoptimized />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[var(--accent-primary)]">Android APK</p>
                <h3
                  id="android-download-title"
                  className="mt-1 text-2xl font-semibold tracking-tight text-[#171717] sm:text-3xl"
                >
                  下载 Android 应用程序
                </h3>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--muted)]">
                  使用手机扫码，或直接点击按钮下载安装包。
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/70 text-[#8b8f96] shadow-sm transition hover:bg-white hover:text-[#171717]"
              aria-label="关闭弹窗"
            >
              <span aria-hidden className="text-3xl font-light leading-none">
                ×
              </span>
            </button>
          </div>
        </div>

        <div className="grid gap-6 px-6 pb-6 pt-6 sm:grid-cols-[220px_minmax(0,1fr)] sm:px-8 sm:pb-8">
          <div className="flex items-center justify-center rounded-2xl border border-[var(--border)] bg-white p-4 shadow-[var(--shadow-card)]">
            <AndroidQrMark href={href} />
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-lg font-semibold text-[#171717]">扫码下载</p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
              建议使用手机浏览器扫码打开下载页。若当前就在 Android 手机上，可直接点击下方按钮下载。
            </p>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[var(--accent-primary)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-primary-hover)] sm:w-auto"
            >
              下载 Android APK
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function AndroidQrMark({ href }: { href: string }) {
  const qrSrc = `/api/qr?data=${encodeURIComponent(href)}`;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={qrSrc}
      alt="Android APK 下载二维码"
      className="h-44 w-44 rounded-lg bg-white object-contain sm:h-48 sm:w-48"
      loading="lazy"
      decoding="async"
      data-qr-value={href}
    />
  );
}

export function DownloadPageContent() {
  const [windowsDialogOpen, setWindowsDialogOpen] = useState(false);
  const [macDialogOpen, setMacDialogOpen] = useState(false);
  const [linuxDialogOpen, setLinuxDialogOpen] = useState(false);
  const [androidDialogOpen, setAndroidDialogOpen] = useState(false);
  const [latestDownloadLinks, setLatestDownloadLinks] = useState<LatestDownloadLinks>(FALLBACK_DOWNLOAD_LINKS);
  const [heroDownloadAction, setHeroDownloadAction] = useState<HeroDownloadAction>({
    label: "下载应用程序",
    href: `#${DOWNLOAD_PLATFORMS_SECTION_ID}`,
  });
  const androidDownloadHref = latestDownloadLinks.androidApk;

  useEffect(() => {
    let cancelled = false;

    async function loadLatestDownloadLinks() {
      try {
        const response = await fetch("/api/downloads/latest");
        if (!response.ok) return;
        const links = (await response.json()) as LatestDownloadLinks;
        if (!cancelled) setLatestDownloadLinks(links);
      } catch {
        // Keep the bundled fallback links if the latest endpoint is unavailable.
      }
    }

    loadLatestDownloadLinks();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function detectHeroDownloadAction() {
      const userAgent = navigator.userAgent.toLowerCase();
      const userAgentData = (navigator as Navigator & { userAgentData?: UserAgentDataLike }).userAgentData;
      const fallbackAction: HeroDownloadAction = {
        label: "下载应用程序",
        href: `#${DOWNLOAD_PLATFORMS_SECTION_ID}`,
      };

      let architecture: string | undefined;
      let platform = userAgentData?.platform?.toLowerCase();

      try {
        const values = await userAgentData?.getHighEntropyValues?.(["architecture", "platform"]);
        architecture = values?.architecture?.toLowerCase();
        platform = values?.platform?.toLowerCase() ?? platform;
      } catch {
        // Browsers may decline high-entropy hints. Fall back to platform-only detection.
      }

      let action = fallbackAction;

      if (userAgent.includes("android")) {
        action = { label: "下载 Android APK", href: androidDownloadHref };
      } else if (platform === "windows" || userAgent.includes("windows")) {
        if (architecture === "arm") {
          action = { label: "下载 Windows", href: latestDownloadLinks.windowsArm64 };
        } else if (architecture === "x86") {
          action = { label: "下载 Windows", href: latestDownloadLinks.windowsX64 };
        } else {
          action = { label: "选择 Windows 版本", href: `#${DOWNLOAD_PLATFORMS_SECTION_ID}` };
        }
      } else if (platform === "macos" || userAgent.includes("mac os")) {
        if (architecture === "arm") {
          action = { label: "下载 macOS", href: latestDownloadLinks.macApple };
        } else if (architecture === "x86") {
          action = { label: "下载 macOS", href: latestDownloadLinks.macIntel };
        } else {
          action = { label: "选择 macOS 版本", href: `#${DOWNLOAD_PLATFORMS_SECTION_ID}` };
        }
      }

      if (!cancelled) setHeroDownloadAction(action);
    }

    detectHeroDownloadAction();
    return () => {
      cancelled = true;
    };
  }, [androidDownloadHref, latestDownloadLinks]);

  function handleAndroidDownload() {
    if (window.matchMedia("(max-width: 639px)").matches) {
      window.location.href = androidDownloadHref;
      return;
    }

    setAndroidDialogOpen(true);
  }

  return (
    <>
      <section className="relative isolate overflow-hidden bg-white pt-[calc(2rem+4.25rem)]">
        <div className="relative z-10 mx-auto grid min-h-[640px] w-full max-w-[var(--page-max)] lg:grid-cols-2">
          <div className="flex flex-col justify-center px-6 py-12 sm:px-10 sm:py-16 lg:px-10 lg:py-20">
            <h1 className="text-3xl font-semibold leading-tight tracking-tight text-[#171717] sm:text-4xl lg:text-[2.75rem]">
              下载 CrowVPN 应用程序
            </h1>
            <ul className="mt-6 space-y-3 sm:mt-8">
              {heroBullets.map((line) => (
                <li key={line} className="flex gap-3 text-sm leading-relaxed text-[var(--muted)] sm:text-base">
                  <span
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#171717] text-white"
                    aria-hidden
                  >
                    <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M2.5 6.2 5 8.7 9.5 3.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center">
              <a
                href={heroDownloadAction.href}
                className="inline-flex items-center justify-center rounded-full bg-[var(--accent-primary)] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-primary-hover)]"
              >
                {heroDownloadAction.label}
              </a>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-full border border-[#171717] bg-white px-7 py-3 text-sm font-semibold text-[#171717] transition hover:bg-black/[0.04]"
              >
                查看套餐
              </Link>
            </div>
            <p className="mt-5 text-xs leading-relaxed text-[var(--muted)] sm:text-sm">
              初次使用 VPN？安装客户端后登录账号即可连接；套餐与同时在线设备数以定价页说明为准。
            </p>
          </div>

          <div className="relative flex min-h-[280px] items-center justify-center overflow-hidden sm:min-h-[360px] lg:min-h-0">
            <div className="relative z-[2] mx-auto w-full max-w-[min(100%,520px)] px-6 py-8 sm:max-w-[640px] sm:px-10 lg:max-w-[680px] lg:px-8">
              <LocalizedImage
                zhSrc={HERO_ART}
                neutralSrc="/images/i18n-neutral/download-banner.png"
                alt="CrowVPN 客户端界面示意"
                width={1024}
                height={600}
                className="h-auto w-full object-contain object-center"
                priority
                sizes="(max-width: 1024px) 90vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      <section
        id={DOWNLOAD_PLATFORMS_SECTION_ID}
        className="scroll-mt-[calc(2rem+4.25rem+1rem)] bg-white py-14 sm:py-20"
      >
        <div className="mx-auto max-w-[var(--page-max)] px-6 lg:px-10">
          <h2 className="text-center text-3xl font-semibold tracking-tight text-[#171717] sm:text-4xl">
            获得适用于您所有设备的 CrowVPN
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-base leading-relaxed text-[var(--muted)] sm:text-lg">
            无论您是在寻找适用于智能手机、平板电脑的应用程序，还是浏览器扩展程序，CrowVPN 都能满足您的需求。
          </p>

          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {downloadItems.slice(0, 4).map((item) => (
              <li key={item.id}>
                <DownloadPlatformCard
                  item={item}
                  onSelect={
                    item.id === "windows"
                      ? () => setWindowsDialogOpen(true)
                      : item.id === "macos"
                        ? () => setMacDialogOpen(true)
                        : item.id === "linux"
                          ? () => setLinuxDialogOpen(true)
                          : item.id === "android"
                            ? handleAndroidDownload
                        : undefined
                  }
                />
              </li>
            ))}
          </ul>

          <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-relaxed text-[var(--muted)] sm:text-sm">
            iOS 版本官方客户端预计 2026 年 12 月份上线，暂时不提供。
          </p>

        </div>
      </section>
      <section className="bg-[var(--surface-muted)] py-14 sm:py-20">
        <div className="mx-auto max-w-[var(--page-max)] px-6 lg:px-10">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-[#171717] sm:text-4xl lg:whitespace-nowrap">
              只需 3 个简单的步骤，即可下载并使用 VPN
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[var(--muted)] sm:text-lg">
              从购买套餐到完成连接，几分钟内即可开始使用 CrowVPN。
            </p>
          </div>

          <ol className="mt-10 grid gap-4 lg:grid-cols-3 lg:gap-5">
            {downloadSteps.map((step, index) => (
              <li
                key={step.title}
                className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-card)]"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent-primary)] text-sm font-semibold text-white">
                  {index + 1}
                </span>
                <h3 className="mt-5 text-xl font-semibold text-[#171717]">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--muted)] sm:text-base">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-[var(--page-max)] px-6 lg:px-10">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-[#171717] sm:text-4xl">
              探索 CrowVPN 应用程序的主要优势
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[var(--muted)] sm:text-lg">
              围绕连接、设备、节点和支持体验，CrowVPN 提供更清晰、更顺手的日常使用方式。
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {appAdvantages.map((item) => (
              <article
                key={item.title}
                className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[#f7f8fa] p-5 text-center sm:p-6"
              >
                <div className="relative mx-auto aspect-square w-full max-w-[220px] overflow-hidden">
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 220px, (min-width: 640px) 220px, 70vw"
                    className="object-cover"
                  />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-[#171717]">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--muted)] sm:text-base">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-[var(--page-max)] px-6 lg:px-10">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-[#171717] sm:text-4xl">
              CrowVPN 对比免费 VPN
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[var(--muted)] sm:text-lg">
              免费 VPN 看起来没有门槛，但在速度、隐私和服务稳定性上往往需要妥协。CrowVPN 更适合希望长期稳定使用的人。
            </p>
          </div>

          <div className="mt-10 overflow-hidden rounded-[28px] border border-[var(--border)] bg-white">
            <div className="hidden grid-cols-[220px_1fr_1fr] border-b border-[var(--border)] bg-[#f0f2f5] text-sm font-semibold text-[#171717] md:grid">
              <div className="px-6 py-5" />
              <div className="border-l border-[var(--border)] px-6 py-5">免费 VPN</div>
              <div className="border-l border-[var(--border)] px-6 py-5">CrowVPN</div>
            </div>

            {comparisonRows.map((row) => (
              <div
                key={row.feature}
                className="grid border-b border-[var(--border)] last:border-b-0 md:grid-cols-[220px_1fr_1fr]"
              >
                <div className="bg-[#fafbfc] px-5 py-5 text-base font-semibold text-[#171717] md:px-6">
                  {row.feature}
                </div>
                <div className="px-5 py-5 text-sm leading-relaxed text-[var(--muted)] md:border-l md:border-[var(--border)] md:px-6 md:text-base">
                  <span className="mb-1 block text-xs font-semibold text-[#8b8f96] md:hidden">免费 VPN</span>
                  {row.freeVpn}
                </div>
                <div className="bg-[#fff7f8] px-5 py-5 text-sm leading-relaxed text-[#171717] md:border-l md:border-[var(--border)] md:px-6 md:text-base">
                  <span className="mb-1 block text-xs font-semibold text-[var(--accent-primary)] md:hidden">CrowVPN</span>
                  {row.crowVpn}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <TestimonialsSection />
      <WindowsDownloadDialog
        links={latestDownloadLinks}
        open={windowsDialogOpen}
        onClose={() => setWindowsDialogOpen(false)}
      />
      <MacDownloadDialog
        links={latestDownloadLinks}
        open={macDialogOpen}
        onClose={() => setMacDialogOpen(false)}
      />
      <LinuxDownloadDialog
        links={latestDownloadLinks}
        open={linuxDialogOpen}
        onClose={() => setLinuxDialogOpen(false)}
      />
      <AndroidDownloadDialog
        href={androidDownloadHref}
        open={androidDialogOpen}
        onClose={() => setAndroidDialogOpen(false)}
      />
    </>
  );
}
