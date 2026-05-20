"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Wifi } from "@icon-park/react";
import { useDestinationPicker } from "@/components/DestinationPickerProvider";

type Destination = {
  name: string;
  code: string;
  fallback: string;
  keywords: string[];
};

const FEATURED_DESTINATIONS: Destination[] = [
  { name: "美国", code: "us", fallback: "🇺🇸", keywords: ["美国", "美", "usa", "united states", "america"] },
  { name: "日本", code: "jp", fallback: "🇯🇵", keywords: ["日本", "jp", "japan", "日"] },
  { name: "法国", code: "fr", fallback: "🇫🇷", keywords: ["法国", "fr", "france", "法"] },
  {
    name: "中国香港",
    code: "hk",
    fallback: "🇭🇰",
    keywords: ["中国香港", "香港", "hk", "hong kong", "xianggang"],
  },
  { name: "加拿大", code: "ca", fallback: "🇨🇦", keywords: ["加拿大", "加", "ca", "canada"] },
];

type RestCountry = {
  cca2: string;
  translations?: {
    zho?: { common?: string };
    cmn?: { common?: string };
  };
  name?: { common?: string };
};

export function HeroSearchBar() {
  const { open, setOpen } = useDestinationPicker();
  const [phase, setPhase] = useState<"select" | "connecting" | "ready">("select");
  const [target, setTarget] = useState<Destination | null>(null);
  const [allDestinations, setAllDestinations] = useState<Destination[]>(FEATURED_DESTINATIONS);
  const [countriesLoaded, setCountriesLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState("");
  const [brokenFlags, setBrokenFlags] = useState<Record<string, boolean>>({});
  const [clientIp, setClientIp] = useState<string>("获取中...");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open || countriesLoaded) return;
    let cancelled = false;
    async function loadAllCountries() {
      try {
        const res = await fetch(
          "https://restcountries.com/v3.1/all?fields=cca2,translations,name",
          { cache: "force-cache" },
        );
        if (!res.ok) throw new Error("countries fetch failed");
        const rows = (await res.json()) as RestCountry[];
        const merged = rows
          .map((row) => {
            const code = row.cca2?.toLowerCase();
            if (!code || code.length !== 2) return null;
            const cn =
              row.translations?.zho?.common ||
              row.translations?.cmn?.common ||
              row.name?.common ||
              code.toUpperCase();
            const existing = FEATURED_DESTINATIONS.find((d) => d.code === code);
            const keywords = existing?.keywords ?? [cn, code];
            return { name: cn, code, fallback: existing?.fallback ?? "🌐", keywords } as Destination;
          })
          .filter((v): v is Destination => Boolean(v))
          .sort((a, b) => a.name.localeCompare(b.name, "zh-Hans-CN"));

        const dedup = new Map<string, Destination>();
        for (const d of [...FEATURED_DESTINATIONS, ...merged]) {
          if (!dedup.has(d.code)) dedup.set(d.code, d);
        }

        if (!cancelled) {
          setAllDestinations(Array.from(dedup.values()));
          setCountriesLoaded(true);
        }
      } catch {
        if (!cancelled) setCountriesLoaded(true);
      }
    }
    loadAllCountries();
    return () => {
      cancelled = true;
    };
  }, [open, countriesLoaded]);

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return [...FEATURED_DESTINATIONS];
    return allDestinations.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.code.toLowerCase().includes(q) ||
        d.keywords.some((k) => k.toLowerCase().includes(q)),
    );
  }, [filter, allDestinations]);

  const close = useCallback(() => {
    setOpen(false);
    setFilter("");
    setPhase("select");
    setTarget(null);
    setSelected(null);
    setClientIp("获取中...");
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    return () => {
      document.body.style.overflow = prev;
      document.body.style.paddingRight = prevPaddingRight;
    };
  }, [open]);

  useEffect(() => {
    if (!open || phase !== "connecting") return;
    const timer = window.setTimeout(() => {
      setPhase("ready");
    }, 5000);
    return () => window.clearTimeout(timer);
  }, [open, phase]);

  useEffect(() => {
    if (!open || phase !== "connecting") return;
    if (clientIp !== "获取中...") return;
    let cancelled = false;
    async function loadIp() {
      try {
        const res = await fetch("https://api.ipify.org?format=json", {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("ip fetch failed");
        const data = (await res.json()) as { ip?: string };
        if (!cancelled) {
          setClientIp(data.ip || "无法获取");
        }
      } catch {
        if (!cancelled) setClientIp("无法获取");
      }
    }
    loadIp();
    return () => {
      cancelled = true;
    };
  }, [open, phase, clientIp]);

  function pick(item: Destination) {
    setSelected(item.name);
    setTarget(item);
    setPhase("connecting");
  }

  const modal = open ? (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dest-dialog-title"
      className="modal-overlay-animate-in fixed inset-0 z-[9999] flex items-center justify-center p-4"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
        aria-label="关闭目的地弹窗"
        onClick={close}
      />
      <div className="modal-panel-animate-in relative flex max-h-[86vh] w-[min(100vw-2rem,528px)] flex-col overflow-hidden rounded-[24px] bg-[var(--surface)] p-6 shadow-2xl sm:p-8">
        <div className="flex shrink-0 items-center justify-between">
            <h2 id="dest-dialog-title" className="text-[1.6rem] font-semibold leading-none text-[#171717]">
              连接节点
            </h2>
            <button
              type="button"
              onClick={close}
              className="flex h-10 w-10 items-center justify-center rounded-full text-[#171717] transition hover:bg-black/[0.06]"
              aria-label="关闭"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
        </div>
        {phase === "select" ? (
          <>
            <div className="mt-5 shrink-0">
            <label htmlFor="dest-filter" className="sr-only">
              筛选目的地
            </label>
            <input
              id="dest-filter"
              type="search"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="输入您的目的地"
              className="w-full rounded-[16px] border border-[#171717] bg-white px-4 py-3 text-[0.8rem] font-medium text-[#171717] placeholder:text-[#a3a3a3] outline-none focus-visible:ring-2 focus-visible:ring-slate-200"
              autoComplete="off"
            />
            </div>
            <div className="mt-7 text-[0.8rem] font-semibold text-[#5f6368]">最热门的目的地</div>
            <div className="mt-3 max-h-[min(55vh,430px)] min-h-[14rem] overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="py-8 text-center text-sm text-[var(--muted)]">未找到匹配的目的地</p>
            ) : (
              <ul className="grid grid-cols-1 gap-2" role="listbox">
                {filtered.map((d) => (
                  <li key={d.name}>
                    <button
                      type="button"
                      role="option"
                      onClick={() => pick(d)}
                      className="flex w-full items-center gap-3 rounded-[14px] px-2 py-2 text-left transition hover:bg-black/[0.03]"
                    >
                      {brokenFlags[d.code] ? (
                        <span className="text-3xl leading-none" aria-hidden>
                          {d.fallback}
                        </span>
                      ) : (
                        <img
                          src={`https://flagfeed.com/country/${d.code}`}
                          alt={`${d.name} 国旗`}
                          width={36}
                          height={36}
                          className="h-9 w-9 rounded-full object-cover"
                          loading="lazy"
                          onError={() =>
                            setBrokenFlags((prev) => ({ ...prev, [d.code]: true }))
                          }
                        />
                      )}
                      <span className="truncate text-base font-semibold leading-tight text-[#171717]">{d.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            </div>
          </>
        ) : (
          <div className="mt-8 flex flex-col items-center">
            <div className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-5 py-8">
              <div className="flex items-center justify-between gap-3 text-center">
                <div className="flex min-w-0 flex-1 flex-col items-center">
                  <span className="mb-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#171717] shadow-sm">
                    <Wifi theme="outline" size="16" fill="#171717" strokeWidth={3} />
                  </span>
                  <span className="text-sm font-semibold text-[#171717]">你的IP</span>
                  <span className="mt-1 text-xs text-[#737373]">{clientIp}</span>
                </div>
                <div className="flex min-w-[6.5rem] flex-col items-center">
                  <div className="relative">
                    <div
                      className={`connection-loader ${phase === "ready" ? "connection-loader--done" : ""}`}
                    />
                    {phase === "ready" ? (
                      <span className="absolute left-1/2 top-1/2 flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#16a34a] text-white">
                        <svg
                          className="h-3 w-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={3}
                          stroke="currentColor"
                          aria-hidden
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
                        </svg>
                      </span>
                    ) : null}
                  </div>
                  <span className="mt-2 text-xs font-medium text-[var(--muted)]">
                    {phase === "connecting" ? "连接中..." : "连接成功"}
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 flex-col items-center">
                  {target && !brokenFlags[target.code] ? (
                    <img
                      src={`https://flagfeed.com/country/${target.code}`}
                      alt={`${target.name}国旗`}
                      width={28}
                      height={28}
                      className="mb-1 h-7 w-7 rounded-full object-cover"
                      onError={() =>
                        setBrokenFlags((prev) => ({ ...prev, [target.code]: true }))
                      }
                    />
                  ) : (
                    <span className="mb-1 text-xl leading-none" aria-hidden>
                      {target?.fallback ?? "🌐"}
                    </span>
                  )}
                  <span className="text-sm font-semibold text-[#171717]">
                    {target ? `${target.name}住宅IP` : "目标住宅IP"}
                  </span>
                  <span className="mt-1 text-xs text-[#737373]">优选节点</span>
                </div>
              </div>
            </div>
            {phase === "ready" ? (
              <button
                type="button"
                onClick={close}
                className="mt-6 inline-flex items-center justify-center rounded-full bg-[var(--accent-primary)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-primary-hover)]"
              >
                登录 CrowVPN
              </button>
            ) : (
              <div className="mt-6 h-10 text-sm text-[var(--muted)]">正在建立安全通道...</div>
            )}
          </div>
        )}
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        id="hero-search"
        type="button"
        onClick={() => setOpen(true)}
        aria-label={selected ? `已选择 ${selected}，点击可更改` : "搜索目的地，点击打开列表"}
        className="relative z-20 mt-8 flex w-full max-w-[21.6rem] cursor-pointer items-center gap-2 rounded-[20px] border border-[var(--border)] bg-[var(--surface)] p-[15px] text-left shadow-[var(--shadow-card)] transition hover:border-[var(--border-strong)]"
      >
        <span className={`min-w-0 flex-1 text-sm ${selected ? "text-[#171717]" : "text-[#a3a3a3]"}`}>
          {selected ?? "搜索目的地"}
        </span>
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-primary)] text-white shadow-sm"
          aria-hidden
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </span>
      </button>
      {mounted && modal ? createPortal(modal, document.body) : null}
    </>
  );
}
