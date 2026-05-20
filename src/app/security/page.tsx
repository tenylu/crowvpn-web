import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SecurityContentLayout } from "@/components/security/SecurityContentLayout";
import { SecurityExtendedFeatures } from "@/components/security/SecurityExtendedFeatures";
import { SecurityFeatureSections } from "@/components/security/SecurityFeatureSections";
import { SecurityPageHero } from "@/components/security/SecurityPageHero";
import { SupportCtaSection } from "@/components/SupportCtaSection";

export const metadata: Metadata = {
  title: "安全能力",
  description:
    "了解 CrowVPN 的安全与隐私设计：加密隧道、节点策略、无日志承诺与客户端安全能力，帮助你在公共 Wi‑Fi 与跨境网络环境下更安心上网。",
  alternates: { canonical: "/security" },
  openGraph: {
    title: "CrowVPN 安全能力 | 加密与隐私",
    description: "加密连接、威胁面控制与可预期的连接策略，为日常与差旅场景而设计。",
    url: "https://crowvpn.com/security",
  },
  twitter: {
    card: "summary_large_image",
    title: "CrowVPN 安全能力",
    description: "VPN 加密、隐私边界与安全功能概览。",
  },
};

export default function SecurityPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-[var(--background)] overflow-x-hidden">
      <SiteHeader />
      <main className="flex-1">
        <SecurityPageHero />

        <SecurityContentLayout />

        <SecurityFeatureSections />

        <SecurityExtendedFeatures />

        <SupportCtaSection />
      </main>
      <SiteFooter />
    </div>
  );
}
