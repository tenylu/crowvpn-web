"use client";

import Link from "next/link";
import { createPortal } from "react-dom";

type CookieConsentBannerProps = {
  onAccept: () => void;
  onPrivacyControls: () => void;
};

export function CookieConsentBanner({ onAccept, onPrivacyControls }: CookieConsentBannerProps) {
  if (typeof document === "undefined") return null;

  const node = (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-consent-title"
      className="cookie-banner-animate-in fixed inset-x-4 bottom-[max(1rem,calc(env(safe-area-inset-bottom,0px)+0.75rem))] z-[150] flex max-h-[min(82dvh,calc(100svh-1.5rem))] flex-col overflow-hidden rounded-[22px] bg-[var(--surface)] p-4 shadow-[0_16px_48px_rgba(15,23,42,0.12)] ring-1 ring-black/[0.06] sm:inset-x-auto sm:bottom-6 sm:left-6 sm:max-h-[min(90dvh,560px)] sm:w-[min(calc(100vw-3rem),24rem)] sm:rounded-[28px] sm:p-8"
    >
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch] pr-0.5">
        <h2 id="cookie-consent-title" className="text-base font-semibold tracking-tight text-[#171717] sm:text-lg md:text-xl">
          我们重视您的隐私
        </h2>
        <p className="mt-2.5 text-[13px] leading-relaxed text-[var(--muted)] sm:mt-3 sm:text-[15px]">
          本网站使用 Cookie 为您提供个性化体验，并可能与合作伙伴共享数据，以用于广告和分析。您可以在隐私控制中调整偏好或选择退出。要了解更多信息，请参阅我们的{" "}
          <Link
            href="/cookies"
            className="font-medium text-[#171717] underline underline-offset-2 decoration-[#171717]/70 hover:text-[var(--accent-primary)] hover:decoration-[var(--accent-primary)]"
          >
            Cookie 政策
          </Link>
          。
        </p>
      </div>
      <div className="mt-4 flex shrink-0 flex-col gap-2.5 sm:mt-6 sm:gap-3">
        <button
          type="button"
          onClick={onAccept}
          className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-[var(--accent-primary)] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--accent-primary-hover)]"
        >
          好的，明白
        </button>
        <button
          type="button"
          onClick={onPrivacyControls}
          className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full border border-[#171717] bg-transparent px-5 text-sm font-semibold text-[#171717] transition hover:bg-black/[0.04]"
        >
          隐私控制
        </button>
      </div>
    </div>
  );

  return createPortal(node, document.body);
}
