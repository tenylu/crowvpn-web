"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { CookieConsentBanner } from "@/components/cookie/CookieConsentBanner";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createPortal } from "react-dom";

export type CookieCategoryPrefs = {
  necessary: true;
  functional: boolean;
  analytical: boolean;
  advertising: boolean;
};

const STORAGE_KEY = "crowvpn.cookiePreferences.v1";

export type CookiePreferencesContextValue = {
  open: boolean;
  openModal: () => void;
  closeModal: () => void;
  prefs: CookieCategoryPrefs;
  setFunctional: (v: boolean) => void;
  setAnalytical: (v: boolean) => void;
  setAdvertising: (v: boolean) => void;
  acceptAll: () => void;
  rejectOptional: () => void;
  confirmSelection: () => void;
};

const defaultPrefs = (): CookieCategoryPrefs => ({
  necessary: true,
  functional: true,
  analytical: true,
  advertising: true,
});

const CookiePreferencesContext = createContext<CookiePreferencesContextValue | null>(null);

function readStored(): CookieCategoryPrefs | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CookieCategoryPrefs>;
    if (parsed.necessary !== true) return null;
    return {
      necessary: true,
      functional: Boolean(parsed.functional),
      analytical: Boolean(parsed.analytical),
      advertising: Boolean(parsed.advertising),
    };
  } catch {
    return null;
  }
}

function writeStored(prefs: CookieCategoryPrefs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    /* ignore */
  }
}

export function CookiePreferencesProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [consentPersisted, setConsentPersisted] = useState(false);
  const [prefs, setPrefs] = useState<CookieCategoryPrefs>(defaultPrefs);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- 客户端挂载后从 localStorage 恢复偏好（SSR 无 window） */
    const stored = readStored();
    if (stored) {
      setPrefs(stored);
      setConsentPersisted(true);
    }
    setMounted(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- 阅读 Cookie 政策页时关闭偏好弹层 */
    if (pathname.startsWith("/cookies")) {
      setOpen(false);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [pathname]);

  const openModal = useCallback(() => setOpen(true), []);
  const closeModal = useCallback(() => setOpen(false), []);

  const persist = useCallback((next: CookieCategoryPrefs) => {
    writeStored(next);
    setPrefs(next);
    setConsentPersisted(true);
    setOpen(false);
  }, []);

  const acceptAll = useCallback(() => {
    persist(defaultPrefs());
  }, [persist]);

  const rejectOptional = useCallback(() => {
    persist({
      necessary: true,
      functional: false,
      analytical: false,
      advertising: false,
    });
  }, [persist]);

  const confirmSelection = useCallback(() => {
    persist({ ...prefs, necessary: true });
  }, [persist, prefs]);

  const setFunctional = useCallback((v: boolean) => {
    setPrefs((p) => ({ ...p, functional: v }));
  }, []);
  const setAnalytical = useCallback((v: boolean) => {
    setPrefs((p) => ({ ...p, analytical: v }));
  }, []);
  const setAdvertising = useCallback((v: boolean) => {
    setPrefs((p) => ({ ...p, advertising: v }));
  }, []);

  const value = useMemo(
    () => ({
      open,
      openModal,
      closeModal,
      prefs,
      setFunctional,
      setAnalytical,
      setAdvertising,
      acceptAll,
      rejectOptional,
      confirmSelection,
    }),
    [
      open,
      openModal,
      closeModal,
      prefs,
      setFunctional,
      setAnalytical,
      setAdvertising,
      acceptAll,
      rejectOptional,
      confirmSelection,
    ],
  );

  const showConsentBanner =
    mounted &&
    !consentPersisted &&
    !pathname.startsWith("/cookies") &&
    !open;

  return (
    <CookiePreferencesContext.Provider value={value}>
      {children}
      {mounted ? <CookiePreferencesModal /> : null}
      {showConsentBanner ? (
        <CookieConsentBanner onAccept={acceptAll} onPrivacyControls={openModal} />
      ) : null}
    </CookiePreferencesContext.Provider>
  );
}

export function useCookiePreferences() {
  const ctx = useContext(CookiePreferencesContext);
  if (!ctx) {
    throw new Error("useCookiePreferences must be used within CookiePreferencesProvider");
  }
  return ctx;
}

function CookiePreferencesModal() {
  const {
    open,
    closeModal,
    prefs,
    setFunctional,
    setAnalytical,
    setAdvertising,
    acceptAll,
    rejectOptional,
    confirmSelection,
  } = useCookiePreferences();

  if (!open) return null;

  return (
    <CookieModalPortal
      onClose={closeModal}
      prefs={prefs}
      setFunctional={setFunctional}
      setAnalytical={setAnalytical}
      setAdvertising={setAdvertising}
      acceptAll={acceptAll}
      rejectOptional={rejectOptional}
      confirmSelection={confirmSelection}
    />
  );
}

