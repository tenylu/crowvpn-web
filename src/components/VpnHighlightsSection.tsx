"use client";

import { useEffect, useRef } from "react";
import { BellRing, CheckOne, ConnectionPoint, Devices, WalletOne } from "@icon-park/react";

const vpnHighlights = [
  {
    title: "全球高速节点",
    body: "覆盖多地区线路，自动选择更优路径，跨境访问更稳定，视频与网站加载更流畅。",
    icon: (
      <svg width="30" height="30" viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <circle cx="24" cy="24" r="21" fill="#111111" />
        <ellipse cx="24" cy="24" rx="8" ry="19" stroke="white" strokeWidth="2" />
        <path d="M4 24h40M8 12c9 6 23 6 32 0M8 36c9-6 23-6 32 0" stroke="white" strokeWidth="2" />
      </svg>
    ),
  },
  {
    title: "简单易用",
    body: "下载安装后即可一键连接，界面清晰直观，无需复杂配置，新手也能快速上手。",
    icon: <CheckOne theme="filled" size="30" fill="#111111" strokeWidth={2.8} />,
  },
  {
    title: "降低漫游成本",
    body: "在境外或跨区域网络环境下，借助稳定加密通道减少高额漫游与不必要的网络开销。",
    icon: <WalletOne theme="filled" size="30" fill="#111111" strokeWidth={2.8} />,
  },
  {
    title: "一个账号多端使用",
    body: "同一账号可在手机、平板与电脑等多设备登录，出行与办公场景都能持续受保护。",
    icon: <Devices theme="filled" size="30" fill="#111111" strokeWidth={2.8} />,
  },
  {
    title: "流量与连接提醒",
    body: "当连接状态变化或使用量达到阈值时及时提醒，帮助你更好管理网络与使用节奏。",
    icon: <BellRing theme="filled" size="30" fill="#111111" strokeWidth={2.8} />,
  },
  {
    title: "国家与区域线路",
    body: "提供国家节点与区域策略选择，按网站、应用或业务场景灵活切换连接方案。",
    icon: <ConnectionPoint theme="filled" size="30" fill="#111111" strokeWidth={2.8} />,
  },
];

export function VpnHighlightsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !("IntersectionObserver" in window)) return;
    const cards = section.querySelectorAll<HTMLElement>(".feature-card");
    const heading = section.querySelector<HTMLElement>(".feature-heading")!;
    const trust = document.getElementById("home-trust");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let titleAnimation: Animation | undefined;
    const render = () => {
      frame = 0;
      const height = window.innerHeight;
      const bounds = section.getBoundingClientRect();
      const titleBounds = heading.getBoundingClientRect();
      const previousHasLeft = !trust || trust.getBoundingClientRect().bottom < height * .60;
      if (reduced.matches) {
        titleAnimation?.cancel();
        section.dataset.reveal = "visible";
      } else if (previousHasLeft && titleBounds.top < height * .76 && titleBounds.bottom > 0 && section.dataset.reveal !== "visible") {
        section.dataset.reveal = "visible";
        titleAnimation?.cancel();
        titleAnimation = heading.querySelector("h2")!.animate([
          { opacity: 0, transform: "translateY(38px)", clipPath: "inset(0 0 100% 0)" },
          { opacity: 1, transform: "translateY(0)", clipPath: "inset(0 0 0% 0)" },
        ], { duration: 900, easing: "cubic-bezier(.22,1,.36,1)", fill: "backwards" });
      } else if (titleBounds.top > height + 64 || titleBounds.bottom < -64 || bounds.bottom < -64) {
        titleAnimation?.cancel();
        section.dataset.reveal = "waiting";
      }
      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        if (reduced.matches || (section.dataset.reveal === "visible" && rect.top < height * .88 && rect.bottom > 0)) {
          card.dataset.visible = "true";
        } else if (rect.top > height + 64 || rect.bottom < -64) {
          card.dataset.visible = "false";
        }
      });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(render); };
    section.dataset.reveal = "waiting";
    render();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    reduced.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(frame);
      titleAnimation?.cancel();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reduced.removeEventListener("change", schedule);
      delete section.dataset.reveal;
    };
  }, []);

  return (
    <section ref={sectionRef} id="features" className="scroll-mt-24 py-20 sm:py-24">
      <div className="feature-layout mx-auto max-w-[var(--page-max)] px-6 lg:px-10">
        <div className="feature-heading">
          <h2>为什么选择 CrowVPN？</h2>
        </div>

        <ul className="feature-grid">
          {vpnHighlights.map((item, index) => (
            <li key={item.title} className="feature-card" style={{ "--card-delay": `${260 + (index % 2) * 110}ms` } as React.CSSProperties}>
              {item.title === "简单易用" && <span className="feature-paperclip" aria-hidden="true" />}
              <div className="feature-card-head">
                <span className="feature-icon" aria-hidden="true">{item.icon}</span>
                <h3>{item.title}</h3>
              </div>
              <div className="feature-divider" aria-hidden="true" />
              <p>{item.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
