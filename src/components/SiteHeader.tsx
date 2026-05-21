"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useState,
  type ChangeEvent,
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

const navTriggerClass =
  "inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-[#171717] transition hover:bg-black/[0.04]";

const dropdownPanelBaseClass =
  "invisible absolute left-0 top-full z-50 mt-1 rounded-xl border border-[var(--border)] bg-white opacity-0 shadow-lg transition-[opacity,visibility] duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100";

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

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  );
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

function DesktopNavItem({ item }: { item: NavItem }) {
  if ("children" in item) {
    const groups = groupNavChildren(item.children);
    const hasCategories = groups.some((group) => group.category);

    return (
      <div className="group relative">
        <button type="button" className={navTriggerClass} aria-haspopup="true" aria-expanded="false">
          {item.label}
          <ChevronDown className="opacity-50" />
        </button>
        <div
          className={`${dropdownPanelBaseClass} ${
            hasCategories
              ? "right-0 left-auto w-[min(92vw,56rem)] p-5"
              : "min-w-[11.5rem] py-1.5"
          }`}
          role="menu"
        >
          {hasCategories ? (
            <div className="grid gap-x-5 gap-y-4 lg:grid-cols-3">
              {groups.map((group) => (
                <div key={group.category || item.label}>
                  {group.category ? (
                    <p className="mb-1.5 px-2 text-xs font-semibold text-[#8b8f96]">{group.category}</p>
                  ) : null}
                  <div className="space-y-1">
                    {group.links.map((child) => (
                      <NavAnchor
                        key={`${item.label}-${child.label}`}
                        href={child.href}
                        external={child.external}
                        className="block rounded-lg px-2.5 py-2 text-sm transition hover:bg-black/[0.04]"
                      >
                        <span className="block font-semibold text-[#171717]">{child.label}</span>
                        {child.description ? (
                          <span className="mt-0.5 block text-xs leading-relaxed text-[var(--muted)]">
                            {child.description}
                          </span>
                        ) : null}
                      </NavAnchor>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            item.children.map((child) => (
              <NavAnchor
                key={`${item.label}-${child.label}`}
                href={child.href}
                external={child.external}
                className={dropdownLinkClass}
              >
                {child.label}
              </NavAnchor>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <NavAnchor href={item.href} external={item.external} className={navTriggerClass}>
      {item.label}
    </NavAnchor>
  );
}

function MobileNavItem({ item, onNavigate }: { item: NavItem; onNavigate?: () => void }) {
  if ("children" in item) {
    const groups = groupNavChildren(item.children);
    const hasCategories = groups.some((group) => group.category);

    return (
      <div className="border-b border-[var(--border)] last:border-b-0">
        <p className="px-4 pb-1 pt-3 text-xs font-semibold uppercase tracking-wide text-[#8b8f96]">{item.label}</p>
        {hasCategories
          ? groups.map((group) => (
              <div key={group.category || item.label} className="pb-2">
                {group.category ? (
                  <p className="px-4 pb-1 pt-2 text-[11px] font-semibold text-[#8b8f96]">{group.category}</p>
                ) : null}
                {group.links.map((child) => (
                  <NavAnchor
                    key={`${item.label}-${child.label}`}
                    href={child.href}
                    external={child.external}
                    className="block px-4 py-2 text-sm font-semibold text-[#171717] hover:bg-black/[0.04]"
                    onClick={onNavigate}
                  >
                    {child.label}
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
                {child.label}
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
      {item.label}
    </NavAnchor>
  );
}

const outlineCtaClass =
  "inline-flex items-center justify-center rounded-full border border-black bg-transparent px-4 py-2 text-xs font-semibold text-[#171717] shadow-none transition hover:bg-black/[0.04] sm:px-5 sm:text-sm";

type SiteHeaderProps = {
  /**
   * 首屏为全宽配图/视频时开启：未滚动前为导航条增加浅底玻璃态，
   * 避免深色链接叠在暗色背景上不可读（滚动后仍与默认行为一致）。
   */
  solidNavBarUntilScroll?: boolean;
};

const PROTECTED_ISP_KEYWORDS = [
  "dmit",
  "vultr",
  "it7 networks",
  "it7",
  "overland storage",
  "overland",
  "akile",
  "netlab global",
  "netlab",
  "hostwinds",
];

export function SiteHeader({ solidNavBarUntilScroll = false }: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [ip, setIp] = useState("获取中...");
  const [isp, setIsp] = useState("获取中...");
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    if (typeof window === "undefined") return defaultLocale;

    const storedLanguage = window.localStorage.getItem("crowvpn-language");
    return isLocaleCode(storedLanguage) ? storedLanguage : defaultLocale;
  });

  useEffect(() => {
    function onLocaleChange(event: Event) {
      const locale = (event as CustomEvent<LocaleCode>).detail;
      if (isLocaleCode(locale)) setSelectedLanguage(locale);
    }

    window.addEventListener("crowvpn:locale-change", onLocaleChange);
    return () => window.removeEventListener("crowvpn:locale-change", onLocaleChange);
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
    let cancelled = false;

    async function loadNetworkInfo() {
      try {
        const ipRes = await fetch("https://api.ipify.org?format=json");
        if (!ipRes.ok) throw new Error("ip fetch failed");
        const ipJson = (await ipRes.json()) as { ip?: string };
        if (!cancelled && ipJson.ip) setIp(ipJson.ip);
      } catch {
        if (!cancelled) setIp("未知");
      }

      try {
        const ispRes = await fetch("https://ipapi.co/json/");
        if (!ispRes.ok) throw new Error("isp fetch failed");
        const ispJson = (await ispRes.json()) as { org?: string; asn?: string };
        const merged = [ispJson.org, ispJson.asn].filter(Boolean).join(" ");
        if (!cancelled) setIsp(merged || "未知");
      } catch {
        try {
          const backupRes = await fetch("https://ipwho.is/");
          if (!backupRes.ok) throw new Error("backup isp fetch failed");
          const backupJson = (await backupRes.json()) as {
            connection?: { isp?: string; org?: string; asn?: string };
          };
          const merged = [
            backupJson.connection?.isp,
            backupJson.connection?.org,
            backupJson.connection?.asn,
          ]
            .filter(Boolean)
            .join(" ");
          if (!cancelled) setIsp(merged || "未知");
        } catch {
          if (!cancelled) setIsp("未知");
        }
      }
    }

    loadNetworkInfo();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    document.documentElement.lang = getLocaleMeta(selectedLanguage).htmlLang;
  }, [selectedLanguage]);

  function handleLanguageChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextLanguage = isLocaleCode(event.target.value) ? event.target.value : defaultLocale;
    setSelectedLanguage(nextLanguage);
    applyLocale(nextLanguage);
  }

  const normalizedIsp = isp.toLowerCase().replace(/[^\w\s.-]/g, " ");
  const isProtected = PROTECTED_ISP_KEYWORDS.some((keyword) => normalizedIsp.includes(keyword));
  const displayedIsp = isProtected ? "CrowMesh" : isp;
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
      className={`fixed inset-x-0 top-0 z-50 transition-colors ${
        scrolled
          ? "border-b border-black/5 bg-white/55 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent backdrop-blur-none"
      }`}
    >
      <div className="bg-black text-white">
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
      <div
        className={
          navBarLifted
            ? "border-b border-black/[0.06] bg-white/82 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset] backdrop-blur-xl transition-[background-color,box-shadow] duration-200"
            : undefined
        }
      >
        <div className="mx-auto flex h-[4.25rem] w-full max-w-[var(--nav-max)] items-center justify-between gap-2 px-4 sm:gap-3 sm:px-8 lg:px-12 xl:px-16 2xl:px-24">
          <Link
            href="/"
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

          <div className="flex min-w-0 shrink-0 items-center gap-1.5 sm:gap-2 md:gap-3">
            <nav className="hidden items-center gap-0.5 md:flex" aria-label="主导航">
              {navItems.map((item) => (
                <DesktopNavItem key={item.label} item={item} />
              ))}
            </nav>

            <NavAnchor
              href={CROWMESH_USER_LOGIN_URL}
              external
              className="hidden shrink-0 items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-[#171717] transition hover:bg-black/[0.04] sm:inline-flex"
            >
              {loginLabel}
            </NavAnchor>

            <Link
              href="/download"
              className="hidden shrink-0 items-center justify-center rounded-full border border-black bg-transparent px-5 py-2 text-sm font-semibold text-[#171717] shadow-none transition hover:bg-black/[0.04] sm:inline-flex"
            >
              {getAppLabel}
            </Link>

            <div className="relative flex h-10 shrink-0 items-center rounded-lg border-0 bg-transparent pl-1.5 pr-6 shadow-none sm:pl-2 sm:pr-8">
              <span className="flex shrink-0 items-center text-[#171717]" aria-hidden>
                <GlobeIcon className="opacity-80" />
              </span>
              <label htmlFor="nav-lang" className="sr-only">
                {chooseLanguageLabel}
              </label>
              <select
                id="nav-lang"
                name="lang"
                value={selectedLanguage}
                onChange={handleLanguageChange}
                className="h-full min-w-0 max-w-[5.75rem] cursor-pointer appearance-none border-0 bg-transparent py-0 pl-1 pr-1 text-sm font-semibold text-[#171717] outline-none focus:ring-0 sm:max-w-[9rem] sm:pl-1.5"
              >
                {localeOptions.map((language) => (
                  <option key={language.value} value={language.value}>
                    {language.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-4 -translate-y-1/2 opacity-50" />
            </div>

            <details className="relative shrink-0 md:hidden">
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
                <NavAnchor
                  href="/download"
                  className={`${outlineCtaClass} mx-2 mb-2 mt-2 w-[calc(100%-1rem)]`}
                  onClick={closeMobileNavMenu}
                >
                  {getAppLabel}
                </NavAnchor>
                {navItems.map((item) => (
                  <MobileNavItem key={item.label} item={item} />
                ))}
              </div>
            </details>
          </div>
        </div>
      </div>
    </header>
  );
}