function CookieModalPortal({
  onClose,
  prefs,
  setFunctional,
  setAnalytical,
  setAdvertising,
  acceptAll,
  rejectOptional,
  confirmSelection,
}: {
  onClose: () => void;
  prefs: CookieCategoryPrefs;
  setFunctional: (v: boolean) => void;
  setAnalytical: (v: boolean) => void;
  setAdvertising: (v: boolean) => void;
  acceptAll: () => void;
  rejectOptional: () => void;
  confirmSelection: () => void;
}) {
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const node = (
    <div
      className="modal-overlay-animate-in fixed inset-0 z-[200] flex items-end justify-center bg-black/45 p-4 pb-8 sm:items-center sm:p-6"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-prefs-title"
        className="modal-panel-animate-in relative flex max-h-[min(92vh,720px)] w-full max-w-[min(100vw-2rem,32rem)] flex-col overflow-hidden rounded-[24px] bg-[var(--surface)] shadow-[0_24px_80px_rgba(15,23,42,0.18)] ring-1 ring-black/[0.06] sm:max-w-[36rem]"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full text-[#737373] transition hover:bg-black/[0.05] hover:text-[#171717]"
          aria-label="关闭"
        >
          <span className="text-xl leading-none" aria-hidden>
            ×
          </span>
        </button>

        <div className="overflow-y-auto overscroll-contain px-6 pb-6 pt-8 sm:px-8 sm:pb-8 sm:pt-10">
          <h2
            id="cookie-prefs-title"
            className="pr-10 text-2xl font-semibold tracking-tight text-[#171717] sm:text-[1.65rem]"
          >
            Cookie 偏好设置
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-[var(--muted)] sm:text-[15px]">
            为了向您提供更安全、更个性化的体验，本网站会使用 Cookie。要了解更多信息，请参阅我们的{" "}
            <Link
              href="/cookies"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[var(--accent-primary)] underline underline-offset-2 hover:text-[var(--accent-primary-hover)]"
            >
              Cookie 政策
            </Link>
            （见《隐私政策》中 Cookie 相关说明）。
          </p>

          <ul className="mt-8 divide-y divide-[var(--border)]">
            <CookieRow
              title="必要型"
              description="这类 Cookie 是我们运行网站和维持安全所需要的元素。"
              right={<span className="text-sm font-medium text-[var(--muted)]">始终开启</span>}
            />
            <CookieRow
              title="功能型"
              description="我们使用这类 Cookie 来记住您的关键偏好，例如语言。"
              right={
                <CookieToggle checked={prefs.functional} onChange={setFunctional} label="功能型 Cookie" />
              }
            />
            <CookieRow
              title="分析型"
              description="这类 Cookie 能帮助我们了解网站访客并改善体验。"
              right={
                <CookieToggle checked={prefs.analytical} onChange={setAnalytical} label="分析型 Cookie" />
              }
            />
            <CookieRow
              title="广告型"
              description="这类 Cookie 帮助我们展示与用户更相关的广告。"
              right={
                <CookieToggle checked={prefs.advertising} onChange={setAdvertising} label="广告型 Cookie" />
              }
            />
          </ul>
        </div>

        <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-[var(--border)] bg-[var(--surface-muted)] px-6 py-4 sm:flex-row sm:justify-end sm:gap-3 sm:px-8">
          <button
            type="button"
            onClick={acceptAll}
            className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[#171717] bg-transparent px-5 text-sm font-semibold text-[#171717] transition hover:bg-black/[0.04]"
          >
            全部接受
          </button>
          <button
            type="button"
            onClick={rejectOptional}
            className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[#171717] bg-transparent px-5 text-sm font-semibold text-[#171717] transition hover:bg-black/[0.04]"
          >
            全部拒绝
          </button>
          <button
            type="button"
            onClick={confirmSelection}
            className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[var(--accent-primary)] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--accent-primary-hover)]"
          >
            确认选项
          </button>
        </div>
      </div>
    </div>
  );

  if (typeof document === "undefined") return null;
  return createPortal(node, document.body);
}

function CookieRow({
  title,
  description,
  right,
}: {
  title: string;
  description: string;
  right: ReactNode;
}) {
  return (
    <li className="flex flex-col gap-3 py-5 first:pt-0 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-[#171717]">{title}</p>
        <p className="mt-1.5 text-sm leading-relaxed text-[var(--muted)]">{description}</p>
      </div>
      <div className="flex shrink-0 justify-start sm:justify-end">{right}</div>
    </li>
  );
}

function CookieToggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-8 w-[3.25rem] shrink-0 items-center rounded-full transition-colors ${
        checked ? "bg-[#171717]" : "bg-[#e5e7eb]"
      }`}
    >
      <span
        className={`pointer-events-none absolute top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-sm transition-[left] ${
          checked ? "left-[calc(100%-1.625rem-0.125rem)]" : "left-0.5"
        }`}
      >
        {checked ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-[#171717]" aria-hidden>
            <path
              d="M20 6L9 17l-5-5"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : null}
      </span>
    </button>
  );
}
