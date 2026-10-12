"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CookiePreferenceFooterButton } from "@/components/cookie/CookiePreferenceFooterButton";
import { defaultLocale, isLocaleCode, type LocaleCode } from "@/i18n/locales";

const APP_STORE_BADGE_ZH =
  "/images/store-badges/app-store-zh.svg";
const GOOGLE_PLAY_BADGE_ZH =
  "/images/store-badges/google-play-zh.svg";
/** 非中文语言使用的官方英文徽章 SVG */
const APP_STORE_BADGE_INTL =
  "/images/store-badges/app-store.svg";
const GOOGLE_PLAY_BADGE_INTL =
  "/images/store-badges/google-play.svg";

function getStoreBadges(locale: LocaleCode) {
  if (locale === "zh-CN" || locale === "zh-HK") {
    return {
      appStore: APP_STORE_BADGE_ZH,
      googlePlay: GOOGLE_PLAY_BADGE_ZH,
      appStoreLabel: "在 App Store 下载",
      googlePlayLabel: "在 Google Play 获取",
    };
  }

  return {
    appStore: APP_STORE_BADGE_INTL,
    googlePlay: GOOGLE_PLAY_BADGE_INTL,
    appStoreLabel: "Download on the App Store",
    googlePlayLabel: "Get it on Google Play",
  };
}

const footerGroups = [
  {
    title: "产品",
    links: [
      { href: "/pricing", label: "套餐定价" },
      { href: "/download", label: "下载应用" },
      { href: "/security", label: "安全能力" },
      { href: "/#vpn-intro", label: "什么是 CrowVPN" },
    ],
  },
  {
    title: "下载",
    links: [
      { href: "/download#download-platforms", label: "Windows 应用" },
      { href: "/download#download-platforms", label: "macOS 应用" },
      { href: "/download#download-platforms", label: "Linux 应用" },
      { href: "/download#download-platforms", label: "Android APK" },
    ],
  },
  {
    title: "帮助",
    links: [
      { href: "https://docs.crowmesh.com/", label: "使用教程", external: true },
      { href: "https://docs.crowmesh.com/client/about", label: "官方客户端", external: true },
      { href: "https://docs.crowmesh.com/troubleshooting/connection-issues", label: "连接问题处理", external: true },
      { href: "https://docs.crowmesh.com/faq/plans", label: "套餐相关 FAQ", external: true },
      { href: "https://docs.crowmesh.com/faq/refund", label: "退款说明", external: true },
    ],
  },
  {
    title: "公司",
    links: [
      { href: "/about", label: "关于我们" },
      { href: "/testimonials", label: "用户评价" },
      { href: "https://crowvpn.com", label: "客户中心", external: true },
      { href: "https://docs.crowmesh.com/faq/other-issues", label: "技术支持", external: true },
    ],
  },
];

