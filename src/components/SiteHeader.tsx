"use client";

import Image from "next/image";
import navLayout from "./SiteHeader.module.css";
import { DropdownNavigation, DropdownNavigationItem } from "./ui/dorpdown-navigation";
import Link from "next/link";
import {
  useEffect,
  useState,
  type MouseEvent,
  type MouseEventHandler,
  type ReactNode,
} from "react";
import { defaultLocale, getLocaleMeta, isLocaleCode, localeOptions, type LocaleCode } from "@/i18n/locales";
import { getMessage } from "@/i18n/messages";
import { applyLocale } from "@/components/LocaleTextBridge";
import { CROWMESH_USER_LOGIN_URL } from "@/data/downloadPlatforms";

type NavLinkItem = {
  href: string;
  label: string;
  external?: boolean;
  category?: string;
  description?: string;
};

type NavItem =
  | ({ label: string } & NavLinkItem)
  | {
      label: string;
      children: NavLinkItem[];
    };

const navItems: NavItem[] = [
  { label: "定价", href: "/pricing" },
  {
    label: "介绍",
    children: [
      { href: "/security", label: "安全" },
      { href: "/about", label: "关于我们" },
      { href: "/testimonials", label: "用户评价" },
    ],
  },
  { label: "下载 VPN", href: "/download" },
  {
    label: "帮助中心",
    children: [
      {
        href: "https://docs.crowmesh.com/",
        label: "CrowVPN 使用教程",
        category: "快速开始",
        description: "安装、配置与基础使用入口",
      },
      {
        href: "https://docs.crowmesh.com/kuaisu",
        label: "节点升级说明",
        category: "快速开始",
        description: "升级节点前的客户端准备",
      },
      {
        href: "https://docs.crowmesh.com/client/about",
        label: "关于官方客户端",
        category: "官方客户端",
        description: "了解 CrowVPN 客户端功能",
      },
      {
        href: "https://docs.crowmesh.com/client/windows-download",
        label: "Windows 下载",
        category: "官方客户端",
        description: "Windows 安装包与说明",
      },
      {
        href: "https://docs.crowmesh.com/client/mac-download",
        label: "macOS 下载",
        category: "官方客户端",
        description: "Apple 与 Intel 芯片安装说明",
      },
      {
        href: "https://docs.crowmesh.com/client/linux-download",
        label: "Linux 下载",
        category: "官方客户端",
        description: "Debian / Ubuntu / RPM 安装包",
      },
      {
        href: "https://docs.crowmesh.com/client/android-download",
        label: "Android 下载",
        category: "官方客户端",
        description: "Android 官方客户端获取",
      },
      {
        href: "https://docs.crowmesh.com/platforms/ios",
        label: "iPhone / iPad",
        category: "第三方客户端",
        description: "Shadowrocket 配置与使用",
      },
      {
        href: "https://docs.crowmesh.com/platforms/appleid-switch",
        label: "Apple ID 切换",
        category: "第三方客户端",
        description: "海外 Apple ID 切换说明",
      },
      {
        href: "https://docs.crowmesh.com/platforms/windows",
        label: "Clash Verge for Windows",
        category: "第三方客户端",
        description: "Windows 第三方客户端教程",
      },
      {
        href: "https://docs.crowmesh.com/platforms/macos",
        label: "Clash Verge for macOS",
        category: "第三方客户端",
        description: "macOS 第三方客户端教程",
      },
      {
        href: "https://docs.crowmesh.com/platforms/android",
        label: "Clash Meta for Android",
        category: "第三方客户端",
        description: "Android 第三方客户端教程",
      },
      {
        href: "https://docs.crowmesh.com/troubleshooting/connection-issues",
        label: "连接问题处理",
        category: "问题解决",
        description: "排查无法连接与断连问题",
      },
      {
        href: "https://docs.crowmesh.com/troubleshooting/update-nodes",
        label: "更新节点",
        category: "问题解决",
        description: "节点订阅更新指南",
      },
      {
        href: "https://docs.crowmesh.com/troubleshooting/check-account",
        label: "检查套餐及环境",
        category: "问题解决",
        description: "确认账号、套餐和网络环境",
      },
      {
        href: "https://docs.crowmesh.com/faq/usage",
        label: "使用相关",
        category: "常见问题",
        description: "日常使用中的常见疑问",
      },
      {
        href: "https://docs.crowmesh.com/faq/plans",
        label: "套餐相关",
        category: "常见问题",
        description: "购买、升级和管理套餐",
      },
      {
        href: "https://docs.crowmesh.com/faq/refund",
        label: "退款说明",
        category: "常见问题",
        description: "退款规则与处理方式",
      },
      {
        href: "https://docs.crowmesh.com/faq/account-issues",
        label: "账户异常",
        category: "常见问题",
        description: "账户状态异常处理",
      },
      {
        href: "https://docs.crowmesh.com/faq/tiktok-usage",
        label: "TikTok 使用说明",
        category: "场景指南",
        description: "海外 TikTok 访问指南",
      },
      {
        href: "https://docs.crowmesh.com/client/faq",
        label: "客户端常见问题",
        category: "技术支持",
        description: "官方客户端问题答疑",
      },
      {
        href: "https://docs.crowmesh.com/faq/other-issues",
        label: "其他常见问题",
        category: "技术支持",
        description: "其他支持与排查入口",
      },
    ],
  },
];

