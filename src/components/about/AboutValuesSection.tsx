"use client";

import { Airplane, Brightness, CheckOne, Globe, Peoples, TrendingUp } from "@icon-park/react";

const valueIconProps = {
  theme: "outline" as const,
  size: "32",
  fill: "var(--accent-primary)",
  strokeWidth: 2.8,
};

const values = [
  {
    title: "自在连接",
    body: "把复杂线路与策略藏在产品背后，让用户在更多地区获得稳定、可预期的访问体验。",
    icon: <Globe {...valueIconProps} />,
  },
  {
    title: "简约至上",
    body: "少术语、少干扰，把关键状态与操作路径说清楚，让新手也能快速完成连接。",
    icon: <Brightness {...valueIconProps} />,
  },
  {
    title: "以人为本",
    body: "尊重用户时间与隐私，把「少断线、少折腾」当作产品里可交付的体验，而不是口号。",
    icon: <Peoples {...valueIconProps} />,
  },
  {
    title: "不断改进",
    body: "持续打磨节点、路由与客户端细节，用可量化的稳定性积累可感知的体验提升。",
    icon: <TrendingUp {...valueIconProps} />,
  },
  {
    title: "旅行者视角",
    body: "以出差、留学与跨境办公的真实场景驱动优先级：先解决「连得上、用得稳」。",
    icon: <Airplane {...valueIconProps} />,
  },
  {
    title: "让努力有价值",
    body: "把研发与运维投入转化为用户可感知的速度、隐私与可控成本，让每次连接都值得。",
    icon: <CheckOne {...valueIconProps} />,
  },
] as const;

export function AboutValuesSection() {
  return (
    <section className="bg-[#0a0a0a] py-20 text-white sm:py-28" id="values">
      <div className="mx-auto max-w-[var(--page-max)] px-6 lg:px-10">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">企业价值观</h2>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/70 sm:text-lg">
          价值观不是挂在墙上的标语，而是我们评估需求、排期功能与处理故障时的默认准则。
        </p>
        <ul className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-12 lg:gap-y-12">
          {values.map((v) => (
            <li key={v.title}>
              <div aria-hidden>{v.icon}</div>
              <h3 className="mt-5 text-xl font-semibold leading-tight sm:text-2xl">{v.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/70 sm:text-base">{v.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