export function SiteFooter() {
  const footerRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const footer = footerRef.current;
    if (!footer || !footer.closest(".home-redesign")) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = footer.getBoundingClientRect();
      const start = window.scrollY + rect.top - window.innerHeight * .8;
      const end = document.documentElement.scrollHeight - window.innerHeight;
      const pageProgress = Math.max(0, Math.min(1, (window.scrollY - start) / Math.max(1, end - start)));
      const progress = reducedMotion.matches ? .5 : pageProgress;
      const widthRatio = window.matchMedia("(max-width: 639px)").matches ? 3 : 1.8;
      const rx = rect.width * widthRatio / 2;
      const ry = rect.height;
      const dx = rect.width * .5;
      const y = ry * (1 - Math.sqrt(1 - (dx / rx) ** 2));
      const path = footer.querySelector<SVGPathElement>(".footer-arc-light path");
      path?.setAttribute("d", `M ${rx - dx} ${y} A ${rx} ${ry} 0 0 1 ${rx + dx} ${y}`);
      if (path) {
        const head = progress * 110 - 10;
        path.style.strokeDasharray = "10 200";
        path.style.strokeDashoffset = String(-head);
        path.style.opacity = String(Math.min(1, (1 - progress) / .08));
        const length = path.getTotalLength();
        const from = path.getPointAtLength(Math.max(0, head) / 100 * length);
        const to = path.getPointAtLength(Math.min(100, head + 10) / 100 * length);
        const gradient = footer.querySelector("#footer-arc-beam");
        gradient?.setAttribute("x1", String(from.x));
        gradient?.setAttribute("y1", String(from.y));
        gradient?.setAttribute("x2", String(to.x));
        gradient?.setAttribute("y2", String(to.y));
      }
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    reducedMotion.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reducedMotion.removeEventListener("change", schedule);
    };
  }, []);
  const [selectedLanguage, setSelectedLanguage] = useState<LocaleCode>(() => {
    if (typeof window === "undefined") return defaultLocale;

    const storedLanguage = window.localStorage.getItem("crowvpn-language");
    return isLocaleCode(storedLanguage) ? storedLanguage : defaultLocale;
  });

  useEffect(() => {
    const onLocaleChange = (event: Event) => {
      const locale = (event as CustomEvent<LocaleCode>).detail;
      if (isLocaleCode(locale)) setSelectedLanguage(locale);
    };

    window.addEventListener("crowvpn:locale-change", onLocaleChange);
    return () => window.removeEventListener("crowvpn:locale-change", onLocaleChange);
  }, []);

  const storeBadges = getStoreBadges(selectedLanguage);

  return (
    <footer ref={footerRef} className="py-16">
      <svg className="footer-arc-light" aria-hidden="true" focusable="false">
        <path pathLength="100" strokeDasharray="4 100" strokeDashoffset="0" fill="none" stroke="url(#footer-arc-beam)" strokeWidth="3" strokeLinecap="round" />
        <defs>
          <linearGradient id="footer-arc-beam" gradientUnits="userSpaceOnUse">
            <stop stopColor="#b8e7ff" stopOpacity="0" />
            <stop offset=".25" stopColor="#b8e7ff" stopOpacity=".4" />
            <stop offset=".5" stopColor="#fff" />
            <stop offset=".75" stopColor="#b8e7ff" stopOpacity=".4" />
            <stop offset="1" stopColor="#b8e7ff" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      <div className="mx-auto flex w-full max-w-[var(--page-max)] flex-col gap-4 px-6 sm:flex-row sm:items-center sm:justify-between lg:px-10">
        <Link
          href="/"
          className="inline-flex w-fit items-center gap-2.5 text-xl font-semibold tracking-tight text-[#171717] sm:text-2xl"
        >
          <Image
            src="/logo.svg"
            alt=""
            width={40}
            height={40}
            className="h-9 w-9 shrink-0 sm:h-11 sm:w-11"
            unoptimized
          />
          CrowVPN
        </Link>
        <div className="flex flex-wrap items-center gap-2.5 sm:justify-end sm:gap-3">
          <a
            href="/download"
            className="footer-store-button inline-flex shrink-0 items-center"
            aria-label={storeBadges.appStoreLabel}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- 外链官方徽章 */}
            <img src={storeBadges.appStore} alt="" width={168} height={50} className="h-9 w-auto object-contain sm:h-10" />
          </a>
          <a
            href="/download"
            className="footer-store-button inline-flex shrink-0 items-center"
            aria-label={storeBadges.googlePlayLabel}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- 外链官方徽章 */}
            <img src={storeBadges.googlePlay} alt="" width={168} height={50} className="h-9 w-auto object-contain sm:h-10" />
          </a>
        </div>
      </div>

      <div className="mx-auto mt-8 w-full max-w-[var(--page-max)] px-6 lg:px-10">
        <div className="h-px w-full bg-[var(--border)]" aria-hidden />
      </div>

      <div className="mx-auto mt-8 flex w-full max-w-[var(--page-max)] flex-col gap-12 px-6 lg:flex-row lg:items-start lg:justify-between lg:px-10">
        <div className="max-w-sm">
          <p className="text-sm leading-relaxed text-[var(--muted)]">
            为日常上网与跨境访问提供清晰、可信赖的加密连接体验。本站用于产品介绍与客户端获取。
          </p>
          <Link
            href="/download"
            aria-label="获取 CrowVPN"
            className="download-roll-button mt-5 inline-flex items-center justify-center rounded-full bg-[var(--accent-primary)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--accent-primary-hover)]"
          >
            <span className="download-roll-label" aria-hidden="true" data-no-translate>
              {[0, 1].map(copy => (
                <span className="download-roll-line" key={copy}>
                  {Array.from("获取 CrowVPN").map((letter, index) => (
                    <span key={index} style={{ transitionDuration: `${.2 + index * .1}s` }}>{letter === " " ? "\u00a0" : letter}</span>
                  ))}
                </span>
              ))}
            </span>
          </Link>
        </div>
        <div className="grid flex-1 grid-cols-2 gap-x-10 gap-y-9 text-sm text-[var(--muted)] sm:grid-cols-4 lg:max-w-3xl">
          {footerGroups.map((group) => (
            <div key={group.title} className="flex flex-col gap-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#171717]">{group.title}</span>
              {group.links.map((link) =>
                link.external ? (
                  <a
                    key={`${group.title}-${link.label}`}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-text-link font-medium"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={`${group.title}-${link.label}`}
                    href={link.href}
                    className="footer-text-link font-medium"
                  >
                    {link.label}
                  </Link>
                ),
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-12 max-w-[var(--page-max)] px-6 lg:px-10">
        <div className="h-px w-full bg-[var(--border)]" aria-hidden />
        <div className="flex flex-col gap-3 pt-8 sm:flex-row sm:flex-wrap sm:items-center sm:justify-start sm:gap-x-6 sm:gap-y-2">
          <p className="text-left text-xs text-[#a3a3a3]">
            © {new Date().getFullYear()} CrowVPN. 保留所有权利。
          </p>
          <nav
            className="flex flex-wrap items-center gap-x-5 gap-y-2 text-left text-xs font-medium text-[var(--muted)]"
            aria-label="法律信息"
          >
            <Link href="/privacy" className="hover:text-[#171717]">
              隐私政策
            </Link>
            <Link href="/terms" className="hover:text-[#171717]">
              服务条款
            </Link>
            <CookiePreferenceFooterButton className="font-medium hover:text-[#171717]" />
          </nav>
        </div>
      </div>
    </footer>
  );
}