const dropdownLinkClass =
  "block px-4 py-2.5 text-sm font-medium text-[#171717] transition hover:bg-black/[0.04]";

function groupNavChildren(children: NavLinkItem[]) {
  return children.reduce<Array<{ category: string; links: NavLinkItem[] }>>((groups, child) => {
    const category = child.category ?? "";
    const last = groups[groups.length - 1];
    if (last?.category === category) {
      last.links.push(child);
    } else {
      groups.push({ category, links: [child] });
    }
    return groups;
  }, []);
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2 12h20" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 2c2.5 3 4 7.2 4 10s-1.5 7-4 10m0-20c-2.5 3-4 7.2-4 10s1.5 7 4 10"
      />
    </svg>
  );
}

function NavAnchor({
  href,
  external,
  className,
  children,
  onClick,
}: {
  href: string;
  external?: boolean;
  className?: string;
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}) {
  if (external || href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}

function translateNavText(locale: LocaleCode, source: string) {
  const translated = getMessage(locale, source);
  if (locale !== "zh-CN" && locale !== "zh-HK" && translated === source) {
    return getMessage("en", source);
  }
  return translated;
}

function DesktopNavItem({ item, locale }: { item: NavItem; locale: LocaleCode }) {
  const translate = (source: string) => translateNavText(locale, source);

  if ("children" in item) {
    const groups = groupNavChildren(item.children);
    const hasCategories = groups.some((group) => group.category);

    return (
      <DropdownNavigationItem label={translate(item.label)}>
        <div
          className={`${
            hasCategories
              ? "w-[min(76vw,65rem)] p-7"
              : "min-w-[11.5rem] py-1.5"
          }`}
        >
          {hasCategories ? (
            <div>
              <p className="mb-6 border-b border-[#edf0f2] pb-5 text-lg font-semibold text-[#203443]">{translate(item.label)}</p>
              <div className="grid grid-cols-4 gap-5">
              {[["快速开始", "问题解决", "场景指南"], ["官方客户端"], ["第三方客户端"], ["常见问题", "技术支持"]].map((categories, column) => (
                <div key={categories[0]} className={column ? "space-y-6 border-l border-[#edf0f2] pl-5" : "space-y-6"}>
              {categories.flatMap(category => groups.filter(group => group.category === category)).map((group) => (
                <div key={group.category || item.label}>
                  {group.category ? (
                    <p className="mb-1.5 px-2 text-xs font-semibold text-[#8b8f96]">
                      {translate(group.category)}
                    </p>
                  ) : null}
                  <div className="space-y-1">
                    {group.links.map((child) => (
                      <NavAnchor
                        key={`${item.label}-${child.label}`}
                        href={child.href}
                        external={child.external}
                        className="block rounded-lg px-2.5 py-2.5 text-sm transition-colors hover:bg-[#f1f5f8] focus-visible:bg-[#f1f5f8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#516471]"
                      >
                        <span className="block font-semibold text-[#171717]">{translate(child.label)}</span>
                        {child.description && ["CrowVPN 使用教程", "关于官方客户端", "iPhone / iPad"].includes(child.label) ? (
                          <span className="mt-0.5 block text-xs leading-relaxed text-[var(--muted)]">
                            {translate(child.description)}
                          </span>
                        ) : null}
                      </NavAnchor>
                    ))}
                  </div>
                </div>
              ))}
                </div>
              ))}
              </div>
            </div>
          ) : (
            item.children.map((child) => (
              <NavAnchor
                key={`${item.label}-${child.label}`}
                href={child.href}
                external={child.external}
                className={dropdownLinkClass}
              >
                {translate(child.label)}
              </NavAnchor>
            ))
          )}
        </div>
      </DropdownNavigationItem>
    );
  }

  return (
    <DropdownNavigationItem href={item.href} external={item.external} label={translate(item.label)} />
  );
}

function MobileNavItem({ item, locale, onNavigate }: { item: NavItem; locale: LocaleCode; onNavigate?: () => void }) {
  const translate = (source: string) => translateNavText(locale, source);

  if ("children" in item) {
    const groups = groupNavChildren(item.children);
    const hasCategories = groups.some((group) => group.category);

    return (
      <div className="border-b border-[var(--border)] last:border-b-0">
        <p className="px-4 pb-1 pt-3 text-xs font-semibold uppercase tracking-wide text-[#8b8f96]">
          {translate(item.label)}
        </p>
        {hasCategories
          ? groups.map((group) => (
              <div key={group.category || item.label} className="pb-2">
                {group.category ? (
                  <p className="px-4 pb-1 pt-2 text-[11px] font-semibold text-[#8b8f96]">
                    {translate(group.category)}
                  </p>
                ) : null}
                {group.links.map((child) => (
                  <NavAnchor
                    key={`${item.label}-${child.label}`}
                    href={child.href}
                    external={child.external}
                    className="block px-4 py-2 text-sm font-semibold text-[#171717] hover:bg-black/[0.04]"
                    onClick={onNavigate}
                  >
                    {translate(child.label)}
                  </NavAnchor>
                ))}
              </div>
            ))
          : item.children.map((child) => (
              <NavAnchor
                key={`${item.label}-${child.label}`}
                href={child.href}
                external={child.external}
                className="block px-4 py-2.5 text-sm font-semibold text-[#171717] hover:bg-black/[0.04]"
                onClick={onNavigate}
              >
                {translate(child.label)}
              </NavAnchor>
            ))}
      </div>
    );
  }

  return (
    <NavAnchor
      href={item.href}
      external={item.external}
      className="block border-b border-[var(--border)] px-4 py-3 text-sm font-semibold text-[#171717] hover:bg-black/[0.04] last:border-b-0"
      onClick={onNavigate}
    >
      {translate(item.label)}
    </NavAnchor>
  );
}

const outlineCtaClass =
  "inline-flex items-center justify-center rounded-full border border-black bg-transparent px-4 py-2 text-xs font-semibold text-[#171717] shadow-none transition hover:bg-black/[0.04] sm:px-5 sm:text-sm";

type SiteHeaderProps = {
  compactHomeNav?: boolean;
  /**
   * 首屏为全宽配图/视频时开启：未滚动前为导航条增加浅底玻璃态，
   * 避免深色链接叠在暗色背景上不可读（滚动后仍与默认行为一致）。
   */
  solidNavBarUntilScroll?: boolean;
};

const PROTECTED_ISP_KEYWORDS = [
  "crowvpn",
  "crowmesh",
  "dmit",
  "vultr",
  "it7 networks",
  "it7",
  "xnnet",
  "overland storage",
  "overland",
  "akile",
  "netlab global",
  "netlab",
  "hostwinds",
];

export function SiteHeader({ solidNavBarUntilScroll = false, compactHomeNav = false }: SiteHeaderProps) {
  const visibleNavItems = compactHomeNav
    ? navItems.filter((item) => item.label !== "定价" && item.label !== "下载 VPN")
    : navItems;
  const [scrolled, setScrolled] = useState(false);
  const [ip, setIp] = useState("获取中...");
  const [isp, setIsp] = useState("获取中...");
  const [selectedLanguage, setSelectedLanguage] = useState(defaultLocale);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const storedLanguage = window.localStorage.getItem("crowvpn-language");
      if (isLocaleCode(storedLanguage)) setSelectedLanguage(storedLanguage);
    }, 0);

    function onLocaleChange(event: Event) {
      const locale = (event as CustomEvent<LocaleCode>).detail;
      if (isLocaleCode(locale)) setSelectedLanguage(locale);
    }

    window.addEventListener("crowvpn:locale-change", onLocaleChange);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("crowvpn:locale-change", onLocaleChange);
    };
  }, []);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (compactHomeNav) return;
    let cancelled = false;

    async function fetchJsonWithTimeout<T>(url: string, timeoutMs = 5000): Promise<T> {
      const controller = new AbortController();
      const timer = window.setTimeout(() => controller.abort(), timeoutMs);
      try {
        const response = await fetch(url, {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`${url} fetch failed`);
        return (await response.json()) as T;
      } finally {
        window.clearTimeout(timer);
      }
    }

    function cleanIsp(value: string | null | undefined) {
      return value?.replace(/^AS\d+\s+/i, "").trim() || null;
    }

    async function loadNetworkInfo() {
      let nextIp: string | null = null;
      let nextIsp: string | null = null;

      try {
        const data = await fetchJsonWithTimeout<{ ip?: string; org?: string }>("https://ipinfo.io/json", 3500);
        nextIp = data.ip || null;
        nextIsp = cleanIsp(data.org);
      } catch {
        // Try more browser-side providers below.
      }

      if (!nextIp) {
        try {
          const data = await fetchJsonWithTimeout<{ ip?: string }>("https://api.ipify.org?format=json", 3500);
          nextIp = data.ip || null;
        } catch {
          // Keep unknown when all providers fail.
        }
      }

      if (!nextIsp) {
        try {
          const data = await fetchJsonWithTimeout<{ org?: string; asn?: string }>("https://ipapi.co/json/", 3500);
          nextIsp = [cleanIsp(data.org), data.asn].filter(Boolean).join(" ") || null;
        } catch {
          // Try the next provider below.
        }
      }

      if (!nextIsp) {
        try {
          const data = await fetchJsonWithTimeout<{
            ip?: string;
            connection?: { isp?: string; org?: string; asn?: string };
          }>("https://ipwho.is/", 3500);
          nextIp = nextIp || data.ip || null;
          nextIsp =
            [data.connection?.isp, data.connection?.org, data.connection?.asn].filter(Boolean).join(" ") || null;
        } catch {
          // Try the server-side fallback below.
        }
      }

      if (!nextIp || !nextIsp) {
        try {
          const data = await fetchJsonWithTimeout<{ ip?: string | null; isp?: string | null }>("/api/network-info");
          nextIp = nextIp || data.ip || null;
          nextIsp = nextIsp || data.isp || null;
        } catch {
          // Keep unknown when all providers fail.
        }
      }

      if (!cancelled) {
        setIp(nextIp || "未知");
        setIsp(nextIsp || "未知");
      }
    }

    loadNetworkInfo();
    return () => {
      cancelled = true;
    };
  }, [compactHomeNav]);

  useEffect(() => {
    document.documentElement.lang = getLocaleMeta(selectedLanguage).htmlLang;
  }, [selectedLanguage]);

  function handleLanguageChange(nextLanguage: LocaleCode) {
    setSelectedLanguage(nextLanguage);
    applyLocale(nextLanguage);
  }

  const normalizedIsp = isp.toLowerCase().replace(/[^\w\s.-]/g, " ");
  const isProtected = PROTECTED_ISP_KEYWORDS.some((keyword) => normalizedIsp.includes(keyword));
  const displayedIsp = isProtected ? "CrowVPN" : isp;
  const displayIp = ip === "未知" || ip === "获取中..." ? getMessage(selectedLanguage, ip) : ip;
  const displayIsp =
    displayedIsp === "未知" || displayedIsp === "获取中..." ? getMessage(selectedLanguage, displayedIsp) : displayedIsp;
  const statusLabel = getMessage(selectedLanguage, "您当前的状态");
  const ipLabel = getMessage(selectedLanguage, "您的 IP 地址");
  const ispLabel = getMessage(selectedLanguage, "您的 ISP");
  const protectedLabel = getMessage(selectedLanguage, "已受保护");
  const unprotectedLabel = getMessage(selectedLanguage, "未受保护");
  const protectionHint = getMessage(
    selectedLanguage,
    "想要保护自己的互联网连接？获取 CrowVPN，连接到我们的服务器。",
  );
  const loginLabel = getMessage(selectedLanguage, "登录");
  const getAppLabel = getMessage(selectedLanguage, "获取应用");
  const chooseLanguageLabel = getMessage(selectedLanguage, "选择语言");

  const navBarLifted = solidNavBarUntilScroll && !scrolled;

  function closeMobileNavMenu(event: MouseEvent<HTMLElement>) {
    event.currentTarget.closest("details")?.removeAttribute("open");
  }

  return (
    <header
      data-no-translate
      className={`${navLayout.header} fixed inset-x-0 top-0 z-50 transition-colors ${
        scrolled
          ? "border-b border-black/5 bg-white/55 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent backdrop-blur-none"
      }`}
    >
      {!compactHomeNav && <div className="bg-black text-white">
        <div className="mx-auto flex h-8 w-full max-w-[var(--nav-max)] items-center justify-center px-3 text-[11px] sm:px-8 sm:text-xs lg:px-12 xl:px-16 2xl:px-24">
          <p className="min-w-0 max-w-full truncate text-center">
            {ipLabel}: {displayIp}
            <span className="mx-3 opacity-70">·</span>
            {ispLabel}: {displayIsp}
            <span className="mx-3 opacity-70">·</span>
            {statusLabel}:{" "}
            {isProtected ? (
              <span className="text-[#22c55e]">{protectedLabel}</span>
            ) : (
              <span className="group relative inline-flex cursor-help items-center text-[#FE405B]">
                {unprotectedLabel}
                <span className="pointer-events-none absolute left-1/2 top-[calc(100%+10px)] z-[60] w-max max-w-[min(92vw,520px)] -translate-x-1/2 rounded-2xl bg-[#3c4046] px-5 py-3.5 text-left text-[14px] font-medium leading-relaxed text-white opacity-0 shadow-xl transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100">
                  <span className="absolute -top-2 left-1/2 h-0 w-0 -translate-x-1/2 border-x-8 border-b-8 border-x-transparent border-b-[#3c4046]" />
                  {protectionHint}
                </span>
              </span>
            )}
          </p>
        </div>
      </div>
      }
      <div
        className={
          navBarLifted
            ? "border-b border-black/[0.06] bg-white/82 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset] backdrop-blur-xl transition-[background-color,box-shadow] duration-200"
            : undefined
        }
      >
        <div data-site-nav className="mx-auto flex h-[4.25rem] w-full max-w-[var(--nav-max)] items-center justify-between gap-2 px-4 sm:gap-3 sm:px-8 lg:px-12 xl:px-16 2xl:px-24">
          <Link
            href="/"
            onClick={(event) => {
              if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
              if (window.location.pathname !== "/") return;
              event.preventDefault();
              window.history.replaceState(window.history.state, "", "/");
              window.dispatchEvent(new Event("crowvpn:restart-home"));
              window.scrollTo({ top: 0, behavior: "instant" });
            }}
            className="flex min-w-0 shrink-0 items-center gap-2 text-lg font-semibold tracking-tight text-[#171717] lg:text-xl"
          >
            <Image
              src="/logo.svg"
              alt=""
              width={32}
              height={32}
              className="h-8 w-8 shrink-0"
              priority
              unoptimized
            />
            <span className="truncate">CrowVPN</span>
          </Link>

          <DropdownNavigation>
          <div data-nav-actions className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-4 lg:gap-5">
            <nav className="hidden items-center gap-1 lg:flex xl:gap-2" aria-label="主导航">
              {visibleNavItems.map((item) => (
                <DesktopNavItem key={item.label} item={item} locale={selectedLanguage} />
              ))}
            </nav>

            <div data-nav-account className="hidden items-center gap-2 sm:flex">
            <DropdownNavigationItem
              href={CROWMESH_USER_LOGIN_URL}
              external
              label={loginLabel}
            />

            {!compactHomeNav && <Link
              href="/download"
              className="inline-flex h-10 shrink-0 items-center justify-center rounded-full border border-[#243845]/65 bg-white/40 px-5 text-sm font-semibold text-[#243845] shadow-none transition hover:bg-white/80"
            >
              {getAppLabel}
            </Link>}
            </div>

            <DropdownNavigationItem
              ariaLabel={`${chooseLanguageLabel}: ${getLocaleMeta(selectedLanguage).label}`}
              label={<>
              <span className="flex shrink-0 items-center text-[#171717]" aria-hidden>
                <GlobeIcon className="opacity-80" />
              </span>
              <span className="max-w-[8.5rem] truncate">{getLocaleMeta(selectedLanguage).label}</span>
              </>}
            >
              <div className="max-h-[min(26rem,65vh)] min-w-[11.5rem] overflow-y-auto py-1.5" aria-label={chooseLanguageLabel}>
                {localeOptions.map((language) => (
                  <button
                    key={language.value}
                    type="button"
                    aria-pressed={selectedLanguage === language.value}
                    className={`${dropdownLinkClass} flex w-full items-center justify-between gap-4 text-left focus-visible:bg-black/[0.04] ${selectedLanguage === language.value ? "bg-black/[0.04]" : ""}`}
                    onClick={() => {
                      handleLanguageChange(language.value);
                    }}
                  >
                    <span>{language.label}</span>
                    {selectedLanguage === language.value && <span aria-hidden>✓</span>}
                  </button>
                ))}
              </div>
            </DropdownNavigationItem>

            <details className="relative shrink-0 lg:hidden">
              <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-full text-[#171717] hover:bg-black/[0.06] [&::-webkit-details-marker]:hidden">
                <span className="sr-only">打开菜单</span>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </summary>
              <div className="absolute right-0 top-full z-50 mt-2 max-h-[calc(100vh-8rem)] w-72 overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--surface)] py-2 shadow-lg">
                <NavAnchor
                  href={CROWMESH_USER_LOGIN_URL}
                  external
                  className="block border-b border-[var(--border)] px-4 py-3 text-sm font-semibold text-[#171717] hover:bg-black/[0.04]"
                  onClick={closeMobileNavMenu}
                >
                  {loginLabel}
                </NavAnchor>
                {!compactHomeNav && <NavAnchor
                  href="/download"
                  className={`${outlineCtaClass} mx-2 mb-2 mt-2 w-[calc(100%-1rem)]`}
                  onClick={closeMobileNavMenu}
                >
                  {getAppLabel}
                </NavAnchor>}
                {visibleNavItems.map((item) => (
                  <MobileNavItem key={item.label} item={item} locale={selectedLanguage} />
                ))}
              </div>
            </details>
          </div>
          </DropdownNavigation>
        </div>
      </div>
    </header>
  );
}
