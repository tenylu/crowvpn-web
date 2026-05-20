"use client";

import { BellRing, CheckOne, ConnectionPoint, Devices, WalletOne, World } from "@icon-park/react";

const vpnHighlights = [
  {
    title: "全球高速节点",
    body: "覆盖多地区线路，自动选择更优路径，跨境访问更稳定，视频与网站加载更流畅。",
    icon: <World theme="outline" size="30" fill="#111111" strokeWidth={2.8} />,
  },
  {
    title: "简单易用",
    body: "下载安装后即可一键连接，界面清晰直观，无需复杂配置，新手也能快速上手。",
    icon: <CheckOne theme="outline" size="30" fill="#111111" strokeWidth={2.8} />,
  },
  {
    title: "降低漫游成本",
    body: "在境外或跨区域网络环境下，借助稳定加密通道减少高额漫游与不必要的网络开销。",
    icon: <WalletOne theme="outline" size="30" fill="#111111" strokeWidth={2.8} />,
  },
  {
    title: "一个账号多端使用",
    body: "同一账号可在手机、平板与电脑等多设备登录，出行与办公场景都能持续受保护。",
    icon: <Devices theme="outline" size="30" fill="#111111" strokeWidth={2.8} />,
  },
  {
    title: "流量与连接提醒",
    body: "当连接状态变化或使用量达到阈值时及时提醒，帮助你更好管理网络与使用节奏。",
    icon: <BellRing theme="outline" size="30" fill="#111111" strokeWidth={2.8} />,
  },
  {
    title: "国家与区域线路",
    body: "提供国家节点与区域策略选择，按网站、应用或业务场景灵活切换连接方案。",
    icon: <ConnectionPoint theme="outline" size="30" fill="#111111" strokeWidth={2.8} />,
  },
];

export function VpnHighlightsSection() {
  return (
    <section id="features" className="scroll-mt-24 py-20 sm:py-24">
      <div className="mx-auto max-w-[var(--page-max)] px-6 lg:px-10">
        <div>
          <p className="text-sm font-medium text-[#a1a1aa]">为什么选择 CrowVPN？</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#171717] sm:text-4xl">在旅途中保持联网</h2>
        </div>

        <ul className="mt-12 grid gap-x-10 gap-y-10 md:grid-cols-2 xl:grid-cols-3">
          {vpnHighlights.map((item) => (
            <li key={item.title}>
              <div className="mb-5 text-[#111111]">{item.icon}</div>
              <h3 className="text-xl font-semibold leading-tight text-[#171717] sm:text-2xl">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--muted)] sm:text-base">{item.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
